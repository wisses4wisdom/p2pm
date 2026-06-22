"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Languages for the markets we serve (+ English as the international default).
export const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "pt", label: "Português", short: "PT" },
  { code: "es", label: "Español", short: "ES" },
];

const en = {
  nav: { features: "Features", how: "How it works", faq: "FAQ" },
  hero: {
    badge: "Built on the p2p.me protocol",
    accept: "Accept", atAnyQr: "at any QR.", keep: "Keep", onBase: "on Base.",
    sub: "P2PM is the merchant terminal for p2p.me — take QR payments from any customer and settle instantly in USDC, with no bank-freeze worries and zero crypto know-how required.",
    seeHow: "See how it works",
    tNonCustodial: "Non-custodial", tGasFree: "Gas-free", tSettles: "Settles on Base", tZkkyc: "zk-KYC",
  },
  band: { qrIn: "QR in", usdcOut: "USDC out", base: "Base", protocol: "p2p.me protocol", countries: "🌎 India · Brazil · Argentina" },
  login: {
    title: "Log in or sign up", sub: "Sign in to your P2PM merchant terminal",
    emailPlaceholder: "your@email.com", wallet: "Continue with a wallet", secured: "Secured by",
    codeSentTo: "Enter the 6-digit code sent to", useDifferent: "Use a different email",
    errEmail: "Enter a valid email address.", errSend: "Couldn’t send the code. Please try again.",
    errCodeShort: "Enter the 6-digit code from your email.", errCode: "That code was invalid or expired.",
  },
  features: {
    kicker: "Why P2PM", title: "Built for merchants, secured by the protocol",
    sub: "The same protocol powering p2p.me swaps worldwide — packaged as a dead-simple terminal for your shop.",
    items: [
      { title: "Private & fraud-proof", text: "Settlement runs through zk-KYC–verified peers, so your details are never shared. The protocol keeps fraud under 1 in 25,000.", tag: "zk-KYC verified" },
      { title: "Blazing fast & gas-free", text: "Payments settle near-instantly on Base. Gas is sponsored — you never hold ETH, sign popups, or pay network fees.", tag: "0 ETH fees" },
      { title: "Decentralized & self-custody", text: "An open protocol — no central party can freeze or censor your money. Funds sit in a wallet only you control.", tag: "Your keys" },
    ],
  },
  how: {
    kicker: "How it works", title: "From local cash to USDC in four taps",
    sub: "No card reader, no app for your customer, no crypto setup.",
    liveDemo: "Live demo", oneSale: "one sale",
    items: [
      { node: "Terminal", t: "Enter the amount", d: "Tap the amount on the number-pad terminal — no hardware needed." },
      { node: "QR scan", t: "Customer scans & pays", d: "They pay with any QR app. Nothing to install on their side." },
      { node: "On Base", t: "Settles in USDC", d: "The payment locks on Base in seconds — verifiable on Basescan." },
      { node: "Payout", t: "Cash out", d: "Withdraw to your bank in local currency, or keep it as USDC." },
    ],
  },
  faq: {
    kicker: "FAQ", title: "Questions, answered",
    items: [
      { q: "What is P2PM?", a: "P2PM is the merchant terminal for the p2p.me protocol. It lets any shop accept local QR payments and settle them instantly in USDC on Base — no card machine, no crypto experience required." },
      { q: "How do I get paid?", a: "Your choice. Once a sale settles you can withdraw to your bank in local currency, or send it as USDC to your own wallet." },
      { q: "Do I need crypto knowledge or a wallet?", a: "No. You sign in with your email and we automatically create a gas-sponsored smart wallet for you. No seed phrases, no extensions, and you never need to hold ETH." },
      { q: "Is my money safe from bank freezes?", a: "Your settled funds live on-chain as USDC in a self-custody wallet only you control. No central party can freeze or claw them back." },
      { q: "Do I need KYC?", a: "The protocol uses zero-knowledge KYC (zk-KYC). Your identity is verified without your personal details being exposed or shared." },
      { q: "Are there any limits?", a: "For safety there’s a per-transaction cap and a daily transaction count that reset each day. They can rise as your account builds history." },
    ],
  },
  footer: {
    tag: "The merchant terminal for the p2p.me protocol. Scaling trust, one order at a time.",
    product: "Product", protocol: "Protocol", legal: "Legal", howItWorks: "How it works", faq: "FAQ",
    whitepaper: "Whitepaper", lp: "Become an LP", terms: "Terms", privacy: "Privacy",
    bottomLeft: "© 2026 P2PM · Built on p2p.me", bottomRight: "Running on Base Sepolia (testnet)",
  },
  cta: { login: "Log in", dashboard: "Go to Dashboard" },
};

