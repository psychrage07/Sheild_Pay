import { notFound } from "next/navigation";
import Link from "next/link";
import ProductArt from "../../components/ProductArt";
import ProductCard from "../../components/ProductCard";
import ShopIcon from "../../components/ShopIcon";
import AddToCart from "./AddToCart";
import { getShopProduct, listShopProducts } from "@/lib/shop/commerce";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getShopProduct(params.id);
  if (!product) notFound();
  const related = (await listShopProducts({ collection: product.category })).filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="page-container">
      <div className="breadcrumb"><Link href="/shop">Home</Link><span>/</span><Link href="/shop/products">Footwear</Link><span>/</span><span>{product.title}</span></div>
      <div className="product-detail">
        <div className="detail-image">
          <span className="product-badge">{product.tags.includes("new") ? "NEW ARRIVAL" : product.tags.includes("bestseller") ? "BEST SELLER" : "BUILT FOR OUTSIDE"}</span>
          <ProductArt image={product.image} title={product.title} className="detail-product-art" />
          <span className="detail-image-label">TRAIL-TESTED. ADVENTURE-READY.</span>
        </div>
        <div className="detail-info">
          <p className="outdoor-eyebrow">{product.category.replace(/-/g, " ").toUpperCase()} FOOTWEAR</p>
          <h1>{product.title.toUpperCase()}</h1>
          <div className="product-rating"><span>★★★★★</span><small>{product.rating} · {product.reviewCount.toLocaleString()} reviews</small></div>
          <p className="detail-price">${product.price.toFixed(2)} {product.compareAtPrice ? <s>${product.compareAtPrice.toFixed(2)}</s> : null}</p>
          <p className="detail-description">{product.description}</p>
          <AddToCart product={product} />
          <details><summary>Built for your next adventure</summary><p>Thoughtful materials, supportive cushioning, and durable traction. Designed for comfort from the first step to the last mile.</p></details>
          <details><summary>Care &amp; materials</summary><p>Brush away loose dirt. Gently clean with mild soap and cool water, then air dry away from direct heat.</p></details>
          <details><summary>Shipping &amp; returns</summary><p>Complimentary shipping on orders $75+. Standard delivery in 3–5 business days. This demo does not ship physical products.</p></details>
        </div>
      </div>
      <section className="outdoor-section outdoor-related-section"><div className="outdoor-section-heading"><h2>MORE WAYS TO GET OUTSIDE.</h2><Link href="/shop/products" className="outdoor-text-link">EXPLORE ALL <ShopIcon name="arrow" size={17} /></Link></div><div className="product-grid outdoor-product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
    </div>
  );
}
