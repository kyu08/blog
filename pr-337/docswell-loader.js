// Lazy load Docswell iframes to prevent auto-scroll on page load
// Uses IntersectionObserver to load iframes only when they enter the viewport

(function() {
  'use strict';

  function loadDocswellIframe(placeholder) {
    const src = placeholder.dataset.src;
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('frameborder', '0');
    iframe.width = '100%';
    iframe.height = '569';
    iframe.allowFullscreen = true;
    iframe.setAttribute('mozallowfullscreen', 'true');
    iframe.setAttribute('webkitallowfullscreen', 'true');

    placeholder.replaceWith(iframe);
  }

  function init() {
    const placeholders = document.querySelectorAll('.docswell-placeholder');

    if (placeholders.length === 0) return;

    // Use IntersectionObserver for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadDocswellIframe(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px',
        threshold: 0.01 // Load when entering viewport
      });

      placeholders.forEach((placeholder) => {
        observer.observe(placeholder);
      });
    } else {
      // Fallback: load all iframes after a delay
      setTimeout(() => {
        placeholders.forEach(loadDocswellIframe);
      }, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
