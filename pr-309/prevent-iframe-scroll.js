// Prevent automatic scrolling to iframes on page load
// This script prevents the browser from automatically scrolling to embedded iframes
// (such as Docswell, Google Slides, Speaker Deck) when the page loads.

(function() {
  'use strict';

  // Configuration constants
  const MONITOR_DURATION_MS = 1000; // Monitor for unwanted scrolling for 1 second
  const EXPECTED_FPS = 60; // Expected frames per second
  const FALLBACK_CHECK_DELAY_MS = 100; // First fallback check delay
  const EXTENDED_CHECK_DELAY_MS = 300; // Extended fallback check delay

  // Check if there's a hash in the URL (intentional navigation to an anchor)
  if (window.location.hash) {
    // User intentionally navigated to a specific section, don't interfere
    return;
  }

  // Store the initial scroll position (should be 0 for new page loads)
  const initialScrollY = window.scrollY || window.pageYOffset || 0;
  
  // Flag to track if we've already corrected unwanted scrolling
  let hasRestoredScroll = false;

  // Function to restore scroll position if changed unexpectedly
  function checkAndRestoreScroll() {
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    
    // If scroll position changed from initial and we haven't restored yet
    if (currentScrollY !== initialScrollY && !hasRestoredScroll) {
      // Restore to initial position
      window.scrollTo({
        top: initialScrollY,
        left: 0,
        behavior: 'instant' // Use instant to avoid visible scrolling animation
      });
      hasRestoredScroll = true;
    }
  }

  // Check for unwanted scroll changes during early page load
  // Use requestAnimationFrame for smooth detection
  let frameCount = 0;
  const maxFrames = (MONITOR_DURATION_MS / 1000) * EXPECTED_FPS;

  function monitorScroll() {
    checkAndRestoreScroll();
    
    frameCount++;
    if (frameCount < maxFrames && !hasRestoredScroll) {
      requestAnimationFrame(monitorScroll);
    }
  }

  // Start monitoring as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      requestAnimationFrame(monitorScroll);
    });
  } else {
    // DOM already loaded
    requestAnimationFrame(monitorScroll);
  }

  // Also set up a fallback check on window load event
  window.addEventListener('load', function() {
    setTimeout(checkAndRestoreScroll, FALLBACK_CHECK_DELAY_MS);
    setTimeout(checkAndRestoreScroll, EXTENDED_CHECK_DELAY_MS);
  });
})();
