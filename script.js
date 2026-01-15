/**
 * i-SPY Website Scripts
 * Clean, minimal JavaScript for core functionality
 */

(function() {
    'use strict';

    // ==================== 
    // SMOOTH SCROLL
    // ==================== 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==================== 
    // MOBILE MENU
    // ==================== 
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu?.querySelectorAll('a');

    function toggleMobileMenu() {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        mobileLinks?.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
                hamburger.focus();
            }
        });
    }

    // ==================== 
    // HEADER SCROLL EFFECT
    // ==================== 
    const header = document.querySelector('header');

    function handleHeaderScroll() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    }

    // ==================== 
    // HERO DOT ROTATION
    // ==================== 
    const heroDot = document.querySelector('.hero-dot');

    function animateHeroDot() {
        if (!heroDot) return;
        const rotation = (window.scrollY / 3) % 360;
        heroDot.style.transform = `rotate(${rotation}deg)`;
    }

    // ==================== 
    // SERVICES TOGGLE
    // ==================== 
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const strategyList = document.getElementById('strategy-list');
    const designList = document.getElementById('design-list');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update button states
            toggleBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update list visibility
            if (target === 'strategy') {
                strategyList?.classList.add('active');
                strategyList?.removeAttribute('hidden');
                designList?.classList.remove('active');
                designList?.setAttribute('hidden', '');
            } else if (target === 'design') {
                designList?.classList.add('active');
                designList?.removeAttribute('hidden');
                strategyList?.classList.remove('active');
                strategyList?.setAttribute('hidden', '');
            }
        });
    });

    // ==================== 
    // TESTIMONIALS CAROUSEL
    // ==================== 
    const track = document.querySelector('.testimonials-track');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;
    let testimonialsPerPage = 3;
    
    function updateTestimonialsPerPage() {
        if (window.innerWidth < 768) {
            testimonialsPerPage = 1;
        } else {
            testimonialsPerPage = 2;
        }
    }
    
    function getMaxIndex() {
        // Maximum index ensures last testimonials fill the viewport without white space
        return Math.max(0, testimonials.length - testimonialsPerPage);
    }
    
    function getCenterStartIndex() {
        // Start at center position so user can scroll both ways
        const maxIndex = getMaxIndex();
        return Math.floor(maxIndex / 2);
    }
    
    function updateCarousel() {
        if (!track || testimonials.length === 0) return;
        
        // Calculate how much to shift based on testimonial width + gap
        const testimonial = testimonials[0];
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const testimonialWidth = testimonial.offsetWidth + gap;
        
        // Clamp currentIndex to valid range
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // Calculate the translation
        const translateX = -(currentIndex * testimonialWidth);
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }
    
    function nextPage() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex += 1;
            updateCarousel();
        }
    }
    
    function prevPage() {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarousel();
        }
    }
    
    if (track && testimonials.length > 0) {
        updateTestimonialsPerPage();
        
        // Start at center position
        currentIndex = getCenterStartIndex();
        updateCarousel();
        
        nextBtn?.addEventListener('click', nextPage);
        prevBtn?.addEventListener('click', prevPage);
        
        // Handle keyboard navigation
        nextBtn?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextPage();
            }
        });
        
        prevBtn?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevPage();
            }
        });
        
        // Reset carousel on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateTestimonialsPerPage();
                // Re-clamp currentIndex after resize
                currentIndex = Math.min(currentIndex, getMaxIndex());
                updateCarousel();
            }, 250);
        });
    }

    // ==================== 
    // PARTNERS CAROUSEL
    // ==================== 
    const partnersTrack = document.querySelector('.partners-track');
    const partners = document.querySelectorAll('.partner-circle');
    const partnersPrevBtn = document.querySelector('.partners-prev');
    const partnersNextBtn = document.querySelector('.partners-next');
    
    let partnersIndex = 0;
    let partnersPerPage = 8;
    
    function updatePartnersPerPage() {
        if (window.innerWidth < 480) {
            partnersPerPage = 2;
        } else if (window.innerWidth < 768) {
            partnersPerPage = 3;
        } else if (window.innerWidth < 1024) {
            partnersPerPage = 5;
        } else {
            partnersPerPage = 8;
        }
    }
    
    function getPartnersMaxIndex() {
        return Math.max(0, partners.length - partnersPerPage);
    }
    
    function getPartnersCenterStartIndex() {
        const maxIndex = getPartnersMaxIndex();
        return Math.floor(maxIndex / 2);
    }
    
    function updatePartnersCarousel() {
        if (!partnersTrack || partners.length === 0) return;
        
        const partner = partners[0];
        const gap = parseFloat(window.getComputedStyle(partnersTrack).gap) || 0;
        const partnerWidth = partner.offsetWidth + gap;
        
        const maxIndex = getPartnersMaxIndex();
        partnersIndex = Math.max(0, Math.min(partnersIndex, maxIndex));
        
        const translateX = -(partnersIndex * partnerWidth);
        partnersTrack.style.transform = `translateX(${translateX}px)`;
        
        if (partnersPrevBtn && partnersNextBtn) {
            partnersPrevBtn.disabled = partnersIndex === 0;
            partnersNextBtn.disabled = partnersIndex >= maxIndex;
        }
    }
    
    function nextPartners() {
        const maxIndex = getPartnersMaxIndex();
        if (partnersIndex < maxIndex) {
            partnersIndex += 1;
            updatePartnersCarousel();
        }
    }
    
    function prevPartners() {
        if (partnersIndex > 0) {
            partnersIndex -= 1;
            updatePartnersCarousel();
        }
    }
    
    if (partnersTrack && partners.length > 0) {
        updatePartnersPerPage();
        
        // Start at center position
        partnersIndex = getPartnersCenterStartIndex();
        updatePartnersCarousel();
        
        partnersNextBtn?.addEventListener('click', nextPartners);
        partnersPrevBtn?.addEventListener('click', prevPartners);
        
        let partnersResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(partnersResizeTimer);
            partnersResizeTimer = setTimeout(() => {
                updatePartnersPerPage();
                partnersIndex = Math.min(partnersIndex, getPartnersMaxIndex());
                updatePartnersCarousel();
            }, 250);
        });
    }

    // ==================== 
    // SCROLL ANIMATIONS
    // ==================== 
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    function initFadeAnimations() {
        const selectors = [
            '.clarity-section h2',
            '.intro-headline',
            '.intro-block',
            '.how-section .section-label',
            '.how-text',
            '.partners-label',
            '.partner-circle',
            '.testimonial',
            '.services-section .section-label',
            '.services-title',
            '.services-toggle',
            '.about-content-inner',
            '.years-block',
            '.footer-left',
            '.footer-right'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('fade-in');
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        });
    }

    // ==================== 
    // SCROLL EVENT HANDLER
    // ==================== 
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                animateHeroDot();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ==================== 
    // INITIALIZE
    // ==================== 
    document.addEventListener('DOMContentLoaded', () => {
        handleHeaderScroll();
        animateHeroDot();
        initFadeAnimations();
    });

})();