import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem("fc_v14_data")) || []);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem("fc_config")) || { key: "", gas: "" });
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);

  useEffect(() => { localStorage.setItem("fc_v14_data", JSON.stringify(clients)); }, [clients]);

  if (!auth) return <div style={S.screen}><SecureGate onAccess={setAuth} /></div>;

  return (
    <div style={S.screen}>
      <div style={S.container}>
        <header style={S.header}>
          <div>
            <h1 style={S.brand}>FARRUKH CONSULTANT <span style={S.version}>v14-SUPREME</span></h1>
            <p style={S.subText}>farrukhimmigration@gmail.com | +92 309 6136080</p>
          </div>
          <button onClick={() => setView("config")} style={S.btnIcon}>⚙️ CONFIG</button>
        </header>

        {view === "dash" && <Dashboard clients={clients} onOpen={(c) => {setActiveCase(c); setView("case");}} onNew={() => setView("new")} />}
        {view === "new" && <NewCase config={config} onSave={(c) => {setClients([c, ...clients]); setView("dash");}} onBack={() => setView("dash")} />}
        {view === "case" && <CaseMaster client={activeCase} clients={clients} setClients={setClients} config={config} onBack={() => setView("dash")} />}
        {view === "config" && <Config config={config} setConfig={setConfig} onBack={() => setView("dash")} />}
      </div>
    </div>
  );
}

// --- CASE MASTER: THE FORENSIC ENGINE ---
function CaseMaster({ client, clients, setClients, config, onBack }) {
  const [audit, setAudit] = useState(client.audit || "");
  const [loading, setLoading] = useState(false);

  const runForensicAudit = async (fileBase64) => {
    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${config.key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5-exp",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Perform a Forensic Audit based on Farrukh Consultant's Legal Advantages (LA-1 to LA-12). Identify Circulator Transactions, Window Dressing, and LA-10 compliance. Assign a Strength Score out of 100. Provide Roman Urdu WhatsApp summary." },
              { type: "image_url", image_url: { url: fileBase64 } }
            ]
          }]
        })
      });
      const data = await res.json();
      const report = data.choices[0].message.content;
      setAudit(report);
      setClients(clients.map(c => c.id === client.id ? {...c, audit: report} : c));
    } catch (e) { alert("Audit Failed: Check API Key"); }
    setLoading(false);
  };

  return (
    <div style={S.content}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
        <h2 style={{color:"#00ff88"}}>CASE: {client.name.toUpperCase()}</h2>
        <button onClick={onBack} style={S.btnSmall}>← BACK</button>
      </div>

      <div style={S.grid}>
        <div style={S.panel}>
          <h3 style={S.panelTitle}>📂 DOCUMENT FORENSICS</h3>
          <p style={S.label}>Upload Bank Statement / Refusal Letter</p>
          <input type="file" onChange={(e) => {
            const r = new FileReader();
            r.onload = () => runForensicAudit(r.result);
            r.readAsDataURL(e.target.files[0]);
          }} style={S.fileInput} />
          
          {loading && <div style={S.loader}>ENGINE ANALYZING TRANSACTIONS...</div>}
          {audit && (
            <div style={S.auditBox}>
              <div style={S.auditHeader}>FORENSIC REPORT (LA-SYSTEM)</div>
              {audit}
            </div>
          )}
        </div>

        <div style={S.panel}>
          <h3 style={S.panelTitle}>⚖️ STRATEGY & DRAFTS</h3>
          <div style={S.actionList}>
            <button style={S.btnAction}>📝 DRAFT DOC-2 COVER LETTER</button>
            <button style={S.btnAction}>📋 GENERATE LA-12 PROPORTIONALITY DRAFT</button>
            <button style={S.btnAction} onClick={() => alert("WhatsApp Report Copied!")}>📱 FC-KOR WHATSAPP UPDATE</button>
          </div>
          <div style={S.strategyNote}>
            <strong>LA-10 NOTICE:</strong> Never submit if Strength Score is below 75%.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD & OTHER COMPONENTS ---
function Dashboard({ clients, onOpen, onNew }) {
  return (
    <div style={S.content}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:30}}>
        <h2 style={{color:"#00ff88"}}>CASE REGISTRY</h2>
        <button onClick={onNew} style={S.btnAdd}>+ NEW KOREA CASE</button>
      </div>
      {clients.length === 0 ? <p style={{color:"#234d36"}}>No active cases. Start a new forensic audit.</p> : 
        clients.map(c => (
          <div key={c.id} style={S.card} onClick={() => onOpen(c)}>
            <div style={{fontWeight:"bold", fontSize:16}}>{c.name.toUpperCase()}</div>
            <div style={{fontSize:12, color:"#5eb18d"}}>{c.passport} | {c.status || "ANALYZING"}</div>
          </div>
        ))
      }
    </div>
  );
}

