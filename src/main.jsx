import React, { useState, useEffect } from "react";

// --- CORE ENGINE: KOREA PRIME SUPREME v16 ---
export default function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  const [config, setConfig] = useState(() => {
    const s = localStorage.getItem("kp_vault_config");
    return s ? JSON.parse(s) : { key: "", gas: "" };
  });

  const [clients, setClients] = useState(() => {
    const s = localStorage.getItem("kp_vault_clients");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("kp_vault_config", JSON.stringify(config));
    localStorage.setItem("kp_vault_clients", JSON.stringify(clients));
  }, [config, clients]);

  const syncToCloud = async (currentList) => {
    if (!config.gas) return;
    setSyncing(true);
    try {
      await fetch(config.gas, { method: "POST", mode: 'no-cors', body: JSON.stringify({ action: "sync", clients: currentList }) });
    } catch (e) { console.error(e); }
    setSyncing(false);
  };

  const retrieveFromCloud = async () => {
    if (!config.gas) return alert("Error: Missing Google Script URL in Config.");
    setSyncing(true);
    try {
      const res = await fetch(config.gas, { method: "POST", body: JSON.stringify({ action: "retrieve" }) });
      const data = await res.json();
      setClients(data);
      alert("VAULT LOADED FROM DRIVE.");
    } catch (e) { alert("Cloud Sync Failed. Check Deployment."); }
    setSyncing(false);
  };

  if (!auth) return <SecureGate onAccess={setAuth} />;

  return (
    <div style={S.screen}>
      <header style={S.header}>
        <h1 style={S.brand}>KOREA PRIME <span style={{fontSize:10, color:"#444"}}>v16.PRO</span></h1>
        <div style={{textAlign:"right"}}>
          <p style={S.firmName}>FARRUKH CONSULTANT | +92 309 6136 080</p>
          <button onClick={() => setView("config")} style={S.btnSmall}>⚙️ SYSTEM CONFIG</button>
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

// --- CASE MASTER: THE LAWYER BRAIN ---
function CaseMaster({ client, clients, setClients, config, onBack }) {
  const [loading, setLoading] = useState(false);
  const checklist = ["Passport Copy", "CNIC", "FRC (Family)", "Bank Statement (6m)", "NTN/Tax Returns", "Chamber Certificate", "Polio Card"];

  const runLegalAudit = async (fileBase64) => {
    if(!config.key) return alert("FATAL: No API Key in Config.");
    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${config.key}`, // FIXED: Using backticks for dynamic key
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5-exp",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `ACT AS FARRUKH NADEEM (Immigration Lawyer).
                APPLY FARRUKH CONSULTANT STRATEGY:
                1. 12 ADVANTAGES: Focus on LA-10 (Ban Prevention) and LA-12 (Proportionality).
                2. REFUSAL ANALYSIS: If it's a refusal, diagnose Path 1 (Reconsideration), Path 2 (Fresh App), or Path 3 (Admin Appeal).
                3. LEGAL CITATION: For Path 1, draft a rebuttal based on Article 7 of the ICA regarding 'Abuse of Discretionary Power'.
                4. OUTPUT: Provide a Strength Score, a Forensic Report, and a Roman Urdu WhatsApp summary.` },
              { type: "image_url", image_url: { url: fileBase64 } }
            ]
          }]
        })
      });
      const data = await res.json();
      const report = data.choices[0].message.content;
      const updated = clients.map(c => c.id === client.id ? {...c, audit: report, status: "Audited"} : c);
      setClients(updated);
    } catch (e) { alert("AUDIT FAILED: Ensure your OpenRouter key is valid."); }
    setLoading(false);
  };

  return (
    <div style={S.container}>
      <div style={S.flexBetween}>
        <h2>CLIENT: {client.name.toUpperCase()}</h2>
        <button onClick={onBack} style={S.btnSmall}>← BACK TO VAULT</button>
      </div>
      <div style={S.grid2}>
        <div style={S.panel}>
          <h3>Forensic Audit</h3>
          <input type="file" onChange={(e) => {
            const r = new FileReader();
            r.onload = () => runLegalAudit(r.result);
            r.readAsDataURL(e.target.files[0]);
          }} style={S.fileInput} />
          {loading && <p style={{color: "#00ff88"}}>ENGINE ANALYZING...</p>}
          <div style={S.auditDisplay}>{client.audit || "Upload document to begin analysis."}</div>
        </div>
        <div style={S.panel}>
          <h3>Case Progress</h3>
          {checklist.map(item => <div key={item} style={{margin: "10px 0"}}><input type="checkbox" /> {item}</div>)}
          <button style={S.btnAction}>📝 DRAFT APPEAL (PATH 1)</button>
          <button style={S.btnAction} onClick={() => navigator.clipboard.writeText(client.audit)}>📱 COPY WHATSAPP REPORT</button>
        </div>
      </div>
    </div>
  );
}

// --- SUPPORTING COMPONENTS ---
function Dashboard({ clients, onOpen, onNew, onSync, onArchive, syncing }) {
  const [showArchived, setShowArchived] = useState(false);
  const filtered = clients.filter(c => !!c.archived === showArchived);
  return (
    <div style={S.container}>
      <div style={S.flexBetween}>
        <h2 style={{color: "#00ff88"}}>{showArchived ? "ARCHIVED CASES" : "ACTIVE VAULT"}</h2>
        <div style={{display:"flex", gap:10}}>
          <button onClick={() => setShowArchived(!showArchived)} style={S.btnSmall}>{showArchived ? "ACTIVE" : "ARCHIVE"}</button>
          <button onClick={onSync} style={S.btnSync}>{syncing ? "SYNCING..." : "🔄 DRIVE SYNC"}</button>
          <button onClick={onNew} style={S.btnAdd}>+ NEW CASE</button>
        </div>
      </div>
      <div style={S.list}>
        {filtered.map(c => (
          <div key={c.id} style={S.card}>
            <div>{c.name.toUpperCase()} <span style={{fontSize:10, color:"#555"}}>{c.passport}</span></div>
            <div style={{display:"flex", gap:5}}>
              <button onClick={() => onOpen(c)} style={S.btnSmall}>OPEN</button>
              <button onClick={() => onArchive(c.id)} style={S.btnSmall}>{showArchived ? "RECOVER" : "ARCHIVE"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewCase({ onSave, onBack }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={S.container}>
      <h2>OPEN NEW KOREA FILE</h2>
      <input style={S.input} placeholder="Client Full Name" onChange={e=>