const hi = {
  nav: { features: "विशेषताएँ", how: "यह कैसे काम करता है", faq: "सामान्य प्रश्न" },
  hero: {
    badge: "p2p.me प्रोटोकॉल पर निर्मित",
    accept: "स्वीकारें", atAnyQr: "किसी भी QR पर.", keep: "रखें", onBase: "Base पर.",
    sub: "P2PM, p2p.me के लिए मर्चेंट टर्मिनल है — किसी भी ग्राहक से QR भुगतान लें और तुरंत USDC में सेटल करें, बिना बैंक-फ़्रीज़ की चिंता और बिना किसी क्रिप्टो जानकारी के.",
    seeHow: "देखें यह कैसे काम करता है",
    tNonCustodial: "नॉन-कस्टोडियल", tGasFree: "गैस-मुक्त", tSettles: "Base पर सेटल", tZkkyc: "zk-KYC",
  },
  band: { qrIn: "QR इन", usdcOut: "USDC आउट", base: "Base", protocol: "p2p.me प्रोटोकॉल", countries: "🌎 भारत · ब्राज़ील · अर्जेंटीना" },
  login: {
    title: "लॉग इन या साइन अप", sub: "अपने P2PM मर्चेंट टर्मिनल में साइन इन करें",
    emailPlaceholder: "your@email.com", wallet: "वॉलेट से जारी रखें", secured: "सुरक्षित द्वारा",
    codeSentTo: "इस ईमेल पर भेजा गया 6-अंकों का कोड दर्ज करें", useDifferent: "दूसरा ईमेल उपयोग करें",
    errEmail: "एक मान्य ईमेल पता दर्ज करें.", errSend: "कोड नहीं भेजा जा सका. कृपया पुनः प्रयास करें.",
    errCodeShort: "अपने ईमेल से 6-अंकों का कोड दर्ज करें.", errCode: "वह कोड अमान्य या समाप्त हो गया था.",
  },
  features: {
    kicker: "P2PM क्यों", title: "मर्चेंट्स के लिए बना, प्रोटोकॉल द्वारा सुरक्षित",
    sub: "वही प्रोटोकॉल जो दुनिया भर में p2p.me स्वैप चलाता है — आपकी दुकान के लिए एक बेहद सरल टर्मिनल के रूप में.",
    items: [
      { title: "निजी और धोखाधड़ी-रोधी", text: "सेटलमेंट zk-KYC–सत्यापित पीयर्स के ज़रिए होता है, इसलिए आपकी जानकारी कभी साझा नहीं होती. प्रोटोकॉल धोखाधड़ी को 25,000 में 1 से कम रखता है.", tag: "zk-KYC सत्यापित" },
      { title: "बेहद तेज़ और गैस-मुक्त", text: "भुगतान Base पर लगभग तुरंत सेटल होते हैं. गैस प्रायोजित है — आपको कभी ETH रखने, पॉपअप साइन करने या नेटवर्क शुल्क देने की ज़रूरत नहीं.", tag: "0 ETH शुल्क" },
      { title: "विकेन्द्रीकृत और स्व-अभिरक्षा", text: "एक ओपन प्रोटोकॉल — कोई केंद्रीय पक्ष आपके पैसे को फ़्रीज़ या सेंसर नहीं कर सकता. फंड केवल आपके नियंत्रण वाले वॉलेट में रहते हैं.", tag: "आपकी चाबियाँ" },
    ],
  },
  how: {
    kicker: "यह कैसे काम करता है", title: "स्थानीय नकदी से USDC तक, चार टैप में",
    sub: "कोई कार्ड रीडर नहीं, ग्राहक के लिए कोई ऐप नहीं, कोई क्रिप्टो सेटअप नहीं.",
    liveDemo: "लाइव डेमो", oneSale: "एक बिक्री",
    items: [
      { node: "टर्मिनल", t: "राशि दर्ज करें", d: "नंबर-पैड टर्मिनल पर राशि टैप करें — किसी हार्डवेयर की ज़रूरत नहीं." },
      { node: "QR स्कैन", t: "ग्राहक स्कैन कर भुगतान करे", d: "वे किसी भी QR ऐप से भुगतान करते हैं. उनकी ओर से कुछ इंस्टॉल नहीं करना." },
      { node: "Base पर", t: "USDC में सेटल", d: "भुगतान सेकंडों में Base पर लॉक हो जाता है — Basescan पर सत्यापित." },
      { node: "भुगतान", t: "कैश आउट", d: "स्थानीय मुद्रा में अपने बैंक में निकालें, या USDC के रूप में रखें." },
    ],
  },
  faq: {
    kicker: "सामान्य प्रश्न", title: "प्रश्नों के उत्तर",
    items: [
      { q: "P2PM क्या है?", a: "P2PM, p2p.me प्रोटोकॉल के लिए मर्चेंट टर्मिनल है. यह किसी भी दुकान को स्थानीय QR भुगतान स्वीकार करने और उन्हें तुरंत Base पर USDC में सेटल करने देता है — कोई कार्ड मशीन नहीं, कोई क्रिप्टो अनुभव नहीं चाहिए." },
      { q: "मुझे भुगतान कैसे मिलता है?", a: "आपकी पसंद. बिक्री सेटल होने पर आप स्थानीय मुद्रा में अपने बैंक में निकाल सकते हैं, या इसे USDC के रूप में अपने वॉलेट में भेज सकते हैं." },
      { q: "क्या मुझे क्रिप्टो जानकारी या वॉलेट चाहिए?", a: "नहीं. आप अपने ईमेल से साइन इन करते हैं और हम स्वचालित रूप से आपके लिए एक गैस-प्रायोजित स्मार्ट वॉलेट बनाते हैं. कोई सीड फ़्रेज़ नहीं, कोई एक्सटेंशन नहीं, और आपको कभी ETH रखने की ज़रूरत नहीं." },
      { q: "क्या मेरा पैसा बैंक फ़्रीज़ से सुरक्षित है?", a: "आपके सेटल फंड ऑन-चेन USDC के रूप में केवल आपके नियंत्रण वाले स्व-अभिरक्षा वॉलेट में रहते हैं. कोई केंद्रीय पक्ष उन्हें फ़्रीज़ या वापस नहीं ले सकता." },
      { q: "क्या मुझे KYC चाहिए?", a: "प्रोटोकॉल ज़ीरो-नॉलेज KYC (zk-KYC) उपयोग करता है. आपकी पहचान सत्यापित होती है बिना आपकी निजी जानकारी उजागर या साझा किए." },
      { q: "क्या कोई सीमाएँ हैं?", a: "सुरक्षा के लिए प्रति-लेनदेन सीमा और दैनिक लेनदेन संख्या है जो हर दिन रीसेट होती है. जैसे-जैसे आपका खाता इतिहास बनाता है, ये बढ़ सकती हैं." },
    ],
  },
  footer: {
    tag: "p2p.me प्रोटोकॉल के लिए मर्चेंट टर्मिनल. भरोसा बढ़ाते हुए, एक ऑर्डर एक बार में.",
    product: "उत्पाद", protocol: "प्रोटोकॉल", legal: "कानूनी", howItWorks: "यह कैसे काम करता है", faq: "सामान्य प्रश्न",
    whitepaper: "व्हाइटपेपर", lp: "LP बनें", terms: "शर्तें", privacy: "गोपनीयता",
    bottomLeft: "© 2026 P2PM · p2p.me पर निर्मित", bottomRight: "Base Sepolia (टेस्टनेट) पर चल रहा है",
  },
  cta: { login: "लॉग इन", dashboard: "डैशबोर्ड पर जाएँ" },
};

