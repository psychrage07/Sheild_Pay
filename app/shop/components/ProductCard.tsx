"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/shop/commerce";
import { productSwatch } from "@/lib/shop/commerce";
import ProductArt from "./ProductArt";
import ShopIcon from "./ShopIcon";

export default function ProductCard({ product, gender = "men" }: { product: ShopProduct; gender?: string }) {
  const [color, setColor] = useState(0);
  const swatch = productSwatch(product.image);
  const colors = useMemo(() => [swatch.bg, swatch.ink, "#b5ad96"], [swatch.bg, swatch.ink]);
  const badge = product.tags.includes("new") ? "NEW ARRIVAL" : product.tags.includes("sale") ? "SALE" : product.tags.includes("bestseller") ? "BEST SELLER" : undefined;
  const href = `/shop/products/${product.handle}?gender=${gender}&color=${color}`;

  return (
    <article className="product-card">
      <Link className="product-image" href={href}>
        <ProductArt image={product.image} title={product.title} className="outdoor-card-art" />
        {badge ? <span className={`product-badge ${badge === "NEW ARRIVAL" ? "new" : ""}`}>{badge}</span> : null}
        <span className="product-quick">Discover <ShopIcon name="arrow" size={17} /></span>
      </Link>
      <div className="swatches" aria-label="Available colors">
        {colors.map((item, index) => (
          <button key={`${product.id}-${item}`} type="button" style={{ backgroundColor: item }} className={index === color ? "active" : ""} onClick={() => setColor(index)} aria-label={`Select color ${index + 1}`} aria-pressed={index === color} />
        ))}
        <span>+{product.variants.length > 1 ? product.variants.length - 1 : 2} colors</span>
      </div>
      <div className="product-name-row"><Link href={href}>{product.title}</Link><span>${product.price.toFixed(2)}</span></div>
      <p className="product-category">{product.category.replace(/-/g, " ")} footwear</p>
      <div className="product-rating"><span>★★★★★</span><small>{product.rating} ({product.reviewCount.toLocaleString()})</small></div>
    </article>
  );
}
