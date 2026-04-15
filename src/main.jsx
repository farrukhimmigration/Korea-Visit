import { useState, useEffect } from "react";

// --- KOREA PRIME SUPREME: COMMAND CENTER ---
export default function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);
  const [syncing, setSyncing] = useState(false);
  
  const [config, setConfig] = useState(() => {
    const s = localStorage.getItem("kp_config_v16");
    return s ? JSON.parse(s) : { key: "", gas: "" };
  });

  const [clients, setClients] = useState(() => {
    const s = localStorage.getItem("kp_clients_v16");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("kp_config_v16", JSON.stringify(config));
    localStorage.setItem("kp_clients_v16", JSON.stringify(clients));
  }, [config, clients]);

  // --- CLOUD VAULT SYNC LOGIC ---
  const syncToCloud = async (currentList) => {
    if (!config.gas) return alert("Meticulous Check: Google Script URL missing in Config.");
    setSyncing(true);
    try {
      await fetch(config.gas, { method: "POST", body: JSON.stringify({ action: "sync", clients: currentList }) });
      console.log("Vault Synced to Google Drive");
    } catch (e) { console.error("Sync Error", e); }
    setSyncing(false);
  };

  const retrieveFromCloud = async () => {
    if (!config.gas) return alert("Config missing URL.");
    setSyncing(true);
    try {
      const res = await fetch(config.gas, { method: "POST", body: JSON.stringify({ action: "retrieve" }) });
      const data = await res.json();
      setClients(data);
      alert("VAULT RETRIEVED: All client data is now synced from Google Drive.");
    } catch (e) { alert("Retrieval Failed. Check Google Script Deployment."); }
    setSyncing(false);
  };

  if (!auth) return <SecureGate onAccess={setAuth} />;

  return (
    <div style={S.screen}>
      <header style={S.header}>
        <h1 style={S.brand}>KOREA PRIME <span style={{fontSize:10, color:"#444"}}>v16.0</span></h1>
        <div style={{textAlign:"right"}}>
          <p style={S.firmName}>FARRUKH CONSULTANT | LAHORE</p>
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
        <NewCase 
          onSave={(c)=>{
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

// --- DASHBOARD: VAULT & ARCHIVE ---
function Dashboard({ clients, onOpen, onNew, onSync, onArchive, syncing }) {
  const [showArchived, setShowArchived] = useState(false);
  const filtered = clients.filter(c => !!c.archived === showArchived);

  return (
    <div style={S.container}>
      <div style={S.flexBetween}>
        <h2 style={{color: "#00ff88"}}>{showArchived ? "📁 ARCHIVE" : "🗂️ ACTIVE VAULT"}</h2>
        <div style={{display:"flex", gap:10}}>
          <button onClick={() => setShowArchived(!showArchived)} style={S.btnSmall}>
            {showArchived ? "SHOW ACTIVE" : "SHOW ARCHIVED"}
          </button>
          <button onClick={onSync} style={S.btnSync}>{syncing ? "SYNCING..." : "🔄 CLOUD RETRIEVE"}</button>
          <button onClick={onNew} style={S.btnAdd}>+ NEW CASE</button>
        </div>
      </div>

      <div style={S.list}>
        {filtered.length === 0 && <p style={{color:"#444"}}>Vault empty. Create a new case or sync from cloud.</p>}
        {filtered.map(c => (
          <div key={c.id} style={S.card}>
            <div>
              <div style={{fontWeight:"bold", fontSize:16, color: "#00ff88"}}>{c.name.toUpperCase()}</div>
              <div style={{fontSize:11, color:"#888"}}>{c.passport} | STATUS: {c.status || "Intake"}</div>
            </div>
            <div style={{display:"flex", gap:8}}>
              <button onClick={() => onOpen(c)} style={S.btnAction}>OPEN FILE</button>
              <button onClick={() => onArchive(c.id)} style={S.btnSmall}>
                {showArchived ? "UNARCHIVE" : "ARCHIVE"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- (CaseMaster, NewCase, Config, SecureGate, and S styles remain as finalized previously) ---
