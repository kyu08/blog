#!/usr/bin/env node

/**
 * Speaker Deck oEmbed情報を取得してキャッシュするスクリプト
 *
 * 処理フロー:
 * 1. content/posts/配下の全Markdownファイルを読み取り
 * 2. Speaker Deck URLを抽出
 * 3. oEmbed APIを呼び出してプレイヤーURLを取得
 * 4. data/speakerdeck_cache.json に保存
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content/posts');
const CACHE_FILE = path.join(__dirname, '../data/speakerdeck_cache.json');
const CONCURRENT_LIMIT = 3; // Speaker Deckへの負荷を考慮して控えめに
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 3000;

/**
 * タイムアウト付きfetch
 */
async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Speaker Deck oEmbed APIからプレイヤーURLを取得
 */
async function fetchSpeakerDeckOEmbed(url) {
  console.log(`  Fetching oEmbed for: ${url}`);

  try {
    const oembedUrl = `https://speakerdeck.com/oembed.json?url=${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(oembedUrl);

    if (!response.ok) {
      console.log(`    Failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // htmlフィールドからiframe srcを抽出
    // 例: <iframe ... src="https://speakerdeck.com/player/9efe648f23514385a48f5c5608d5f1c3" ...>
    const srcMatch = data.html.match(/src="([^"]+)"/);
    if (!srcMatch) {
      console.log(`    Could not extract player URL from oEmbed response`);
      return null;
    }

    const playerUrl = srcMatch[1];

    const result = {
      playerUrl: playerUrl,
      title: data.title || '',
      ratio: data.width && data.height ? (data.width / data.height).toString() : '1.7777777777777777',
      fetchedAt: new Date().toISOString()
    };

    console.log(`    ✅ Success: ${playerUrl}`);
    return result;
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * リトライ付きoEmbed取得
 */
async function fetchOEmbedWithRetry(url) {
  let result = await fetchSpeakerDeckOEmbed(url);

  if (!result) {
    console.log(`    Retrying after ${RETRY_DELAY_MS / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    result = await fetchSpeakerDeckOEmbed(url);
  }

  return result;
}

/**
 * ディレクトリ内の全Markdownファイルを再帰的に取得
 */
async function getMarkdownFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMarkdownFiles(fullPath)));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * MarkdownファイルからSpeaker Deck URLを抽出
 */
function extractSpeakerDeckUrls(content) {
  const urls = new Set();

  // Speaker Deck URLパターン
  // https://speakerdeck.com/username/presentation-slug 形式
  const speakerdeckPattern = /https:\/\/speakerdeck\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/g;

  let match;
  while ((match = speakerdeckPattern.exec(content)) !== null) {
    urls.add(match[0]);
  }

  return Array.from(urls);
}

/**
 * 既存キャッシュを読み込み
 */
async function loadCache() {
  try {
    const cacheData = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(cacheData);
  } catch (error) {
    return {};
  }
}

/**
 * キャッシュを保存
 */
async function saveCache(cache) {
  const dataDir = path.dirname(CACHE_FILE);
  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

/**
 * 並列度制限付きで全URLのoEmbed情報を取得
 */
async function fetchAllOEmbed(urls, existingCache) {
  const cache = { ...existingCache };
  const urlsToFetch = [];

  // キャッシュにないURLのみ取得対象にする
  for (const url of urls) {
    if (!cache[url]) {
      urlsToFetch.push(url);
    }
  }

  console.log(`\n📊 Total Speaker Deck URLs: ${urls.length}`);
  console.log(`  - Cached: ${urls.length - urlsToFetch.length}`);
  console.log(`  - To fetch: ${urlsToFetch.length}\n`);

  if (urlsToFetch.length === 0) {
    console.log('✨ All URLs are already cached!\n');
    return cache;
  }

  // 並列度制限付きで処理
  let processedCount = 0;
  const total = urlsToFetch.length;

  for (let i = 0; i < urlsToFetch.length; i += CONCURRENT_LIMIT) {
    const chunk = urlsToFetch.slice(i, i + CONCURRENT_LIMIT);

    console.log(`\n🔄 Processing batch ${Math.floor(i / CONCURRENT_LIMIT) + 1}/${Math.ceil(total / CONCURRENT_LIMIT)} (${chunk.length} URLs):`);

    const results = await Promise.all(
      chunk.map(async (url) => {
        const oembedData = await fetchOEmbedWithRetry(url);
        processedCount++;
        console.log(`  Progress: ${processedCount}/${total}`);
        return { url, oembedData };
      })
    );

    // 結果をキャッシュに追加
    for (const { url, oembedData } of results) {
      if (oembedData) {
        cache[url] = oembedData;
      }
    }
  }

  return cache;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Starting Speaker Deck oEmbed fetch...\n');

  // 既存キャッシュを読み込み
  console.log('📦 Loading existing cache...');
  const existingCache = await loadCache();
  console.log(`  Found ${Object.keys(existingCache).length} cached entries\n`);

  // Markdownファイルを取得
  console.log('📝 Scanning markdown files...');
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  console.log(`  Found ${markdownFiles.length} markdown files\n`);

  // 全ファイルからSpeaker Deck URLを抽出
  console.log('🔍 Extracting Speaker Deck URLs...');
  const allUrls = new Set();

  for (const filePath of markdownFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const urls = extractSpeakerDeckUrls(content);
    urls.forEach(url => allUrls.add(url));
  }

  const uniqueUrls = Array.from(allUrls);
  console.log(`  Found ${uniqueUrls.length} unique Speaker Deck URLs\n`);

  if (uniqueUrls.length === 0) {
    console.log('ℹ️  No Speaker Deck URLs found in content files.');
    return;
  }

  // oEmbed情報を取得
  const cache = await fetchAllOEmbed(uniqueUrls, existingCache);

  // キャッシュを保存
  console.log('\n💾 Saving cache...');
  await saveCache(cache);
  console.log(`  Saved to ${path.relative(process.cwd(), CACHE_FILE)}`);

  // 統計情報を表示
  const successCount = Object.keys(cache).length;
  const failedCount = uniqueUrls.length - successCount;

  console.log('\n✨ Speaker Deck oEmbed fetch completed!');
  console.log(`\n📊 Summary:`);
  console.log(`  - Total URLs: ${uniqueUrls.length}`);
  console.log(`  - Successfully cached: ${successCount}`);
  console.log(`  - Failed: ${failedCount}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
