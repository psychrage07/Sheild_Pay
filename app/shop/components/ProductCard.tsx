import Link from "next/link";
import ProductArt from "./ProductArt";
import type { ShopProduct } from "@/lib/shop/commerce";

export default function ProductCard({ product }: { product: ShopProduct }) {
  const badge = product.tags.includes("bestseller")
    ? "Bestseller"
    : product.tags.includes("new")
      ? "New"
      : null;

  return (
    <Link href={`/shop/products/${product.handle}`} className="shop-product-card">
      <div className="shop-product-art-wrap">
        <ProductArt image={product.image} title={product.title} />
        {badge ? <span className="shop-product-badge">{badge}</span> : null}
        <span className="shop-product-arrow" aria-hidden>↗</span>
      </div>
      <div className="shop-product-meta">
        <div>
          <p className="shop-product-title">{product.title}</p>
          <p className="shop-product-cat">{product.category}</p>
        </div>
        <div className="shop-price">
          <p>${product.price.toFixed(2)}</p>
          {product.compareAtPrice ? (
            <p className="shop-compare">${product.compareAtPrice.toFixed(2)}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
