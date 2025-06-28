import ClientOnly from "../../components/ui/ClientOnly";
import ProductsPageClient from "../../components/products/ProductsPageClient";

export default function ProductsPage() {
  return (
    <ClientOnly>
      <ProductsPageClient />
    </ClientOnly>
  );
}