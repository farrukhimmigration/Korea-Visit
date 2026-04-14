const processImageAI = async (base64Image) => {
    if (!config.openRouterKey) return alert("System Error: OpenRouter API Key missing in Config.");
    setScanning(true);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://korea-visit.vercel.app", 
          "X-Title": "Korea Visit AI Tool"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free", 
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Extract Name and Passport Number. Return ONLY JSON: {\"name\": \"...\", \"passport\": \"...\"}" },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }]
        })
      });

      const data = await response.json();
      
      // If OpenRouter returns an error, show the specific message
      if (data.error) {
        alert("OpenRouter Error: " + data.error.message);
        setScanning(false);
        return;
      }

      const resultText = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
      const extracted = JSON.parse(resultText);
      
      if(extracted.name) setName(extracted.name.toUpperCase());
      if(extracted.passport) setPassport(extracted.passport.toUpperCase());
    } catch (err) {
      alert("System Error: " + err.message);
    }
    setScanning(false);
  };
