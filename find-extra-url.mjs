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

async function findBlogcardUrls() {
  const CONTENT_DIR = './content/posts';
  const markdownFiles = await getMarkdownFiles(CONTENT_DIR);
  
  const blogcardUrls = new Set();
  
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
          blogcardUrls.add(url);
        }
      }
    }
  }
  
  console.log('DETECTED URLS:');
  const urls = Array.from(blogcardUrls).sort();
  urls.forEach(url => console.log(url));
  
  console.log('\nCACHED URLS:');
  const cacheFile = './data/blogcard-cache.json';
  const cache = JSON.parse(await fs.readFile(cacheFile, 'utf-8'));
  const cached = Object.keys(cache).sort();
  cached.forEach(url => console.log(url));
  
  console.log('\nDIFF:');
  const detectedSet = new Set(urls);
  const cachedSet = new Set(cached);
  
  console.log('In detected but not cached:');
  urls.forEach(url => {
    if (!cachedSet.has(url)) {
      console.log('  + ' + url);
    }
  });
  
  console.log('In cached but not detected:');
  cached.forEach(url => {
    if (!detectedSet.has(url)) {
      console.log('  - ' + url);
    }
  });
}

findBlogcardUrls().catch(console.error);
