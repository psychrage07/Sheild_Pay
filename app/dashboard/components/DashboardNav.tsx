"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

type IconName = "grid" | "inbox" | "bell" | "sliders" | "store";

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    inbox: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" /><path d="M4 13h4l1.5 2h5L16 13h4" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 22h4" /></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></>,
    store: <><path d="M4 10v10h16V10" /><path d="M3 10 5 4h14l2 6" /><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M9 20v-5h6v5" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "grid" as IconName, view: "cases" as const },
  { href: "/dashboard?view=cases", label: "Cases", icon: "inbox" as IconName, view: "cases" as const },
  { href: "/dashboard?view=alerts", label: "Mock alerts", icon: "bell" as IconName, view: "alerts" as const },
  { href: "/dashboard/settings", label: "Automation", icon: "sliders" as IconName, view: null },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <aside className="dash-sidebar">
      <div>
        <Link href="/dashboard" className="dash-logo">
          <span className="dash-logo-mark">S</span>
          <span>
            <strong>ShieldPay</strong>
            <small>Merchant operations</small>
          </span>
        </Link>

        <div className="dash-workspace-switcher">
          <span className="dash-workspace-avatar">N</span>
          <span className="dash-workspace-copy"><small>Workspace</small><strong>Northline</strong></span>
          <span className="dash-chevron">⌄</span>
        </div>

        <p className="dash-nav-label">Workspace</p>
        <nav className="dash-nav" aria-label="Merchant navigation">
          {NAV.map((item, index) => {
            const onSettings = pathname.startsWith("/dashboard/settings");
            const onCase = pathname.startsWith("/dashboard/disputes");
            const onDesk = pathname === "/dashboard";
            const active = item.label === "Overview"
              ? onDesk && view == null && !onCase && index === 0
              : item.view === "alerts"
                ? onDesk && view === "alerts"
                : item.label === "Cases"
                  ? (onDesk && view === "cases") || onCase
                  : onSettings;
            return (
              <Link key={item.label} href={item.href} className={`dash-nav-link ${active ? "dash-nav-link-active" : ""}`}>
                <span className="dash-nav-icon"><NavIcon name={item.icon} /></span>
                <span>{item.label}</span>
                {item.label === "Mock alerts" ? <span className="dash-nav-pill">DEMO</span> : null}
              </Link>
            );
          })}
        </nav>

        <p className="dash-nav-label dash-nav-label-lower">Resources</p>
        <Link href="/shop" className="dash-nav-link dash-store-link">
          <span className="dash-nav-icon"><NavIcon name="store" /></span>
          <span>View storefront</span>
          <span className="dash-external">↗</span>
        </Link>
      </div>

      <div className="dash-sidebar-footer">
        <div className="dash-live-status"><span /> All systems operational</div>
        <div className="dash-sidebar-bottom">
          <div className="dash-user-avatar">JD</div>
          <div className="dash-user-copy"><strong>Jordan Davis</strong><small>Administrator</small></div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
