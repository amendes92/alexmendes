import { GoogleGenAI } from "@google/genai";
import { DoctorData } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDoctorPerformance = async (data: DoctorData): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-latest';
    const prompt = `
      You are an expert Medical Marketing and Technical SEO consultant. 
      Analyze the following JSON data for ${data.medico}.
      
      Data:
      ${JSON.stringify(data, null, 2)}
      
      Please provide:
      1. A critical assessment of their current digital presence.
      2. Specific technical recommendations to improve the PageSpeed and Security.
      3. A strategy to compete with "${data.mercado.concorrenteLider}".
      4. How they can leverage Google Cloud (Firestore, Storage) to improve their patient data handling.
      
      Format the response in Markdown with clear headings. Keep it professional and actionable.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please check your API Key configuration.";
  }
};

export const chatWithInfrastructure = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-latest',
      history: history,
      config: {
        systemInstruction: "You are a Google Cloud Platform DevOps assistant. You help the user understand the status of their Resource Manager, Firebase, Firestore, and Billing APIs. You are helpful, concise, and technical."
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error communicating with the AI assistant.";
  }
};