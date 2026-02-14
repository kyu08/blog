// Table of Contents functionality

document.addEventListener('DOMContentLoaded', function() {
  const tocSidebar = document.querySelector('.table-of-contents-sidebar');
  if (!tocSidebar) return;

  // Create mobile TOC button (shown on screens < 1200px)
  const tocButton = document.createElement('button');
  tocButton.className = 'toc-mobile-button';
  tocButton.setAttribute('aria-label', '目次を表示');
  tocButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;
  document.body.appendChild(tocButton);

  // Create overlay backdrop
  const overlay = document.createElement('div');
  overlay.className = 'toc-overlay';
  document.body.appendChild(overlay);

  // Toggle TOC visibility on narrow screens
  let tocOpen = false;
  
  function toggleTOC() {
    tocOpen = !tocOpen;
    if (tocOpen) {
      tocSidebar.classList.add('toc-open');
      overlay.classList.add('toc-open');
      tocButton.setAttribute('aria-label', '目次を閉じる');
    } else {
      tocSidebar.classList.remove('toc-open');
      overlay.classList.remove('toc-open');
      tocButton.setAttribute('aria-label', '目次を表示');
    }
  }

  tocButton.addEventListener('click', toggleTOC);
  overlay.addEventListener('click', toggleTOC);

  // Highlight active heading based on scroll position (for sidebar TOC only)
  const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
  const tocLinks = tocSidebar.querySelectorAll('a[href^="#"]');

  if (headings.length === 0 || tocLinks.length === 0) return;

  // Create a map of heading IDs to TOC links
  const headingToLink = new Map();
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const id = href.substring(1);
      headingToLink.set(id, link);
    }
  });

  // Track scroll direction and last scroll position
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';
  
  // Use Intersection Observer to detect visible headings
  const observerOptions = {
    rootMargin: '-10% 0px -66% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  };

  const observer = new IntersectionObserver(entries => {
    // Update scroll direction
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      scrollDirection = 'down';
    } else if (currentScrollY < lastScrollY) {
      scrollDirection = 'up';
    }
    lastScrollY = currentScrollY;
    
    // Find all currently intersecting headings
    const intersectingHeadings = [];
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if heading is in the upper portion of viewport
      if (rect.top >= 0 && rect.top <= viewportHeight * 0.4) {
        intersectingHeadings.push({
          element: heading,
          top: rect.top
        });
      }
    });
    
    let activeHeading = null;
    
    if (intersectingHeadings.length > 0) {
      // Sort by position
      intersectingHeadings.sort((a, b) => a.top - b.top);
      
      // Choose the first one (topmost)
      activeHeading = intersectingHeadings[0].element;
    } else {
      // No headings in the detection zone, find the one closest above
      let closestHeading = null;
      let closestDistance = -Infinity;
      
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        // Check if heading is above the viewport
        if (rect.top < 0 && rect.top > closestDistance) {
          closestDistance = rect.top;
          closestHeading = heading;
        }
      });
      
      activeHeading = closestHeading || headings[0];
    }
    
    // Update active link
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    
    if (activeHeading) {
      let link = headingToLink.get(activeHeading.id);
      
      // If the active heading is not in TOC (h4, h5, h6), find the nearest parent heading in TOC
      if (!link) {
        // Get the heading level (2 for h2, 3 for h3, etc.)
        const activeLevel = parseInt(activeHeading.tagName.substring(1));
        
        // Find all headings before the active one
        const headingsArray = Array.from(headings);
        const activeIndex = headingsArray.indexOf(activeHeading);
        
        // Search backwards for a parent heading (h2 or h3) that exists in TOC
        for (let i = activeIndex - 1; i >= 0; i--) {
          const candidateHeading = headingsArray[i];
          const candidateLevel = parseInt(candidateHeading.tagName.substring(1));
          
          // Only consider headings with a lower level number (h2 < h3 < h4)
          if (candidateLevel < activeLevel) {
            const candidateLink = headingToLink.get(candidateHeading.id);
            if (candidateLink) {
              link = candidateLink;
              break;
            }
          }
        }
      }
      
      if (link) {
        link.classList.add('toc-active');
        
        // Auto-scroll the TOC to keep the active item visible
        // Only scroll if sidebar is visible (desktop >= 1200px)
        if (window.innerWidth >= 1200) {
          link.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }
  }, observerOptions);

  // Observe all headings
  headings.forEach(heading => {
    if (heading.id) {
      observer.observe(heading);
    }
  });
});
