#!/usr/bin/env node

/**
 * すべての記事のフロントマターに cover: "cover.png" を追加するスクリプト
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content/posts');

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
 * フロントマターにcoverフィールドを追加
 */
async function addCoverToFrontmatter(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);

  // すでにcoverフィールドがある場合はスキップ
  if (data.cover) {
    console.log(`⏭️  Skipped (already has cover): ${path.basename(path.dirname(filePath))}`);
    return;
  }

  // coverフィールドを追加
  data.cover = 'cover.png';

  // フロントマターとコンテンツを再構築
  const updatedContent = matter.stringify(markdownContent, data);

  // ファイルに書き込み
  await fs.writeFile(filePath, updatedContent, 'utf-8');

  console.log(`✅ Added cover field: ${path.basename(path.dirname(filePath))}`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Starting to add cover field to frontmatter...\\n');

  // Markdownファイルを取得
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  console.log(`📝 Found ${markdownFiles.length} markdown files\\n`);

  // 各ファイルを処理
  let updated = 0;
  for (const filePath of markdownFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);

      if (!data.cover) {
        await addCoverToFrontmatter(filePath);
        updated++;
      } else {
        console.log(`⏭️  Skipped (already has cover): ${path.basename(path.dirname(filePath))}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error);
    }
  }

  console.log(`\\n✨ Completed! Updated ${updated} files.`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
