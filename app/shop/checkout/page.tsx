"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartProvider";
import { formatCardNumber, inferCardNetwork } from "@/shared/shop/test-cards";
import ShopIcon from "../components/ShopIcon";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardNetwork, setCardNetwork] = useState("visa");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const shipping = subtotal >= 75 ? 0 : 8;
  const total = subtotal + shipping;

  function fillCard() {
    setCardNetwork("visa");
    setCardNumber(formatCardNumber("4242424242424242"));
    setExpMonth("12");
    setExpYear(String(new Date().getFullYear() + 2));
    setCvc("123");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length || busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"), name: form.get("name"), cardNetwork, cardNumber,
          expMonth, expYear, cvc,
          shipping: { name: form.get("name"), address1: form.get("address1"), city: form.get("city"), region: form.get("region"), postalCode: form.get("postalCode"), country: "US" },
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity, variant: line.variant })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Checkout failed");
      try { localStorage.setItem("northline-last-email", String(form.get("email") ?? "")); } catch { /* browser storage is optional */ }
      clear();
      router.push(`/shop/orders/${encodeURIComponent(String(data.order?.orderId ?? ""))}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to complete your order.");
      setBusy(false);
    }
  }

  if (!lines.length) {
    return <div className="page-container empty-state"><ShopIcon name="bag" size={48} /><h1>A LITTLE ADVENTURE IS MISSING.</h1><p>Add something to your bag before checking out.</p><Link className="shop-btn-primary" href="/shop/products">SHOP FOOTWEAR <ShopIcon name="arrow" size={18} /></Link></div>;
  }

  return (
    <div className="page-container checkout-page">
      <div className="breadcrumb"><Link href="/shop/cart">Bag</Link><span>/</span><span>Checkout</span></div>
      <div className="outdoor-section-heading"><h1>ONE STEP CLOSER TO OUTSIDE.</h1><span className="secure-note"><ShopIcon name="lock" size={16} /> Secure checkout</span></div>
      <div className="demo-banner"><ShopIcon name="shield" size={23} /><div><b>This is a demo checkout. No real payment will be taken.</b><p>Use the demo card below. Please don&apos;t enter real card details.</p></div></div>
      <div className="checkout-layout">
        <form id="checkout-form" onSubmit={submit} className="checkout-form">
          <section className="form-section"><h2><span>01</span> CONTACT DETAILS</h2><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label></section>
          <section className="form-section"><h2><span>02</span> SHIPPING ADDRESS</h2><div className="form-grid"><label className="span-2">Full name<input required name="name" autoComplete="name" placeholder="First and last name" maxLength={150} /></label><label className="span-2">Street address<input required name="address1" autoComplete="street-address" placeholder="Street address, apartment, suite" maxLength={200} /></label><label>City<input required name="city" autoComplete="address-level2" placeholder="City" maxLength={100} /></label><label>State<input required name="region" autoComplete="address-level1" placeholder="State" maxLength={100} /></label><label>ZIP code<input required name="postalCode" autoComplete="postal-code" placeholder="ZIP code" maxLength={20} /></label><label>Country<select name="country" defaultValue="US"><option value="US">United States</option></select></label></div></section>
          <section className="form-section"><h2><span>03</span> PAYMENT</h2><div className="demo-card-box"><div><b>Try a demo card</b><code>{cardNumber || "4242 4242 4242 4242"}</code><span>Future expiry · 3-digit CVC</span></div><button type="button" onClick={fillCard} className="underlined">Use demo card <ShopIcon name="arrow" size={15} /></button></div><div className="form-grid"><label className="span-2">Card network<select value={cardNetwork} name="cardNetwork" onChange={(event) => { setCardNetwork(event.target.value); setCardNumber(""); }}><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="amex">American Express</option><option value="rupay">RuPay</option></select></label><label className="span-2">Card number<input required name="cardNumber" value={cardNumber} inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" onChange={(event) => { const next = formatCardNumber(event.target.value); setCardNumber(next); setCardNetwork(inferCardNetwork(next, cardNetwork)); }} /></label><label>Expiration month<input required name="expMonth" value={expMonth} onChange={(event) => setExpMonth(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="MM" maxLength={2} /></label><label>Expiration year<input required name="expYear" value={expYear} onChange={(event) => setExpYear(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="YYYY" maxLength={4} /></label><label className="span-2">Security code (CVC)<input required name="cvc" type="password" value={cvc} onChange={(event) => setCvc(event.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="off" placeholder="3 digits" minLength={3} maxLength={4} /></label></div><p className="secure-note"><ShopIcon name="shield" size={16} /> Only the card network and last four digits are saved.</p></section>
          {error && <p className="error error-box" role="alert">{error}</p>}
          <button type="submit" className="shop-btn-primary full" disabled={busy}>{busy ? "PROCESSING YOUR ORDER…" : `PLACE DEMO ORDER · $${total.toFixed(2)}`} <ShopIcon name="lock" size={18} /></button>
          <p className="small muted">By placing this order, you acknowledge that this is a simulated purchase. No physical products will be shipped.</p>
        </form>
        <aside className="order-summary"><h2>YOUR ADVENTURE KIT</h2>{lines.map((line) => <div className="checkout-summary-item" key={`${line.productId}-${line.variant}`}><div className="checkout-summary-art"><span>{line.title.slice(0, 2).toUpperCase()}</span></div><div><b>{line.title}</b><p>{line.variant}</p><span>Qty {line.quantity}</span></div><b>${(line.price * line.quantity).toFixed(2)}</b></div>)}<div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div><div className="summary-row summary-total"><span>Total (USD)</span><span>${total.toFixed(2)}</span></div><p className="secure-note"><ShopIcon name="shield" size={16} /> Protected by ShieldPay · Demo mode</p><Link href="/shop/cart" className="underlined">Edit your bag</Link></aside>
      </div>
    </div>
  );
}
