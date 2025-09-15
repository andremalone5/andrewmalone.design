/**
 * Main JavaScript file for Andrew Malone Portfolio
 * Focus: Accessibility, Performance, and User Experience
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level (polite, assertive)
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ========================================
// LAZY LOADING ENHANCEMENT
// ========================================

class LazyLoadingEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
  }

  setupLazyLoading() {
    // Add smooth loading transition for lazy-loaded images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      // Add loaded class when image finishes loading
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });

      // Handle error case
      img.addEventListener('error', () => {
        img.classList.add('loaded');
        console.warn('Failed to load image:', img.src);
      });

      // If image is already loaded (cached), add loaded class immediately
      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  }
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

class AnimationController {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all animations immediately
      this.showAllAnimations();
      return;
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all animated elements
    this.observeElements();
  }

  observeElements() {
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  showAllAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(element => {
      element.classList.add('visible');
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ========================================
// PROJECT CARD INTERACTIONS
// ========================================

class ProjectCardController {
  constructor() {
    this.init();
  }

  init() {
    this.setupProjectCards();
  }

  setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      // Add click handler
      card.addEventListener('click', (e) => {
        this.handleProjectCardClick(e, card);
      });

      // Add keyboard handler
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleProjectCardClick(e, card);
        }
      });

      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.handleCardHover(card, true);
      });

      card.addEventListener('mouseleave', () => {
        this.handleCardHover(card, false);
      });
    });
  }

  handleProjectCardClick(event, card) {
    const projectTitle = card.querySelector('.project-title');
    const projectName = projectTitle ? projectTitle.textContent : 'project';
    
    // Announce to screen reader
    announceToScreenReader(`Opening ${projectName} project details`);
    
    // Add visual feedback
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // In a real implementation, this would navigate to the project page
    console.log(`Opening project: ${projectName}`);
    
    // For demo purposes, show an alert
    // In production, you would navigate to the actual project page
    // window.location.href = card.getAttribute('href');
  }

  handleCardHover(card, isHovering) {
    const image = card.querySelector('.project-image-img');
    if (image) {
      if (isHovering) {
        image.style.transform = 'scale(1.02)';
      } else {
        image.style.transform = 'scale(1)';
      }
    }
  }
}

// ========================================
// MOBILE NAVIGATION
// ========================================

class MobileNavigationController {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupKeyboardNavigation();
    this.setupClickOutside();
  }

  setupMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (toggleButton && navMenu) {
      toggleButton.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking on nav links
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }
  }

  setupKeyboardNavigation() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    
    if (toggleButton) {
      toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleMobileMenu();
        }
        
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
    }

    // Handle escape key for closing menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  setupClickOutside() {
    document.addEventListener('click', (e) => {
      const navHeader = document.querySelector('.nav-header');
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      
      if (this.isOpen && 
          !navHeader.contains(e.target) && 
          e.target !== toggleButton) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (toggleButton && navMenu) {
      this.isOpen = true;
      toggleButton.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('mobile-open');
      
      // Announce to screen readers
      announceToScreenReader('Navigation menu opened');
      
      // Focus first nav link
      const firstLink = navMenu.querySelector('.nav-link');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  closeMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (toggleButton && navMenu) {
      this.isOpen = false;
      toggleButton.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('mobile-open');
      
      // Announce to screen readers
      announceToScreenReader('Navigation menu closed');
      
      // Return focus to toggle button
      toggleButton.focus();
    }
  }
}

// ========================================
// CONTACT EMAIL COPY FUNCTIONALITY
// ========================================

class ContactController {
  constructor() {
    // Obfuscated email to prevent basic scraping
    this.email = this.decodeEmail('YW5kcmV3bWFsb25lZGVzaWduQGdtYWlsLmNvbQ==');
    this.originalText = 'Contact';
    this.lastClickTime = 0;
    this.clickCount = 0;
    this.init();
  }

  // Simple base64 decoding for email obfuscation
  decodeEmail(encoded) {
    return atob(encoded);
  }

  // Additional protection: Check if running in a legitimate browser
  isLegitimateBrowser() {
    // Basic checks to detect automated tools
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      navigator.userAgent &&
      !navigator.userAgent.includes('bot') &&
      !navigator.userAgent.includes('crawler') &&
      !navigator.userAgent.includes('spider')
    );
  }

  init() {
    this.setupContactLink();
  }

  setupContactLink() {
    // Handle navigation contact link
    const contactLink = document.querySelector('.contact-copy-link');
    
    if (contactLink) {
      contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContactClick(e);
      });

      contactLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleContactClick(e);
        }
      });
    }
  }

  async handleContactClick(event) {
    const link = event.currentTarget;
    const now = Date.now();
    
    // Basic protection: Only work in legitimate browsers
    if (!this.isLegitimateBrowser()) {
      console.warn('Contact functionality blocked for automated tools');
      return;
    }
    
    // Rate limiting: Prevent rapid clicks (likely scraping)
    if (now - this.lastClickTime < 1000) { // 1 second cooldown
      this.clickCount++;
      if (this.clickCount > 3) {
        console.warn('Too many rapid clicks detected - blocking');
        return;
      }
    } else {
      this.clickCount = 0; // Reset counter if enough time passed
    }
    this.lastClickTime = now;
    
    try {
      // Copy email to clipboard
      await navigator.clipboard.writeText(this.email);
      
      // Add visual feedback
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
      
      // Announce to screen reader
      announceToScreenReader('Email address copied to clipboard');
      
      // Smooth transition to "Copied!"
      this.showCopiedState(link);
      
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error('Failed to copy email to clipboard:', err);
      
      // Show fallback message
      announceToScreenReader('Unable to copy email automatically. Please copy the email address manually');
      
      // Still show visual feedback
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
      
      // Show copied state even on error
      this.showCopiedState(link);
    }
  }

  showCopiedState(link) {
    // Store original text content
    const originalText = link.textContent.trim();
    
    // Remove focus to clear the blue outline
    link.blur();
    
    // Add copied class for styling and animation
    link.classList.add('copied');
    
    // Change text to "Copied!"
    link.textContent = 'Copied!';
    
    // Reset after 1.5 seconds (snappier transition)
    setTimeout(() => {
      // Remove copied class and reset text
      link.classList.remove('copied');
      link.textContent = originalText;
    }, 1500);
  }
}

// ========================================
// LINKEDIN BUTTON INTERACTIONS
// ========================================

class LinkedInButtonController {
  constructor() {
    this.init();
  }

  init() {
    this.setupLinkedInButton();
  }

  setupLinkedInButton() {
    const linkedInButton = document.querySelector('.btn-linkedin');
    
    if (linkedInButton) {
      linkedInButton.addEventListener('click', (e) => {
        this.handleLinkedInClick(e);
      });

      linkedInButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleLinkedInClick(e);
        }
      });
    }
  }

  handleLinkedInClick(event) {
    // Announce to screen reader
    announceToScreenReader('Opening LinkedIn profile in new tab');
    
    // Add visual feedback
    const button = event.currentTarget;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);

    // In a real implementation, this would open the LinkedIn profile
    // For demo purposes, we'll just log the action
    console.log('Opening LinkedIn profile');
    
    // Uncomment the line below to actually open LinkedIn
    // window.open('https://linkedin.com/in/andrewmalone', '_blank', 'noopener,noreferrer');
  }
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupFocusManagement();
    this.setupReducedMotion();
    this.setupHighContrast();
    this.setupScreenReaderEnhancements();
    this.setupKeyboardNavigation();
    this.setupARIALabels();
  }

  setupFocusManagement() {
    // Track focus changes for better UX
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('focused');
    });
    
    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focused');
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
    
    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
      } else {
        document.documentElement.style.setProperty('--transition-fast', '150ms ease-in-out');
        document.documentElement.style.setProperty('--transition-base', '250ms ease-in-out');
        document.documentElement.style.setProperty('--transition-slow', '350ms ease-in-out');
      }
    });
  }

  setupHighContrast() {
    // Detect high contrast mode
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    if (prefersHighContrast.matches) {
      document.documentElement.classList.add('high-contrast');
    }
    
    // Listen for changes
    prefersHighContrast.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    });
  }

  setupScreenReaderEnhancements() {
    // Add live regions for dynamic content
    this.createLiveRegion();
    
    // Enhance image descriptions
    this.enhanceImageDescriptions();
    
    // Add landmark navigation
    this.addLandmarkNavigation();
    
    // Setup reading order
    this.setupReadingOrder();
  }

  createLiveRegion() {
    // Create a live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  enhanceImageDescriptions() {
    // Add enhanced descriptions for complex images
    const images = document.querySelectorAll('img[alt]');
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (alt && alt.length > 100) {
        // For complex images, add a detailed description
        img.setAttribute('aria-describedby', `desc-${img.id || Math.random().toString(36).substr(2, 9)}`);
        
        const description = document.createElement('div');
        description.id = img.getAttribute('aria-describedby');
        description.className = 'sr-only';
        description.textContent = alt;
        img.parentNode.insertBefore(description, img.nextSibling);
      }
    });
  }

  addLandmarkNavigation() {
    // Add skip links for landmarks
    const landmarks = document.querySelectorAll('main, nav, section, article, aside, header, footer');
    landmarks.forEach(landmark => {
      if (!landmark.id) {
        landmark.id = `landmark-${Math.random().toString(36).substr(2, 9)}`;
      }
    });
  }

  setupReadingOrder() {
    // Ensure logical reading order
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let headingLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > headingLevel + 1) {
        console.warn('Heading level skipped:', heading);
      }
      headingLevel = level;
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Skip to main content with 'M' key
      if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
          announceToScreenReader('Skipped to main content');
        }
      }
      
      // Skip to navigation with 'N' key
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) {
          nav.focus();
          announceToScreenReader('Skipped to navigation');
        }
      }
      
      // Skip to footer with 'F' key
      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        const footer = document.querySelector('footer');
        if (footer) {
          footer.focus();
          announceToScreenReader('Skipped to footer');
        }
      }
    });
  }

  setupARIALabels() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
      if (!button.textContent.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });
    
    // Add ARIA labels to links without descriptive text
    const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
    links.forEach(link => {
      if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
        link.setAttribute('aria-label', 'Link');
      }
    });
    
    // Add ARIA descriptions for complex interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const title = card.querySelector('.project-title');
      const company = card.querySelector('.project-company');
      if (title && company) {
        card.setAttribute('aria-label', `View ${title.textContent} project at ${company.textContent}`);
      }
    });
  }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor page load performance
    this.monitorPageLoad();
    
    // Monitor scroll performance
    this.monitorScrollPerformance();
  }

  monitorPageLoad() {
    window.addEventListener('load', () => {
      // Use Performance API if available
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Report slow loading
        if (loadTime > 3000) {
          console.warn('Page load time is slow:', loadTime + 'ms');
        }
      }
    });
  }

  monitorScrollPerformance() {
    const handleScroll = debounce(() => {
      // Check for scroll performance issues
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add visual indicator for scroll position (for debugging)
      if (scrollTop > 100) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

/**
 * Optimized initialization with performance monitoring
 */
function initializeWebsite() {
  // Use requestIdleCallback for non-critical initialization
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initializeControllers();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(initializeControllers, 0);
  }
}

function initializeControllers() {
  // Initialize controllers in order of priority
  const lazyLoadingEnhancer = new LazyLoadingEnhancer();
  const accessibilityEnhancer = new AccessibilityEnhancer();
  const mobileNavigationController = new MobileNavigationController();
  const contactController = new ContactController();
  const projectCardController = new ProjectCardController();
  const linkedInButtonController = new LinkedInButtonController();
  const animationController = new AnimationController();
  const performanceMonitor = new PerformanceMonitor();
  
  // Announce page load to screen readers
  announceToScreenReader('Andrew Malone portfolio website loaded successfully');
  
  // Log initialization
  console.log('Portfolio website initialized with accessibility and performance enhancements');
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    animationController.destroy();
  });
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  // DOM is already ready
  initializeWebsite();
}

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you might want to send this to an error tracking service
});