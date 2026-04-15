import { useState, useEffect } from "react";

// --- KOREA PRIME SUPREME v16.1 ---
export default function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  const [config, setConfig] = useState(() => {
    const s = localStorage.getItem("kp_v16_cfg");
    return s ? JSON.parse(s) : { key: "", gas: "" };
  });

  const [clients, setClients] = useState(() => {
    const s = localStorage.getItem("kp_v16_cli");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("kp_v16_cfg", JSON.stringify(config));
    localStorage.setItem("kp_v16_cli", JSON.stringify(clients));
  }, [config, clients]);

  const syncToCloud = async (currentList) => {
    if (!config.gas) return;
    try {
      await fetch(config.gas, { method: "POST", mode: 'no-cors', body: JSON.stringify({ action: "sync", clients: currentList }) });
    } catch (e) { console.error(e); }
  };

  const retrieveFromCloud = async () => {
    if (!config.gas) return alert("Missing Google Script URL.");
    setSyncing(true);
    try {
      const res = await fetch(config.gas, { method: "POST", body: JSON.stringify({ action: "retrieve" }) });
      const data = await res.json();
      setClients(data);
      alert("VAULT SYNCED.");
    } catch (e) { alert("Sync Failed."); }
    setSyncing(false);
  };

  if (!auth) return <SecureGate setAuth={setAuth} />;

  return (
    <div style={S.screen}>
      <header style={S.header}>
        <h1 style={S.brand}>KOREA PRIME <span style={{fontSize:10, color:"#444"}}>v16.1</span></h1>
        <div style={{textAlign:"right"}}>
          <p style={S.firmName}>FARRUKH CONSULTANT</p>
          <button onClick={() => setView("config")} style={S.btnSmall}>⚙️ CONFIG</button>
        </div>
      </header>

      {view === "dash" && (
        <Dashboard 
          clients={clients} 
          onOpen={(c)=>{setActiveCase(c); setView("case");}} 
          onNew={()=>setView("new")} 
          onSync={retrieveFromCloud}
          onArchive={(id) => {
            const updated = clients.map(c => c.id === id ? {...c, archived: !c.archived} : c);
            setClients(updated);
            syncToCloud(updated);
          }}
          syncing={syncing}
        />
      )}

      {view === "new" && (
        <NewCase onSave={(c)=>{
            const newList = [c, ...clients];
            setClients(newList);
            syncToCloud(newList);
            setView("dash");
          }} 
          onBack={()=>setView("dash")} 
        />
      )}

      {view === "case" && (
        <CaseMaster 
          client={activeCase} 
          setClients={(updatedList) => { setClients(updatedList); syncToCloud(updatedList); }} 
          clients={clients} 
          config={config} 
          onBack={()=>setView("dash")} 
        />
      )}

      {view === "config" && <Config config={config} setConfig={setConfig} onBack={()=>setView("dash")} />}
    </div>
  );
}

