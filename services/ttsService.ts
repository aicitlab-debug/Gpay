import { GoogleGenAI, Modality } from "@google/genai";

export async function playClickSound() {
  try {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.3;
    await audio.play();
  } catch (error) {
    // Silent fail for clicks
  }
}

export async function playSuccessSound() {
  try {
    // Using a clean, professional success chime
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.5;
    await audio.play();
  } catch (error) {
    console.error("Sound Effect Error:", error);
  }
}

export async function speakMalayalamSuccess() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = "Say in Malayalam: പൈസ അയച്ചു (Paisa ayachu)";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      try {
        // More robust conversion of base64 to Blob
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Try mpeg as it's common for TTS outputs
        const blob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onended = () => URL.revokeObjectURL(url);
        audio.onerror = (e) => {
          console.error("Audio element error:", e);
          URL.revokeObjectURL(url);
        };

        await audio.play();
      } catch (convError) {
        console.error("Base64 conversion error:", convError);
      }
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
}
