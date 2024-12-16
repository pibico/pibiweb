document.addEventListener('DOMContentLoaded', () => {
  // Elements for logo animation
  const heartIcon = document.querySelector('.heart-icon');
  const logoComplete = document.querySelector('.logo-complete');

  // Elements for menu curtain
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const curtain = document.querySelector('.curtain');
  const langButtons = document.querySelectorAll('.lang-btn');

  // Elements for legal and privacy curtains
  const sideCurtains = document.querySelectorAll('.side-curtain');
  const closeButtons = document.querySelectorAll('.close-curtain');
  const footerLinks = document.querySelectorAll('.footer-links a');

  // Initial setup
  heartIcon?.classList.remove('hidden');
  logoComplete?.classList.remove('hidden');

  // Helper function to get URL parameters
  function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Function to set initial language button state
  function setInitialLanguageState() {
    const currentLang = getUrlParameter('_lang') || 'en';
    langButtons.forEach(btn => {
      const btnLang = btn.textContent?.toLowerCase().trim();
      if (btnLang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Set initial language state
  setInitialLanguageState();

  // Heart animation handler
  heartIcon?.addEventListener('animationend', () => {
    heartIcon.classList.add('hidden');
  });

  // Language selector
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.textContent?.toLowerCase().trim();
      if (lang) {
        // Remove active class from all buttons
        langButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Change the URL while maintaining the current hash
        const currentHash = window.location.hash;
        const newUrl = `?_lang=${lang}${currentHash}`;
        window.location.href = newUrl;
      }
    });
  });

  // Menu curtain handlers
  if (hamburgerIcon && curtain) {
    hamburgerIcon.addEventListener('click', () => {
      curtain.classList.toggle('open');
      hamburgerIcon.classList.toggle('active');

      // Close any open side curtain
      sideCurtains.forEach(curtain => {
        if (curtain.classList.contains('open')) {
          curtain.classList.remove('open');
        }
      });
    });

    curtain.addEventListener('click', (e) => {
      if (e.target === curtain) {
        curtain.classList.remove('open');
        hamburgerIcon.classList.remove('active');
      }
    });
  }

  // Menu items navigation
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetHref = this.getAttribute('data-href');
      
      // Close menu before any navigation
      curtain?.classList.remove('open');
      hamburgerIcon?.classList.remove('active');

      if (targetHref) {
        // Get current language from URL or default to 'en'
        const currentLang = getUrlParameter('_lang') || 'en';
        
        // Check if we're already on the home page
        if (window.location.pathname === '/home/' || window.location.pathname === '/home') {
          // We're on home page, scroll to section
          const sectionId = targetHref.replace('#', '');
          const targetSection = document.getElementById(sectionId);
          
          if (targetSection) {
            // Update URL with language parameter while scrolling
            const newUrl = `/home/?_lang=${currentLang}${targetHref}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            
            // Smooth scroll to target section
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        } else {
          // Not on home page, navigate with language parameter
          window.location.href = `/home/?_lang=${currentLang}${targetHref}`;
        }
      }
    });
  });

  // Contact link handlers
  const contactLinks = document.querySelectorAll('a[href*="#contact-us"], a[data-href="#contact-us"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close the curtain menu
      curtain?.classList.remove('open');
      hamburgerIcon?.classList.remove('active');

      // Get current language
      const currentLang = getUrlParameter('_lang') || 'en';
      
      // Get current path without trailing slash
      const currentPath = window.location.pathname.replace(/\/$/, '');
      
      if (currentPath === '/home') {
        // Already on home page, scroll to contact section
        const contactSection = document.getElementById('contact-us');
        if (contactSection) {
          // Update URL with language parameter
          const newUrl = `/home/?_lang=${currentLang}#contact-us`;
          window.history.pushState({ path: newUrl }, '', newUrl);
          
          // Smooth scroll to contact section
          contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        // On another page, do a full navigation to home page with contact section
        const targetUrl = `/home/?_lang=${currentLang}#contact-us`;
        
        // Store a flag in sessionStorage to indicate we need to scroll
        sessionStorage.setItem('scrollToContact', 'true');
        
        // Navigate to home page
        window.location.href = targetUrl;
      }
    });
  });

  // Handle scroll after navigation for contact section
  if (window.location.pathname.replace(/\/$/, '') === '/home') {
    // Check if we need to scroll to contact
    const shouldScroll = sessionStorage.getItem('scrollToContact');
    if (shouldScroll === 'true') {
      // Clear the flag
      sessionStorage.removeItem('scrollToContact');
      
      // Wait for page to load and then scroll
      window.addEventListener('load', () => {
        const contactSection = document.getElementById('contact-us');
        if (contactSection) {
          setTimeout(() => {
            contactSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      });
    }
  }

  // Footer links handler for curtains
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const curtainClass = link.getAttribute('data-curtain');
      if (!curtainClass) return;

      e.preventDefault();
      
      // Close menu curtain if open
      if (curtain?.classList.contains('open')) {
        curtain.classList.remove('open');
        hamburgerIcon?.classList.remove('active');
      }

      // Close any open side curtain
      sideCurtains.forEach(curtain => {
        curtain.classList.remove('open');
      });

      // Open target curtain
      const targetCurtain = document.querySelector(`.${curtainClass}`);
      if (targetCurtain) {
        targetCurtain.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close button handler for both curtains
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentCurtain = button.closest('.side-curtain');
      if (parentCurtain) {
        parentCurtain.classList.remove('open');
        // Check if no other curtains are open before enabling scroll
        const anyOpen = document.querySelector('.curtain.open, .side-curtain.open');
        if (!anyOpen) {
          document.body.style.overflow = '';
        }
      }
    });
  });

  // Handle escape key for all curtains
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (curtain?.classList.contains('open')) {
        curtain.classList.remove('open');
        hamburgerIcon?.classList.remove('active');
      }
      sideCurtains.forEach(curtain => {
        if (curtain.classList.contains('open')) {
          curtain.classList.remove('open');
        }
      });
      // Check if no curtains are open before enabling scroll
      const anyOpen = document.querySelector('.curtain.open, .side-curtain.open');
      if (!anyOpen) {
        document.body.style.overflow = '';
      }
    }
  });

  // Touch events for all curtains
  setupTouchEvents(curtain, 'right');
  sideCurtains.forEach(curtain => {
    setupTouchEvents(curtain, 'right');
  });

  function setupTouchEvents(element, direction) {
    let touchStartX = 0;
    let touchEndX = 0;

    element?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    element?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(element, direction);
    }, false);

    function handleSwipe(elem, dir) {
      const swipeThreshold = 100;
      const swipeLength = touchEndX - touchStartX;

      if ((dir === 'right' && swipeLength > swipeThreshold) ||
          (dir === 'left' && swipeLength < -swipeThreshold)) {
        elem.classList.remove('open');
        if (elem === curtain) {
          hamburgerIcon?.classList.remove('active');
        }
        // Check if no curtains are open before enabling scroll
        const anyOpen = document.querySelector('.curtain.open, .side-curtain.open');
        if (!anyOpen) {
          document.body.style.overflow = '';
        }
      }
    }
  }

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get current language
      const currentLang = getUrlParameter('_lang') || 'en';
      
      // Show loading spinner
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const loadingSpinner = submitButton.querySelector('.loading-spinner');
      submitButton.disabled = true;
      loadingSpinner.classList.remove('d-none');
      
      // Gather form data
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        _lang: currentLang
      };
      
      try {
        const response = await frappe.call({
          method: 'pibiweb.pibiweb.api.send_contact_email',
          args: data,
          callback: function(r) {
            if (r.message && r.message.success) {
              // Show success message
              frappe.show_alert({
                message: __('Thank you for your message. We will get back to you soon.'),
                indicator: 'green'
              });
              
              // Reset form while maintaining language in URL
              contactForm.reset();
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set('_lang', currentLang);
              window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);
            } else {
              // Show error message
              frappe.show_alert({
                message: r.message.message || __('There was an error sending your message. Please try again.'),
                indicator: 'red'
              });
            }
          }
        });
      } catch (error) {
        console.error('Contact form error:', error);
        frappe.show_alert({
          message: __('There was an error sending your message. Please try again.'),
          indicator: 'red'
        });
      } finally {
        submitButton.disabled = false;
        loadingSpinner.classList.add('d-none');
      }
    });
  }
});