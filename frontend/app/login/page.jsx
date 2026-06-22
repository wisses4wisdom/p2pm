"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { LiveConvert } from "../../components/LiveConvert";
import styles from "./login.module.css";

// Deterministic floating ₹/$ particles (hardcoded so SSR + client hydration
// match — no Math.random in render).
const PARTICLES = [
  { c: "₹", left: "6%",  bottom: "12%", size: 26, dur: 15, delay: 0 },
  { c: "$", left: "18%", bottom: "62%", size: 18, dur: 19, delay: 2 },
  { c: "₹", left: "34%", bottom: "30%", size: 16, dur: 17, delay: 4 },
  { c: "$", left: "47%", bottom: "78%", size: 22, dur: 21, delay: 1 },
  { c: "₹", left: "61%", bottom: "20%", size: 18, dur: 16, delay: 3 },
  { c: "$", left: "74%", bottom: "55%", size: 26, dur: 20, delay: 5 },
  { c: "₹", left: "86%", bottom: "34%", size: 16, dur: 18, delay: 2.5 },
  { c: "$", left: "92%", bottom: "70%", size: 20, dur: 22, delay: 4.5 },
];

export default function Login() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const [entering, setEntering] = useState(false);

  // Already signed in → straight to the dashboard.
  useEffect(() => {
    if (ready && authenticated) router.replace("/dashboard");
  }, [ready, authenticated, router]);

  function handleLogin() {
    if (!ready) return;
    setEntering(true);
    // Let the overlay animate in, then open Privy's secure login modal.
    setTimeout(() => login(), 320);
    // Auto-clear so cancelling the modal returns the user to this page.
    setTimeout(() => setEntering(false), 1700);
  }

  return (
    <div className={styles.wrap}>
      {/* animated background */}
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blob1}`} />
        <span className={`${styles.blob} ${styles.blob2}`} />
        <span className={`${styles.blob} ${styles.blob3}`} />
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              left: p.left,
              bottom: p.bottom,
              fontSize: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.c}
          </span>
        ))}
      </div>

      {/* ── Left: live showcase ── */}
      <section className={styles.showcase}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>◆</span> P2PM
        </div>

        <div className={styles.hero}>
          <div className={styles.heroKicker}>P2P.me Merchant Terminal</div>
          <h1 className={styles.heroTitle}>
            Accept <span className={styles.grad}>UPI in ₹</span>,<br />
            settle in <span className={styles.grad}>USDC</span> on Base.
          </h1>
          <p className={styles.heroSub}>
            Swaps so fast you get paid — without bank-freeze worries.
          </p>

          <LiveConvert />

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statIco}>🛡</div>
              <div className={styles.statVal}>Fraud-proof</div>
              <div className={styles.statLabel}>zk-KYC verified peers</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statIco}>⚡</div>
              <div className={styles.statVal}>Gas-free</div>
              <div className={styles.statLabel}>0 ETH — no wallet popups</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statIco}>🔒</div>
              <div className={styles.statVal}>Self-custody</div>
              <div className={styles.statLabel}>Your keys, your funds</div>
            </div>
          </div>
        </div>

        <div className={styles.showFoot}>
          <span className={styles.accentTxt}>⚡ Powered by the p2p.me protocol</span>
          <span>· &lt; 1 in 25,000 fraud</span>
          <span>· 1,000+ global LPs</span>
        </div>
      </section>

      {/* ── Right: sign-in ── */}
      <section className={styles.formside}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Sign in to your terminal</h2>
          <p className={styles.cardSub}>
            One tap with your email. We spin up a gas-sponsored smart wallet for
            you — no seed phrases, no ETH, no browser extensions.
          </p>
          <button className={styles.cta} disabled={!ready} onClick={handleLogin}>
            {ready ? "Continue with Email →" : "Loading…"}
          </button>
          <div className={styles.trust}>
            <span>🔒 Non-custodial</span><span>·</span>
            <span>⚡ Gas-free</span><span>·</span>
            <span>⛓ Base</span>
          </div>
        </div>
      </section>

      {/* branded hand-off into Privy's modal */}
      {entering && (
        <div className={styles.overlay} role="status" aria-live="polite">
          <div className={styles.overlayLogo}>◆</div>
          <div className={styles.spinner2} />
          <div className={styles.overlayText}>Opening secure login…</div>
        </div>
      )}
    </div>
  );
}
