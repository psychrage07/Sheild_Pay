"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ShopProduct } from "@/lib/shop/commerce";
import ProductArt from "./ProductArt";
import ProductCard from "./ProductCard";
import ShopIcon from "./ShopIcon";

const TABS = ["Best Sellers", "New Arrivals", "Hiking", "Trail Running"] as const;

export default function Home({ products }: { products: ShopProduct[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Best Sellers");
  const [slide, setSlide] = useState(0);

  const slides = [
    { image: "moab", eyebrow: "LESS SCROLLING. MORE SUMMITING.", title: <>FIND YOUR<br />OUTSIDE.</>, copy: "Good things happen when you get out there.", sub: "Gear up for wherever the trail takes you." },
    { image: "agility", eyebrow: "BUILT FOR THE WAY YOU MOVE.", title: <>TAKE THE<br />SCENIC ROUTE.</>, copy: "A little further. A little wilder.", sub: "Meet your next go-to trail companion." },
    { image: "jungle", eyebrow: "LEAVE THE ORDINARY BEHIND.", title: <>RUN YOUR<br />OWN TRAIL.</>, copy: "Find your flow beyond the pavement.", sub: "Trail-tested performance. Unstoppable possibilities." },
  ];

  const campaign = slides[slide];
  const shown = useMemo(() => {
    if (tab === "New Arrivals") return products.filter((product) => product.tags.includes("new")).slice(0, 4);
    if (tab === "Hiking") return products.filter((product) => product.category === "hiking").slice(0, 4);
    if (tab === "Trail Running") return products.filter((product) => product.category === "trail-running").slice(0, 4);
    return products.filter((product) => product.tags.includes("bestseller")).slice(0, 4);
  }, [products, tab]);

  const fallback = shown.length ? shown : products.slice(0, 4);

  return (
    <>
      <section className="outdoor-hero">
        <div className="outdoor-hero-art">
          <ProductArt image={campaign.image} title={campaign.image === "agility" ? "Agility Peak 6" : campaign.image === "jungle" ? "Jungle Moc" : "Moab 3"} className="outdoor-hero-product" />
          <div className="outdoor-hero-ring outdoor-hero-ring-one" />
          <div className="outdoor-hero-ring outdoor-hero-ring-two" />
          <span className="outdoor-hero-art-note">TRAIL-TESTED<br />ADVENTURE-READY</span>
        </div>
        <div className="outdoor-hero-shade" />
        <div className="outdoor-hero-copy">
          <p className="outdoor-eyebrow"><span /> {campaign.eyebrow}</p>
          <h1>{campaign.title}</h1>
          <p className="outdoor-hero-description">{campaign.copy}<br />{campaign.sub}</p>
          <div className="outdoor-hero-buttons">
            <Link className="shop-btn-primary" href="/shop/products?gender=men">SHOP MEN <ShopIcon name="arrow" size={18} /></Link>
            <Link className="shop-btn-light" href="/shop/products?gender=women">SHOP WOMEN <ShopIcon name="arrow" size={18} /></Link>
          </div>
        </div>
        <div className="outdoor-hero-bottom">
          <span className="outdoor-coordinate"><ShopIcon name="pin" size={14} /> THE GREAT OUTDOORS. YOUR HAPPY PLACE.</span>
          <div className="outdoor-pagination">
            {slides.map((item, index) => (
              <button key={item.eyebrow} onClick={() => setSlide(index)} aria-label={`Show campaign ${index + 1}`} aria-pressed={slide === index} className={slide === index ? "active" : ""} />
            ))}
            <span>0{slide + 1} / 03</span>
          </div>
        </div>
        <span className="outdoor-hero-side">BUILT FOR THE OUTSIDE. SINCE 1981.</span>
      </section>

      <div className="outdoor-adventure-strip">
        <span>OUTSIDE IS FOR EVERYONE.</span><b>✳</b><span>EVERY PATH. EVERY PACE.</span><b>✳</b><span>LET&apos;S GET OUT THERE.</span><ShopIcon name="arrow" size={21} />
      </div>

      <section className="outdoor-section featured-section">
        <div className="outdoor-section-heading">
          <div><p className="outdoor-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p><h2>TRAIL-TESTED.<br />ADVENTURE-READY.</h2></div>
          <Link className="outdoor-text-link" href="/shop/products">SHOP ALL FOOTWEAR <ShopIcon name="arrow" size={17} /></Link>
        </div>
        <div className="outdoor-collection-tabs">
          {TABS.map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? "active" : ""}>{item}</button>)}
          <span>Made to go further.</span>
        </div>
        <div className="product-grid outdoor-product-grid">{fallback.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="outdoor-section outdoor-activity-section">
        <div className="outdoor-section-heading"><div><p className="outdoor-eyebrow">THERE&apos;S MORE THAN ONE WAY OUT</p><h2>WHATEVER YOUR TRAIL.</h2></div><p>Find the gear that gets you there.</p></div>
        <div className="outdoor-activity-grid">
          {[
            { name: "HIKING", image: "moab", description: "Go a little further.", query: "hiking" },
            { name: "TRAIL RUNNING", image: "agility", description: "Find your off-road rhythm.", query: "trail-running" },
            { name: "EVERYDAY", image: "jungle", description: "Make the everyday an adventure.", query: "everyday" },
          ].map((item, index) => (
            <Link key={item.name} href={`/shop/products?collection=${item.query}`} className="outdoor-activity-card">
              <ProductArt image={item.image} title={item.name} className="outdoor-activity-art" />
              <span className="outdoor-activity-number">0{index + 1} / EXPLORE</span>
              <div className="outdoor-activity-copy"><p>{item.description}</p><h3>{item.name}</h3></div>
              <span className="outdoor-activity-arrow"><ShopIcon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="outdoor-story-banner">
        <div className="outdoor-story-art"><ProductArt image="pack" title="16L Daypack" className="outdoor-story-product" /></div>
        <div className="outdoor-story-copy"><p className="outdoor-eyebrow">40+ YEARS. COUNTLESS TRAILS.</p><h2>THE OUTSIDE<br />IS IN OUR DNA.</h2><p>We believe the trail is for everyone. That a little fresh air goes a long way. And that the best things in life happen outside.</p><Link className="shop-btn-primary" href="/shop/about">THIS IS NORTHLINE <ShopIcon name="arrow" size={18} /></Link></div>
        <span className="outdoor-story-stamp"><ShopIcon name="mountain" size={32} /> BUILT FOR<br />THE OUTSIDE</span>
      </section>

      <section className="outdoor-outside-note"><ShopIcon name="mountain" size={35} /><p>NOT JUST A SHOE. A WAY OUT.</p><h2>Less ordinary. More outside.</h2><Link href="/shop/products" className="outdoor-text-link">FIND YOUR NEXT PAIR <ShopIcon name="arrow" size={17} /></Link></section>
    </>
  );
}
