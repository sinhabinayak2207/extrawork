import { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "../../../components/layout/MainLayout";
import Section from "../../../components/ui/Section";
import ClientOnly from "../../../components/ui/ClientOnly";
import ServicePageClient from "../../../components/services/ServicePageClient";
import { getService, services } from "../../../lib/api/mockData";

// Generate static paths for all services
export async function generateStaticParams() {
  return services.map(service => ({
    service: service.slug
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  const service = await getService(params.service);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }
  
  return {
    title: `${service.title} - B2B Showcase`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: { service: string } }) {
  const serviceSlug = params.service;
  const service = await getService(serviceSlug);
  
  if (!service) {
    notFound();
  }
  
  return (
    <MainLayout>
      <ClientOnly>
        <ServicePageClient service={service} />
      </ClientOnly>
    </MainLayout>
  );
}