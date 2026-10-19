import React, { useState } from "react";
import artwork from "./ReferenceArtwork.js";

// Reference snapshots from the supplied October 19 recording, not a live feed.
export const RECORDING_TOKENS = [
  { sym: "HOOKR", name: "Hookr.fun", price: .0194, chg: -19.83, mc: "19.3M", net: "Robinhood Chain", tag: "Memes", reference: true, volume: "1.3M", about: "Launchpad with custom Uniswap hook builder. Powered by OpenZaps." },
  { sym: "SPCX", name: "SPCX", price: 149.38, chg: 4.11, mc: "53M", net: "Robinhood Chain", tag: "Blue Chips", reference: true },
  { sym: "CTR", name: "CTR", price: .0144, chg: 10.69, mc: "22M", net: "Robinhood Chain", tag: "Memes", reference: true },
  { sym: "MORPHO", name: "Morpho", price: 2.46, chg: 5.92, mc: "1.7B", net: "Ethereum", tag: "Blue Chips", reference: true },
  { sym: "NEAR", name: "NEAR", price: 4.89, chg: 3.82, mc: "16M", net: "NEAR", tag: "Blue Chips", reference: true },
  { sym: "WEFT", name: "WEFT", price: .00282267, chg: 375.1, mc: "2.7M", net: "Solana", tag: "Memes", reference: true },
  { sym: "HYPE", name: "Hyperliquid", price: 78.32, chg: 1.17, mc: "17B", net: "Hyperliquid", tag: "Blue Chips", reference: true },
  { sym: "PUMP", name: "Pump", price: .00438728, chg: 3.71, mc: "4.4B", net: "Solana", tag: "Memes", reference: true },
  { sym: "POL", name: "Polygon", price: .0915, chg: 1.57, mc: "973M", net: "Polygon", tag: "Blue Chips", reference: true },
];
export const money = n => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n > 0 && n < 1 ? 8 : 2 }).format(n || 0);
export async function copyText(value) {
  try { await navigator.clipboard.writeText(value); return true; } catch { return false; }
}
export async function shareText(text) {
  if (navigator.share) { try { await navigator.share({ text }); return "Shared"; } catch (e) { if (e.name === "AbortError") return ""; } }
  return await copyText(text) ? "Copied" : "Copy unavailable on this device";
}

export function HomeDiscovery({ empty, onDeposit, onMarkets, icons }) {
  const [promo, setPromo] = useState(true);
  if (!empty && !promo) return null;
  return <section className="recording-home">
    {empty && <div className="recording-welcome">
      <img src={artwork.welcome} alt="" />
      <h2>Welcome to Phantom</h2><p>Fund your account to start trading.</p>
      <button className="recording-primary" onClick={onDeposit}>Deposit</button>
    </div>}
    {promo && <div className="recording-promo">
      <button className="recording-dismiss" aria-label="Dismiss hot markets" onClick={() => setPromo(false)}>{icons.x(16)}</button>
      <div><span className="recording-promo-label">HOT MARKETS</span><p>See what’s trending.<br />Find your next trade.</p>
        <button onClick={onMarkets}>Make your move ›</button></div>
      <img src={artwork.fire} alt="" />
    </div>}
  </section>;
}

