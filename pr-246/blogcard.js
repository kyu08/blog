// ブログカード - OGP情報の自動取得機能
// data-auto-fetch="true" 属性を持つブログカードに対してOGP情報を自動取得します

(function() {
  'use strict';

  const DEBUG = true; // デバッグモード

  function log(...args) {
    if (DEBUG) {
      console.log('[BlogCard]', ...args);
    }
  }

  // OGP情報を取得する関数
  async function fetchOGPData(url) {
    log('Fetching OGP data for:', url);

    try {
      // CORS制限を回避するため、alloriginsを使用
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      log('Proxy URL:', proxyUrl);

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const html = data.contents;
      log('HTML fetched, length:', html.length);

      // HTMLパーサーを使用してOGPメタタグを抽出
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

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
      log('Raw image URL:', image);

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
        log('Converted image URL:', image);
      }

      const result = {
        title: title.trim(),
        description: description.trim(),
        image: image
      };

      log('OGP data fetched:', result);
      return result;
    } catch (error) {
      console.error('[BlogCard] Error fetching OGP data:', error);
      return null;
    }
  }

  // ブログカードを更新する関数
  function updateBlogCard(card, ogpData) {
    if (!ogpData) {
      log('No OGP data to update');
      return;
    }

    log('Updating blog card with:', ogpData);

    const link = card.querySelector('.blogcard-link');
    const thumbnail = card.querySelector('.blogcard-thumbnail');
    const title = card.querySelector('.blogcard-title');
    const description = card.querySelector('.blogcard-description');

    // タイトルを更新
    if (ogpData.title && title) {
      title.textContent = ogpData.title;
      log('Title updated:', ogpData.title);
    }

    // 説明を更新（存在しない場合は作成）
    if (ogpData.description) {
      if (description) {
        description.textContent = ogpData.description;
      } else {
        const descElement = document.createElement('div');
        descElement.className = 'blogcard-description';
        descElement.textContent = ogpData.description;
        title.parentNode.insertBefore(descElement, title.nextSibling);
      }
      log('Description updated:', ogpData.description);
    }

    // 画像を更新
    if (ogpData.image && thumbnail) {
      thumbnail.classList.remove('blogcard-thumbnail-placeholder');
      thumbnail.innerHTML = `<img src="${ogpData.image}" alt="${ogpData.title || ''}" loading="lazy">`;
      log('Image updated:', ogpData.image);
    } else {
      log('No image to update, ogpData.image:', ogpData.image);
    }
  }

  // ページ読み込み時に自動取得設定のあるブログカードを処理
  function initBlogCards() {
    log('Initializing blog cards...');
    const cards = document.querySelectorAll('.blogcard[data-auto-fetch="true"]');
    log('Found', cards.length, 'blog cards with auto-fetch');

    cards.forEach(async (card) => {
      const url = card.getAttribute('data-url');
      log('Processing card for URL:', url);

      if (!url) {
        log('No URL found, skipping');
        return;
      }

      // OGP情報を取得して更新
      const ogpData = await fetchOGPData(url);
      if (ogpData) {
        updateBlogCard(card, ogpData);
      }
    });
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    log('Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initBlogCards);
  } else {
    log('DOM already loaded, initializing immediately');
    initBlogCards();
  }
})();
