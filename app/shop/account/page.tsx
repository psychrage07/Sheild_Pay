"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import ShopIcon from "../components/ShopIcon";

type Order = Record<string, unknown>;

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  async function load(value = email) {
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/shop/orders?email=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to load orders.");
      setOrders(data.orders ?? []);
      setLoaded(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load orders.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("northline-last-email") ?? "";
    setEmail(stored);
    if (stored) void load(stored);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load();
  }

  return (
    <div className="page-container account-page">
      <p className="outdoor-eyebrow">YOUR ADVENTURES, ALL IN ONE PLACE</p>
      <h1>YOUR ORDERS.</h1>
      <p className="page-intro">Enter the email you used at checkout to find your orders.</p>
      <form className="lookup-form" onSubmit={submit}><label className="sr-only" htmlFor="order-email">Email address</label><input id="order-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" /><button className="shop-btn-dark" disabled={busy} type="submit">{busy ? "LOOKING…" : "FIND MY ORDERS"}<ShopIcon name="arrow" size={18} /></button></form>
      <p className="muted small">For your privacy, only orders placed in this browser are shown.</p>
      {error && <p className="error" role="alert">{error}</p>}
      {orders.length ? <div className="order-list">{orders.map((order) => <Link className="order-list-item" href={`/shop/orders/${encodeURIComponent(String(order.orderId))}`} key={String(order.orderId)}><span className="order-list-icon"><ShopIcon name="bag" size={28} /></span><div><b>{String(order.orderId)}</b><p>{new Date(String(order.createdAt)).toLocaleDateString()} · {((order.items as Array<{ quantity: number }> | undefined) ?? []).reduce((sum, item) => sum + item.quantity, 0)} items</p></div><span className="status-chip">{String(order.status)}</span><b>${Number(order.totalAmount).toFixed(2)}</b><ShopIcon name="arrow" /></Link>)}</div> : <div className="empty-state"><ShopIcon name="mountain" size={45} /><h2>{loaded ? "YOUR FIRST ADVENTURE AWAITS." : "GOOD GEAR. GREAT MEMORIES."}</h2><p>{loaded ? "No orders found for this email in this browser." : "Already checked out? Look up your order above."}</p><Link className="shop-btn-primary" href="/shop/products">EXPLORE FOOTWEAR <ShopIcon name="arrow" size={18} /></Link></div>}
    </div>
  );
}