export function ReferenceProfile({ wallet, total, rows, onOpen, onPhoto, onPatch, Ava, icons, onManage }) {
  const [tab, setTab] = useState("Open");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(wallet.bio || "");
  const [editingFollowers, setEditingFollowers] = useState(false);
  const [followerInput, setFollowerInput] = useState("");
  const [followerError, setFollowerError] = useState("");
  const followers = Number.isSafeInteger(wallet.followers) && wallet.followers >= 0 ? wallet.followers : 0;
  const [status, setStatus] = useState("");
  return <section className="recording-profile">
    <div className="recording-toolbar"><button onClick={onManage}>Manage</button><button aria-label="Share profile" onClick={async () => setStatus(await shareText("@" + wallet.handle))}>{icons.send(19)}</button></div>
    <button aria-label="Change profile picture" onClick={onPhoto}><Ava value={wallet.avatar} size={64} /></button>
    <h2>@{wallet.handle}</h2><div className="recording-muted recording-profile-stats">
      <button type="button" aria-label="Edit follower count" aria-expanded={editingFollowers} onClick={() => { setFollowerInput(String(followers)); setFollowerError(""); setEditingFollowers(true); }}>{followers.toLocaleString("en-US")} Followers <span aria-hidden="true" className="recording-follower-edit">Edit</span></button>
      <span>· {money(wallet.log.reduce((n, x) => n + Math.abs(x.amount || 0), 0))} Vol</span>
    </div>
    {editingFollowers && <form className="recording-detail" onSubmit={e => {
      e.preventDefault();
      const value = followerInput.trim();
      if (!/^\d+$/.test(value) || Number(value) > 999999999) { setFollowerError("Enter a whole number from 0 to 999,999,999."); return; }
      onPatch({ followers: Number(value) }); setEditingFollowers(false); setFollowerError(""); setStatus("Follower count saved.");
    }}>
      <label htmlFor="profile-followers">Follower count</label>
      <input id="profile-followers" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" enterKeyHint="done" autoFocus
        value={followerInput} onChange={e => { setFollowerInput(e.target.value); setFollowerError(""); }}
        aria-invalid={!!followerError} aria-describedby={followerError ? "profile-followers-error" : undefined} />
      {followerError && <p id="profile-followers-error" role="alert" style={{ color: "#ff9999", fontSize: 14 }}>{followerError}</p>}
      <div className="recording-follower-actions"><button type="button" onClick={() => { setEditingFollowers(false); setFollowerError(""); }}>Cancel</button><button className="recording-primary" type="submit">Save followers</button></div>
    </form>}
    {editing ? <form onSubmit={e => { e.preventDefault(); onPatch({ bio: bio.trim() }); setEditing(false); }}><label htmlFor="profile-bio">Bio</label><textarea id="profile-bio" maxLength={160} value={bio} onChange={e => setBio(e.target.value)} /><button className="recording-primary">Save bio</button></form>
      : <button className="recording-link" onClick={() => setEditing(true)}>{wallet.bio || "Add a bio"}</button>}
    <p className="recording-muted recording-note">Local demo profile</p>
    <div className="recording-profile-balance">{money(total)}</div>
    <div className="recording-tabs">{["Open", "Closed"].map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === "Open" ? rows.length ? rows.map(t => <button className="recording-market-row" key={t.sym} onClick={() => onOpen(t)}><span className="recording-grow">{t.name || t.sym}<small>{t.amt} {t.sym}</small></span><span>{money(t.value)}</span></button>) : <p className="recording-empty">No open positions</p>
      : wallet.log.filter(x => x.kind === "Sold").length ? wallet.log.filter(x => x.kind === "Sold").map((x, i) => <div className="recording-market-row" key={i}><span className="recording-grow">{x.detail || "Sold"}</span>{money(Math.abs(x.amount || 0))}</div>) : <p className="recording-empty">No closed positions</p>}
    <p role="status" className="recording-muted">{status}</p>
  </section>;
}

export function ReferenceReferral({ handle, icons }) {
  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("");
  const code = "demo:" + handle;
  return <section className="recording-referral">
    <div className="recording-confetti" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ left: (i * 31 % 100) + "%", top: (i * 27 % 130) + "px", transform: `rotate(${i * 41}deg)`, background: ["#6b5596", "#807732", "#2d5753"][i % 3] }} />)}</div>
    <div className="recording-toolbar"><span>{icons.person(28)}</span><button aria-label="Referral information" onClick={() => setDetail("This referral screen is a local demo. No rewards are earned or paid.")}>{icons.info(20)}</button></div>
    <h2>Earn 25% of your<br />friends’ trading fees</h2><p className="recording-muted">Earn every time they trade — no limit on friends, no limit on earnings. Terms apply.</p>
    <p className="recording-note">Demo preview · rewards are not active</p>
    <h3>Referrals</h3><div className="recording-referral-grid">
      <button onClick={() => setDetail("No earnings yet.")}><strong>$0.00 <span>›</span></strong><small>Total Earned</small></button>
      <button onClick={() => setDetail("No referrals yet.")}><strong>0 <span>›</span></strong><small>Referrals Made</small></button>
    </div><button className="recording-reward" onClick={() => setDetail("No upcoming rewards.")}><span>Upcoming Rewards</span><span>$0.00</span></button>
    {detail && <div className="recording-detail" role="status"><p>{detail}</p><button className="recording-link" onClick={() => setDetail(null)}>Done</button></div>}
    <div className="recording-referral-bottom"><div className="recording-reward"><span className="recording-grow">{code}</span><button aria-label="View referral code" onClick={() => setDetail("Your demo referral code: " + code)}>{icons.qr(20)}</button><button aria-label="Copy referral code" onClick={async () => setStatus(await copyText(code) ? "Referral code copied" : "Copy unavailable")}>{icons.copy(20)}</button></div>
      <button className="recording-primary" onClick={async () => setStatus(await shareText("Try my wallet demo. Referral code: " + code))}>Invite Friends ↗</button><p role="status" className="recording-note">{status}</p>
    </div>
  </section>;
}

