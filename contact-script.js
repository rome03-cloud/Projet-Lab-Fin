document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const feedbackDiv = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(inputId, message) {
        const errorElement = document.getElementById(`${inputId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }

        const inputField = document.getElementById(inputId);
        if (inputField) {
            inputField.style.borderColor = '#dc3545';
        }
    }

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

    function resetErrors() {
        ['name', 'email', 'subject', 'message'].forEach(clearError);
    }

    function validateForm() {
        let isValid = true;

        const nameValue = nameInput?.value.trim() || '';
        if (!nameValue) {
            showError('name', 'Veuillez entrer votre nom complet');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        } else {
            clearError('name');
        }

        const emailValue = emailInput?.value.trim() || '';
        if (!emailValue) {
            showError('email', 'L\'adresse email est obligatoire');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError('email', 'Veuillez entrer une adresse email valide (ex: nom@domaine.com)');
            isValid = false;
        } else {
            clearError('email');
        }

        const subjectValue = subjectInput?.value.trim() || '';
        if (!subjectValue) {
            showError('subject', 'Le sujet est obligatoire');
            isValid = false;
        } else if (subjectValue.length < 3) {
            showError('subject', 'Le sujet est trop court (min. 3 caractères)');
            isValid = false;
        } else {
            clearError('subject');
        }

        const messageValue = messageInput?.value.trim() || '';
        if (!messageValue) {
            showError('message', 'Veuillez écrire votre message');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        } else {
            clearError('message');
        }

        return isValid;
    }

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
    }

    function simulateServerSend(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Données envoyées (simulation) :', {
                    nom: formData.get('name'),
                    email: formData.get('email'),
                    sujet: formData.get('subject'),
                    message: formData.get('message'),
                    date: new Date().toISOString()
                });
                resolve({ success: true });
            }, 800);
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!feedbackDiv) return;

        feedbackDiv.innerHTML = '';
        feedbackDiv.className = 'feedback-message';

        if (!validateForm()) {
            feedbackDiv.textContent = '❌ Veuillez corriger les erreurs dans le formulaire.';
            feedbackDiv.classList.add('error');

            const firstInvalid = document.querySelector('.error-msg:not(:empty), .error-message:not(:empty)');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
        }

        const formData = new FormData(form);

        try {
            const result = await simulateServerSend(formData);
            if (result.success) {
                feedbackDiv.innerHTML = '✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                feedbackDiv.classList.add('success');
                form.reset();
                resetErrors();

                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    if (input) input.style.borderColor = '#e2e8f0';
                });

                feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer le message';
            }
        }
    }

    function init() {
        form.addEventListener('submit', handleSubmit);
        setupLiveValidation();

        const allInputs = form.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            input.addEventListener('focus', function() {
                const icon = this.closest('.input-wrapper')?.querySelector('.input-icon, i') || this.parentElement?.querySelector('i');
                if (icon) icon.style.transform = 'scale(1.1)';
            });
            input.addEventListener('blur', function() {
                const icon = this.closest('.input-wrapper')?.querySelector('.input-icon, i') || this.parentElement?.querySelector('i');
                if (icon) icon.style.transform = 'scale(1)';
            });
        });
    }

    init();
});