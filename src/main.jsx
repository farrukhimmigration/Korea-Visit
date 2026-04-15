import { useState, useEffect } from "react";

// --- CORE ENGINE: KOREA PRIME v15-SUPREME ---
function FarrukhEliteEngine() {
  const [auth, setAuth] = useState(false);
  const [view, setView] = useState("dash");
  const [activeCase, setActiveCase] = useState(null);
  
  const [config, setConfig] = useState(() => {
    const s = localStorage.getItem("kp_config");
    return s ? JSON.parse(s) : { key: "", gas: "" };
  });

  const [clients, setClients] = useState(() => {
    const s = localStorage.getItem("kp_clients");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => localStorage.setItem("kp_config", JSON.stringify(config)), [config]);
  useEffect(() => localStorage.setItem("kp_clients", JSON.stringify(clients)), [clients]);

  if (!auth) return <SecureGate onAccess={setAuth} />;

  return (
    <div style={S.screen}>
      <header style={S.header}>
        <h1 style={S.brand}>KOREA PRIME <span style={{fontSize:12, color:"#555"}}>PRO-LEGAL</span></h1>
        <div style={{textAlign:"right"}}>
          <p style={S.firmName}>FARRUKH CONSULTANT</p>
          <button onClick={() => setView("config")} style={S.btnSmall}>⚙️ CONFIG</button>
        </div>
      </header>

      {view === "dash" && <Dashboard clients={clients} onOpen={(c)=>{setActiveCase(c); setView("case");}} onNew={()=>setView("new")} />}
      {view === "new" && <NewCase onSave={(c)=>{setClients([c, ...clients]); setView("dash");}} onBack={()=>setView("dash")} />}
      {view === "case" && <CaseManager client={activeCase} setClients={setClients} clients={clients} config={config} onBack={()=>setView("dash")} />}
      {view === "config" && <Config config={config} setConfig={setConfig} onBack={()=>setView("dash")} />}
    </div>
  );
}

// --- CASE MANAGER: THE "LAWYER" WORKSPACE ---
function CaseManager({ client, clients, setClients, config, onBack }) {
  const [loading, setLoading] = useState(false);
  
  // 12 Legal Advantages & Korea Checklist
  const checklist = ["Passport", "CNIC", "FRC", "Bank Statement", "NTN/Tax", "Chamber Cert", "Polio Cert"];

  const runAdvancedAudit = async (fileBase64) => {
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
              { type: "text", text: `LEGAL DIRECTIVE FOR FARRUKH CONSULTANT (+92 309 6136 080):
                Analyze this document for a South Korea C-3-9 Visa case.
                1. IF REFUSAL: Apply PATH 1, 2, or 3 from the Strategy Matrix. If Path 1, draft a rebuttal citing Article 7 ICA.
                2. IF BANK STATEMENT: Audit for LA-10 compliance. Flag 'Window Dressing' or 'Circular Transactions'.
                3. APPLY LA-12: Detail the client's 'Economic Ties' to Pakistan to prove return intent.
                4. OUTPUT: Provide a Strength Score (0-100) and a Roman Urdu WhatsApp Update.` },
              { type: "image_url", image_url: { url: fileBase64 } }
            ]
          }]
        })
      });
      const data = await res.json();
      const report = data.choices[0].message.content;
      updateClient({ audit: report, status: "Audited" });
    } catch (e) { alert("Audit Failed. Check Config."); }
    setLoading(false);
  };

  const updateClient = (updates) => {
    const updated = {...client, ...updates};
    setClients(clients.map(c => c.id === client.id ? updated : c));
  };

  return (
    <div style={S.container}>
      <div style={S.flexBetween}>
        <h2>{client.name} | <span style={{color:"#00ff88"}}>{client.status}</span></h2>
        <button onClick={onBack} style={S.btnSmall}>← EXIT</button>
      </div>

      <div style={S.grid2}>
        {/* LEFT: Documents & Audit */}
        <div style={S.panel}>
          <h3>Forensic Document Audit</h3>
          <input type="file" onChange={(e)=>{
            const r = new FileReader();
            r.onload = () => runAdvancedAudit(r.result);
            r.readAsDataURL(e.target.files[0]);
          }} />
          {loading && <p>Analyzing via Korea Prime Engine...</p>}
          <div style={S.auditDisplay}>{client.audit || "No analysis yet."}</div>
        </div>

        {/* RIGHT: Checklist & Drafting */}
        <div style={S.panel}>
          <h3>Case Progress</h3>
          {checklist.map(item => (
            <div key={item} style={{marginBottom:8}}>
               <input type="checkbox" /> {item}
            </div>
          ))}
          <hr style={{margin:"20px 0"}} />
          <button style={S.btnAction}>📝 DRAFT DOC-2 (APPEAL)</button>
          <button style={S.btnAction}>📋 GENERATE LA-12 PROPORTIONALITY</button>
          <button style={S.btnAction} onClick={() => navigator.clipboard.writeText(client.audit)}>📱 COPY WHATSAPP UPDATE</button>
        </div>
      </div>
    </div>
  );
}

// --- STYLING (THE NEON FOREST THEME) ---
const S = {
  screen: { backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#eee", fontFamily: "monospace" },
  header: { padding: "20px", borderBottom: "1px solid #1a3a2a", display: "flex", justifyContent: "space-between" },
  brand: { color: "#00ff88", margin: 0 },
  firmName: { margin: 0, fontSize: 12, color: "#888" },
  container: { padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" },
  panel: { backgroundColor: "#111", padding: "20px", borderRadius: "8px", border: "1px solid #1a3a2a" },
  auditDisplay: { marginTop: "20px", fontSize: "13px", whiteSpace: "pre-wrap", color: "#bbb", lineHeight: "1.6" },
  btnAction: { width: "100%", padding: "12px", backgroundColor: "#00ff88", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", marginBottom: "10px", cursor: "pointer" },
  btnSmall: { padding: "5px 10px", fontSize: "11px", backgroundColor: "#222", color: "#00ff88", border: "1px solid #00ff88", cursor: "pointer" },
  flexBetween: { display: "flex", justifyContent: "space-between", alignItems: "center" }
};
