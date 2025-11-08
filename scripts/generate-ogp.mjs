#!/usr/bin/env node

/**
 * OGP画像を動的に生成するスクリプト
 *
 * 処理フロー:
 * 1. content/posts/配下の全Markdownファイルを読み取り
 * 2. Front matterからメタデータ(title, tags, date)を抽出
 * 3. Satoriを使ってOGP画像を生成
 * 4. static/og/配下に画像を保存
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { generateOgpTemplate } from './ogp-template.mjs';

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
 * Front matterからメタデータを抽出
 */
function extractMetadata(filePath, content) {
  const { data } = matter(content);

  // ファイル名からスラッグとディレクトリパスを取得
  const postDir = path.dirname(filePath);
  const slug = path.basename(postDir);

  return {
    slug,
    postDir,
    title: data.title || 'Untitled',
    tags: data.tags || [],
    date: data.date
      ? new Date(data.date).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '/')
      : '',
    author: data.author || 'kyu08',
    draft: data.draft || false,
  };
}

/**
 * SVGをPNGに変換
 */
function svgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * フォントデータをローカルから読み込み
 */
async function getFonts() {
  // @fontsource/noto-sans-jpからフォントファイルを読み込み
  const fontPath400 = path.join(
    __dirname,
    '../node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff'
  );
  const fontPath700 = path.join(
    __dirname,
    '../node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff'
  );

  const fontData400 = await fs.readFile(fontPath400);
  const fontData700 = await fs.readFile(fontPath700);

  return [
    {
      name: 'Noto Sans JP',
      data: fontData400,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Noto Sans JP',
      data: fontData700,
      weight: 700,
      style: 'normal',
    },
  ];
}

/**
 * OGP画像を生成
 */
async function generateOgpImage(metadata, fonts) {
  // ドラフト記事はスキップ
  if (metadata.draft) {
    console.log(`⏭️  Skipped (draft): ${metadata.slug}`);
    return;
  }

  try {
    // Satoriでレンダリング
    const svg = await satori(
      generateOgpTemplate({
        title: metadata.title,
        date: metadata.date,
        tags: metadata.tags,
        author: metadata.author,
      }),
      {
        width: 1200,
        height: 630,
        fonts,
      }
    );

    // SVGをPNGに変換
    const png = svgToPng(svg);

    // 記事のディレクトリにcover.pngとして保存
    const outputPath = path.join(metadata.postDir, 'cover.png');
    await fs.writeFile(outputPath, png);

    console.log(`✅ Generated: ${metadata.slug}/cover.png`);
  } catch (error) {
    console.error(`❌ Failed to generate OGP for ${metadata.slug}:`, error);
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 Starting OGP image generation...\n');

  // フォントを取得
  console.log('📦 Loading fonts...');
  const fonts = await getFonts();
  console.log('✅ Fonts loaded\n');

  // Markdownファイルを取得
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  console.log(`📝 Found ${markdownFiles.length} markdown files\n`);

  // 各ファイルに対してOGP画像を生成
  for (const filePath of markdownFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const metadata = extractMetadata(filePath, content);
    await generateOgpImage(metadata, fonts);
  }

  console.log('\n✨ OGP image generation completed!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
