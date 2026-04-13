// ============================================================
// PROJECT: Korea-Visit | VERSION 4.0
// FIRM: Farrukh Consultant | Principal: Farrukh Nadeem
// CONTACT: +92 309 6136080 | PIN: 2026
// ============================================================
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

// --- SECURITY GATEWAY ---
function SecureGate({ onAccess }) {
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");

  const verify = (e) => {
    e.preventDefault();
    if (pin === "2026") {
      onAccess({ user: "Farrukh Nadeem", level: "Principal" });
    } else {
      setErr("UNAUTHORIZED PIN. ACCESS DENIED.");
      setPin("");
    }
  };

  if (mode === "recovery") {
    return (
      <div style={S.card}>
        <h2 style={{color:"#ff4b5c"}}>SECURITY LOCKDOWN</h2>
        <p style={S.p}>Automated resets are disabled for security. Contact:</p>
        <div style={S.email}>farrukhimmigration@gmail.com</div>
        <button onClick={()=>setMode("login")} style={S.btnDim}>BACK</button>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <h1 style={S.h1}>FARRUKH CONSULTANT</h1>
      <p style={S.sub}>KOREA-VISIT COMMAND CENTER</p>
      <form onSubmit={verify}>
        <input 
          type="password" placeholder="PIN" value={pin} 
          onChange={e=>setPin(e.target.value)} style={S.input}
        />
        {err && <div style={S.err}>{err}</div>}
        <button type="submit" style={S.btn}>INITIALIZE SYSTEM</button>
      </form>
      <div style={S.forgot} onClick={()=>setMode("recovery")}>Forgot PIN?</div>
    </div>
  );
}

// --- MAIN SYSTEM DASHBOARD ---
function KoreaVisit() {
  const [auth, setAuth] = useState(null);

  if (!auth) return <div style={S.screen}><SecureGate onAccess={setAuth} /></div>;

  return (
    <div style={S.screen}>
      <div style={S.dashboard}>
        <header style={S.header}>
          <div>
            <span style={{color:"#00ff88", fontWeight:900, letterSpacing:2}}>KOREA-VISIT</span>
            <span style={{color:"#234d36", marginLeft:10}}>v4.0.0</span>
          </div>
          <div style={{textAlign:"right", fontSize:11}}>
            <strong style={{color:"#00ff88"}}>{auth.user}</strong><br/>
            <span style={{color:"#234d36"}}>SECURE ACCESS ENABLED</span>
          </div>
        </header>
        <div style={S.content}>
          <h2 style={{color:"#00ff88", letterSpacing:1}}>SYSTEM ONLINE</h2>
          <p style={{color:"#5eb18d", fontSize:14}}>The core architecture is stable. Ready to deploy specialized modules.</p>
          
          <div style={S.grid}>
            <div style={S.moduleCard}>BANK AUDITOR (LA-4)</div>
            <div style={S.moduleCard}>ECO SIMULATOR (LA-8)</div>
            <div style={S.moduleCard}>APPEAL DRAFTER (DOC-2)</div>
            <div style={S.moduleCard}>CLIENT REGISTRY</div>
          </div>

          <footer style={S.footer}>
            Farrukh Consultant | farrukhimmigration@gmail.com | +92 309 6136080
          </footer>
        </div>
      </div>
    </div>
  );
}

// --- SYSTEM STYLES ---
const S = {
  screen: { height:"100vh", background:"#020705", color:"#d1ffea", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", margin:0 },
  card: { background:"#06120a", padding:40, borderRadius:12, border:"1px solid #163a24", textAlign:"center", width:320, boxShadow:"0 10px 30px rgba(0,0,0,0.5)" },
  h1: { fontSize:18, letterSpacing:2, color:"#00ff88", margin:0 },
  sub: { fontSize:10, color:"#234d36", marginBottom:30, letterSpacing:1 },
  input: { width:"100%", padding:12, background:"#0a1d12", border:"1px solid #163a24", color:"#00ff88", fontSize:24, textAlign:"center", letterSpacing:8, borderRadius:6, outline:"none", boxSizing:"border-box" },
  btn: { width:"100%", padding:12, background:"#00ff88", color:"#020705", border:"none", borderRadius:6, fontWeight:800, cursor:"pointer", marginTop:15, letterSpacing:1 },
  btnDim: { background:"none", border:"1px solid #163a24", color:"#5eb18d", padding:"8px 16px", cursor:"pointer", borderRadius:4, marginTop:10 },
  forgot: { fontSize:10, color:"#234d36", marginTop:20, cursor:"pointer", textDecoration:"underline" },
  err: { color:"#ff4b5c", fontSize:10, marginTop:10, fontWeight:"bold" },
  email: { background:"#0a1d12", padding:10, borderRadius:4, margin:"15px 0", fontSize:11, color:"#00ff88", border:"1px solid #163a24" },
  p: { fontSize:12, color:"#5eb18d", lineHeight:1.5 },
  dashboard: { width:"95%", maxWidth:1100, height:"90vh", background:"#06120a", border:"1px solid #163a24", borderRadius:8, display:"flex", flexDirection:"column", overflow:"hidden" },
  header: { padding:"15px 25px", borderBottom:"1px solid #163a24", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#030b07" },
  content: { padding:40, flex:1, display:"flex", flexDirection:"column" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20, marginTop:30 },
  moduleCard: { padding:25, background:"#0a1d12", border:"1px solid #163a24", borderRadius:6, color:"#234d36", fontSize:12, fontWeight:"bold", textAlign:"center", borderStyle:"dashed" },
  footer: { marginTop:"auto", paddingTop:20, borderTop:"1px solid #0d1a0f", fontSize:10, color:"#234d36", textAlign:"center" }
};

createRoot(document.getElementById("root")).render(<StrictMode><KoreaVisit /></StrictMode>);
