export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  longDescription?: string;
  benefits?: string[];
  process?: {
    title: string;
    description: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  features?: {
    title: string;
    description: string;
    icon: string;
  }[];
  caseStudies?: {
    title: string;
    description: string;
    image: string;
    tags: string[];
  }[];
}
