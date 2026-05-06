document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation au scroll (Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.9;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Appel initial

    // 2. FAQ Accordéon
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fermer tous les autres items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            
            // Ouvrir l'item cliqué s'il n'était pas déjà actif
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. Gestion du Formulaire
    const leadForm = document.getElementById('leadForm');
    const formSuccess = document.getElementById('formSuccess');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulation de validation et d'envoi
            const formData = new FormData(leadForm);
            const name = formData.get('name');
            const email = formData.get('email');

            // Animation de chargement sur le bouton
            const submitBtn = leadForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Masquer le formulaire et afficher le succès
                leadForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                // Logique de conversion (fictive)
                console.log(`Nouveau lead capturé : ${name} (${email})`);
                
                // Scroll vers le message de succès
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1500);
        });
    }

    // 4. Smooth Scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
