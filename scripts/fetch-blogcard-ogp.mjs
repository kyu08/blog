#!/usr/bin/env node

/**
 * ブログカード用OGP情報を取得してキャッシュするスクリプト
 *
 * 処理フロー:
 * 1. content/posts/配下の全Markdownファイルを読み取り
 * 2. ブログカード対象のURLを抽出（リンクテキストとURLが同じもの）
 * 3. OGP情報を並列度制限付きで取得
 * 4. data/blogcard_cache.json に保存
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetch } from 'undici';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content/posts');
const CACHE_FILE = path.join(__dirname, '../data/blogcard_cache.json');
const CONCURRENT_LIMIT = 5; // 並列度制限
const TIMEOUT_MS = 10000; // タイムアウト
const RETRY_DELAY_MS = 3000; // リトライ待機時間

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
 * OGP情報を取得する関数（Node.jsでは直接取得可能）
 */
async function fetchOGPData(url) {
  console.log(`  Fetching OGP data for: ${url}`);

  try {
    // Node.jsではCORS制限がないため、直接URLからHTMLを取得
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.log(`    Failed with status: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // HTMLパーサーを使用してOGPメタタグを抽出
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // OGPメタタグから情報を取得
    const getMetaContent = (property) => {
      const element = doc.querySelector(`meta[property="${property}"]`) ||
                     doc.querySelector(`meta[name="${property}"]`);
      return element ? element.getAttribute('content') : null;
    };

    // タイトルを取得（OGP > title要素の順）
    const title = getMetaContent('og:title') ||
                 doc.querySelector('title')?.textContent ||
                 url;

    // 説明を取得
    const description = getMetaContent('og:description') ||
                       getMetaContent('description') ||
                       '';

    // 画像を取得
    let image = getMetaContent('og:image') || '';

    // 相対URLを絶対URLに変換
    if (image && !image.startsWith('http')) {
      const urlObj = new URL(url);
      if (image.startsWith('//')) {
        image = urlObj.protocol + image;
      } else if (image.startsWith('/')) {
        image = urlObj.origin + image;
      } else {
        image = urlObj.origin + '/' + image;
      }
    }

    const result = {
      title: title.trim(),
      description: description.trim(),
      image: image,
      fetchedAt: new Date().toISOString()
    };

    console.log(`    ✅ Success`);
    return result;
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * リトライ付きOGP取得
 */
async function fetchOGPWithRetry(url) {
  let result = await fetchOGPData(url);
  
  if (!result) {
    console.log(`    Retrying after ${RETRY_DELAY_MS / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    result = await fetchOGPData(url);
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
 * Markdownファイルからブログカード対象URLを抽出
 * パターン1: リンクテキストとURLが同じ場合（[https://example.com](https://example.com)）
 * パターン2: 単独行のURL（autolink） - 脚注参照などが続く場合も含む
 * 
 * 以下のURLは除外する:
 * - 脚注定義内のURL（[^N]: で始まる行）
 * - リスト項目内のURL（番号付きリスト、箇条書きを含む）
 */
function extractBlogcardUrls(content) {
  const urls = new Set();
  let match;

  // 脚注定義の行を検出するヘルパー関数
  const isInFootnoteDefinition = (content, matchIndex) => {
    // matchIndexから行の先頭まで遡る
    const beforeMatch = content.substring(0, matchIndex);
    const lastNewline = beforeMatch.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const linePrefix = content.substring(lineStart, matchIndex);
    
    // 行が [^数字]: で始まっているかチェック
    return /^\[\^[0-9]+\]:\s*/.test(linePrefix);
  };

  // リスト項目内を検出するヘルパー関数
  const isInListItem = (content, matchIndex) => {
    // matchIndexから行の先頭まで遡る
    const beforeMatch = content.substring(0, matchIndex);
    const lastNewline = beforeMatch.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const linePrefix = content.substring(lineStart, matchIndex);
    
    // 行が番号付きリスト（1. など）または箇条書き（-, *, +）で始まっているかチェック
    // インデントにも対応（スペースやタブ）
    return /^\s*(\d+\.|[-*+])\s+/.test(linePrefix);
  };

  // パターン1: Markdownリンク [text](url) でテキストとURLが同じ場合
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  while ((match = linkPattern.exec(content)) !== null) {
    const text = match[1];
    const url = match[2];

    // 脚注定義内のリンクはスキップ
    if (isInFootnoteDefinition(content, match.index)) {
      continue;
    }

    // リスト項目内のリンクはスキップ
    if (isInListItem(content, match.index)) {
      continue;
    }

    // URLの正規化（プロトコルとトレイリングスラッシュを除去して比較）
    const normalizedText = text.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // リンクテキストとURLが同じ場合のみブログカード対象
    if (normalizedText === normalizedUrl && url.startsWith('http')) {
      urls.add(url);
    }
  }

  // パターン2: 行頭のURL（autolink） - 脚注参照やテキストが続く場合も含む
  // 例: https://example.com [^1]
  //     https://example.com P3より引用
  // 注: 脚注定義（[^N]: https://...）は行頭がURLではないため自動的に除外される
  const autolinkPattern = /^(https?:\/\/[^\s]+)/gm;
  while ((match = autolinkPattern.exec(content)) !== null) {
    urls.add(match[1]);
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
    // キャッシュファイルが存在しない場合は空オブジェクトを返す
    return {};
  }
}

/**
 * キャッシュを保存
 */
async function saveCache(cache) {
  // dataディレクトリが存在しない場合は作成
  const dataDir = path.dirname(CACHE_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

/**
 * 並列度制限付きで全URLのOGP情報を取得
 */
async function fetchAllOGP(urls, existingCache) {
  const cache = { ...existingCache };
  const urlsToFetch = [];
  
  // キャッシュにないURLのみ取得対象にする
  for (const url of urls) {
    if (!cache[url]) {
      urlsToFetch.push(url);
    }
  }
  
  console.log(`\n📊 Total URLs: ${urls.length}`);
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
        const ogpData = await fetchOGPWithRetry(url);
        processedCount++;
        console.log(`  Progress: ${processedCount}/${total}`);
        return { url, ogpData };
      })
    );
    
    // 結果をキャッシュに追加
    for (const { url, ogpData } of results) {
      if (ogpData) {
        cache[url] = ogpData;
      }
      // 取得失敗時: 既存のキャッシュデータがあればそれを保持、なければスキップ
      // （既にexistingCacheからコピー済みなので、何もしない）
    }
  }
  
  return cache;
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Starting blogcard OGP fetch...\n');
  
  // 既存キャッシュを読み込み
  console.log('📦 Loading existing cache...');
  const existingCache = await loadCache();
  console.log(`  Found ${Object.keys(existingCache).length} cached entries\n`);
  
  // Markdownファイルを取得
  console.log('📝 Scanning markdown files...');
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  console.log(`  Found ${markdownFiles.length} markdown files\n`);
  
  // 全ファイルからブログカード対象URLを抽出
  console.log('🔍 Extracting blogcard URLs...');
  const allUrls = new Set();
  
  for (const filePath of markdownFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const urls = extractBlogcardUrls(content);
    urls.forEach(url => allUrls.add(url));
  }
  
  const uniqueUrls = Array.from(allUrls);
  console.log(`  Found ${uniqueUrls.length} unique blogcard URLs\n`);
  
  // OGP情報を取得
  const cache = await fetchAllOGP(uniqueUrls, existingCache);
  
  // キャッシュを保存
  console.log('\n💾 Saving cache...');
  await saveCache(cache);
  console.log(`  Saved to ${path.relative(process.cwd(), CACHE_FILE)}`);
  
  // 統計情報を表示
  const successCount = Object.keys(cache).length;
  const failedCount = uniqueUrls.length - successCount;
  
  console.log('\n✨ Blogcard OGP fetch completed!');
  console.log(`\n📊 Summary:`);
  console.log(`  - Total URLs: ${uniqueUrls.length}`);
  console.log(`  - Successfully cached: ${successCount}`);
  console.log(`  - Failed: ${failedCount}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
