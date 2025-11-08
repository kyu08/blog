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

  // タイムアウト付きfetch
  async function fetchWithTimeout(url, timeout = 5000) {
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

  // 複数のプロキシを試す
  const PROXY_SERVICES = [
    // corsproxy.io - 高速で信頼性が高い
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    // allOrigins - バックアップ
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  ];

  // OGP情報を取得する関数
  async function fetchOGPData(url) {
    log('Fetching OGP data for:', url);

    for (let i = 0; i < PROXY_SERVICES.length; i++) {
      const proxyUrl = PROXY_SERVICES[i](url);
      log(`Trying proxy ${i + 1}/${PROXY_SERVICES.length}:`, proxyUrl);

      try {
        const response = await fetchWithTimeout(proxyUrl, 5000);

        if (!response.ok) {
          log(`Proxy ${i + 1} failed with status:`, response.status);
          continue;
        }

        let html;
        if (i === 0) {
          // corsproxy.io returns HTML directly
          html = await response.text();
        } else if (i === 1) {
          // allOrigins returns JSON
          const data = await response.json();
          html = data.contents;
        }

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

        log('OGP data fetched successfully:', result);
        return result;
      } catch (error) {
        log(`Proxy ${i + 1} error:`, error.message);
        // Try next proxy
        continue;
      }
    }

    // All proxies failed
    console.error('[BlogCard] All proxies failed to fetch OGP data for:', url);
    return null;
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
      // 既存の画像を削除
      while (thumbnail.firstChild) {
        thumbnail.removeChild(thumbnail.firstChild);
      }
      // 新しいimg要素を安全に作成
      const img = document.createElement('img');
      img.setAttribute('src', ogpData.image);
      img.setAttribute('alt', ogpData.title || '');
      img.setAttribute('loading', 'lazy');
      thumbnail.appendChild(img);
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

      // ローディング状態を追加
      card.classList.add('loading');

      // OGP情報を取得して更新
      const startTime = Date.now();
      const ogpData = await fetchOGPData(url);
      const elapsedTime = Date.now() - startTime;
      log(`Fetch completed in ${elapsedTime}ms`);

      // ローディング状態を解除
      card.classList.remove('loading');

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
