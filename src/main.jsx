// ============================================================
// PROJECT: Korea-Visit | VERSION 4.1
// FIRM: Farrukh Consultant | Principal: Farrukh Nadeem
// CONTACT: +92 309 6136080 | PIN: 2026
// ============================================================
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

function SecureGate({ onAccess }) {
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");

  const MASTER_PIN = "2026"; // <--- CHANGE YOUR PIN HERE

  const verify = (e) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      onAccess({ user: "Farrukh Nadeem", level: "Master Access" });
    } else {
      setErr("UNAUTHORIZED PIN. ACCESS DENIED.");
      setPin("");
    }
  };

  const requestReset = () => {
    const subject = encodeURIComponent("KOREA-VISIT: PIN RESET REQUEST");
    const body = encodeURIComponent("I have forgotten my Korea-Visit terminal PIN. Please provide the Master Reset Code for Farrukh Consultant.");
    window.location.href = `mailto:farrukhimmigration@gmail.com?subject=${subject}&body=${body}`;
  };

  if (mode === "recovery") {
    return (
      <div style={S.card}>
        <h2 style={{color:"#ff4b5c", fontSize:14}}>MASTER RESET PROTOCOL</h2>
        <p style={S.p}>Direct automated resets require a connected database. To recover access to the Korea-Visit terminal:</p>
        <div style={S.email}>farrukhimmigration@gmail.com</div>
        <button onClick={requestReset} style={S.btn}>SEND RESET REQUEST EMAIL</button>
        <button onClick={()=>setMode("login")} style={S.btnDim}>BACK TO LOGIN</button>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <h1 style={S.h1}>FARRUKH CONSULTANT</h1>
      <p style={S.sub}>KOREA-VISIT COMMAND CENTER</p>
      <form onSubmit={verify}>
        <input 
          type="password" placeholder="ENTER PIN" value={pin} 
          onChange={e=>setPin(e.target.value)} style={S.input}
        />
        {err && <div style={S.err}>{err}</div>}
        <button type="submit" style={S.btn}>INITIALIZE SYSTEM</button>
      </form>
      <div style={S.forgot} onClick={()=>setMode("recovery")}>Forgot PIN? / Request Access</div>
    </div>
  );
}

function KoreaVisit() {
  const [auth, setAuth] = useState(null);
  if (!auth) return <div style={S.screen}><SecureGate onAccess={setAuth} /></div>;

  return (
    <div style={S.screen}>
      <div style={S.dashboard}>
        <header style={S.header}>
          <div>
            <span style={{color:"#00ff88", fontWeight:900, letterSpacing:2}}>KOREA-VISIT</span>
            <span style={{color:"#234d36", marginLeft:10}}>v4.1.0</span>
          </div>
          <div style={{textAlign:"right", fontSize:11}}>
            <strong style={{color:"#00ff88"}}>{auth.user}</strong><br/>
            <span style={{color:"#234d36"}}>{auth.level.toUpperCase()} ONLINE</span>
          </div>
        </header>
        <div style={S.content}>
          <div style={S.statusBadge}>SYSTEM READY</div>
          <h2 style={{color:"#00ff88", letterSpacing:1, marginTop:10}}>COMMAND DASHBOARD</h2>
          <p style={{color:"#5eb18d", fontSize:13}}>Welcome, Principal Nadeem. All encryption layers for <strong>Korea-Visit</strong> are active.</p>
          
          <div style={S.grid}>
            <div style={S.moduleCard}>CLIENT REGISTRY<br/><span style={S.tag}>PHASE 2</span></div>
            <div style={S.moduleCard}>BANK AUDITOR<br/><span style={S.tag}>PHASE 3</span></div>
            <div style={S.moduleCard}>DOC GENERATOR<br/><span style={S.tag}>PHASE 4</span></div>
          </div>

          <footer style={S.footer}>
            PROPRIETARY SYSTEM | FARRUKH CONSULTANT | +92 309 6136080
          </footer>
        </div>
      </div>
    </div>
  );
}

const S = {
  screen: { height:"100vh", background:"#020705", color:"#d1ffea", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", margin:0 },
  card: { background:"#06120a", padding:40, borderRadius:12, border:"1px solid #163a24", textAlign:"center", width:340, boxShadow:"0 15px 35px rgba(0,0,0,0.7)" },
  h1: { fontSize:18, letterSpacing:2, color:"#00ff88", margin:0 },
  sub: { fontSize:10, color:"#234d36", marginBottom:30, letterSpacing:1 },
  input: { width:"100%", padding:12, background:"#0a1d12", border:"1px solid #163a24", color:"#00ff88", fontSize:24, textAlign:"center", letterSpacing:8, borderRadius:6, outline:"none", boxSizing:"border-box" },
  btn: { width:"100%", padding:12, background:"#00ff88", color:"#020705", border:"none", borderRadius:6, fontWeight:800, cursor:"pointer", marginTop:15, letterSpacing:1 },
  btnDim: { width:"100%", background:"none", border:"1px solid #163a24", color:"#5eb18d", padding:"10px", cursor:"pointer", borderRadius:6, marginTop:10, fontSize:11 },
  forgot: { fontSize:10, color:"#234d36", marginTop:20, cursor:"pointer", textDecoration:"underline" },
  err: { color:"#ff4b5c", fontSize:10, marginTop:10, fontWeight:"bold" },
  email: { background:"#0a1d12", padding:12, borderRadius:4, margin:"15px 0", fontSize:11, color:"#00ff88", border:"1px solid #163a24" },
  p: { fontSize:12, color:"#5eb18d", lineHeight:1.5 },
  dashboard: { width:"95%", maxWidth:1100, height:"90vh", background:"#06120a", border:"1px solid #163a24", borderRadius:8, display:"flex", flexDirection:"column", overflow:"hidden" },
  header: { padding:"15px 25px", borderBottom:"1px solid #163a24", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#030b07" },
  content: { padding:40, flex:1, display:"flex", flexDirection:"column" },
  statusBadge: { width:"fit-content", padding:"4px 12px", background:"rgba(0, 255, 136, 0.1)", color:"#00ff88", borderRadius:20, fontSize:10, fontWeight:"bold", border:"1px solid #00ff88" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:20, marginTop:30 },
  moduleCard: { padding:30, background:"#0a1d12", border:"1px solid #163a24", borderRadius:6, color:"#234d36", fontSize:13, fontWeight:"bold", textAlign:"center", borderStyle:"dashed" },
  tag: { fontSize:9, color:"#163a24", letterSpacing:1 },
  footer: { marginTop:"auto", paddingTop:20, borderTop:"1px solid #0d1a0f", fontSize:10, color:"#234d36", textAlign:"center", letterSpacing:1 }
};

createRoot(document.getElementById("root")).render(<StrictMode><KoreaVisit /></StrictMode>);
