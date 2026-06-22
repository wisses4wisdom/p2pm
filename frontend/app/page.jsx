"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { LiveConvert } from "../components/LiveConvert";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { CurrencyCycle } from "../components/CurrencyCycle";
import { LanguageProvider, useI18n, LANGS } from "../lib/i18n";
import styles from "./landing.module.css";

export default function Page() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}

function LangDropdown() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className={styles.langWrap}>
      <button className={styles.langBtn} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        🌐 {current.short} <span className={styles.langCaret}>▾</span>
      </button>
      {open && (
        <>
          <div className={styles.langBackdrop} onClick={() => setOpen(false)} />
          <div className={styles.langMenu} role="listbox">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`${styles.langItem} ${l.code === lang ? styles.langItemActive : ""}`}
                onClick={() => { setLang(l.code); setOpen(false); }}
                role="option"
                aria-selected={l.code === lang}
              >
                {l.label} <span className={styles.langShort}>{l.short}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Landing() {
  const router = useRouter();
  const { t } = useI18n();
  const { ready, authenticated, login } = usePrivy();
  const [openFaq, setOpenFaq] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const ctaLabel = authenticated ? t.cta.dashboard : t.cta.login;

  // Once signed in, drop the merchant straight into their terminal.
  useEffect(() => {
    if (ready && authenticated) router.replace("/dashboard");
  }, [ready, authenticated, router]);

  // One login: open Privy's modal. On success Privy authenticates and the
  // effect above redirects into the app.
  function openApp() {
    if (authenticated) {
      router.push("/dashboard");
      return;
    }
    if (ready) login();
  }

  return (
    <div className={styles.page}>
      {/* background */}
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blob1}`} />
        <span className={`${styles.blob} ${styles.blob2}`} />
        <span className={`${styles.blob} ${styles.blob3}`} />
      </div>

      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navBrand}>
            <span className={styles.navMark}>◆</span> P2PM
          </Link>
          <div className={styles.navLinks}>
            <a href="#features">{t.nav.features}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#faq">{t.nav.faq}</a>
          </div>
          <div className={styles.navRight}>
            <LangDropdown />
            <button
              className={styles.navBurger}
              onClick={() => setNavOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={navOpen}
            >
              {navOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className={styles.navMobile}>
            <a href="#features" onClick={() => setNavOpen(false)}>{t.nav.features}</a>
            <a href="#how" onClick={() => setNavOpen(false)}>{t.nav.how}</a>
            <a href="#faq" onClick={() => setNavOpen(false)}>{t.nav.faq}</a>
            <button className={styles.btnPrimary} onClick={() => { setNavOpen(false); openApp(); }}>
              {ctaLabel} →
            </button>
          </div>
        )}
      </nav>

      <div className={styles.container}>
        {/* ── Hero ── */}
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.heroKicker}>{t.hero.badge}</span>
            <h1 className={styles.heroTitle}>
              {t.hero.accept} <CurrencyCycle /> {t.hero.atAnyQr}<br />
              {t.hero.keep} <span className={styles.grad}>USDC</span> {t.hero.onBase}
            </h1>
            <p className={styles.heroSub}>{t.hero.sub}</p>
            <div className={styles.heroCtas}>
              <button className={`${styles.btnPrimary} ${styles.lg}`} onClick={openApp} disabled={!ready}>
                {ctaLabel} →
              </button>
              <a href="#how" className={styles.btnGhost}>{t.hero.seeHow}</a>
            </div>
            <div className={styles.heroTrust}>
              <span>🔒 {t.hero.tNonCustodial}</span>
              <span>⚡ {t.hero.tGasFree}</span>
              <span>⛓ {t.hero.tSettles}</span>
              <span>🛡 {t.hero.tZkkyc}</span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <span className={`${styles.chip} ${styles.chipA}`}>✓ {t.hero.tGasFree}</span>
            <span className={`${styles.chip} ${styles.chipB}`}>↑ {t.band.usdcOut}</span>
            <LiveConvert />
          </div>
        </header>

        {/* trust band */}
        <div className={styles.trustband}>
          <span className={styles.tchip}>{t.band.countries}</span>
          <span className={styles.tchip}>↘ {t.band.qrIn}</span>
          <span className={styles.tchip}>↗ {t.band.usdcOut}</span>
          <span className={styles.tchip}>⛓ {t.band.base}</span>
          <span className={styles.tchip}>⚡ {t.band.protocol}</span>
        </div>

        {/* ── Features ── */}
        <section className={styles.section} id="features">
          <div className={styles.sectionHead}>
            <div className={styles.sKicker}>{t.features.kicker}</div>
            <h2 className={styles.sTitle}>{t.features.title}</h2>
            <p className={styles.sSub}>{t.features.sub}</p>
          </div>
          <Features />
        </section>

        {/* ── How it works ── */}
        <section className={styles.section} id="how">
          <div className={styles.sectionHead}>
            <div className={styles.sKicker}>{t.how.kicker}</div>
            <h2 className={styles.sTitle}>{t.how.title}</h2>
            <p className={styles.sSub}>{t.how.sub}</p>
          </div>
          <HowItWorks />
        </section>

        {/* ── FAQ ── */}
        <section className={styles.section} id="faq">
          <div className={styles.sectionHead}>
            <div className={styles.sKicker}>{t.faq.kicker}</div>
            <h2 className={styles.sTitle}>{t.faq.title}</h2>
          </div>
          <div className={styles.faq}>
            {t.faq.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <div className={`${styles.faqItem} ${open ? styles.open : ""}`} key={i}>
                  <button
                    className={styles.faqQ}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    {item.q}
                    <span className={styles.faqIco}>+</span>
                  </button>
                  <div className={styles.faqA}>
                    <div className={styles.faqAInner}>{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footGrid}>
            <div>
              <div className={styles.footBrand}>
                <span className={styles.navMark}>◆</span> P2PM
              </div>
              <p className={styles.footTag}>{t.footer.tag}</p>
            </div>
            <div className={styles.footCol}>
              <div className={styles.footColTitle}>{t.footer.product}</div>
              <button onClick={openApp}>{ctaLabel}</button>
              <a href="#how">{t.footer.howItWorks}</a>
              <a href="#faq">{t.footer.faq}</a>
            </div>
            <div className={styles.footCol}>
              <div className={styles.footColTitle}>{t.footer.protocol}</div>
              <a href="https://www.p2p.lol/en" target="_blank" rel="noopener noreferrer">p2p.me</a>
              <a href="https://www.p2p.lol/en" target="_blank" rel="noopener noreferrer">{t.footer.whitepaper}</a>
              <a href="https://www.p2p.lol/en" target="_blank" rel="noopener noreferrer">{t.footer.lp}</a>
            </div>
            <div className={styles.footCol}>
              <div className={styles.footColTitle}>{t.footer.legal}</div>
              <a href="mailto:compliance@p2p.me">compliance@p2p.me</a>
              <span>{t.footer.terms}</span>
              <span>{t.footer.privacy}</span>
            </div>
          </div>
          <div className={styles.footBottom}>
            <span>{t.footer.bottomLeft}</span>
            <span>⛓ {t.footer.bottomRight}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
