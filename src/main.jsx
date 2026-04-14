// ============================================================
// PROJECT: Korea-Visit | VERSION 5.0 (LIVE AI & DRIVE SYNC)
// FIRM: Farrukh Consultant | Principal: Farrukh Nadeem
// CONTACT: +92 309 6136080 | EMAIL: farrukhimmigration@gmail.com
// ============================================================
import { StrictMode, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

function KoreaVisit() {
  const [auth, setAuth] = useState(null);
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("fc_clients_v5");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Secure Local Storage for API Keys (Keeps it off GitHub)
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("fc_config");
    return saved ? JSON.parse(saved) : { openRouterKey: "", gasUrl: "" };
  });

  const [view, setView] = useState("dash"); // dash, registry, manage, config
  const [activeClient, setActiveClient] = useState(null);

  useEffect(() => { localStorage.setItem("fc_clients_v5", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem("fc_config", JSON.stringify(config)); }, [config]);

  if (!auth) return <div style={S.screen}><SecureGate onAccess={setAuth} /></div>;

  return (
    <div style={S.screen}>
      <div style={S.dashboard}>
        <header style={S.header}>
          <div onClick={() => {setView("dash"); setActiveClient(null);}} style={{cursor:"pointer"}}>
            <span style={{color:"#00ff88", fontWeight:900, letterSpacing:2}}>KOREA-VISIT</span>
          </div>
          <div style={{textAlign:"right", fontSize:11}}>
            <strong style={{color:"#00ff88"}}>MASTER ACCESS</strong><br/>
            <span style={{color:"#234d36", cursor:"pointer", textDecoration:"underline"}} onClick={()=>setView("config")}>
              ⚙️ SYSTEM CONFIG
            </span>
          </div>
        </header>

        {view === "dash" && (
          <div style={S.content}>
            <div style={S.statusBadge}>API CONNECTIONS ACTIVE</div>
            <h2 style={S.h2}>MASTER CONSOLE</h2>
            <div style={S.grid}>
              <div style={S.moduleCardActive} onClick={() => setView("registry")}>
                CLIENT REGISTRY & AI SCANNER
                <p style={S.tagActive}>{clients.length} CASES FILED</p>
              </div>
            </div>
          </div>
        )}

        {view === "config" && <ConfigManager config={config} setConfig={setConfig} onBack={() => setView("dash")} />}
        {view === "registry" && <ClientRegistry clients={clients} setClients={setClients} config={config} onManage={(c) => {setActiveClient(c); setView("manage");}} onBack={() => setView("dash")} />}
        {view === "manage" && <CaseManager client={activeClient} clients={clients} setClients={setClients} config={config} onBack={() => setView("registry")} />}

        <footer style={S.footer}>
          Farrukh Consultant | farrukhimmigration@gmail.com | +92 309 6136080
        </footer>
      </div>
    </div>
  );
}

// --- SECURE CONFIGURATION MANAGER ---
function ConfigManager({ config, setConfig, onBack }) {
  const [keys, setKeys] = useState(config);
  const save = () => { setConfig(keys); alert("System Configuration Saved Locally."); onBack(); };
  return (
    <div style={S.content}>
      <h2 style={S.h2}>SYSTEM CONFIGURATION</h2>
      <p style={{color:"#5eb18d", fontSize:12, marginBottom:20}}>Keys are stored securely in your browser's local storage.</p>
      
      <div style={{marginBottom:15}}>
        <label style={S.label}>OPENROUTER API KEY (For Document AI)</label>
        <input type="password" style={S.inputReg} value={keys.openRouterKey} onChange={e=>setKeys({...keys, openRouterKey: e.target.value})} />
      </div>
      
      <div style={{marginBottom:25}}>
        <label style={S.label}>GOOGLE APPS SCRIPT URL (For Drive Sync)</label>
        <input type="text" style={S.inputReg} value={keys.gasUrl} onChange={e=>setKeys({...keys, gasUrl: e.target.value})} />
      </div>
      
      <button onClick={save} style={S.btnAction}>SAVE CONFIGURATION</button>
      <button onClick={onBack} style={S.btnDim}>CANCEL</button>
    </div>
  );
}

