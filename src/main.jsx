import { useState, useEffect } from "react";

// --- KOREA PRIME v16.3: STABLE BASE ---
export default function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);
  const [config, setConfig] = useState(() => {
    const s = localStorage.getItem("kp_cfg");
    return s ? JSON.parse(s) : { key: "", gas: "" };
  });
  const [clients, setClients] = useState(() => {
    const s = localStorage.getItem("kp_cli");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("kp_cfg", JSON.stringify(config));
    localStorage.setItem("kp_cli", JSON.stringify(clients));
  }, [config, clients]);

  // SECURE GATE
  if (!auth) return (
    <div style={{height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#0a0a0a", color:"#00ff88", flexDirection:"column"}}>
      <h2 style={{fontFamily:"monospace"}}>FARRUKH CONSULTANT</h2>
      <input type="password" placeholder="PIN" onChange={(e) => {if(e.target.value === "2026") setAuth(true)}} style={{padding:12, backgroundColor:"#000", border:"1px solid #1a3a2a", color:"#00ff88", textAlign:"center", outline:"none"}} />
    </div>
  );

  return (
    <div style={{backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#eee", fontFamily: "monospace", padding: "20px"}}>
      {/* HEADER */}
      <header style={{display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1a3a2a", paddingBottom: "10px"}}>
        <h1 style={{color: "#00ff88", margin: 0, fontSize: "1.2rem"}}>KOREA PRIME <span style={{fontSize:10, color:"#444"}}>STABLE</span></h1>
        <button onClick={() => setView("config")} style={{backgroundColor: "#222", color: "#00ff88", border: "1px solid #00ff88", cursor: "pointer", padding: "5px 10px"}}>⚙️ CONFIG</button>
      </header>

      {/* VIEW: DASHBOARD */}
      {view === "dash" && (
        <div>
          <div style={{display: "flex", justifyContent: "space-between", margin: "20px 0"}}>
            <h2 style={{color: "#00ff88", fontSize: "1rem"}}>CLIENT VAULT</h2>
            <button onClick={() => setView("new")} style={{backgroundColor: "#00ff88", color: "#000", border: "none", padding: "10px 20px", fontWeight: "bold", cursor: "pointer"}}>+ NEW CASE</button>
          </div>
          {clients.length === 0 && <p style={{color: "#444"}}>Vault empty. Create your first case.</p>}
          {clients.map(c => (
            <div key={c.id} style={{backgroundColor: "#111", padding: "15px", border: "1px solid #1a3a2a", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>
                <div style={{fontWeight: "bold"}}>{c.name.toUpperCase()}</div>
                <div style={{fontSize: "10px", color: "#666"}}>ID: {c.id}</div>
              </div>
              <button onClick={() => {setActiveCase(c); setView("case");}} style={{backgroundColor: "#222", color: "#00ff88", border: "1px solid #00ff88", cursor: "pointer", padding: "5px 15px"}}>OPEN FILE</button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: NEW CASE */}
      {view === "new" && (
        <div style={{maxWidth: "400px", margin: "auto", paddingTop: "50px"}}>
          <h2 style={{color: "#00ff88", textAlign: "center"}}>NEW CASE INTAKE</h2>
          <input placeholder="Client Name" id="new_name" style={{width: "100%", padding: "12px", backgroundColor: "#000", border: "1px solid #1a3a2a", color: "#00ff88", marginBottom: "15px", boxSizing: "border-box"}} />
          <button onClick={() => {
            const name = document.getElementById("new_name").value;
            if(!name) return;
            setClients([{id: Date.now(), name, audit: "", status: "Pending"}, ...clients]);
            setView("dash");
          }} style={{width: "100%", padding: "12px", backgroundColor: "#00ff88", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer"}}>SAVE TO VAULT</button>
          <button onClick={() => setView("dash")} style={{width: "100%", marginTop: "15px", background: "none", color: "#888", border: "none", cursor: "pointer"}}>CANCEL</button>
        </div>
      )}

      {/* VIEW: CASE MANAGER */}
      {view === "case" && activeCase && (
        <div>
          <button onClick={() => setView("dash")} style={{color: "#888", background: "none", border: "none", cursor: "pointer", marginBottom: "20px"}}>← BACK TO VAULT</button>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
            <div style={{backgroundColor: "#111", padding: "20px", border: "1px solid #1a3a2a"}}>
              <h3 style={{color: "#00ff88", marginTop: 0}}>Audit & Analysis</h3>
              <p style={{fontSize: "11px", color: "#888"}}>Drop Bank Statements or Refusal Letters here.</p>
              <input type="file" style={{color: "#00ff88", fontSize: "11px"}} />
              <div style={{marginTop: "20px", fontSize: "12px", color: "#bbb", whiteSpace: "pre-wrap", borderTop: "1px solid #222", paddingTop: "15px"}}>
                {activeCase.audit || "System ready for document upload..."}
              </div>
            </div>
            <div style={{backgroundColor: "#111", padding: "20px", border: "1px solid #1a3a2a"}}>
              <h3 style={{color: "#00ff88", marginTop: 0}}>Firm Actions</h3>
              <button style={{width: "100%", padding: "12px", backgroundColor: "#00ff88", color: "#000", border: "none", fontWeight: "bold", marginBottom: "10px"}}>📝 DRAFT KOREA APPEAL</button>
              <button style={{width: "100%", padding: "12px", backgroundColor: "#111", color: "#00ff88", border: "1px solid #00ff88", fontWeight: "bold"}}>📱 CLIENT WHATSAPP</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CONFIG */}
      {view === "config" && (
        <div style={{maxWidth: "400px", margin: "auto", paddingTop: "50px"}}>
          <h2 style={{color: "#00ff88"}}>SYSTEM SETTINGS</h2>
          <label style={{fontSize: "10px", color: "#00ff88"}}>OPENROUTER API KEY</label>
          <input type="password" defaultValue={config.key} id="cfg_key" style={{width: "100%", padding: "12px", backgroundColor: "#000", border: "1px solid #1a3a2a", color: "#00ff88", marginBottom: "20px", boxSizing: "border-box"}} />
          <label style={{fontSize: "10px", color: "#00ff88"}}>GOOGLE SCRIPT URL</label>
          <input defaultValue={config.gas} id="cfg_gas" style={{width: "100%", padding: "12px", backgroundColor: "#000", border: "1px solid #1a3a2a", color: "#00ff88", marginBottom: "20px", boxSizing: "border-box"}} />
          <button onClick={() => {
            setConfig({
              key: document.getElementById("cfg_key").value,
              gas: document.getElementById("cfg_gas").value
            });
            setView("dash");
          }} style={{width: "100%", padding: "12px", backgroundColor: "#00ff88", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer"}}>SAVE & LOCK</button>
        </div>
      )}
    </div>
  );
}