const pt = {
  nav: { features: "Recursos", how: "Como funciona", faq: "Perguntas" },
  hero: {
    badge: "Construído no protocolo p2p.me",
    accept: "Aceite", atAnyQr: "em qualquer QR.", keep: "Receba", onBase: "na Base.",
    sub: "O P2PM é o terminal de lojista do p2p.me — receba pagamentos por QR de qualquer cliente e liquide instantaneamente em USDC, sem medo de bloqueio bancário e sem precisar saber nada de cripto.",
    seeHow: "Ver como funciona",
    tNonCustodial: "Sem custódia", tGasFree: "Sem gás", tSettles: "Liquida na Base", tZkkyc: "zk-KYC",
  },
  band: { qrIn: "QR entra", usdcOut: "USDC sai", base: "Base", protocol: "protocolo p2p.me", countries: "🌎 Índia · Brasil · Argentina" },
  login: {
    title: "Entrar ou criar conta", sub: "Acesse seu terminal de lojista P2PM",
    emailPlaceholder: "voce@email.com", wallet: "Continuar com uma carteira", secured: "Protegido por",
    codeSentTo: "Digite o código de 6 dígitos enviado para", useDifferent: "Usar outro e-mail",
    errEmail: "Digite um e-mail válido.", errSend: "Não foi possível enviar o código. Tente novamente.",
    errCodeShort: "Digite o código de 6 dígitos do seu e-mail.", errCode: "Esse código é inválido ou expirou.",
  },
  features: {
    kicker: "Por que P2PM", title: "Feito para lojistas, protegido pelo protocolo",
    sub: "O mesmo protocolo que move os swaps do p2p.me no mundo todo — em um terminal simples para a sua loja.",
    items: [
      { title: "Privado e à prova de fraude", text: "A liquidação passa por pares verificados com zk-KYC, então seus dados nunca são compartilhados. O protocolo mantém a fraude abaixo de 1 em 25.000.", tag: "Verificado por zk-KYC" },
      { title: "Ultrarrápido e sem gás", text: "Os pagamentos liquidam quase instantaneamente na Base. O gás é patrocinado — você nunca guarda ETH, assina pop-ups ou paga taxas de rede.", tag: "0 de taxa ETH" },
      { title: "Descentralizado e autocustódia", text: "Um protocolo aberto — nenhuma entidade central pode bloquear ou censurar seu dinheiro. Os fundos ficam em uma carteira só sua.", tag: "Suas chaves" },
    ],
  },
  how: {
    kicker: "Como funciona", title: "Do dinheiro local ao USDC em quatro toques",
    sub: "Sem maquininha, sem app para o cliente, sem configuração cripto.",
    liveDemo: "Demo ao vivo", oneSale: "uma venda",
    items: [
      { node: "Terminal", t: "Digite o valor", d: "Toque no valor no terminal de teclado numérico — sem hardware." },
      { node: "Leitura QR", t: "Cliente escaneia e paga", d: "Ele paga com qualquer app de QR. Nada para instalar do lado dele." },
      { node: "Na Base", t: "Liquida em USDC", d: "O pagamento trava na Base em segundos — verificável no Basescan." },
      { node: "Saque", t: "Saque", d: "Saque para seu banco em moeda local, ou mantenha em USDC." },
    ],
  },
  faq: {
    kicker: "Perguntas", title: "Perguntas respondidas",
    items: [
      { q: "O que é o P2PM?", a: "O P2PM é o terminal de lojista do protocolo p2p.me. Ele permite que qualquer loja aceite pagamentos por QR locais e os liquide instantaneamente em USDC na Base — sem maquininha, sem experiência com cripto." },
      { q: "Como eu recebo?", a: "Você escolhe. Quando a venda liquida, você pode sacar para seu banco em moeda local ou enviar como USDC para sua carteira." },
      { q: "Preciso saber de cripto ou ter carteira?", a: "Não. Você entra com seu e-mail e criamos automaticamente uma carteira inteligente com gás patrocinado. Sem frases-semente, sem extensões e você nunca precisa guardar ETH." },
      { q: "Meu dinheiro está seguro contra bloqueios bancários?", a: "Seus fundos liquidados ficam on-chain como USDC em uma carteira de autocustódia só sua. Nenhuma entidade central pode bloqueá-los ou reavê-los." },
      { q: "Preciso de KYC?", a: "O protocolo usa KYC de conhecimento zero (zk-KYC). Sua identidade é verificada sem expor ou compartilhar seus dados pessoais." },
      { q: "Existem limites?", a: "Por segurança há um limite por transação e uma contagem diária que reiniciam todo dia. Eles podem aumentar conforme sua conta cria histórico." },
    ],
  },
  footer: {
    tag: "O terminal de lojista do protocolo p2p.me. Ampliando a confiança, um pedido por vez.",
    product: "Produto", protocol: "Protocolo", legal: "Jurídico", howItWorks: "Como funciona", faq: "Perguntas",
    whitepaper: "Whitepaper", lp: "Seja um LP", terms: "Termos", privacy: "Privacidade",
    bottomLeft: "© 2026 P2PM · Construído no p2p.me", bottomRight: "Rodando na Base Sepolia (testnet)",
  },
  cta: { login: "Entrar", dashboard: "Ir ao painel" },
};

