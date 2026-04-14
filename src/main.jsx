const processImageAI = async (base64Image) => {
    if (!config.openRouterKey) return alert("System Error: OpenRouter API Key missing in Config.");
    setScanning(true);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://korea-visit.vercel.app", // Required by OpenRouter
          "X-Title": "Korea Visit AI"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free", // Use the 100% Free Model
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "You are an immigration assistant. Extract the full name and passport number from this ID document. Return ONLY a JSON object: {\"name\": \"NAME HERE\", \"passport\": \"NUMBER HERE\"}" },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const resultText = data.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
      const extracted = JSON.parse(resultText);
      
      if(extracted.name) setName(extracted.name.toUpperCase());
      if(extracted.passport) setPassport(extracted.passport.toUpperCase());
    } catch (err) {
      console.error(err);
      alert("AI Error: " + err.message + ". Ensure your OpenRouter key has at least $0.01 credit or use a free model.");
    }
    setScanning(false);
  };
