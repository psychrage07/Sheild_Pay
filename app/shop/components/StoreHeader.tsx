"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "./CartProvider";
import ShopIcon from "./ShopIcon";

const NAV = [
  ["Men", "/shop/products?gender=men"],
  ["Women", "/shop/products?gender=women"],
  ["Hiking", "/shop/products?collection=hiking"],
  ["Trail Running", "/shop/products?collection=trail-running"],
  ["Everyday", "/shop/products?collection=everyday"],
  ["Sale", "/shop/products?collection=sale"],
] as const;

function Logo() {
  return (
    <span className="shop-brand shop-brand-outdoor">
      <span className="shop-brand-mountain" aria-hidden><ShopIcon name="mountain" size={27} /></span>
      <span>Northline<sup>®</sup></span>
    </span>
  );
}

export default function StoreHeader() {
  const { count, notice, setNotice } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");
    router.push(`/shop/products?q=${encodeURIComponent(String(q ?? ""))}`);
    setSearch(false);
  }

  return (
    <>
      <div className="outdoor-announcement">
        <span>FREE SHIPPING ON ORDERS $75+</span>
        <Link href="/shop/shipping">GET OUTSIDE. WE&apos;LL HANDLE THE REST. <ShopIcon name="arrow" size={13} /></Link>
      </div>
      <header className="outdoor-header">
        <div className="outdoor-header-main">
          <button
            className="shop-icon-button outdoor-mobile-menu"
            onClick={() => setMenu((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={menu}
            type="button"
          >
            <ShopIcon name={menu ? "close" : "menu"} />
          </button>
          <Link href="/shop" aria-label="Northline home"><Logo /></Link>
          <nav className="outdoor-main-nav" aria-label="Main navigation">
            {NAV.map(([label, href]) => (
              <Link key={label} href={href} className={label === "Sale" ? "outdoor-sale-link" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="outdoor-header-tools">
            <Link className="outdoor-explore-link" href="/shop/about">Explore <span>↗</span></Link>
            <button
              className="shop-icon-button"
              aria-label="Search products"
              aria-expanded={search}
              onClick={() => setSearch((current) => !current)}
              type="button"
            >
              <ShopIcon name={search ? "close" : "search"} />
            </button>
            <Link className="shop-icon-button outdoor-account-icon" href="/shop/account" aria-label="Your orders">
              <ShopIcon name="user" />
            </Link>
            <Link className={`shop-icon-button outdoor-bag-icon ${pathname === "/shop/cart" ? "selected" : ""}`} href="/shop/cart" aria-label={`Shopping bag, ${count} items`}>
              <ShopIcon name="bag" /><span>{count}</span>
            </Link>
          </div>
        </div>
        {menu && (
          <nav className="outdoor-mobile-nav" aria-label="Mobile navigation">
            {NAV.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenu(false)}>
                {label}<ShopIcon name="arrow" size={18} />
              </Link>
            ))}
            <Link href="/shop/account" onClick={() => setMenu(false)}>Your orders <ShopIcon name="arrow" size={18} /></Link>
            <Link href="/dashboard" onClick={() => setMenu(false)}>Merchant dashboard <ShopIcon name="arrow" size={18} /></Link>
          </nav>
        )}
        {search && (
          <form className="outdoor-search-panel" onSubmit={submitSearch}>
            <ShopIcon name="search" />
            <input name="q" autoFocus placeholder="Find your next adventure. Search pieces..." aria-label="Search products" required />
            <button className="shop-btn-primary" type="submit">Search <ShopIcon name="arrow" size={16} /></button>
          </form>
        )}
      </header>
      {notice && (
        <div className="outdoor-toast" role="status">
          <ShopIcon name="check" />
          <span>{notice}</span>
          <Link href="/shop/cart">View bag →</Link>
          <button className="shop-icon-button" aria-label="Dismiss notification" onClick={() => setNotice("")} type="button"><ShopIcon name="close" size={16} /></button>
        </div>
      )}
    </>
  );
}
