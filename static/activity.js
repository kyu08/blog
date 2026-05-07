/**
 * activity.js — activityページのインタラクション
 *
 * - PR一覧フィルタリング（すべて / 自分のリポジトリのみ / 外部コントリビューションのみ）
 * - リポジトリ別統計のソート切り替え（スター順 / マージ数順）
 * - 日付文字列のフォーマット（ISO 8601 → YYYY/MM/DD）
 */

(function () {
  'use strict';

  /** ISO 8601の日付文字列をYYYY/MM/DD形式に変換する */
  function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }

  /** PR一覧の日付を読みやすい形式に変換する */
  function formatPRDates() {
    document.querySelectorAll('.activity-pr-date').forEach(function (el) {
      var isoDatetime = el.getAttribute('datetime');
      if (isoDatetime) {
        el.textContent = formatDate(isoDatetime);
      }
    });
  }

  /** 最終更新日時をローカライズする */
  function formatLastUpdated() {
    var el = document.querySelector('.activity-last-updated');
    if (!el) return;
    var isoDatetime = el.getAttribute('datetime');
    if (!isoDatetime) return;
    var d = new Date(isoDatetime);
    if (isNaN(d.getTime())) return;
    // YYYY/MM/DD HH:MM JST 形式で表示
    el.textContent =
      '最終更新: ' +
      d.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo',
        hour12: false,
      }) +
      ' JST';
  }

  // --- PR フィルタリング ---

  function initPRFilter() {
    var filterBar = document.getElementById('pr-filter-bar');
    if (!filterBar) return;

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.activity-filter-btn');
      if (!btn) return;

      // ボタンのアクティブ状態を更新
      filterBar.querySelectorAll('.activity-filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      applyPRFilter(filter);
    });
  }

  function applyPRFilter(filter) {
    var cards = document.querySelectorAll('.activity-pr-card');
    cards.forEach(function (card) {
      var isOwn = card.getAttribute('data-own-repo') === 'true';
      var visible = true;
      if (filter === 'own') visible = isOwn;
      else if (filter === 'other') visible = !isOwn;
      card.style.display = visible ? '' : 'none';
    });
  }

  // --- リポジトリ別統計のソート ---

  function initRepoSort() {
    var sortBar = document.getElementById('repo-sort-bar');
    if (!sortBar) return;

    var dataEl = document.getElementById('repo-data');
    if (!dataEl) return;

    var repoData;
    try {
      repoData = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    sortBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.activity-sort-btn');
      if (!btn) return;

      sortBar.querySelectorAll('.activity-sort-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      var sort = btn.getAttribute('data-sort');
      renderRepoList(sort === 'stars' ? repoData.byStars : repoData.byMergeCount);
    });
  }

  function renderRepoList(repos) {
    var listEl = document.getElementById('repo-list');
    if (!listEl) return;
    if (!repos || repos.length === 0) {
      listEl.innerHTML =
        '<p class="activity-empty">データを取得中です。しばらくお待ちください。</p>';
      return;
    }

    var html = repos
      .map(function (repo) {
        return (
          '<div class="activity-repo-item">' +
          '<a href="' +
          escapeHtml(repo.repoUrl) +
          '" class="activity-repo-name" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(repo.repo) +
          '</a>' +
          '<div class="activity-repo-meta">' +
          '<span class="activity-repo-stars">★ ' +
          repo.stars +
          '</span>' +
          '<span class="activity-repo-count">' +
          repo.mergedCount +
          ' PRs</span>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');

    listEl.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- 初期化 ---
  document.addEventListener('DOMContentLoaded', function () {
    formatPRDates();
    formatLastUpdated();
    initPRFilter();
    initRepoSort();
  });
})();