function Dashboard({ clients, onOpen, onNew, onSync, onArchive, syncing }) {
  const [showArchived, setShowArchived] = useState(false);
  const filtered = clients.filter(c => !!c.archived === showArchived);
  return (
    <div style={S.container}>
      <div style={S.flexBetween}>
        <h2 style={{color: "#00ff88"}}>{showArchived ? "📁 ARCHIVE" : "🗂️ ACTIVE"}</h2>
        <div style={{display:"flex", gap:10}}>
          <button onClick={() => setShowArchived(!showArchived)} style={S.btnSmall}>{showArchived ? "ACTIVE" : "ARCHIVE"}</button>
          <button onClick={onSync} style={S.btnSync}>{syncing ? "..." : "🔄 SYNC"}</button>
          <button onClick={onNew} style={S.btnAdd}>+ NEW</button>
        </div>
      </div>
      <div style={S.list}>
        {filtered.map(c => (
          <div key={c.id} style={S.card}>
            <div>{c.name.toUpperCase()}</div>
            <div style={{display:"flex", gap:5}}>
              <button onClick={() => onOpen(c)} style={S.btnSmall}>OPEN</button>
              <button onClick={() => onArchive(c.id)} style={S.btnSmall}>X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseMaster({ client, clients, setClients, config, onBack }) {
  const [loading, setLoading] = useState(false);
  const runLegalAudit = async (fileBase64) => {
    if(!config.key) return alert("API Key missing.");
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
              { type: "text", text: `Lawyer: Farrukh Nadeem. Firm: Farrukh Consultant. Apply LA-1 to LA-12. If refusal, check Path 1/2/3 and Article 7 ICA.` },
              { type: "image_url", image_url: { url: fileBase64 } }
            ]
          }]
        })
      });
      const data = await res.json();
      const report = data.choices[0].message.content;
      setClients(clients.map(c => c.id === client.id ? {...c, audit: report} : c));
    } catch (e) { alert("Fail."); }
    setLoading(false);
  };

  return (
    <div style={S.container}>
      <button onClick={onBack} style={S.btnSmall}>← EXIT</button>
      <div style={S.grid2}>
        <div style={S.panel}>
          <h3>Audit</h3>
          <input type="file" onChange={(e) => {
            const r = new FileReader();
            r.onload = () => runLegalAudit(r.result);
            r.readAsDataURL(e.target.files[0]);
          }} />
          <div style={S.auditDisplay}>{client.audit || "Waiting..."}</div>
        </div>
        <div style={S.panel}>
          <h3>Actions</h3>
          <button style={S.btnAction}>📝 DRAFT APPEAL</button>
        </div>
      </div>
    </div>
  );
}

function NewCase({ onSave, onBack }) {
  const [name, setName] = useState("");
  return (
    <div style={S.container}>
      <input style={S.input} placeholder="Name" onChange={e=>setName(e.target.value)} />
      <button style={S.btnAdd} onClick={()=>onSave({id: Date.now(), name, archived: false})}>SAVE</button>
      <button onClick={onBack} style={S.btnSmall}>BACK</button>
    </div>
  );
}

function Config({ config, setConfig, onBack }) {
  const [t, setT] = useState(config);
  return (
    <div style={S.container}>
      <input style={S.input} value={t.key} placeholder="API KEY" onChange={e=>setT({...t, key:e.target.value})} />
      <input style={S.input} value={t.gas} placeholder="GAS URL" onChange={e=>setT({...t, gas:e.target.value})} />
      <button style={S.btnAdd} onClick={()=>{setConfig(t); onBack();}}>LOCK</button>
    </div>
  );
}

function SecureGate({ setAuth }) {
  const [p, setP] = useState("");
  return (
    <div style={{padding: 50, textAlign: "center"}}>
      <input style={S.input} type="password" placeholder="PIN" onChange={e=>setP(e.target.value)} />
      <button style={S.btnAdd} onClick={()=>{if(p==="2026") setAuth(true)}}>ENTER</button>
    </div>
  );
}

const S = {
  screen: { backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#eee", fontFamily: "monospace" },
  header: { padding: "20px", borderBottom: "1px solid #1a3a2a", display: "flex", justifyContent: "space-between" },
  brand: { color: "#00ff88", margin: 0 },
  firmName: { margin: 0, fontSize: 10, color: "#888" },
  container: { padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  panel: { backgroundColor: "#111", padding: "20px", border: "1px solid #1a3a2a" },
  input: { width: "100%", padding: "12px", backgroundColor: "#000", border: "1px solid #1a3a2a", color: "#00ff88", marginBottom: "15px" },
  btnAction: { width: "100%", padding: "12px", backgroundColor: "#00ff88", color: "#000", border: "none", fontWeight: "bold" },
  btnAdd: { padding: "10px 20px", backgroundColor: "#00ff88", color: "#000", border: "none" },
  btnSync: { padding: "10px 20px", backgroundColor: "#000", color: "#00ff88", border: "1px solid #00ff88" },
  btnSmall: { padding: "5px 10px", fontSize: "11px", backgroundColor: "#222", color: "#00ff88", border: "1px solid #00ff88" },
  card: { backgroundColor: "#111", padding: "15px", border: "1px solid #1a3a2a", marginBottom: "10px", display: "flex", justifyContent: "space-between" },
  flexBetween: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  auditDisplay: { marginTop: "20px", fontSize: "12px", color: "#bbb", whiteSpace: "pre-wrap" }
};
