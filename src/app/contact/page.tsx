import { Metadata } from "next";
import Section from "../../components/ui/Section";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";

export const metadata: Metadata = {
  title: 'Contact Us - B2B Showcase',
  description: 'Get in touch with B2B Showcase for inquiries about our products and services. We are here to help with your bulk commodity needs.',
};

export default function ContactPage() {
  return (
    <>
      <Section background="gradient" paddingY="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about our products or services? Our team is here to help.
            Fill out the form below or use our contact information to get in touch.
          </p>
        </div>
      </Section>
      
      <Section background="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </Section>
      
      <Section background="light">
        <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          {/* Replace with actual Google Maps embed in production */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573814498!2d-73.98784492346204!3d40.75838083646841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5m2!1s!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Section>
    </>
  );
}
