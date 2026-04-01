const validationRules = {
    firstName: { required: true, min: 1, max: 30, label: "First Name", regex: /^[a-zA-Z\s]+$/ },
    lastName: { required: true, min: 1, max: 30, label: "Last Name", regex: /^[a-zA-Z\s]+$/ },
    email: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, max: 50, label: "Email Address" },
    contact: { required: true, regex: /^(\+91|91)?[6-9]\d{9}$/, label: "Contact Number" },
    pincode: { required: true, regex: /^[1-9]\d{5}$/, label: "PIN Code" },
    cardnumber: { required: true, regex: /^4\d{15}$/, label: "Card Number" },
    cvv: { required: true, regex: /^\d{3,4}$/, label: "CVV" },
    cardExpiry: {
        required: true,
        custom: (val) => {
            const year = parseInt(val, 10);
            return /^\d{4}$/.test(val) && year >= new Date().getFullYear();
        },
        label: "Card Expiry"
    }
};

/**
 *  validating the form
 */
function formValidation() {
    //mapping field with its id and validator
    const fields = [
        'firstName',
        'lastName',
        'email',
        'contact',
        'pincode',
        'cardnumber',
        'cardExpiry',
        'cvv'
    ];
    let isFormValid = true;
    fields.forEach(field => {
        const inputElement = document.getElementById(field);
        const errorElement = inputElement.parentElement.querySelector('.error-message');
        //exceute the validator
        const result = validateField(field, inputElement.value);
        if (!result.isValid) {
            errorElement.innerText = result.message;
            errorElement.style.display = 'block';
            inputElement.classList.add('invalid');
            isFormValid = false;
        } else {
            errorElement.innerText = '';
            errorElement.style.display = 'none';
            inputElement.classList.remove('invalid');
        }
    })
    if (isFormValid) {
        window.alert("Form submitted successfully");
    }
}

/**
 *  validate given field value
 * @param {*} fieldName 
 * @param {*} value 
 * @returns validation result
 */
function validateField(fieldName, value) {
    const rule = validationRules[fieldName];
    const val = value.trim();
    //check required
    if (rule.required && val === '') {
        return { isValid: false, message: `${rule.label} is required` };
    }
    //check lengths
    if (rule.min && val.length < rule.min) return { isValid: false, message: `${rule.label} is not valid` };
    if (rule.max && val.length > rule.max) return { isValid: false, message: `${rule.label} is not valid` };
    //check regex
    if (rule.regex && !rule.regex.test(val)) {
        return { isValid: false, message: `${rule.label} is not valid` };
    }
    //check expiry date year check
    if (rule.custom && !rule.custom(val)) {
        return { isValid: false, message: `${rule.label} is not valid` };
    }
    return { isValid: true, message: "" };
}
