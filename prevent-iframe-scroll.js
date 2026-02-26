// Prevent automatic scrolling to iframes on page load
// This script prevents the browser from automatically scrolling to embedded iframes
// (such as Docswell, Google Slides, Speaker Deck) when the page loads.
// Only active on fresh navigation, not on reload (to preserve browser's scroll restoration).

(function() {
  'use strict';

  // Check if this is a page reload - if so, let browser handle scroll restoration naturally
  const navEntries = performance.getEntriesByType('navigation');
  if (navEntries.length > 0 && navEntries[0].type === 'reload') {
    return;
  }

  // Check if there's a hash in the URL (intentional navigation to an anchor)
  if (window.location.hash) {
    return;
  }

  // Configuration
  const MONITOR_DURATION_MS = 2000;

  // Store the initial scroll position (should be 0 for fresh page loads)
  const initialScrollY = window.scrollY || 0;

  // If already scrolled on fresh load, something else is at play - don't interfere
  if (initialScrollY > 0) {
    return;
  }

  // Flag to track if user has intentionally interacted
  let userHasInteracted = false;

  function stopMonitoring() {
    userHasInteracted = true;
    window.removeEventListener('wheel', stopMonitoring);
    window.removeEventListener('touchstart', stopMonitoring);
    window.removeEventListener('keydown', stopMonitoring);
    window.removeEventListener('mousedown', stopMonitoring);
    window.removeEventListener('scroll', onScroll);
  }

  // Detect user-initiated scroll via scroll event timing
  // If scroll happens after user interaction, it's intentional
  let lastInteractionTime = 0;

  function onInteraction() {
    lastInteractionTime = Date.now();
  }

  function onScroll() {
    // If scroll happened within 100ms of user interaction, it's user-initiated
    if (Date.now() - lastInteractionTime < 100) {
      stopMonitoring();
    }
  }

  // Listen for user interaction
  window.addEventListener('wheel', onInteraction, { passive: true });
  window.addEventListener('touchstart', onInteraction, { passive: true });
  window.addEventListener('keydown', onInteraction, { passive: true });
  window.addEventListener('mousedown', onInteraction, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // Also stop immediately on wheel (most common scroll method)
  window.addEventListener('wheel', stopMonitoring, { passive: true });

  // Function to restore scroll position if changed unexpectedly
  function checkAndRestoreScroll() {
    if (userHasInteracted) {
      return;
    }

    const currentScrollY = window.scrollY || 0;

    if (currentScrollY !== initialScrollY) {
      window.scrollTo({
        top: initialScrollY,
        left: 0,
        behavior: 'instant'
      });
    }
  }

  // Monitor for unwanted scroll changes
  let startTime = null;

  function monitorScroll(timestamp) {
    if (userHasInteracted) {
      return;
    }

    if (startTime === null) {
      startTime = timestamp;
    }

    checkAndRestoreScroll();

    if (timestamp - startTime < MONITOR_DURATION_MS) {
      requestAnimationFrame(monitorScroll);
    } else {
      stopMonitoring();
    }
  }

  // Start monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      requestAnimationFrame(monitorScroll);
    });
  } else {
    requestAnimationFrame(monitorScroll);
  }

  // Fallback checks
  window.addEventListener('load', function() {
    if (!userHasInteracted) setTimeout(checkAndRestoreScroll, 100);
    if (!userHasInteracted) setTimeout(checkAndRestoreScroll, 300);
    if (!userHasInteracted) setTimeout(checkAndRestoreScroll, 500);
    if (!userHasInteracted) setTimeout(checkAndRestoreScroll, 1000);
  });
})();
