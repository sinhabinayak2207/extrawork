/**
 * Contact form validation utilities
 */

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
  // Allow digits, spaces, dashes, parentheses, and plus sign
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return phone === '' || phoneRegex.test(phone);
};

/**
 * Validates the entire contact form
 * Returns an object with validation errors or null if valid
 */
export const validateContactForm = (formData: ContactFormData): ValidationErrors | null => {
  const errors: ValidationErrors = {};
  
  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Phone validation (optional)
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  // Subject validation
  if (!formData.subject || formData.subject.trim() === '') {
    errors.subject = 'Subject is required';
  } else if (formData.subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  }
  
  // Message validation
  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Message is required';
  } else if (formData.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Sanitizes form input to prevent XSS attacks
 */
export const sanitizeFormData = (formData: ContactFormData): ContactFormData => {
  const sanitized: ContactFormData = {
    name: sanitizeString(formData.name),
    email: sanitizeString(formData.email),
    subject: sanitizeString(formData.subject),
    message: sanitizeString(formData.message),
  };
  
  if (formData.company) {
    sanitized.company = sanitizeString(formData.company);
  }
  
  if (formData.phone) {
    sanitized.phone = sanitizeString(formData.phone);
  }
  
  return sanitized;
};

/**
 * Basic string sanitization
 */
const sanitizeString = (str: string): string => {
  if (!str) return '';
  
  // Replace potentially dangerous characters
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
