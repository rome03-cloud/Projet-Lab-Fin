document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation au scroll (Reveal effect)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 2. Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Navbar height
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Validation du Formulaire de Contact
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        // Validation en temps réel
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerText = 'Envoi en cours...';

                // Simulation d'envoi
                setTimeout(() => {
                    contactForm.classList.add('hidden');
                    contactSuccess.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Scroll vers le message de succès
                    window.scrollTo({
                        top: contactSuccess.offsetTop - 150,
                        behavior: 'smooth'
                    });
                }, 1500);
            }
        });
    }

    function validateField(input) {
        const errorSpan = document.getElementById(`${input.id}Error`);
        let isValid = true;
        let message = "";

        if (input.required && !input.value.trim()) {
            isValid = false;
            message = "Ce champ est obligatoire.";
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            message = "Veuillez entrer un email valide.";
        }

        if (!isValid) {
            input.classList.add('invalid');
            input.style.borderColor = '#dc2626';
            if (errorSpan) errorSpan.innerText = message;
        } else {
            input.classList.remove('invalid');
            input.style.borderColor = '#e5e7eb';
            if (errorSpan) errorSpan.innerText = "";
        }

        return isValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    // 4. Effet de transition de page simple
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        // On ne transitionne pas pour les ancres ou les liens externes
        if (link.hostname === window.location.hostname && !link.hash && !link.href.includes('javascript:void(0)')) {
            link.addEventListener('click', (e) => {
                const targetUrl = link.href;
                if (targetUrl !== window.location.href) {
                    e.preventDefault();
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 300);
                }
            });
        }
    });
});
