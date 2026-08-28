import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import EvidenceCard from "../components/EvidenceCard.jsx";
import GlassButton from "../components/GlassButton.jsx";
import { getCompanyById, runCheck } from "../services/verificationService.js";
import "./VerificationResult.css";

export default function VerificationResult() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading -> scanning -> done
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const company = await getCompanyById(companyId);
      if (!company) {
        setStatus("not-found");
        return;
      }
      setStatus("scanning");
      const data = await runCheck(company);
      if (!cancelled) {
        setResult(data);
        setStatus("done");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [companyId]);

  return (
    <div className="page">
      <AnimatedBackground />
      <Navbar />

      <div className="container verify">
        {status === "not-found" && (
          <div className="glass-card verify__empty">
            <p>We couldn't find that company. Try searching again from your dashboard.</p>
            <GlassButton variant="ghost" showArrow={false} onClick={() => navigate("/dashboard")}>
              Back to dashboard
            </GlassButton>
          </div>
        )}

        {(status === "loading" || status === "scanning") && (
          <div className="verify__scanning glass-card">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            >
              <ScanSearch size={40} color="var(--color-primary)" />
            </motion.div>
            <h2>Running verification checks...</h2>
            <p>Cross-referencing company records, website signals and student reports.</p>
          </div>
        )}

        {status === "done" && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="verify__header glass-card">
              <div>
                <span className="verify__label">Verification result for</span>
                <h1>{result.company}</h1>
              </div>
              <RiskBadge level={result.riskLevel} size="lg" />
            </div>

            <p className="verify__summary">{result.summary}</p>

            <h3 className="verify__evidence-title">Evidence collected</h3>
            <div className="verify__evidence-list">
              {result.checks.map((c, i) => (
                <EvidenceCard key={c.name} name={c.name} status={c.status} index={i} />
              ))}
            </div>

            <p className="verify__timestamp">
              Checked at {new Date(result.checkedAt).toLocaleString()}
            </p>

            <div className="verify__actions">
              <GlassButton variant="solid" showArrow={false} onClick={() => navigate("/dashboard")}>
                Back to dashboard
              </GlassButton>
              <GlassButton variant="ghost" showArrow={false} onClick={() => window.location.reload()}>
                Re-run check
              </GlassButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
