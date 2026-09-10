"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Dispute } from "@/shared/schemas";
import { fetchDisputes, fetchDisputeSnapshot } from "@/lib/p4/api-client";
import DisputeCard from "./components/DisputeCard";
import SimulateDisputeModal from "./components/SimulateDisputeModal";
import ReviewNotificationBanner from "./components/ReviewNotificationBanner";
import MockAlertsPanel from "./components/MockAlertsPanel";

function MetricIcon({ type }: { type: "cases" | "review" | "submitted" | "value" }) {
  if (type === "cases") return <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7.5h16M7 4h10a2 2 0 0 1 2 2v13H5V6a2 2 0 0 1 2-2Z" /><path d="M8 11h8M8 15h5" /></svg>;
  if (type === "review") return <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5l3 2" /></svg>;
  if (type === "submitted") return <svg viewBox="0 0 24 24" aria-hidden><path d="m5 12 4.5 4.5L19 7" /><circle cx="12" cy="12" r="9" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden><path d="M5 19V9M12 19V5M19 19v-7" /><path d="M3 19h18" /></svg>;
}

export default function DashboardHome() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "alerts" ? "alerts" : "cases";
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);

  const loadDisputes = useCallback(async () => {
    setLoading(true);
    const list = await fetchDisputes();
    setDisputes(list);
    setLoading(false);

    const scoreMap: Record<string, number | null> = {};
    list.forEach((d) => {
      scoreMap[d.disputeId] = null;
    });
    setScores(scoreMap);

    list.forEach(async (d) => {
      try {
        const snapshot = await fetchDisputeSnapshot(d.disputeId);
        const score = snapshot.evidence?.confidenceScore ?? null;
        if (score != null) {
          setScores((prev) => ({ ...prev, [d.disputeId]: score }));
        }
      } catch {
        // keep pending
      }
    });
  }, []);

  useEffect(() => {
    void loadDisputes();
  }, [loadDisputes]);

  const metrics = useMemo(() => {
    const review = disputes.filter((d) => d.status === "review").length;
    const submitted = disputes.filter((d) => d.status === "submitted").length;
    const exposure = disputes.reduce((total, d) => total + d.amount, 0);
    return { review, submitted, exposure };
  }, [disputes]);

  if (view === "alerts") {
    return <MockAlertsPanel />;
  }

  return (
    <div className="dash-dashboard">
      <ReviewNotificationBanner />

      <section className="dash-page-intro">
        <div>
          <div className="dash-greeting"><span className="dash-greeting-dot" /> Thursday, September 10, 2026</div>
          <h1 className="dash-title mt-3">Good morning, Jordan.</h1>
          <p className="dash-muted dash-intro-copy mt-2">
            Here&apos;s what&apos;s happening with your payment protection today.
          </p>
        </div>
        <div className="dash-intro-actions">
          <span className="dash-sync-status"><span /> Synced just now</span>
          <SimulateDisputeModal onSuccess={loadDisputes} />
        </div>
      </section>

      <section className="dash-metric-grid" aria-label="Case summary">
        <div className="dash-metric-card">
          <div className="dash-metric-head"><span>Total cases</span><i><MetricIcon type="cases" /></i></div>
          <div className="dash-metric-value">{loading ? "—" : disputes.length}</div>
          <div className="dash-metric-foot"><span className="dash-trend-positive">↑ 8.4%</span><span>vs. last month</span></div>
        </div>
        <div className="dash-metric-card dash-metric-card-highlight">
          <div className="dash-metric-head"><span>Needs review</span><i><MetricIcon type="review" /></i></div>
          <div className="dash-metric-value">{loading ? "—" : metrics.review}</div>
          <div className="dash-metric-foot"><span className={metrics.review > 0 ? "dash-trend-warning" : "dash-trend-positive"}>{metrics.review > 0 ? "Action needed" : "All clear"}</span><span>right now</span></div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-head"><span>Submitted</span><i><MetricIcon type="submitted" /></i></div>
          <div className="dash-metric-value">{loading ? "—" : metrics.submitted}</div>
          <div className="dash-metric-foot"><span className="dash-trend-positive">↑ 12.6%</span><span>auto-resolved</span></div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-head"><span>At-risk value</span><i><MetricIcon type="value" /></i></div>
          <div className="dash-metric-value dash-metric-money">{loading ? "—" : `$${metrics.exposure.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}</div>
          <div className="dash-metric-foot"><span>Across open cases</span></div>
        </div>
      </section>

      <section className="dash-section-header">
        <div>
          <div className="dash-section-title-row"><h2>Open cases</h2><span className="dash-count-pill">{disputes.length}</span></div>
          <p className="dash-muted">Monitor disputes, evidence quality, and submission status.</p>
        </div>
        <div className="dash-case-actions">
          <button type="button" className="dash-filter-button">All cases <span>⌄</span></button>
          <button type="button" className="dash-filter-button dash-filter-icon" aria-label="Filter cases">☷</button>
        </div>
      </section>

      {loading ? (
        <div className="dash-loading-grid"><span /><span /><span /></div>
      ) : disputes.length === 0 ? (
        <div className="dash-empty-state">
          <div className="dash-empty-icon"><MetricIcon type="cases" /></div>
          <p className="dash-serif">Your case queue is clear</p>
          <p className="dash-muted">Place an order in the <Link href="/shop">Northline store</Link> or create a test case to see it here.</p>
          <SimulateDisputeModal onSuccess={loadDisputes} />
        </div>
      ) : (
        <div className="dash-case-grid">
          {disputes.map((dispute) => (
            <DisputeCard key={dispute.disputeId} dispute={dispute} confidenceScore={scores[dispute.disputeId]} />
          ))}
        </div>
      )}

      <section className="dash-bottom-insight">
        <div className="dash-insight-mark">✦</div>
        <div>
          <p className="dash-kicker">ShieldPay intelligence</p>
          <p className="dash-insight-title">Your evidence engine is watching every transaction.</p>
          <p className="dash-muted">Cases are automatically scored against network rules before they reach your team.</p>
        </div>
        <Link href="/dashboard/settings" className="dash-text-link">Tune automation <span>→</span></Link>
      </section>
    </div>
  );
}
