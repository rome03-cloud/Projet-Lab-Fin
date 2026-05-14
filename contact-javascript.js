// Sélection des éléments du DOM
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackDiv = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');
    const contactSuccess = document.getElementById('contactSuccess');

    // Fonction de validation email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fonction pour ajouter la classe d'erreur au form-group
    function showError(inputId, message) {
        const inputField = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}Error`);
        
        if (inputField && inputField.closest('.form-group')) {
            inputField.closest('.form-group').classList.add('has-error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Fonction pour effacer l'erreur
    function clearError(inputId) {
        const inputField = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}Error`);
        
        if (inputField && inputField.closest('.form-group')) {
            inputField.closest('.form-group').classList.remove('has-error');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Réinitialiser toutes les erreurs
    function resetErrors() {
        const fields = ['name', 'email', 'subject', 'message'];
        fields.forEach(field => clearError(field));
    }

    // Validation complète du formulaire
    function validateForm() {
        let isValid = true;
        resetErrors();
        
        // Validation du nom
        const nameValue = nameInput?.value.trim() || '';
        if (nameValue === '') {
            showError('name', 'Le nom complet est requis');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        }
        
        // Validation de l'email
        const emailValue = emailInput?.value.trim() || '';
        if (emailValue === '') {
            showError('email', 'L\'email est requis');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError('email', 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validation du sujet
        const subjectValue = subjectInput?.value.trim() || '';
        if (subjectValue === '') {
            showError('subject', 'Sélectionnez un sujet');
            isValid = false;
        }
        
        // Validation du message
        const messageValue = messageInput?.value.trim() || '';
        if (messageValue === '') {
            showError('message', 'Le message est requis');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }
        
        return isValid;
    }

    // Validation en temps réel (meilleure UX)
    function setupLiveValidation() {
        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                if (nameInput.value.trim() === '') {
                    showError('name', 'Le nom complet est requis');
                } else if (nameInput.value.trim().length < 2) {
                    showError('name', 'Le nom doit contenir au moins 2 caractères');
                } else {
                    clearError('name');
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const email = emailInput.value.trim();
                if (email === '') {
                    showError('email', 'L\'email est requis');
                } else if (!isValidEmail(email)) {
                    showError('email', 'Veuillez entrer une adresse email valide');
                } else {
                    clearError('email');
                }
            });
        }
        
        if (subjectInput) {
            subjectInput.addEventListener('change', () => {
                if (subjectInput.value.trim() === '') {
                    showError('subject', 'Sélectionnez un sujet');
                } else {
                    clearError('subject');
                }
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('blur', () => {
                const message = messageInput.value.trim();
                if (message === '') {
                    showError('message', 'Le message est requis');
                } else if (message.length < 10) {
                    showError('message', 'Le message doit contenir au moins 10 caractères');
                } else {
                    clearError('message');
                }
            });
        }
    }

    // Fonction d'envoi du formulaire (simulation)
    function simulateServerSend(formData) {
        return new Promise((resolve) => {
            // Simule un délai réseau réaliste
            setTimeout(() => {
                console.log('Message envoyé :', {
                    nom: formData.get('name'),
                    email: formData.get('email'),
                    sujet: formData.get('subject'),
                    message: formData.get('message'),
                    date: new Date().toISOString()
                });
                resolve({ success: true });
            }, 1200);
        });
    }

    // Gestion de la soumission du formulaire
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Valider le formulaire
        if (!validateForm()) {
            if (feedbackDiv) {
                feedbackDiv.textContent = '❌ Veuillez corriger les erreurs dans le formulaire';
                feedbackDiv.classList.add('error', 'show');
                setTimeout(() => {
                    feedbackDiv.classList.remove('show');
                }, 4000);
            }
            return;
        }
        
        // Désactiver le bouton pour éviter double envoi
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            if (btnText) btnText.classList.add('hide');
            if (btnLoader) btnLoader.style.display = 'inline-flex';
        }
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        
        try {
            // Simuler un envoi serveur (remplacez par fetch réelle si backend dispo)
            const result = await simulateServerSend(formData);
            
            if (result.success) {
                // Masquer le formulaire
                form.style.display = 'none';
                
                // Afficher le message de succès
                if (contactSuccess) {
                    contactSuccess.classList.add('show');
                    contactSuccess.style.display = 'block';
                    
                    // Scroll jusqu'au message de succès
                    contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Réinitialiser le formulaire
                form.reset();
                resetErrors();
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            if (feedbackDiv) {
                feedbackDiv.textContent = '⚠️ Une erreur technique est survenue. Veuillez réessayer.';
                feedbackDiv.classList.add('error', 'show');
            }
        } finally {
            // Réactiver le bouton
            if (submitBtn) {
                submitBtn.disabled = false;
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoader = submitBtn.querySelector('.btn-loader');
                if (btnText) btnText.classList.remove('hide');
                if (btnLoader) btnLoader.style.display = 'none';
            }
        }
    }

    // Initialisation des événements
    function init() {
        form.addEventListener('submit', handleSubmit);
        setupLiveValidation();
    }

    init();
});