import fs from 'fs/promises';
import path from 'path';

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

async function analyzeAllLinks() {
  const CONTENT_DIR = './content/posts';
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  
  let blogcardCount = 0;
  const otherHttpLinks = [];
  
  for (const filePath of markdownFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkPattern.exec(content)) !== null) {
      const text = match[1];
      const url = match[2];
      
      if (url.startsWith('http')) {
        const normalizedText = text.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        
        if (normalizedText === normalizedUrl) {
          blogcardCount++;
        } else {
          otherHttpLinks.push({text, url, file: filePath});
        }
      }
    }
  }
  
  console.log('BLOGCARD URLs (detected): ' + blogcardCount);
  console.log('OTHER HTTP LINKS: ' + otherHttpLinks.length);
  console.log('');
  console.log('=== SAMPLE OTHER LINKS ===');
  
  otherHttpLinks.slice(0, 20).forEach(item => {
    console.log('TEXT: ' + item.text);
    console.log('URL: ' + item.url);
    console.log('FILE: ' + item.file);
    console.log('');
  });
}

analyzeAllLinks().catch(console.error);
