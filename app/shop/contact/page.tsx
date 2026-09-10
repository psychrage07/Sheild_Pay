"use client";

import { useState, type FormEvent } from "react";
import ShopIcon from "../components/ShopIcon";

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/shop/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: new FormData(form).get("email"), message: new FormData(form).get("message") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Please try again.");
      setStatus("Thanks for reaching out. Your demo message has been saved.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="page-container info-page"><p className="outdoor-eyebrow">WE&apos;RE HERE FOR YOU</p><h1>LET&apos;S TALK TRAIL.</h1><p className="page-intro">Questions about your gear, your order, or your next step? Drop us a note.</p><p className="muted">hello@northline.shop · +1 (415) 555-0142</p><form onSubmit={submit} className="contact-form"><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>How can we help?<textarea required name="message" minLength={5} maxLength={5000} placeholder="Tell us what&apos;s on your mind…" rows={6} /></label><button className="shop-btn-primary" disabled={busy} type="submit">{busy ? "SENDING…" : "SEND MESSAGE"}<ShopIcon name="arrow" size={18} /></button><p role="status">{status}</p><p className="small muted">Demo messages are saved for this session. No email is sent.</p></form></div>;
}
