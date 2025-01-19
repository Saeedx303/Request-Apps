import emailjs from '@emailjs/browser';

const form = document.getElementById('requestForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
const descriptionField = document.getElementById('description');
const charCount = document.getElementById('charCount');

// Initialize EmailJS with your public key
emailjs.init("4gnzUtz6W6TnHlRsZ"); // Your public key

// Character count for description
descriptionField.addEventListener('input', (e) => {
    const count = e.target.value.length;
    charCount.textContent = count;
});

// Form validation
function validateField(field) {
    const errorElement = field.nextElementSibling;
    
    if (field.validity.valueMissing) {
        errorElement.textContent = 'This field is required';
        errorElement.style.display = 'block';
        return false;
    } else if (field.validity.typeMismatch && field.type === 'email') {
        errorElement.textContent = 'Please enter a valid email address';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    formMessage.className = 'form-message';
    formMessage.style.display = 'none';
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        // Send email using EmailJS
        const templateParams = {
            from_name: form.name.value,
            from_email: form.email.value,
            app_name: form.appName.value,
            description: form.description.value,
            reason: form.reason.value,
            priority: form.priority.value
        };

        await emailjs.send(
            'service_dk0yzl6', // Your service ID
            'template_mde98rr', // Your template ID
            templateParams
        );
        
        // Show success message
        formMessage.textContent = 'Request submitted successfully! We will contact you soon.';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        charCount.textContent = '0';
        
    } catch (error) {
        // Show error message
        formMessage.textContent = 'An error occurred. Please try again.';
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        console.error('EmailJS Error:', error);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Real-time validation
form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
});

// Reset form message when starting to type
form.addEventListener('input', () => {
    formMessage.style.display = 'none';
});