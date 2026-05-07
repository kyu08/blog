#!/usr/bin/env node

/**
 * GitHub activity データを取得してキャッシュするスクリプト
 *
 * 処理フロー:
 * 1. GitHub Search APIでkyu08のmerged PRをすべて取得（最大1000件）
 * 2. 直近50件のPRにAI要約を付ける（既にキャッシュ済みのものはスキップ）
 * 3. リポジトリごとのスター数・マージ数を集計
 * 4. data/github_activity.json に保存
 *
 * 必要な環境変数:
 * - GITHUB_TOKEN: GitHub APIの認証トークン（必須）
 *   AI要約にはGitHub Models API（https://models.inference.ai.azure.com）を使用
 *   利用できない場合は要約なしで続行する
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetch } from 'undici';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/github_activity.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = 'kyu08';
const RECENT_PR_LIMIT = 50;
const SEARCH_RATE_LIMIT_DELAY_MS = 2000; // Search APIは30req/min制限
const AI_RATE_LIMIT_DELAY_MS = 1000; // AI APIレート制限対応
const MAX_SUMMARY_TOKENS = 200; // AI要約の最大トークン数
const AI_TEMPERATURE = 0.3; // AI生成の温度パラメータ（低いほど決定論的）

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GitHub REST APIへのGETリクエスト
 */
async function githubApiGet(url) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': GITHUB_USER,
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }

  return response.json();
}

/**
 * kyu08がAuthorのmerged PRをすべて取得する（最大1000件）
 */
async function fetchAllMergedPRs() {
  console.log(`Fetching merged PRs for ${GITHUB_USER}...`);

  const allPRs = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/search/issues?q=type:pr+is:merged+author:${GITHUB_USER}+is:public&sort=created&order=desc&per_page=100&page=${page}`;

    console.log(`  Page ${page}...`);
    const data = await githubApiGet(url);

    const items = data.items || [];
    if (items.length === 0) break;

    for (const item of items) {
      const repoPath = item.repository_url.replace(
        'https://api.github.com/repos/',
        ''
      );
      allPRs.push({
        id: item.id,
        number: item.number,
        title: item.title,
        url: item.html_url,
        repo: repoPath,
        isOwnRepo: repoPath.startsWith(`${GITHUB_USER}/`),
        mergedAt: item.pull_request?.merged_at ?? null,
        summary: null,
      });
    }

    // 上限に達したか最終ページならループ終了
    if (items.length < 100 || allPRs.length >= 1000) break;
    page++;

    // Search APIのレート制限（30req/min）を考慮して待機
    await sleep(SEARCH_RATE_LIMIT_DELAY_MS);
  }

  // マージ日時降順でソート
  allPRs.sort((a, b) => {
    if (!a.mergedAt) return 1;
    if (!b.mergedAt) return -1;
    return new Date(b.mergedAt) - new Date(a.mergedAt);
  });

  console.log(`  Fetched ${allPRs.length} PRs total`);
  return allPRs;
}

/**
 * リポジトリのスター数を取得する
 */
async function fetchRepoStars(repoPath) {
  try {
    const data = await githubApiGet(`https://api.github.com/repos/${repoPath}`);
    return data.stargazers_count ?? 0;
  } catch (error) {
    console.error(`  Failed to get stars for ${repoPath}: ${error.message}`);
    return 0;
  }
}

/**
 * GitHub Models APIを使ってPRの要約を生成する
 * 失敗した場合はnullを返す（要約なしで続行）
 */
async function generatePRSummary(pr) {
  if (!GITHUB_TOKEN) return null;

  try {
    const response = await fetch(
      'https://models.inference.ai.azure.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'あなたはソフトウェアエンジニアです。GitHubのPRタイトルとリポジトリ名から、そのPRの変更内容を日本語で1〜2文で簡潔に要約してください。',
            },
            {
              role: 'user',
              content: `リポジトリ: ${pr.repo}\nPRタイトル: ${pr.title}`,
            },
          ],
          max_tokens: MAX_SUMMARY_TOKENS,
          temperature: AI_TEMPERATURE,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `  AI API error for PR #${pr.number} (${response.status}): ${errorText.slice(0, 100)}`
      );
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.warn(
      `  Failed to generate summary for PR #${pr.number}: ${error.message}`
    );
    return null;
  }
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  // 既存データを読み込んでサマリーをキャッシュ
  const existingSummaries = new Map();
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const existing = JSON.parse(content);
    for (const pr of existing.recentPRs ?? []) {
      if (pr.summary) {
        existingSummaries.set(pr.id, pr.summary);
      }
    }
    console.log(`Loaded ${existingSummaries.size} cached summaries`);
  } catch {
    console.log('No existing data found, starting fresh');
  }

  // Merged PRを全件取得
  const allPRs = await fetchAllMergedPRs();

  // 直近50件
  const recentPRs = allPRs.slice(0, RECENT_PR_LIMIT);

  // 新規PRのAI要約を生成（キャッシュ済みはスキップ）
  console.log('\nGenerating AI summaries for recent PRs...');
  const prsNeedingSummary = recentPRs.filter(
    (pr) => !existingSummaries.has(pr.id)
  );
  console.log(`  ${prsNeedingSummary.length} new PRs need summaries`);

  for (const pr of prsNeedingSummary) {
    console.log(`  Summarizing #${pr.number}: ${pr.title}`);
    pr.summary = await generatePRSummary(pr);
    await sleep(AI_RATE_LIMIT_DELAY_MS);
  }

  // キャッシュ済みの要約を適用
  for (const pr of recentPRs) {
    if (!pr.summary && existingSummaries.has(pr.id)) {
      pr.summary = existingSummaries.get(pr.id);
    }
  }

  // 統計情報の計算
  const ownRepoPRs = allPRs.filter((pr) => pr.isOwnRepo);
  const otherRepoPRs = allPRs.filter((pr) => !pr.isOwnRepo);

  // リポジトリごとのマージ数を集計
  console.log('\nBuilding repository statistics...');
  const repoMap = new Map();
  for (const pr of allPRs) {
    if (!repoMap.has(pr.repo)) {
      repoMap.set(pr.repo, {
        repo: pr.repo,
        repoUrl: `https://github.com/${pr.repo}`,
        isOwnRepo: pr.isOwnRepo,
        mergedCount: 0,
        stars: 0,
      });
    }
    repoMap.get(pr.repo).mergedCount++;
  }

  // スター数を取得
  console.log('Fetching repository star counts...');
  const repos = Array.from(repoMap.values());
  for (const repo of repos) {
    repo.stars = await fetchRepoStars(repo.repo);
    await sleep(100);
  }

  const byStars = [...repos].sort((a, b) => b.stars - a.stars);
  const byMergeCount = [...repos].sort(
    (a, b) => b.mergedCount - a.mergedCount
  );

  const outputData = {
    recentPRs,
    stats: {
      totalMergedInOwnRepos: ownRepoPRs.length,
      totalMergedInOtherRepos: otherRepoPRs.length,
      byRepo: {
        byStars,
        byMergeCount,
      },
    },
    lastUpdated: new Date().toISOString(),
  };

  await fs.writeFile(DATA_FILE, JSON.stringify(outputData, null, 2));

  console.log(`\nSaved to ${DATA_FILE}`);
  console.log(`  Total merged PRs : ${allPRs.length}`);
  console.log(`  Own repos        : ${ownRepoPRs.length}`);
  console.log(`  Other repos      : ${otherRepoPRs.length}`);
  console.log(`  Unique repos     : ${repos.length}`);
  console.log(`  Recent PRs       : ${recentPRs.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
