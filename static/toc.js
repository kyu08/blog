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

  // Use Intersection Observer to detect visible headings
  const observerOptions = {
    rootMargin: '-100px 0px -66%',
    threshold: 0
  };

  let activeLink = null;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = headingToLink.get(id);
      
      if (entry.isIntersecting && link) {
        // Remove active class from previous link
        if (activeLink) {
          activeLink.classList.remove('toc-active');
        }
        
        // Add active class to current link
        link.classList.add('toc-active');
        activeLink = link;
      }
    });
  }, observerOptions);

  // Observe all headings
  headings.forEach(heading => {
    if (heading.id) {
      observer.observe(heading);
    }
  });
});
