"use client";

import { useEffect, useState } from "react";
import { fetchUsdcInrRate } from "../lib/rates";
import styles from "./LiveConvert.module.css";

// Amounts the converter cycles through to show the INR→USDC settlement.
const DEFAULT_AMOUNTS = [100, 250, 500, 1000, 2500];

// Count a value up to `target` whenever `trigger` changes (easeOutCubic).
function useCountUp(target, duration, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let raf;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, trigger]);
  return val;
}

/**
 * Animated INR→USDC converter card. Pulls the real live rate from the p2p.me
 * subgraph (falls back gracefully) and cycles through demo amounts, counting
 * the USDC side up each time. Works without auth — safe on public pages.
 */
export function LiveConvert({ amounts = DEFAULT_AMOUNTS, showRate = true }) {
  const [rate, setRate] = useState(null); // { rate: INR-per-USDC, source }
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let on = true;
    fetchUsdcInrRate().then((r) => on && setRate(r)).catch(() => {});
    return () => { on = false; };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % amounts.length), 3200);
    return () => clearInterval(t);
  }, [amounts.length]);

  const inr = amounts[idx];
  const inrPerUsdc = rate?.rate || 90;
  const usdc = useCountUp(inr / inrPerUsdc, 900, idx);

  return (
    <div className={styles.shell}>
      <div className={styles.convert}>
        <div className={styles.side}>
          <div className={styles.sideLabel}>You’re paid</div>
          <div key={idx} className={`${styles.inrVal} ${styles.slideIn}`}>
            ₹{inr.toLocaleString("en-IN")}
          </div>
        </div>
        <div className={styles.pipe} aria-hidden="true">
          <div className={styles.pipeLine} />
          <span className={styles.pipeArrow}>▶</span>
        </div>
        <div className={styles.side}>
          <div className={styles.sideLabel}>You keep</div>
          <div className={styles.usdcVal}>${usdc.toFixed(2)}</div>
        </div>
      </div>

      {showRate && (
        <div className={styles.rateline}>
          <span className={styles.livedot} />
          1 USDC = ₹{inrPerUsdc.toFixed(2)} · {rate ? rate.source : "fetching live rate…"}
        </div>
      )}
    </div>
  );
}
