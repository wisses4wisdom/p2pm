"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../lib/i18n";
import styles from "./Features.module.css";

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const ShieldCheck = () => (<svg viewBox="0 0 24 24" width="22" height="22" {...s}><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>);
const Bolt = () => (<svg viewBox="0 0 24 24" width="22" height="22" {...s}><path d="M13 3 5 13h5l-1 8 8-10h-5l1-8z" /></svg>);
const Key = () => (<svg viewBox="0 0 24 24" width="22" height="22" {...s}><circle cx="7.5" cy="15.5" r="4.5" /><path d="M10.7 12.3 20 3" /><path d="m15 8 3 3" /><path d="m17 6 2 2" /></svg>);
const Check = () => (<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);

const ICONS = [<ShieldCheck key="s" />, <Bolt key="b" />, <Key key="k" />];

export function Features() {
  const t = useT();
  const FEATURES = t.features.items.map((it, i) => ({ ...it, icon: ICONS[i] }));
  const ref = useRef(null);
  const [inview, setInview] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = (e) => setReduce(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  // Reveal when the section scrolls into view (once).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setInview(true); io.disconnect(); } }),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-cycle the spotlight, paused on hover / reduced-motion.
  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % FEATURES.length), 3000);
    return () => clearInterval(t);
  }, [reduce, paused]);

  const show = inview || reduce;

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={ref} className={`${styles.grid} ${show ? styles.inview : ""}`}>
        {FEATURES.map((f, i) => (
          <div key={f.title} className={styles.reveal} style={{ transitionDelay: show ? `${i * 110}ms` : "0ms" }}>
            <article
              className={`${styles.card} ${i === active ? styles.active : ""}`}
              onMouseEnter={() => setActive(i)}
            >
              <span className={styles.icon}>{f.icon}</span>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.text}>{f.text}</p>
              <span className={styles.tag}><span className={styles.tagCheck}><Check /></span> {f.tag}</span>
            </article>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Highlight: ${f.title}`}
          />
        ))}
      </div>
    </div>
  );
}
