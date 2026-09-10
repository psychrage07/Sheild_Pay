import Link from "next/link";
import ProductCard from "./components/ProductCard";
import ProductArt from "./components/ProductArt";
import { listShopProducts } from "@/lib/shop/commerce";
import catalog from "@/shared/shop/catalog.json";

export const dynamic = "force-dynamic";

export default async function ShopHomePage() {
  const products = await listShopProducts();
  const featured = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
  const rest = products.slice(0, 8);

  return (
    <div className="shop-home">
      <section className="shop-hero shop-hero-premium">
        <div className="shop-hero-copy">
          <div className="shop-eyebrow-row">
            <span className="shop-eyebrow-dot" />
            <p className="shop-kicker">Fall / Winter 2026</p>
          </div>
          <h1>Everyday objects, <em>considered.</em></h1>
          <p className="shop-lede">
            {catalog.store.tagline} A small edit of apparel, home, and tools designed to earn
            their place in your routine.
          </p>
          <div className="shop-actions">
            <Link href="/shop/products" className="shop-btn-primary shop-btn-arrow">
              Explore the collection <span aria-hidden>↗</span>
            </Link>
            <Link href="/shop/about" className="shop-text-link">
              Our approach <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="shop-hero-proof">
            <div>
              <strong>12k+</strong>
              <span>quietly happy customers</span>
            </div>
            <div>
              <strong>4.8 / 5</strong>
              <span>average product rating</span>
            </div>
          </div>
        </div>

        <div className="shop-hero-visual" aria-label="Featured Northline pieces">
          <div className="shop-hero-visual-top">
            <span>Northline / 026</span>
            <span>01 — 04</span>
          </div>
          <div className="shop-hero-product">
            <ProductArt image="sweater" title="Merino Crewneck" className="shop-art-hero" />
            <div className="shop-hero-float-card">
              <span className="shop-float-label">Featured piece</span>
              <strong>Merino Crewneck</strong>
              <span>$89.00 <s>$120.00</s></span>
            </div>
          </div>
          <div className="shop-hero-visual-bottom">
            <span>Soft structure</span>
            <span>01 / 04</span>
          </div>
        </div>
      </section>

      <div className="shop-service-bar">
        <span><b>01</b> Thoughtful materials</span>
        <span><b>02</b> Easy, free returns</span>
        <span><b>03</b> Delivered in 3–5 days</span>
        <span><b>04</b> Made to live with</span>
      </div>

      <section className="shop-section shop-section-featured">
        <div className="shop-section-head shop-section-head-premium">
          <div>
            <p className="shop-kicker">The edit</p>
            <h2>Best sellers, <em>well loved.</em></h2>
          </div>
          <Link href="/shop/products" className="shop-text-link">
            View all pieces <span aria-hidden>↗</span>
          </Link>
        </div>
        <div className="shop-product-grid shop-product-grid-premium">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="shop-editorial">
        <div className="shop-editorial-art">
          <ProductArt image="daypack" title="16L Daypack" className="shop-art-editorial" />
          <span className="shop-editorial-stamp">Built for the in-between</span>
        </div>
        <div className="shop-editorial-copy">
          <p className="shop-kicker">The Northline standard</p>
          <h2>Less noise. More <em>use.</em></h2>
          <p>
            We look for the details that make a piece feel right six months from now: honest
            materials, useful proportions, and nothing added just to be noticed.
          </p>
          <Link href="/shop/about" className="shop-text-link">
            Read our story <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="shop-section shop-section-new">
        <div className="shop-section-head shop-section-head-premium">
          <div>
            <p className="shop-kicker">Just in</p>
            <h2>New & notable</h2>
          </div>
          <Link href="/shop/products" className="shop-text-link">
            Shop the catalog <span aria-hidden>↗</span>
          </Link>
        </div>
        <div className="shop-product-grid shop-product-grid-premium">
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="shop-newsletter">
        <div>
          <p className="shop-kicker">A considered note</p>
          <h2>Good things, occasionally.</h2>
          <p>New pieces, care notes, and the occasional reason to slow down.</p>
        </div>
        <form className="shop-newsletter-form" action="#">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Your email address" required />
          <button type="submit" className="shop-btn-primary">Subscribe <span aria-hidden>→</span></button>
        </form>
      </section>
    </div>
  );
}
