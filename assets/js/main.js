/* to prevent copying content*/
// document.addEventListener('selectstart', function(e) {
//   e.preventDefault();
// }, false);

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function() {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function() {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-filters li', true);

      on('click', '#portfolio-filters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });
  GLightbox({
    selector: '.portfolio-lightbox'
  });
  /**
   * Portfolio details slider
   */
  const portfolioSwiper = new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    on: {
      init: function() {
        // Add event listeners to videos when swiper is initialized
        const videos = this.el.querySelectorAll('video');
        videos.forEach(video => {
          video.addEventListener('play', function() {
            portfolioSwiper.autoplay.stop();
          });
          video.addEventListener('ended', function() {
            // Only resume autoplay if the video is still in the active slide
            if (this.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
              portfolioSwiper.autoplay.start();
            }
          });
          video.addEventListener('pause', function() {
            // Only resume autoplay if the video is still in the active slide
            if (this.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
              portfolioSwiper.autoplay.start();
            }
          });
        });
      },
      slideChange: function() {
        // Pause any playing videos when slide changes
        const activeSlide = this.slides[this.activeIndex];
        const videos = activeSlide.querySelectorAll('video');
        videos.forEach(video => {
          video.pause();
        });
        // Restart autoplay if it was stopped
        if (!this.autoplay.running) {
          this.autoplay.start();
        }
      }
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Page Visit Tracking
   */
  (function() {
    const TRACKING_URL = 'https://naromailing.pythonanywhere.com/api/track/';

    const getCustomData = () => {
      return {
        page: window.location.pathname || '/',
        timestamp: new Date().toISOString(),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null
      };
    };

    const trackPageView = async () => {
      try {
        const payload = {
          event_type: 'page_view',
          event_name: 'portfolio_home_visit',
          custom_data: getCustomData()
        };

        await fetch(TRACKING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        // Silent fail - tracking errors shouldn't break the page
        console.log('Tracking failed:', error.message);
      }
    };

    // Fire tracking on page load (non-blocking)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      trackPageView();
    } else {
      window.addEventListener('DOMContentLoaded', trackPageView);
    }
  })();

  /**
   * Contact Form Handling
   */
  (function() {
    const contactForm = select('#contactForm');
    if (!contactForm) return;

    const API_URL = 'https://naromailing.pythonanywhere.com/api/send-mail/';

    // Form elements
    const nameInput = select('#name');
    const emailInput = select('#email');
    const subjectInput = select('#subject');
    const messageInput = select('#message');
    const submitBtn = select('#submitBtn');

    // Feedback elements
    const formLoading = select('#formLoading');
    const formError = select('#formError');
    const formSuccess = select('#formSuccess');

    // Validation helpers
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const showFieldError = (fieldId, show) => {
      const errorEl = select(`#${fieldId}Error`);
      if (errorEl) {
        errorEl.style.display = show ? 'block' : 'none';
      }
    };

    const clearAllErrors = () => {
      ['name', 'email', 'subject', 'message'].forEach(field => {
        showFieldError(field, false);
      });
      if (formError) formError.style.display = 'none';
    };

    const validateForm = () => {
      let isValid = true;
      clearAllErrors();

      // Name validation
      if (!nameInput.value.trim()) {
        showFieldError('name', true);
        isValid = false;
      }

      // Email validation
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showFieldError('email', true);
        isValid = false;
      }

      // Subject validation
      if (!subjectInput.value.trim()) {
        showFieldError('subject', true);
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        showFieldError('message', true);
        isValid = false;
      }

      return isValid;
    };

    const setLoading = (loading) => {
      if (formLoading) {
        formLoading.style.display = loading ? 'block' : 'none';
      }
      if (submitBtn) {
        submitBtn.disabled = loading;
        submitBtn.textContent = loading ? 'Sending...' : 'Send Message';
      }
    };

    const showSuccess = () => {
      if (formSuccess) {
        formSuccess.style.display = 'block';
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }
    };

    const showError = (message) => {
      if (formError) {
        formError.textContent = message || 'An error occurred. Please try again later.';
        formError.style.display = 'block';
      }
    };

    const clearForm = () => {
      contactForm.reset();
    };

    // Real-time validation removal on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', function() {
          const fieldId = this.id;
          if (this.value.trim()) {
            showFieldError(fieldId, false);
          }
        });

        // Also clear on blur if valid
        input.addEventListener('blur', function() {
          const fieldId = this.id;
          if (this.id === 'email') {
            if (validateEmail(this.value.trim())) {
              showFieldError(fieldId, false);
            }
          } else {
            if (this.value.trim()) {
              showFieldError(fieldId, false);
            }
          }
        });
      }
    });

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Client-side validation
      if (!validateForm()) {
        return;
      }

      // Prepare request payload
      const payload = {
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        recipient: 'chahinnacir@gmail.com',
        sender_email: emailInput.value.trim(),
        sender_name: nameInput.value.trim()
      };

      // Show loading state
      setLoading(true);
      clearAllErrors();

      // Send AJAX request
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);

        if (data.success) {
          showSuccess();
          clearForm();
        } else {
          // Handle API validation errors
          if (data.errors) {
            const errorMessages = Object.entries(data.errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
            showError(errorMessages);
          } else {
            showError(data.message || 'Failed to send message. Please try again.');
          }
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Contact form error:', error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          showError('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('HTTP error')) {
          showError('Server error. Please try again later.');
        } else {
          showError('An unexpected error occurred. Please try again.');
        }
      });
    });
  })();

})()