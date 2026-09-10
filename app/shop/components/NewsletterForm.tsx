"use client";

import { useState, type FormEvent } from "react";
import ShopIcon from "./ShopIcon";

export default function NewsletterForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/shop/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: new FormData(form).get("email") }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Please try again.");
      setStatus("You’re on the list. Here’s to more time outside.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="outdoor-newsletter-right">
      <form onSubmit={submit}>
        <input type="email" name="email" placeholder="Enter your email address" aria-label="Email for newsletter" required />
        <button type="submit" aria-label="Subscribe to newsletter" disabled={busy}>
          {busy ? "…" : <ShopIcon name="arrow" />}
        </button>
      </form>
      <p role="status">{status || "By signing up, you agree to receive marketing emails. Unsubscribe anytime."}</p>
    </div>
  );
}
