import { listShopProducts } from "@/lib/shop/commerce";
import Home from "./components/Home";

export const dynamic = "force-dynamic";

export default async function ShopHomePage() {
  const products = await listShopProducts();
  return <Home products={products} />;
}
