import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- MAIN ENGINE (PRO BUILD) ---
function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  
  // PRO: Secure Initialization from LocalStorage
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("kp_config_v15");
      return saved ? JSON.parse(saved) : { key: "", gas: "" };
    } catch (e) {
      console.error("Storage Error", e);
      return { key: "", gas: "" };
    }
  });

  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem("kp_clients_v15");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Storage Error", e);
      return [];
    }
  });

  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);

  // PRO: Flawless State Synchronization
  useEffect(() => {
    localStorage.setItem("kp_config_v15", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("kp_clients_v15", JSON.stringify(clients));
  }, [clients]);

  if (!auth) return <div style={S.screen}><SecureGate onAccess={setAuth} /></div>;

  return (
    <div style={S.screen}>
      <div style={S.container}>
        <header style={S.header}>
          <div>
            <h1 style={S.brand}>KOREA PRIME <span style={S.version}>v15-PRO</span></h1>
            <p style={S.subText}>FARRUKH CONSULTANT | +92 309 6136 080</p>
          </div>
          <button onClick={() => setView("config")} style={S.btnIcon}>⚙️ SECURE CONFIG</button>
        </header>

        {view === "dash" && <Dashboard clients={clients} onOpen={(c) => {setActiveCase(c); setView("case");}} onNew={() => setView("new")} />}
        {view === "new" && <NewCase config={config} onSave={(c) => {setClients([c, ...clients]); setView("dash");}} onBack={() => setView("dash")} />}
        {view === "case" && <CaseMaster client={activeCase} clients={clients} setClients={setClients} config={config} onBack={() => setView("dash")} />}
        {view === "config" && <Config config={config} setConfig={setConfig} onBack={() => setView("dash")} />}
      </div>
    </div>
  );
}

// --- SECURE CONFIG COMPONENT ---
function Config({ config, setConfig, onBack }) {
  const [temp, setTemp] = useState(config);

  const handleSave = () => {
    if(!temp.key.trim() || !temp.gas.trim()) {
      alert("SYSTEM HALT: Both OpenRouter Key and Google Script URL are required.");
      return;
    }
    setConfig(temp);
    alert("SYSTEM SECURED: Credentials locked in permanent memory.");
    onBack();
  };

  return (
    <div style={S.content}>
      <h2 style={{color:"#00ff88"}}>SECURE SYSTEM CONFIGURATION</h2>
      <p style={{fontSize:12, color:"#5eb18d", marginBottom:20}}>WARNING: Ensure keys are accurate to prevent Forensic Audit failure.</p>
      
      <div style={{marginBottom: 20}}>
        <label style={{display:"block", color:"#00ff88", fontSize:12, marginBottom:5}}>OPENROUTER API KEY (THE BRAIN)</label>
        <input 
          style={S.input} 
          type="password" 
          placeholder="sk-or-v1-..." 
          value={temp.key} 
          onChange={e=>setTemp({...temp, key:e.target.value})} 
        />
      </div>

      <div style={{marginBottom: 30}}>
        <label style={{display:"block", color:"#00ff88", fontSize:12, marginBottom:5}}>GOOGLE APPS SCRIPT URL (THE HANDS)</label>
        <input 
          style={S.input} 
          placeholder="https://script.google.com/macros/s/..." 
          value={temp.gas} 
          onChange={e=>setTemp({...temp, gas:e.target.value})} 
        />
      </div>

      <div style={{display:"flex", gap:10}}>
        <button onClick={handleSave} style={S.btnAdd}>LOCK CREDENTIALS & SAVE</button>
        <button onClick={onBack} style={S.btnSmall}>CANCEL / RETURN</button>
      </div>
    </div>
  );
}

// --- THE REST OF YOUR COMPONENTS (CaseMaster, Dashboard, SecureGate, Styles) REMAIN UNCHANGED ---
// ... (Make sure your styles 'S' object is at the bottom as before)
