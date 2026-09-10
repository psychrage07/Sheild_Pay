"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import type { ShopProduct } from "@/lib/shop/commerce";
import ShopIcon from "../components/ShopIcon";

const CATEGORIES = [
  ["all", "All footwear"],
  ["hiking", "Hiking"],
  ["trail-running", "Trail Running"],
  ["everyday", "Everyday"],
  ["barefoot", "Barefoot"],
  ["sale", "Sale"],
] as const;

export default function CatalogClient({ initialProducts }: { initialProducts: ShopProduct[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const collection = params.get("collection") ?? "all";
  const gender = params.get("gender") ?? "men";
  const [products, setProducts] = useState(initialProducts);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "featured");

  useEffect(() => {
    const query = new URLSearchParams();
    if (collection) query.set("collection", collection);
    if (q) query.set("q", q);
    if (sort !== "featured") query.set("sort", sort);
    fetch(`/api/shop/products?${query.toString()}`)
      .then((response) => response.json())
      .then((data: { products?: ShopProduct[] }) => setProducts(data.products ?? []))
      .catch(() => undefined);
  }, [collection, q, sort]);

  const title = collection === "all"
    ? `${gender === "women" ? "WOMEN’S" : "MEN’S"} FOOTWEAR`
    : CATEGORIES.find(([key]) => key === collection)?.[1].toUpperCase() ?? "ALL FOOTWEAR";

  function changeCategory(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("collection", value);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="page-container catalog-page">
      <div className="breadcrumb"><Link href="/shop">Home</Link><span>/</span><span>Footwear</span></div>
      <div className="catalog-heading"><p className="outdoor-eyebrow">BUILT FOR EVERY WAY YOU GET OUTSIDE</p><h1>{title}</h1><p>From the first mile to the last light. Find your perfect trail companion.</p></div>
      <div className="catalog-toolbar">
        <div className="catalog-search"><ShopIcon name="search" size={18} /><input aria-label="Search products" placeholder="Search footwear" value={q} onChange={(event) => setQ(event.target.value)} /></div>
        <span>{products.length} products</span>
        <label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></select></label>
      </div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h3>FIND YOUR TRAIL</h3>
          {CATEGORIES.map(([key, label]) => <button key={key} onClick={() => changeCategory(key)} className={collection === key ? "active" : ""}>{label}<ShopIcon name="chevron" size={13} /></button>)}
          <h3>SHOP BY</h3>
          <Link className={gender === "men" ? "active" : ""} href={`/shop/products?gender=men&collection=${collection}`}>Men</Link>
          <Link className={gender === "women" ? "active" : ""} href={`/shop/products?gender=women&collection=${collection}`}>Women</Link>
          <div className="sidebar-note"><ShopIcon name="truck" /><b>A LITTLE EXTRA FREEDOM.</b><p>Free shipping on orders $75+.</p></div>
        </aside>
        <div>
          {products.length ? <div className="product-grid catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} gender={gender} />)}</div> : <div className="empty-state"><ShopIcon name="search" size={40} /><h2>NO TRAILS FOUND.</h2><p>Try a different search or explore all footwear.</p><button className="shop-btn-primary" onClick={() => { setQ(""); changeCategory("all"); }}>Clear filters</button></div>}
        </div>
      </div>
    </div>
  );
}
