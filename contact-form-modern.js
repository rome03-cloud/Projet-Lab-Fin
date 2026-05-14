// ========== CONTACT FORM - MODERN VERSION ==========

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const feedbackDiv = document.getElementById('formFeedback');

    // Form Elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // ========== VALIDATION FUNCTIONS ==========
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Show Error State
    const showError = (inputId, message) => {
        const inputField = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}Error`);

        if (inputField?.closest('.form-group')) {
            inputField.closest('.form-group').classList.add('has-error');
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    };

    // Clear Error State
    const clearError = (inputId) => {
        const inputField = document.getElementById(inputId);
        const errorElement = document.getElementById(`${inputId}Error`);

        if (inputField?.closest('.form-group')) {
            inputField.closest('.form-group').classList.remove('has-error');
        }

        if (errorElement) {
            errorElement.textContent = '';
        }
    };

    // Reset All Errors
    const resetErrors = () => {
        ['name', 'email', 'subject', 'message'].forEach(field => clearError(field));
    };

    // Full Form Validation
    const validateForm = () => {
        let isValid = true;
        resetErrors();

        // Validate Name
        const nameValue = nameInput?.value.trim() || '';
        if (nameValue === '') {
            showError('name', 'Le nom complet est requis');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError('name', 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        }

        // Validate Email
        const emailValue = emailInput?.value.trim() || '';
        if (emailValue === '') {
            showError('email', 'L\'adresse email est requise');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError('email', 'Veuillez entrer une adresse email valide');
            isValid = false;
        }

        // Validate Subject
        const subjectValue = subjectInput?.value.trim() || '';
        if (subjectValue === '') {
            showError('subject', 'Sélectionnez un sujet');
            isValid = false;
        }

        // Validate Message
        const messageValue = messageInput?.value.trim() || '';
        if (messageValue === '') {
            showError('message', 'Le message est requis');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError('message', 'Le message doit contenir au moins 10 caractères');
            isValid = false;
        }

        return isValid;
    };

    // ========== LIVE VALIDATION ==========
    const setupLiveValidation = () => {
        nameInput?.addEventListener('blur', () => {
            const nameValue = nameInput.value.trim();
            if (nameValue === '') {
                showError('name', 'Le nom complet est requis');
            } else if (nameValue.length < 2) {
                showError('name', 'Le nom doit contenir au moins 2 caractères');
            } else {
                clearError('name');
            }
        });

        emailInput?.addEventListener('blur', () => {
            const emailValue = emailInput.value.trim();
            if (emailValue === '') {
                showError('email', 'L\'adresse email est requise');
            } else if (!isValidEmail(emailValue)) {
                showError('email', 'Veuillez entrer une adresse email valide');
            } else {
                clearError('email');
            }
        });

        subjectInput?.addEventListener('change', () => {
            const subjectValue = subjectInput.value.trim();
            if (subjectValue === '') {
                showError('subject', 'Sélectionnez un sujet');
            } else {
                clearError('subject');
            }
        });

        messageInput?.addEventListener('blur', () => {
            const messageValue = messageInput.value.trim();
            if (messageValue === '') {
                showError('message', 'Le message est requis');
            } else if (messageValue.length < 10) {
                showError('message', 'Le message doit contenir au moins 10 caractères');
            } else {
                clearError('message');
            }
        });
    };

    // ========== FORM SUBMISSION ==========
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate Form
        if (!validateForm()) {
            if (feedbackDiv) {
                feedbackDiv.innerHTML = '❌ Veuillez corriger les erreurs du formulaire';
                feedbackDiv.classList.add('error', 'show');
                setTimeout(() => {
                    feedbackDiv.classList.remove('show');
                }, 4000);
            }
            return;
        }

        // Disable Button & Show Loader
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            if (btnText) btnText.classList.add('hide');
            if (btnLoader) {
                btnLoader.classList.add('show');
                btnLoader.style.display = 'flex';
            }
        }

        // Get Form Data
        const formData = new FormData(form);

        try {
            // Simulate Server Sending (Replace with real API call)
            await simulateServerSend(formData);

            // Hide Form
            form.style.display = 'none';

            // Show Success Message
            if (contactSuccess) {
                contactSuccess.classList.add('show');
                contactSuccess.style.display = 'block';
                contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Reset Form
            form.reset();
            resetErrors();

        } catch (error) {
            console.error('Error:', error);
            if (feedbackDiv) {
                feedbackDiv.innerHTML = '⚠️ Une erreur technique est survenue. Veuillez réessayer.';
                feedbackDiv.classList.add('error', 'show');
            }
        } finally {
            // Re-enable Button
            if (submitBtn) {
                submitBtn.disabled = false;
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoader = submitBtn.querySelector('.btn-loader');
                if (btnText) btnText.classList.remove('hide');
                if (btnLoader) {
                    btnLoader.classList.remove('show');
                    btnLoader.style.display = 'none';
                }
            }
        }
    };

    // Simulate Server Response
    const simulateServerSend = (formData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Message sent:', {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString()
                });
                resolve({ success: true });
            }, 1200);
        });
    };

    // ========== INITIALIZATION ==========
    const init = () => {
        if (form) {
            form.addEventListener('submit', handleSubmit);
            setupLiveValidation();
        }
    };

    init();
});
