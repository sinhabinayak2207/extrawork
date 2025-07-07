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
             <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Contact Us</span>
          </h1>
          <p className="text-lg text-blue-600 mb-8">
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
      
    
    </>
  );
}
