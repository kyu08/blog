// Table of Contents functionality

document.addEventListener('DOMContentLoaded', function() {
  const toc = document.querySelector('.table-of-contents');
  if (!toc) return;

  // Create mobile TOC button
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

  // Toggle TOC on mobile
  let isTocVisible = false;
  tocButton.addEventListener('click', function() {
    isTocVisible = !isTocVisible;
    toc.classList.toggle('toc-mobile-visible', isTocVisible);
    tocButton.setAttribute('aria-label', isTocVisible ? '目次を閉じる' : '目次を表示');
  });

  // Close TOC when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1200 && isTocVisible && 
        !toc.contains(e.target) && !tocButton.contains(e.target)) {
      isTocVisible = false;
      toc.classList.remove('toc-mobile-visible');
      tocButton.setAttribute('aria-label', '目次を表示');
    }
  });

  // Highlight active heading based on scroll position
  const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
  const tocLinks = toc.querySelectorAll('a[href^="#"]');

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

  // Track which headings are currently visible
  const visibleHeadings = new Set();
  let lastActiveHeading = null;
  
  // Use Intersection Observer to detect visible headings
  const observerOptions = {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      
      if (entry.isIntersecting) {
        visibleHeadings.add(entry.target);
      } else {
        visibleHeadings.delete(entry.target);
      }
    });
    
    // Find the topmost visible heading
    let topHeading = null;
    let topPosition = Infinity;
    
    visibleHeadings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top < topPosition) {
        topPosition = rect.top;
        topHeading = heading;
      }
    });
    
    // If no headings are visible, find the closest one above the viewport
    if (!topHeading) {
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
      
      topHeading = closestHeading || headings[0];
    }
    
    // Update active link
    tocLinks.forEach(link => link.classList.remove('toc-active'));
    
    if (topHeading) {
      lastActiveHeading = topHeading;
      const link = headingToLink.get(topHeading.id);
      if (link) {
        link.classList.add('toc-active');
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
