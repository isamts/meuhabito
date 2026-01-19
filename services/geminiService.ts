import { GoogleGenAI } from "@google/genai";
import { Habit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalQuote = async (habits: Habit[]): Promise<string> => {
  try {
    const habitNames = habits.map(h => h.name).join(", ");
    
    // Fallback if no habits exist yet
    if (!habitNames) {
      return "Comece hoje a construir a melhor versão de si mesmo. Adicione seu primeiro hábito!";
    }

    const prompt = `
      O usuário tem os seguintes hábitos: ${habitNames}.
      Crie uma frase curta, gentil e motivacional (máximo 20 palavras) em Português para inspirá-lo a continuar.
      O tom deve ser 'soft', acolhedor e positivo (bloom aesthetic).
      Não use formatação markdown, apenas texto puro.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Continue florescendo, um dia de cada vez!";
  } catch (error) {
    console.error("Error fetching motivation:", error);
    return "Cada pequeno passo é uma vitória. Continue firme!";
  }
};
