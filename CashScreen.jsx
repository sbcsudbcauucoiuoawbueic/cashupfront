import React, { useEffect, useRef, useState } from "react";

function CashIcon({ type }) {
  if (type === "receive") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 3.5a3 3.5 0 1 0 0 7 3 3.5 0 1 0 0-7ZM6 8a1 1 0 1 0-2 0 1 1 0 1 0 2 0Zm14 0a1 1 0 1 0-2 0 1 1 0 1 0 2 0ZM6 16a1 1 0 1 0-2 0 1 1 0 1 0 2 0Zm14 0a1 1 0 1 0-2 0 1 1 0 1 0 2 0Z" /></svg>;
  if (type === "buy") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 4h14a3 3 0 0 1 3 3v2H2V7a3 3 0 0 1 3-3Zm-3 8h20v5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3Zm4 3v2h5v-2Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="15" cy="7" r="4" fill="currentColor"/><path d="M8 3a4 4 0 0 0 0 8M3 15l4-3h5a2 2 0 0 1 0 4H9m3 0 6-2a2 2 0 0 1 2 3l-7 4H3Z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function CashScreen({ balance, width = 440, onClose, onBuy, onBank, onHistory }) {
  const [menu, setMenu] = useState(false);
  const [receive, setReceive] = useState(false);
  const [coin, setCoin] = useState("USDC");
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const dialog = useRef(null);
  useEffect(() => {
    const oldFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = overflow; oldFocus?.focus?.({ preventScroll: true }); };
  }, []);
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(balance || 0);
  return <div className="cash-screen anim-sheet" role="dialog" aria-modal="true" aria-label="Cash" tabIndex={-1} ref={dialog}
    onKeyDown={e => {
      if (e.key === "Escape") { e.stopPropagation(); if (receive) setReceive(false); else if (menu) setMenu(false); else onClose(); }
      if (e.key === "Tab") {
        const items = [...dialog.current.querySelectorAll('button:not([disabled]),[href],input')];
        const first = items[0], last = items.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }}>
    <div className="cash-screen-inner" style={{ maxWidth: width, transform: drag ? `translateY(${drag}px)` : undefined }}>
      <button type="button" className="cash-grabber" aria-label="Close Cash" onClick={onClose}
        onPointerDown={e => { start.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (start.current !== null) setDrag(Math.max(0, e.clientY - start.current)); }}
        onPointerUp={() => { if (drag > 90) onClose(); start.current = null; setDrag(0); }}
        onPointerCancel={() => { start.current = null; setDrag(0); }}><span /></button>
      <div className="cash-toolbar"><button type="button" className="cash-more" aria-label="Cash options" aria-expanded={menu} onClick={() => setMenu(!menu)}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="20" cy="12" r="1.7"/></g></svg></button>
        {menu && <div className="cash-menu"><button onClick={onHistory}>Cash activity</button><button onClick={onClose}>Close</button></div>}
      </div>
      <div className="cash-balance-header"><div><h1>Cash</h1><p>{currency}</p></div>
        <div className="cash-visa-art" role="img" aria-label="Pastel cash card illustration">
          <svg className="cash-card-ghost" viewBox="0 0 32 28" aria-hidden="true"><path d="M4 22C2 17 8 5 18 4c8-1 12 6 9 12-2 4-6 4-8 1-3 5-6 7-8 4-4 5-7 5-7 1Z" fill="#79769f"/><ellipse cx="19" cy="10" rx="1.1" ry="1.8" fill="#eee"/><ellipse cx="23" cy="10" rx="1.1" ry="1.8" fill="#eee"/></svg>
          <span><small>DEBIT</small><strong>VISA</strong></span>
        </div>
      </div>
      <section className="cash-add"><h2>Add Cash</h2>
        {[["receive", "Receive Stablecoins", "Transfer from another wallet", () => setReceive(true)],
          ["buy", "Buy Instantly", "Use a card, Apple Pay, or ACH", onBuy],
          ["bank", "Bank Transfer", "Transfer from your bank account", onBank]].map(([type, label, subtitle, action]) =>
          <button key={type} type="button" className="cash-add-row" onClick={action}><span className="cash-action-icon"><CashIcon type={type} /></span><span><strong>{label}</strong><small>{subtitle}</small></span></button>)}
      </section>
      {receive && <section className="cash-receive" aria-label="Receive stablecoins"><div className="cash-receive-title"><h2>Receive Stablecoins</h2><button onClick={() => setReceive(false)} aria-label="Close receive stablecoins">×</button></div>
        <div className="recording-tabs">{["USDC", "USDT"].map(value => <button key={value} aria-pressed={coin === value} onClick={() => setCoin(value)}>{value}</button>)}</div>
        <p>{coin} on Solana</p><p className="recording-muted">This demo is not connected to a receiving wallet. No deposit address is available.</p>
        <button className="recording-primary" onClick={() => setReceive(false)}>Done</button>
      </section>}
    </div>
  </div>;
}