function NewCase({ config, onSave, onBack }) {
  const [name, setName] = useState("");
  const [passport, setPassport] = useState("");
  return (
    <div style={S.content}>
      <h2 style={{color:"#00ff88"}}>INITIALIZE CASE</h2>
      <input style={S.input} placeholder="CLIENT NAME" value={name} onChange={e=>setName(e.target.value)} />
      <input style={S.input} placeholder="PASSPORT NUMBER" value={passport} onChange={e=>setPassport(e.target.value)} />
      <div style={{display:"flex", gap:10}}>
        <button onClick={() => onSave({id:Date.now(), name, passport, audit:""})} style={S.btnAdd}>CREATE & OPEN FORENSIC FILE</button>
        <button onClick={onBack} style={S.btnSmall}>CANCEL</button>
      </div>
    </div>
  );
}

function Config({ config, setConfig, onBack }) {
  const [temp, setTemp] = useState(config);
  return (
    <div style={S.content}>
      <h2 style={{color:"#00ff88"}}>SYSTEM CONFIG</h2>
      <input style={S.input} type="password" placeholder="OPENROUTER KEY" value={temp.key} onChange={e=>setTemp({...temp, key:e.target.value})} />
      <input style={S.input} placeholder="GOOGLE SCRIPT URL" value={temp.gas} onChange={e=>setTemp({...temp, gas:e.target.value})} />
      <button onClick={()=>{setConfig(temp); onBack();}} style={S.btnAdd}>SAVE CONFIGURATION</button>
    </div>
  );
}

function SecureGate({ onAccess }) {
  const [pin, setPin] = useState("");
  return (
    <div style={{textAlign:"center", background:"#06120a", padding:40, border:"1px solid #163a24"}}>
      <h1 style={{color:"#00ff88", fontSize:20, marginBottom:20}}>FARRUKH CONSULTANT</h1>
      <input type="password" style={S.input} placeholder="MASTER PIN" value={pin} onChange={e=>setPin(e.target.value)} />
      <button onClick={() => pin === "2026" && onAccess(true)} style={S.btnAdd}>ACCESS ENGINE</button>
    </div>
  );
}

const S = {
  screen: { height:"100vh", background:"#020705", color:"#d1ffea", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace" },
  container: { width:"95%", maxWidth:1100, height:"90vh", background:"#06120a", border:"1px solid #163a24", display:"flex", flexDirection:"column" },
  header: { padding:"20px 30px", borderBottom:"1px solid #163a24", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#030b07" },
  brand: { margin:0, fontSize:18, color:"#00ff88" },
  version: { fontSize:10, color:"#234d36", marginLeft:10 },
  subText: { margin:0, fontSize:10, color:"#5eb18d" },
  content: { padding:30, flex:1, overflowY:"auto" },
  grid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
  panel: { padding:20, background:"#0a1d12", border:"1px solid #163a24", borderRadius:4 },
  panelTitle: { margin:"0 0 15px 0", fontSize:14, color:"#00ff88" },
  input: { width:"100%", padding:12, background:"#030b07", border:"1px solid #163a24", color:"#00ff88", marginBottom:15, boxSizing:"border-box" },
  btnSmall: { background:"none", border:"1px solid #163a24", color:"#5eb18d", padding:"5px 15px", cursor:"pointer" },
  btnAdd: { padding:"12px 25px", background:"#00ff88", color:"#06120a", border:"none", fontWeight:"bold", cursor:"pointer" },
  card: { padding:20, background:"#0a1d12", border:"1px solid #163a24", marginBottom:10, cursor:"pointer" },
  auditBox: { marginTop:20, padding:15, background:"#030b07", fontSize:12, whiteSpace:"pre-wrap", borderLeft:"3px solid #ffcc00", color:"#e0e0e0" },
  auditHeader: { color:"#ffcc00", fontWeight:"bold", marginBottom:10 },
  btnAction: { width:"100%", padding:12, background:"#163a24", color:"#00ff88", border:"1px solid #00ff88", marginBottom:10, cursor:"pointer", textAlign:"left", fontWeight:"bold" },
  strategyNote: { marginTop:15, fontSize:11, color:"#ff4d4d", padding:10, background:"rgba(255, 77, 77, 0.1)", border:"1px solid #ff4d4d" },
  loader: { padding:15, color:"#ffcc00", fontSize:12 }
};

createRoot(document.getElementById("root")).render(<StrictMode><FarrukhEliteEngine /></StrictMode>);
