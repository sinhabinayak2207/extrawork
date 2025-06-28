import Hero from "../components/home/Hero";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import AboutSection from "../components/home/AboutSection";
import CtaSection from "../components/home/CtaSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'B2B Showcase - Premium Bulk Products for Global Businesses',
  description: 'B2B Showcase offers high-quality bulk commodities and raw materials including rice, seeds, oil, raw polymers, and bromine salt for businesses worldwide.',
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <AboutSection />
      <CtaSection />
    </>
  );
}
