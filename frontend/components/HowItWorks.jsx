"use client";

import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";
import styles from "./HowItWorks.module.css";

// Demo visuals (currency + icon) stay fixed; the labels come from translations.
const META = [
  { ico: "🔢", val: "₹100" },
  { qr: true, val: "₹100" },
  { ico: "⛓️", val: "$1.18" },
  { ico: "🏦", val: "$1.18" },
];

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// 6×6 QR-like pattern (three corner finders + data modules).
const QR = [
  1, 1, 0, 0, 1, 1,
  1, 1, 0, 0, 1, 1,
  0, 0, 1, 1, 0, 0,
  0, 1, 1, 0, 1, 0,
  1, 1, 0, 1, 0, 0,
  1, 1, 0, 0, 1, 0,
];

function QrGlyph() {
  return (
    <span className={styles.qr} aria-hidden="true">
      {QR.map((on, i) => (
        <i key={i} className={on ? styles.qrOn : undefined} />
      ))}
      <span className={styles.scan} />
    </span>
  );
}

export function HowItWorks() {
  const tr = useT();
  const STEPS = META.map((m, i) => ({ ...m, ...tr.how.items[i] }));

  const [step, setStep] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = (e) => setReduce(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % META.length), 2200);
    return () => clearInterval(t);
  }, []);

  const pct = 12.5 + (step / 3) * 75;
  const slide = step !== 0 && !reduce;

  return (
    <div className={styles.flow}>
      <div className={styles.stage}>
        <div className={styles.stageCap}>
          <span className={styles.live}><span className={styles.liveDot} /> {tr.how.liveDemo}</span>
          <span>{tr.how.oneSale}</span>
        </div>

        <div className={styles.track}>
          <div className={styles.line} />
          <div
            className={styles.lineFill}
            style={{ width: `${(step / 3) * 75}%`, transition: slide ? `width 0.6s ${EASE}` : "none" }}
          />
          {STEPS.map((s, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < step ? styles.dotDone : i === step ? styles.dotActive : styles.dotIdle}`}
              style={{ left: `${12.5 + (i / 3) * 75}%` }}
            />
          ))}
          <div
            className={`${styles.coin} ${step >= 2 ? styles.coinUsdc : styles.coinInr}`}
            style={{
              left: `${pct}%`,
              transition: slide
                ? `left 0.6s ${EASE}, background-color 0.5s ease, box-shadow 0.5s ease`
                : "none",
            }}
          >
            {STEPS[step].val}
          </div>
        </div>

        <div className={styles.nodes}>
          {STEPS.map((s, i) => (
            <div key={i} className={`${styles.node} ${i === step ? styles.nodeActive : ""}`}>
              <span className={styles.nodeIco}>{s.qr ? <QrGlyph /> : s.ico}</span>
              <span className={styles.nodeName}>{s.node}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cards}>
        {STEPS.map((s, i) => (
          <div key={i} className={`${styles.card} ${i === step ? styles.cardActive : ""}`}>
            <div className={styles.cardNum}>{i + 1}</div>
            <div className={styles.cardTitle}>{s.t}</div>
            <div className={styles.cardText}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
