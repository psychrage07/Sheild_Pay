import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import DashboardNav from "./components/DashboardNav";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShieldPay — Merchant desk",
  description: "Chargeback automation, evidence scoring, and payment-gateway submit",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="dash-root">
        <div className="dash-app-shell">
          <Suspense fallback={<div className="dash-sidebar dash-sidebar-loading" />}>
            <DashboardNav />
          </Suspense>
          <div className="dash-main-shell">
            <header className="dash-topbar">
              <div className="dash-breadcrumbs">
                <span>Northline</span><b>/</b><strong>Merchant operations</strong>
              </div>
              <div className="dash-topbar-actions">
                <span className="dash-demo-pill"><span /> Demo environment</span>
                <Link href="/shop" className="dash-view-store">View store <span>↗</span></Link>
                <div className="dash-topbar-avatar">JD</div>
              </div>
            </header>
            <main className="dash-main-content">{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