export function TokenCommunity({ token, icons, Ava, wallet }) {
  const [panel, setPanel] = useState(null);
  const [draft, setDraft] = useState("");
  const key = "phantom-demo-chat:" + token.sym;
  const [messages, setMessages] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } });
  const [status, setStatus] = useState("");
  const holders = token.sym === "HOOKR" ? [["colinwong7", "2.0M", "$14K", "-$3.8K"], ["ronhtpp", "1.8M", "$11K", "-$5.8K"], ["FiftyH", "1.6M", "$10K", "-$6.8K"]] : [];
  const chat = token.sym === "BTC" ? "Go short then long" : "Diamond hands full send mode";
  return <section className="recording-community">
    <button className="recording-section-title" onClick={() => setPanel(panel === "chat" ? null : "chat")}><h2>Live Chat ›</h2><span className="recording-online">Demo</span></button>
    <button className="recording-chat-preview" onClick={() => setPanel("chat")}><Ava value="g:2" size={25} /><span>{messages.at(-1)?.text || chat}</span></button>
    {panel === "chat" && <div className="recording-detail"><p className="recording-note">Messages are saved on this device only.</p><div className="recording-chat-log">{messages.map((m, i) => <p key={i}><strong>@{m.handle}</strong><br />{m.text}</p>)}</div><form onSubmit={e => { e.preventDefault(); if (!draft.trim()) return; const next = [...messages, { handle: wallet.handle, text: draft.trim() }].slice(-100); try { localStorage.setItem(key, JSON.stringify(next)); setMessages(next); setDraft(""); setStatus(""); } catch { setStatus("Could not save message. Please free up storage and try again."); } }}><input aria-label="Chat message" maxLength={300} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a message" /><button className="recording-primary" disabled={!draft.trim()}>Send</button></form><p role="status">{status}</p><button className="recording-link" onClick={() => setPanel(null)}>Close chat</button></div>}
    <button className="recording-section-title" onClick={() => setPanel(panel === "holders" ? null : "holders")}><h2>Top Holders ›</h2></button>
    {holders.length ? holders.map((h, i) => <button className="recording-market-row" key={h[0]} onClick={() => setPanel(h[0])}><Ava value={"g:" + (i + 1)} size={40} /><span className="recording-grow"><strong>@{h[0]}</strong><small>{h[1]} {token.sym}</small></span><span className="recording-right">{h[2]}<small style={{ color: "#ef164e" }}>{h[3]}</small></span></button>) : <p className="recording-muted">Holder data is unavailable.</p>}
    {(panel === "holders" || holders.some(h => h[0] === panel)) && <div className="recording-detail"><strong>{panel === "holders" ? "Top holders" : "@" + panel}</strong><p className="recording-muted">Snapshot from the reference recording. Live holder profiles are not connected.</p><button className="recording-link" onClick={() => setPanel(null)}>Done</button></div>}
    <button className="recording-section-title" onClick={() => setPanel(panel === "about" ? null : "about")}><h2>About {token.sym} ›</h2></button>
    <p>{token.about || `${token.name || token.sym} · ${token.net || "Network unavailable"}`}</p>
    <div className="recording-tabs recording-about-links"><button onClick={() => setPanel("about")}>Website</button><a href={"https://x.com/search?q=" + encodeURIComponent(token.sym)} target="_blank" rel="noreferrer">X Twitter</a><a href={"https://x.com/search?q=" + encodeURIComponent("$" + token.sym)} target="_blank" rel="noreferrer">Search on X</a></div>
    {panel === "about" && <div className="recording-detail"><p>{token.about || token.name}</p><p className="recording-muted">No verified website has been configured for this token.</p><button className="recording-link" onClick={() => setPanel(null)}>Done</button></div>}
    {[["Security", "Not independently verified"], ["24h Volume", token.volume ? "$" + token.volume : "Unavailable"], ["Market cap", "$" + (token.mc || "—")], ["Network", token.net || "Unavailable"]].map(([label, value]) => <div className="recording-fact" key={label}><span>{label}</span><span>{value}</span></div>)}
  </section>;
}
