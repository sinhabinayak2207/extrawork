import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Products - OCC World Trade',
  description: 'Explore our extensive range of high-quality bulk products including rice, seeds, oil, raw polymers, and bromine salt for your business needs.',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
