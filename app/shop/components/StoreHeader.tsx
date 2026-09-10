"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/shop", label: "Home" },
  { href: "/shop/products", label: "Collection" },
  { href: "/shop/account", label: "Orders" },
  { href: "/shop/about", label: "About" },
];

export default function StoreHeader() {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="shop-header">
      <p className="shop-banner">
        <span>Complimentary delivery on orders over $75</span>
        <span className="shop-banner-detail">·&nbsp; Designed for everyday, shipped worldwide</span>
      </p>
      <div className="shop-header-row">
        <button
          type="button"
          className="shop-menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <span className="shop-menu-lines" aria-hidden><i /><i /></span>
          Menu
        </button>
        <Link href="/shop" className="shop-brand" aria-label="Northline home">
          <span className="shop-brand-mark" aria-hidden>N</span>
          <span>Northline</span>
        </Link>
        <nav className="shop-nav-desktop" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="shop-header-actions">
          <Link href="/dashboard" className="shop-merchant-link">
            Merchant <span aria-hidden>↗</span>
          </Link>
          <Link href="/shop/cart" className="shop-cart-link">
            <span>Bag</span><span className="shop-cart-count">{count > 0 ? count : "0"}</span>
          </Link>
        </div>
      </div>
      {open && (
        <nav className="shop-nav-mobile" aria-label="Mobile navigation">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Merchant dashboard <span aria-hidden>↗</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
