import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import FixViewport from "@/components/layout/FixViewport";
import GlobalStyles from "@/components/layout/GlobalStyles";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | B2B Showcase",
    default: "B2B Showcase - Premium Bulk Products for Global Businesses",
  },
  description: "B2B Showcase offers high-quality bulk commodities and raw materials including rice, seeds, oil, raw polymers, and bromine salt for businesses worldwide.",
  keywords: ["B2B", "bulk products", "commodities", "rice", "seeds", "oil", "raw polymers", "bromine salt", "wholesale"],
  authors: [{ name: "B2B Showcase Team" }],
  creator: "B2B Showcase",
  publisher: "B2B Showcase",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <GlobalStyles />
        <FixViewport />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