// --- FUNCTIONAL AI SCANNER & REGISTRY ---
function ClientRegistry({ clients, setClients, config, onManage, onBack }) {
  const [name, setName] = useState("");
  const [passport, setPassport] = useState("");
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef(null);

  const processImageAI = async (base64Image) => {
    if (!config.openRouterKey) return alert("System Error: OpenRouter API Key missing in Config.");
    setScanning(true);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.openRouterKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-pro-vision", // Or qwen/qwen-vl-plus
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Extract the full name and passport number from this ID document. Return ONLY a JSON object in this format, nothing else: {\"name\": \"JOHN DOE\", \"passport\": \"AB123456\"}" },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }]
        })
      });

      const data = await response.json();
      const resultText = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
      const extracted = JSON.parse(resultText);
      
      if(extracted.name) setName(extracted.name.toUpperCase());
      if(extracted.passport) setPassport(extracted.passport.toUpperCase());
    } catch (err) {
      alert("AI Extraction Failed. Please enter manually.");
    }
    setScanning(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => processImageAI(reader.result);
    reader.readAsDataURL(file);
  };

  const addClient = (e) => {
    e.preventDefault();
    if (!name || !passport) return;
    const newClient = { id: Date.now(), name, passport, status: "PREPARING", fileUrls: [], date: new Date().toLocaleDateString() };
    setClients([newClient, ...clients]);
    setName(""); setPassport("");
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={S.content}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2 style={S.h2}>CASE REGISTRY</h2>
        <button onClick={onBack} style={S.btnSmall}>DASHBOARD</button>
      </div>

      <div style={S.scanBox}>
        <p style={{fontSize:12, color:"#00ff88", margin:"0 0 10px 0"}}>1. AUTO-FILL VIA AI OCR</p>
        <input type="file" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} style={{color:"#5eb18d", fontSize:11}} />
        {scanning && <span style={{color:"#ffcc00", fontSize:11, marginLeft:10, fontWeight:"bold"}}>AI ANALYZING...</span>}
      </div>

      <form onSubmit={addClient} style={S.regForm}>
        <input style={S.inputReg} placeholder="CLIENT NAME" value={name} onChange={e=>setName(e.target.value)} />
        <input style={S.inputReg} placeholder="PASSPORT #" value={passport} onChange={e=>setPassport(e.target.value)} />
        <button type="submit" style={S.btnAdd}>OPEN CASE</button>
      </form>

      <div style={S.listContainer}>
        {clients.map(c => (
          <div key={c.id} style={S.clientRow} onClick={() => onManage(c)}>
            <div>
              <div style={{color:"#00ff88", fontWeight:"bold"}}>{c.name}</div>
              <div style={{color:"#234d36", fontSize:10}}>{c.passport} | {c.status}</div>
            </div>
            <div style={{color:"#5eb18d", fontSize:12}}>MANAGE ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FUNCTIONAL DRIVE SYNC & CASE MANAGER ---
function CaseManager({ client, clients, setClients, config, onBack }) {
  const [uploading, setUploading] = useState(false);

  const updateStatus = (status) => setClients(clients.map(c => c.id === client.id ? {...c, status} : c));

  const uploadToDrive = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!config.gasUrl) return alert("Google Drive API URL missing in System Config.");
    
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      
      try {
        const response = await fetch(config.gasUrl, {
          method: "POST",
          body: JSON.stringify({
            clientName: client.name,
            passport: client.passport,
            fileName: file.name,
            mimeType: file.type,
            base64: base64Data
          }) // Send as text to bypass CORS preflight
        });
        
        const result = await response.json();
        if (result.status === "success") {
          const updatedClient = { ...client, fileUrls: [...(client.fileUrls || []), {name: file.name, url: result.fileUrl}] };
          setClients(clients.map(c => c.id === client.id ? updatedClient : c));
          alert("Document synced to Farrukh Consultant Drive successfully.");
        } else {
          alert("Drive Error: " + result.message);
        }
      } catch (err) {
        alert("Network Error during Drive Sync.");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const generateCoverLetter = () => {
    const text = `[FIRM HEADER: FARRUKH CONSULTANT]\n[CONTACT: +92 309 6136080 | farrukhimmigration@gmail.com]\n\nDate: ${new Date().toLocaleDateString()}\nTo: The Embassy of the Republic of Korea\n\nSubject: Visa Application Cover Letter for ${client.name}\nPassport No: ${client.passport}\n\nRespected Sir/Madam,\n\nI am acting as the legal consultant for the applicant, ${client.name}. Attached are the verified documents supporting their visit to South Korea...\n\nSincerely,\nFarrukh Nadeem\nPrincipal Consultant`;
    
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${client.name}_Cover_Letter.txt`;
    link.click();
  };

  return (
    <div style={S.content}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:20}}>
        <h2 style={S.h2}>CASE: {client.name}</h2>
        <button onClick={onBack} style={S.btnSmall}>BACK</button>
      </div>
      
      <div style={S.statusRow}>
        <span style={{fontSize:12, color:"#5eb18d"}}>STATUS:</span>
        <select value={client.status} onChange={(e) => updateStatus(e.target.value)} style={S.select}>
          <option value="PREPARING">PREPARING</option>
          <option value="SUBMITTED">SUBMITTED</option>
        </select>
        <button onClick={generateCoverLetter} style={S.btnDrive}>📥 DOWNLOAD COVER LETTER</button>
      </div>

      <div style={S.panel}>
        <h3 style={{fontSize:14, color:"#00ff88", margin:"0 0 10px 0"}}>SECURE DRIVE VAULT</h3>
        <p style={{fontSize:11, color:"#5eb18d"}}>Upload documents. They will automatically be sent to your Google Drive folder: "Farrukh Consultant - Client Files"</p>
        
        <input type="file" onChange={uploadToDrive} style={{color:"#00ff88", marginTop:10}} />
        {uploading && <div style={{color:"#ffcc00", fontSize:12, marginTop:10}}>SYNCING TO GOOGLE DRIVE... PLEASE WAIT.</div>}

        <div style={{marginTop:20}}>
          {client.fileUrls && client.fileUrls.map((f, i) => (
             <div key={i} style={{padding:"8px", background:"#030b07", border:"1px solid #163a24", marginBottom:5, fontSize:11}}>
                ✅ <a href={f.url} target="_blank" style={{color:"#00ff88", textDecoration:"none"}}>{f.name}</a>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- LOGIN GATEWAY ---
function SecureGate({ onAccess }) {
  const [pin, setPin] = useState("");
  const verify = (e) => { e.preventDefault(); if (pin === "2026") onAccess(true); else setPin(""); };
  return (
    <div style={S.card}>
      <h1 style={S.h1}>FARRUKH CONSULTANT</h1>
      <p style={S.sub}>MASTER TERMINAL v5</p>
      <form onSubmit={verify}><input type="password" placeholder="PIN" value={pin} onChange={e=>setPin(e.target.value)} style={S.input} /><button type="submit" style={S.btn}>INITIALIZE SYSTEM</button></form>
    </div>
  );
}

// --- STYLES ---
const S = {
  screen: { height:"100vh", background:"#020705", color:"#d1ffea", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", margin:0 },
  dashboard: { width:"95%", maxWidth:1000, height:"90vh", background:"#06120a", border:"1px solid #163a24", display:"flex", flexDirection:"column", overflow:"hidden" },
  header: { padding:"15px 25px", borderBottom:"1px solid #163a24", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#030b07" },
  content: { padding:30, flex:1, overflowY:"auto" },
  h2: { color:"#00ff88", letterSpacing:1, margin:0, fontSize:18 },
  statusBadge: { width:"fit-content", padding:"4px 12px", background:"rgba(0, 255, 136, 0.1)", color:"#00ff88", borderRadius:20, fontSize:10, fontWeight:"bold", border:"1px solid #00ff88", marginBottom:10 },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:20, marginTop:20 },
  moduleCardActive: { padding:30, background:"#0a1d12", border:"1px solid #00ff88", borderRadius:6, color:"#00ff88", cursor:"pointer", textAlign:"center", fontWeight:"bold" },
  tagActive: { fontSize:10, color:"#5eb18d", marginTop:10 },
  scanBox: { marginTop:20, padding:15, border:"1px dashed #00ff88", background:"#0a1d12", borderRadius:6 },
  regForm: { display:"flex", gap:10, margin:"15px 0", paddingBottom:20, borderBottom:"1px solid #163a24" },
  inputReg: { width:"100%", padding:12, background:"#030b07", border:"1px solid #163a24", color:"#00ff88", outline:"none", boxSizing:"border-box" },
  btnAdd: { padding:"0 20px", background:"#00ff88", border:"none", fontWeight:"bold", cursor:"pointer", color:"#020705" },
  listContainer: { marginTop:10 },
  clientRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:15, background:"#0a1d12", border:"1px solid #163a24", marginBottom:10, borderRadius:4, cursor:"pointer" },
  btnSmall: { background:"none", border:"1px solid #00ff88", color:"#00ff88", padding:"5px 15px", cursor:"pointer", fontSize:11 },
  statusRow: { margin:"20px 0", padding:15, background:"#030b07", borderRadius:6, display:"flex", alignItems:"center", gap:15 },
  select: { background:"#0a1d12", color:"#00ff88", border:"1px solid #163a24", padding:8 },
  btnDrive: { background:"#00ff88", color:"#020705", border:"none", padding:"8px 15px", borderRadius:4, cursor:"pointer", fontSize:11, fontWeight:"bold", marginLeft:"auto" },
  panel: { padding:20, background:"#0a1d12", border:"1px solid #163a24", borderRadius:6 },
  btnAction: { padding:12, background:"#00ff88", color:"#020705", border:"none", fontWeight:"bold", marginTop:15, cursor:"pointer", marginRight:10 },
  btnDim: { padding:12, background:"none", color:"#5eb18d", border:"1px solid #163a24", fontWeight:"bold", marginTop:15, cursor:"pointer" },
  footer: { padding:15, borderTop:"1px solid #0d1a0f", fontSize:10, color:"#234d36", textAlign:"center" },
  card: { background:"#06120a", padding:40, borderRadius:12, border:"1px solid #163a24", textAlign:"center", width:320 },
  h1: { fontSize:18, color:"#00ff88", margin:0 },
  sub: { fontSize:10, color:"#234d36", marginBottom:20 },
  input: { width:"100%", padding:12, background:"#0a1d12", border:"1px solid #163a24", color:"#00ff88", fontSize:20, textAlign:"center", boxSizing:"border-box" },
  btn: { width:"100%", padding:12, background:"#00ff88", color:"#020705", border:"none", fontWeight:800, cursor:"pointer", marginTop:15 },
  label: { fontSize:11, color:"#5eb18d", display:"block", marginBottom:5, fontWeight:"bold" }
};

createRoot(document.getElementById("root")).render(<StrictMode><KoreaVisit /></StrictMode>);