const es = {
  nav: { features: "Funciones", how: "Cómo funciona", faq: "Preguntas" },
  hero: {
    badge: "Construido sobre el protocolo p2p.me",
    accept: "Acepta", atAnyQr: "en cualquier QR.", keep: "Recibe", onBase: "en Base.",
    sub: "P2PM es el terminal de comercios de p2p.me — recibe pagos por QR de cualquier cliente y liquida al instante en USDC, sin miedo a bloqueos bancarios y sin saber nada de cripto.",
    seeHow: "Ver cómo funciona",
    tNonCustodial: "Sin custodia", tGasFree: "Sin gas", tSettles: "Liquida en Base", tZkkyc: "zk-KYC",
  },
  band: { qrIn: "QR entra", usdcOut: "USDC sale", base: "Base", protocol: "protocolo p2p.me", countries: "🌎 India · Brasil · Argentina" },
  login: {
    title: "Inicia sesión o regístrate", sub: "Accede a tu terminal de comercio P2PM",
    emailPlaceholder: "tu@email.com", wallet: "Continuar con una billetera", secured: "Protegido por",
    codeSentTo: "Ingresa el código de 6 dígitos enviado a", useDifferent: "Usar otro correo",
    errEmail: "Ingresa un correo válido.", errSend: "No se pudo enviar el código. Inténtalo de nuevo.",
    errCodeShort: "Ingresa el código de 6 dígitos de tu correo.", errCode: "Ese código no es válido o expiró.",
  },
  features: {
    kicker: "Por qué P2PM", title: "Hecho para comercios, protegido por el protocolo",
    sub: "El mismo protocolo que impulsa los swaps de p2p.me en todo el mundo — en un terminal sencillísimo para tu tienda.",
    items: [
      { title: "Privado y a prueba de fraude", text: "La liquidación pasa por pares verificados con zk-KYC, así tus datos nunca se comparten. El protocolo mantiene el fraude por debajo de 1 en 25.000.", tag: "Verificado con zk-KYC" },
      { title: "Velocísimo y sin gas", text: "Los pagos liquidan casi al instante en Base. El gas está patrocinado — nunca tienes ETH, firmas pop-ups ni pagas comisiones de red.", tag: "0 de comisión ETH" },
      { title: "Descentralizado y autocustodia", text: "Un protocolo abierto — ninguna entidad central puede congelar ni censurar tu dinero. Los fondos están en una billetera solo tuya.", tag: "Tus llaves" },
    ],
  },
  how: {
    kicker: "Cómo funciona", title: "Del efectivo local a USDC en cuatro toques",
    sub: "Sin lector de tarjetas, sin app para tu cliente, sin configuración cripto.",
    liveDemo: "Demo en vivo", oneSale: "una venta",
    items: [
      { node: "Terminal", t: "Ingresa el monto", d: "Toca el monto en el terminal de teclado numérico — sin hardware." },
      { node: "Escaneo QR", t: "El cliente escanea y paga", d: "Paga con cualquier app de QR. Nada que instalar de su lado." },
      { node: "En Base", t: "Liquida en USDC", d: "El pago se bloquea en Base en segundos — verificable en Basescan." },
      { node: "Retiro", t: "Retira", d: "Retira a tu banco en moneda local, o mantenlo en USDC." },
    ],
  },
  faq: {
    kicker: "Preguntas", title: "Preguntas respondidas",
    items: [
      { q: "¿Qué es P2PM?", a: "P2PM es el terminal de comercios del protocolo p2p.me. Permite que cualquier tienda acepte pagos por QR locales y los liquide al instante en USDC en Base — sin terminal de tarjetas, sin experiencia en cripto." },
      { q: "¿Cómo cobro?", a: "Tú eliges. Cuando la venta liquida, puedes retirar a tu banco en moneda local o enviarlo como USDC a tu billetera." },
      { q: "¿Necesito saber de cripto o tener billetera?", a: "No. Inicias sesión con tu correo y creamos automáticamente una billetera inteligente con gas patrocinado. Sin frases semilla, sin extensiones, y nunca necesitas tener ETH." },
      { q: "¿Mi dinero está a salvo de bloqueos bancarios?", a: "Tus fondos liquidados viven on-chain como USDC en una billetera de autocustodia solo tuya. Ninguna entidad central puede congelarlos ni revertirlos." },
      { q: "¿Necesito KYC?", a: "El protocolo usa KYC de conocimiento cero (zk-KYC). Tu identidad se verifica sin exponer ni compartir tus datos personales." },
      { q: "¿Hay límites?", a: "Por seguridad hay un límite por transacción y un conteo diario que se reinician cada día. Pueden aumentar a medida que tu cuenta genera historial." },
    ],
  },
  footer: {
    tag: "El terminal de comercios del protocolo p2p.me. Escalando la confianza, un pedido a la vez.",
    product: "Producto", protocol: "Protocolo", legal: "Legal", howItWorks: "Cómo funciona", faq: "Preguntas",
    whitepaper: "Whitepaper", lp: "Sé un LP", terms: "Términos", privacy: "Privacidad",
    bottomLeft: "© 2026 P2PM · Construido sobre p2p.me", bottomRight: "Funcionando en Base Sepolia (testnet)",
  },
  cta: { login: "Iniciar sesión", dashboard: "Ir al panel" },
};

const DICT = { en, hi, pt, es };

const Ctx = createContext({ lang: "en", setLang: () => {}, t: en });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Restore the saved choice after mount (SSR-safe; brief flash to saved lang).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("p2pm_lang");
      if (saved && DICT[saved]) setLang(saved);
    } catch {}
  }, []);

  function change(l) {
    if (!DICT[l]) return;
    setLang(l);
    try { localStorage.setItem("p2pm_lang", l); } catch {}
  }

  return <Ctx.Provider value={{ lang, setLang: change, t: DICT[lang] || en }}>{children}</Ctx.Provider>;
}

export function useI18n() { return useContext(Ctx); }
export function useT() { return useContext(Ctx).t; }
