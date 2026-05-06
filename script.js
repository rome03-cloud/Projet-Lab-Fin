document.addEventListener('DOMContentLoaded', () => {
    // Animation au scroll (Reveal effect)
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

    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Effet de transition de page simple
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        try {
            const linkUrl = new URL(href, window.location.href);
            const sameOrigin = linkUrl.origin === window.location.origin;
            const samePage = linkUrl.pathname === window.location.pathname && linkUrl.search === window.location.search;

            if (!sameOrigin || samePage) {
                return;
            }

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = linkUrl.href;

                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            });
        } catch (error) {
            // Ignorer les URL invalides ou externes
        }
    });
});
