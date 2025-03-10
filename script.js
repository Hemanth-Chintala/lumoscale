// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolio-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const elements = document.querySelectorAll('.fade-in');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Current testimonial index
    let currentTestimonial = 0;
    let testimonialInterval;
    
    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // Check for elements to animate on scroll
        checkFadeIn();
        
        // Check if services section is in view
        checkServiceCards();
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Portfolio modal
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            const imgSrc = this.querySelector('img').getAttribute('src');
            
            modalTitle.textContent = title;
            modalImage.setAttribute('src', imgSrc);
            modalDescription.textContent = description;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Testimonial slider
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    // Initialize testimonial slider
    if (testimonials.length > 0) {
        // Auto-scroll testimonials
        testimonialInterval = setInterval(nextTestimonial, 5000);
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                clearInterval(testimonialInterval);
                prevTestimonial();
                testimonialInterval = setInterval(nextTestimonial, 5000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                clearInterval(testimonialInterval);
                nextTestimonial();
                testimonialInterval = setInterval(nextTestimonial, 5000);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                clearInterval(testimonialInterval);
                showTestimonial(index);
                testimonialInterval = setInterval(nextTestimonial, 5000);
            });
        });
    }
    
    // Check elements in viewport for animations
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    function checkFadeIn() {
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }
    
    // Check if service cards are in viewport
    function checkServiceCards() {
        const servicesSection = document.getElementById('services');
        if (servicesSection && isInViewport(servicesSection)) {
            serviceCards.forEach(card => {
                if (!card.classList.contains('animate')) {
                    card.classList.add('animate');
                }
            });
        }
    }
    
    // Initial check for elements in viewport
    checkFadeIn();
    checkServiceCards();
    
    // Lazy loading images
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-load');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show a success message
            const formElements = contactForm.elements;
            
            // Reset the form
            contactForm.reset();
            
            // Show success message (you could create a more sophisticated notification)
            alert('Thank you for your message! We will get back to you soon.');
        });
    }
});
