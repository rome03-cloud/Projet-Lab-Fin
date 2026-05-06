// Sélection des éléments du DOM
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const companyInput = document.getElementById('company');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');
    const feedbackDiv = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    // Fonction de validation email (regex performant)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fonction pour afficher les erreurs individuelles
    function showError(inputId, message) {
        const errorElement = document.getElementById(`${inputId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        // Ajout d'une classe CSS pour bordure d'erreur
        const inputField = document.getElementById(inputId);
        if (inputField) {
            inputField.style.borderColor = '#dc3545';
        }
    }

    // Fonction pour effacer une erreur spécifique
    function clearError(inputId) {
        const errorElement = document.getElementById(`${inputId}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        const inputField = document.getElementById(inputId);
        if (inputField) {
            inputField.style.borderColor = '#e2e8f0';
        }
    }

    // Réinitialiser toutes les erreurs
    function resetErrors() {
        const fields = ['name', 'email', 'company', 'subject', 'message', 'consent'];
        fields.forEach(field => clearError(field));
    }

    // Validation complète du formulaire
    function validateForm() {
        let isValid = true;
        
        // Validation du nom
        const nameValue = nameInput?.value.trim() || '';
        if (nameValue === '') {
            showError('name', 'Veuillez entrer votre nom complet');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        } else {
            clearError('name');
        }
        
        // Validation de l'email
        const emailValue = emailInput?.value.trim() || '';
        if (emailValue === '') {
            showError('email', 'L\'adresse email est obligatoire');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError('email', 'Veuillez entrer une adresse email valide (ex: nom@domaine.com)');
            isValid = false;
        } else {
            clearError('email');
        }
        
        // Validation de l'entreprise (optionnel)
        const companyValue = companyInput?.value.trim() || '';
        if (companyValue && companyValue.length < 2) {
            showError('company', 'Le nom de l\'entreprise doit contenir au moins 2 caractères');
            isValid = false;
        } else {
            clearError('company');
        }
        
        // Validation du sujet
        const subjectValue = subjectInput?.value.trim() || '';
        if (subjectValue === '') {
            showError('subject', 'Le sujet est obligatoire');
            isValid = false;
        } else if (subjectValue.length < 3) {
            showError('subject', 'Le sujet est trop court (min. 3 caractères)');
            isValid = false;
        } else {
            clearError('subject');
        }
        
        // Validation du message
        const messageValue = messageInput?.value.trim() || '';
        if (messageValue === '') {
            showError('message', 'Veuillez écrire votre message');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        } else {
            clearError('message');
        }
        
        // Validation du consentement
        if (consentInput && !consentInput.checked) {
            showError('consent', 'Vous devez accepter le traitement de vos données');
            isValid = false;
        } else {
            clearError('consent');
        }
        
        return isValid;
    }

    // Effacer les erreurs lorsque l'utilisateur tape (meilleure UX)
    function setupLiveValidation() {
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (nameInput.value.trim() !== '') clearError('name');
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const email = emailInput.value.trim();
                if (email !== '' && isValidEmail(email)) clearError('email');
                else if (email === '') clearError('email');
            });
        }
        
        if (companyInput) {
            companyInput.addEventListener('input', () => {
                if (companyInput.value.trim() !== '') clearError('company');
            });
        }
        
        if (subjectInput) {
            subjectInput.addEventListener('input', () => {
                if (subjectInput.value.trim() !== '') clearError('subject');
            });
        }
        
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                if (messageInput.value.trim() !== '') clearError('message');
            });
        }
        
        if (consentInput) {
            consentInput.addEventListener('change', () => {
                if (consentInput.checked) clearError('consent');
            });
        }
    }

    // Simulation d'envoi vers serveur (dans un vrai projet, on utiliserait fetch vers une API)
    function simulateServerSend(formData) {
        return new Promise((resolve) => {
            // Simule un délai réseau réaliste (800ms)
            setTimeout(() => {
                console.log('Données envoyées (simulation) :', {
                    nom: formData.get('name'),
                    email: formData.get('email'),
                    entreprise: formData.get('company'),
                    sujet: formData.get('subject'),
                    message: formData.get('message'),
                    consentement: formData.get('consent') === 'on',
                    date: new Date().toISOString()
                });
                resolve({ success: true });
            }, 800);
        });
    }

    // Gestion de la soumission du formulaire
    async function handleSubmit(event) {
        event.preventDefault();
        if (!feedbackDiv) return;
        
        // Réinitialiser le message de feedback précédent
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = 'feedback-message';
        
        // Valider le formulaire
        if (!validateForm()) {
            // Afficher un message global d'erreur
            feedbackDiv.textContent = '❌ Veuillez corriger les erreurs dans le formulaire.';
            feedbackDiv.classList.add('error');
            // Scroll doux vers le premier champ invalide
            const firstInvalid = document.querySelector('.error-msg:not(:empty)');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Désactiver le bouton pour éviter double envoi
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';
        }
        
        // Récupérer les données du formulaire
        const formData = new FormData(form);
        
        try {
            // Simuler un envoi serveur (remplacez par fetch réelle si backend dispo)
            const result = await simulateServerSend(formData);
            
            if (result.success) {
                // Message de confirmation
                feedbackDiv.innerHTML = '✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                feedbackDiv.classList.add('success');
                
                // Réinitialiser le formulaire
                form.reset();
                resetErrors();
                
                // Optionnel : re-mettre les bordures par défaut
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    if (input) input.style.borderColor = '#e2e8f0';
                });
                
                // Scroll jusqu'au feedback
                feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Effacer le message de succès après 8 secondes
                setTimeout(() => {
                    if (feedbackDiv.classList.contains('success')) {
                        feedbackDiv.style.opacity = '0';
                        setTimeout(() => {
                            feedbackDiv.innerHTML = '';
                            feedbackDiv.className = 'feedback-message';
                            feedbackDiv.style.opacity = '';
                        }, 300);
                    }
                }, 8000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            feedbackDiv.innerHTML = '⚠️ Une erreur technique est survenue. Veuillez réessayer ou nous contacter directement par téléphone.';
            feedbackDiv.classList.add('error');
        } finally {
            // Réactiver le bouton
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Envoyer le message';
            }
        }
    }

    // Initialisation des événements
    function init() {
        form.addEventListener('submit', handleSubmit);
        setupLiveValidation();
        
        // Petite animation sur les icônes des inputs au focus
        const allInputs = document.querySelectorAll('.input-icon input, .input-icon textarea');
        allInputs.forEach(input => {
            input.addEventListener('focus', function() {
                const icon = this.parentElement.querySelector('i');
                if (icon) icon.style.transform = 'scale(1.1)';
            });
            input.addEventListener('blur', function() {
                const icon = this.parentElement.querySelector('i');
                if (icon) icon.style.transform = 'scale(1)';
            });
        });
    }

    init();
});