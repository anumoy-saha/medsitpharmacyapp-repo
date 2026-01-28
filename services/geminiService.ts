
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Analyzes a prescription image and extracts a clean list of medicine names.
 */
export const analyzePrescriptionImage = async (base64Image: string, mimeType: string): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please set VITE_API_KEY environment variable.');
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: "Identify all medication names in this prescription. Look for brand names or generic names. Ignore instructions, patient details, and clinic headers. Return the results as a JSON array of strings containing ONLY the names of the medicines found. If no medicines are found, return an empty array [].",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "The name of a medicine found on the prescription."
        },
      },
      temperature: 0.1, // Low temperature for higher accuracy in extraction
    },
  });

  try {
    const text = response.text || "[]";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Prescription Analysis Error:", error);
    return [];
  }
};

/**
 * Handles conversational AI for the health assistant.
 */
export const getAssistantResponse = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  userContext: { name: string, reminders: any[], membershipType: string, currentTime: string }
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please set VITE_API_KEY environment variable.');
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are 'Medsit AI', a deeply empathetic, warm, and highly knowledgeable personal health companion. 
  Your persona is that of a caring friend who is also a medical expert.
  
  User Profile:
  - Name: ${userContext.name}
  - Membership: ${userContext.membershipType}
  - Current Local Time: ${userContext.currentTime}
  - Medication Reminders: ${JSON.stringify(userContext.reminders)}
  
  Your Core Missions:
  1. Persona: Be exceptionally kind and supportive.
  2. Health Tips: Proactively offer one personalized health tip.
  3. Medication Reminders: Gently remind them if a med is due soon.
  4. Consultations: Warmly suggest booking a call with Dr. Priya Sharma or Dr. Rajesh Kumar if symptoms sound serious.
  
  Rules:
  - Use emojis (🌿, 💧, 🧡).
  - NEVER provide specific dosages or definitive diagnoses.
  - Always add a disclaimer that you are an AI.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.8,
    },
  });

  return response.text || "I'm having a little trouble connecting. Please try again, I'm here for you! 🧡";
};
