# EmailJS Template Setup Guide

## 1. Create an Email Template

1. Log in to your EmailJS account
2. Go to "Email Templates" and click "Create New Template"
3. Give it a name like "Contact Form Template"
4. Design your email with the following variables:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})
Company: {{company}}
Phone: {{phone}}

Message:
{{message}}
```

5. Save the template and note the Template ID (it will look like "template_abc123")

## 2. Get Your Public Key

1. Go to "Account" > "API Keys"
2. Copy your "Public Key"

## 3. Update Your Code

Replace the placeholder values in your ContactForm.tsx with your actual template ID and public key:

```typescript
await emailjs.send(
  'service_ou1qh5q',      // Your service ID (already updated)
  'your_template_id',     // Replace with your actual template ID
  templateParams,
  'your_public_key'       // Replace with your actual public key
);
```

## 4. Test Your Contact Form

1. Log in to your website
2. Fill out the contact form and submit
3. Check your inbox at sinha.vinayak2207@gmail.com for the email
