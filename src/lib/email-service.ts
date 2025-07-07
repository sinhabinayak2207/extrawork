import emailjs from 'emailjs-com';

// EmailJS configuration
// You'll need to sign up for EmailJS (https://www.emailjs.com/) and get your own service ID, template ID, and user ID
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
const USER_ID = 'YOUR_USER_ID'; // Replace with your EmailJS user ID

interface EmailParams {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  recipientEmail?: string; // Optional override for recipient
}

/**
 * Sends an email using EmailJS
 * @param params Email parameters
 * @returns Promise that resolves when email is sent
 */
export const sendEmail = async (params: EmailParams): Promise<{ success: boolean; message: string }> => {
  try {
    // Initialize EmailJS with your user ID
    emailjs.init(USER_ID);
    
    // Prepare template parameters
    const templateParams = {
      from_name: params.name,
      from_email: params.email,
      company: params.company || 'Not provided',
      phone: params.phone || 'Not provided',
      subject: params.subject,
      message: params.message,
      to_email: params.recipientEmail || 'sinha.vinayak2207@gmail.com', // Default recipient
      reply_to: params.email,
    };
    
    // Send the email
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    
    console.log('Email sent successfully:', response);
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email. Please try again later.' };
  }
};
