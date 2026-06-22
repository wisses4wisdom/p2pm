"use client";

import { useEffect, useState } from "react";
import styles from "./CurrencyCycle.module.css";

// India · Brazil · Argentina — the markets we serve.
const SYMBOLS = ["₹", "R$", "$"];

export function CurrencyCycle() {
  const [i, setI] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = (e) => setReduce(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % SYMBOLS.length), 1900);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <span className={styles.wrap} aria-label="local currency">
      <span key={i} className={styles.sym}>{SYMBOLS[i]}</span>
    </span>
  );
}
