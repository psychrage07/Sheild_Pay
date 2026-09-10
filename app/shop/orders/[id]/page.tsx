"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_ALERT_DISCLAIMER } from "@/shared/schemas";
import ShopIcon from "../../components/ShopIcon";

type OrderItem = { name: string; quantity: number; price: number; variant?: string };
type Order = Record<string, unknown>;

export default function OrderPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dispute, setDispute] = useState(false);
  const [reason, setReason] = useState("Item not received");

  useEffect(() => {
    fetch(`/api/shop/orders/${encodeURIComponent(id)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Order not found");
        setOrder(data.order ?? null);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Order not available"));
  }, [id]);

  async function fileDispute() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/shop/orders/${encodeURIComponent(id)}/dispute`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not open dispute");
      setOrder((current) => current ? { ...current, status: "Dispute opened", disputeReason: reason, shieldpay: { ...((current.shieldpay as Record<string, unknown> | undefined) ?? {}), disputeId: data.disputeId } } : current);
      setDispute(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!order) {
    return <div className="page-container empty-state"><ShopIcon name="bag" size={40} /><h2>{error ? "ORDER NOT AVAILABLE" : "GETTING YOUR ORDER…"}</h2><p role="status">{error || "Just a moment."}</p>{error && <Link className="shop-btn-light" href="/shop/account">YOUR ORDERS</Link>}</div>;
  }

  const items = (order.items as OrderItem[] | undefined) ?? [];
  const payment = (order.payment as { cardNetwork?: string; last4?: string } | undefined) ?? {};
  const tracking = (order.tracking as { trackingNumber?: string; status?: string } | undefined) ?? {};
  const shipping = (order.shipping as { name?: string; address1?: string; city?: string; region?: string; postalCode?: string } | undefined) ?? {};
  const shieldpay = (order.shieldpay as { disputeId?: string | null; alert?: { message?: string }; scenario?: { label?: string; reason?: string } | null } | undefined) ?? {};
  const disputeId = shieldpay.disputeId;
  const total = Number(order.totalAmount ?? 0);
  const status = String(order.status ?? "confirmed");

  return (
    <div className="page-container order-page">
      <div className="order-confirmation"><span className="confirmation-icon"><ShopIcon name={disputeId ? "shield" : "check"} size={32} /></span><p className="outdoor-eyebrow">{disputeId ? "SIMULATED CHARGEBACK CASE" : "DEMO PAYMENT SUCCESSFUL"}</p><h1>{disputeId ? "WE’RE ON THE CASE." : "YOUR NEXT ADVENTURE IS CONFIRMED."}</h1><p>Thanks, {String(order.name ?? "there").split(" ")[0]}. {disputeId ? "Your demo dispute has been recorded." : "Your gear is one step closer to the trail."}</p><span className="order-id">ORDER {String(order.orderId)}</span></div>
      <div className="order-details-grid">
        <div className="order-summary"><h2>ORDER DETAILS</h2>{items.map((item, index) => <div className="checkout-summary-item" key={`${item.name}-${index}`}><div className="checkout-summary-art"><span>{item.name.slice(0, 2).toUpperCase()}</span></div><div><b>{item.name}</b><p>{item.variant ?? "Standard"}</p><span>Qty {item.quantity}</span></div><b>${(item.price * item.quantity).toFixed(2)}</b></div>)}<div className="summary-row summary-total"><span>Total paid</span><span>${total.toFixed(2)}</span></div><p className="secure-note"><ShopIcon name="lock" size={16} /> {(payment.cardNetwork ?? "card").toUpperCase()} ending in {payment.last4 ?? "••••"} · Demo payment</p></div>
        <div className="order-delivery"><h2>THE TRAIL AHEAD</h2><div className="delivery-status"><ShopIcon name="check" /><div><b>{status}</b><p>{String(order.createdAt ?? "").slice(0, 10)}</p></div></div><h3>SHIPPING TO</h3><p>{shipping.name}<br />{shipping.address1}<br />{shipping.city}, {shipping.region} {shipping.postalCode}<br />United States</p><h3>CONTACT</h3><p>{String(order.email ?? "")}</p><div className="demo-banner"><ShopIcon name="shield" size={20} /><p>This is a demo order. No live card was charged, and no physical shipment will be sent.</p></div></div>
      </div>
      <section className="dispute-panel"><div><h2>{disputeId ? "DISPUTE CASE OPENED" : "NEED A HAND WITH YOUR ORDER?"}</h2><p>{disputeId ? `Reason: ${shieldpay.scenario?.reason ?? (order.disputeReason as string) ?? "customer reported an issue"}. Your simulated ShieldPay case has been saved. No bank or card network has been contacted.` : "Contact our team, or open a simulated dispute for this order."}</p>{disputeId && <p className="small muted">{MOCK_ALERT_DISCLAIMER}</p>}{shieldpay.alert?.message && <p className="small muted">Mock Alerts: {shieldpay.alert.message}</p>}</div>{!disputeId && <button className="shop-btn-light" onClick={() => setDispute((current) => !current)} type="button">{dispute ? "CANCEL" : "REPORT AN ISSUE"}<ShopIcon name="arrow" size={16} /></button>}{dispute && <div className="dispute-form"><label>What went wrong?<select value={reason} onChange={(event) => setReason(event.target.value)}><option>Item not received</option><option>Item not as described</option><option>Duplicate charge</option><option>Other</option></select></label><button disabled={busy} className="shop-btn-primary" onClick={fileDispute} type="button">{busy ? "SAVING…" : "OPEN DEMO DISPUTE"}</button></div>}{error && <p className="error" role="alert">{error}</p>}{disputeId && <Link href={`/dashboard/disputes/${encodeURIComponent(String(disputeId))}?preview=1`} className="shop-btn-primary">VIEW MERCHANT CASE <ShopIcon name="arrow" size={16} /></Link>}</section>
      <div className="center-actions"><Link href="/shop/products" className="shop-btn-primary">KEEP EXPLORING <ShopIcon name="arrow" size={18} /></Link><Link href="/shop/account" className="shop-btn-light">VIEW ALL ORDERS</Link></div>
    </div>
  );
}
