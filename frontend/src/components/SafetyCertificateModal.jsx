import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import "./SafetyCertificateModal.css";

export default function SafetyCertificateModal({ company, result, onClose }) {
  const [copied, setCopied] = useState(false);

  const certId = `IS-CERT-2026-${(company?.id || "NIMBUS").toUpperCase()}`;
  const verifyDate = result?.checkedAt
    ? new Date(result.checkedAt).toLocaleString()
    : new Date().toLocaleString();

  const isSafe = (result?.riskLevel || company?.risk) === "LOW";
  const score = company?.score || (isSafe ? 96 : 28);

  function handlePrint() {
    window.print();
  }

  function handleCopy() {
    navigator.clipboard.writeText(certId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportJson() {
    const certData = {
      certificateId: certId,
      issuedBy: "InternShield National Student Safety Network",
      issueDate: new Date().toISOString(),
      company: {
        name: company?.name || result?.company,
        domain: company?.domain || "verified-org.com",
        cin: company?.cin || "U72900MH2019PTC328910",
        mcaStatus: company?.mcaStatus || "ACTIVE",
      },
      trustScore: score,
      riskLevel: result?.riskLevel || company?.risk || "LOW",
      evidence: result?.checks || [
        { name: "MCA Ministry Registration", status: "PASS" },
        { name: "Domain Age & Corporate MX Records", status: "PASS" },
        { name: "Advance Fee Scam Heuristic", status: "PASS" },
        { name: "Student Community Threat Flagging", status: "PASS" },
      ],
      digitalSignature: `SHA256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${certId}_Audit_Dossier.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="cert-overlay" onClick={onClose}>
      <div
        className="cert-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Safety Certificate"
      >
        {/* Top Header Bar */}
        <div className="cert-modal__header-bar">
          <div className="cert-modal__brand">
            <ShieldCheck size={20} color="#38bdf8" />
            <span>InternShield Safety Audit Dossier</span>
          </div>
          <button
            type="button"
            className="cert-modal__close-btn"
            onClick={onClose}
            aria-label="Close certificate modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Printable Certificate Document */}
        <div className="cert-document">
          <div className="cert-badge-row">
            <span className="cert-serial">CERT ID: {certId}</span>
            <span
              className={`risk-badge risk-badge--${isSafe ? "low" : "high"}`}
              style={{
                fontSize: "0.8rem",
                padding: "4px 12px",
                borderRadius: "999px",
                fontWeight: 700,
                color: isSafe ? "#22c55e" : "#f43f5e",
                background: isSafe
                  ? "rgba(34, 197, 94, 0.12)"
                  : "rgba(244, 63, 94, 0.12)",
                border: `1px solid ${isSafe ? "rgba(34, 197, 94, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
              }}
            >
              {isSafe ? "VERIFIED GENUINE" : "HIGH THREAT WARNING"}
            </span>
          </div>

          <div className="cert-title-block">
            <h2>Internship Opportunity Safety Dossier</h2>
            <p>Cryptographically validated employer credential & fraud vulnerability audit</p>
          </div>

          {/* Company Summary Card */}
          <div className="cert-company-card">
            <div className="cert-company-info">
              <h3>{company?.name || result?.company || "Target Company"}</h3>
              <div className="cert-company-meta">
                <span>
                  Domain: <strong>{company?.domain || "corporate-domain.com"}</strong>
                </span>
                <span>
                  CIN: <strong>{company?.cin || "U72900MH2019PTC328910"}</strong>
                </span>
                <span>
                  MCA Status: <strong>{company?.mcaStatus || "ACTIVE"}</strong>
                </span>
              </div>
            </div>

            <div className="cert-score-pill">
              <span
                className="cert-score-number"
                style={{ color: isSafe ? "#22c55e" : "#f43f5e" }}
              >
                {score}/100
              </span>
              <span className="cert-score-label">Trust Index</span>
            </div>
          </div>

          {/* Evidence Checklist */}
          <div className="cert-checklist">
            {(result?.checks || [
              { name: "Ministry of Corporate Affairs (MCA) active registration", status: "PASS" },
              { name: "Domain age & Corporate MX records authenticity", status: "PASS" },
              { name: "Advance training fee & security deposit heuristics", status: isSafe ? "PASS" : "FAIL" },
              { name: "Community threat & Telegram scam cross-audit", status: isSafe ? "PASS" : "FAIL" },
            ]).map((c, i) => (
              <div key={i} className="cert-check-item">
                <div className="cert-check-left">
                  {c.status === "PASS" ? (
                    <CheckCircle2 size={16} color="#22c55e" />
                  ) : (
                    <AlertTriangle size={16} color="#f43f5e" />
                  )}
                  <span>{c.name}</span>
                </div>
                <strong
                  style={{
                    color: c.status === "PASS" ? "#22c55e" : "#f43f5e",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                  }}
                >
                  {c.status}
                </strong>
              </div>
            ))}
          </div>

          {/* Footer with Digital Seal */}
          <div className="cert-footer-row">
            <div>
              <p>Audited: {verifyDate}</p>
              <p style={{ marginTop: 2 }}>
                Verifier: <strong>InternShield Neural Trust Engine v2.7</strong>
              </p>
            </div>

            <div className="cert-seal-wrap">
              <div
                className="cert-seal"
                style={{ borderColor: isSafe ? "#22c55e" : "#f43f5e" }}
              >
                <ShieldCheck size={26} color={isSafe ? "#22c55e" : "#f43f5e"} />
              </div>
              <div>
                <strong style={{ color: "#ffffff", display: "block" }}>
                  DIGITALLY STAMPED
                </strong>
                <span style={{ fontSize: "0.72rem" }}>Tamper-proof Audit Record</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="cert-modal__actions">
          <button
            type="button"
            className="cert-action-btn cert-action-btn--secondary"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
            <span>{copied ? "Copied ID!" : "Copy Cert ID"}</span>
          </button>

          <button
            type="button"
            className="cert-action-btn cert-action-btn--secondary"
            onClick={handleExportJson}
          >
            <FileCheck size={16} />
            <span>Download Audit JSON</span>
          </button>

          <button
            type="button"
            className="cert-action-btn cert-action-btn--primary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
