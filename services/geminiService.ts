import { GoogleGenAI } from "@google/genai";
import { JournalEntry } from "../types";

// NOTE: In a real app, do not expose API keys on the client.
// This requires a proxy or server-side handling for production.
// For this demo, we assume the user might provide it or it's in env.
const API_KEY = process.env.API_KEY || ''; 

let aiClient: GoogleGenAI | null = null;

if (API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
}

export const isApiReady = () => !!aiClient;

export const chatWithAgent = async (
    model: string, 
    systemPrompt: string, 
    userMessage: string,
    contextData: JournalEntry[]
): Promise<string> => {
    if (!aiClient) return "API Key not configured.";

    // Simplify context for token limit efficiency
    const contextString = JSON.stringify(contextData.slice(-14)); // Last 2 weeks

    const fullPrompt = `
${systemPrompt}

CONTEXT DATA (Last 14 entries):
${contextString}

USER QUESTION:
${userMessage}
    `;

    try {
        const response = await aiClient.models.generateContent({
            model: model,
            contents: fullPrompt,
        });
        return response.text || "No response generated.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error communicating with the agent.";
    }
};

export const runMagic = async (
    magicType: 'narrative' | 'mood' | 'pattern' | 'socratic',
    entry: JournalEntry | JournalEntry[]
): Promise<string> => {
    if (!aiClient) return "API Key not configured.";

    let prompt = "";
    let model = "gemini-2.5-flash";

    switch(magicType) {
        case 'narrative':
            prompt = `Transform the following daily log into a cohesive, first-person journal entry story. Make it engaging. Data: ${JSON.stringify(entry)}`;
            model = "gemini-3-flash-preview";
            break;
        case 'mood':
            prompt = `Analyze the sentiment of this entry. Return ONLY a JSON object with this format: {"score": number (-1 to 1), "color": "hex code", "emoji": "single emoji", "summary": "2 word summary"}. Data: ${JSON.stringify(entry)}`;
            break;
        case 'pattern':
            prompt = `Scan these entries and find one subtle correlation or pattern between habits, mood, and achievements. Be insightful. Data: ${JSON.stringify(entry)}`;
            model = "gemini-3-pro-preview";
            break;
        case 'socratic':
             prompt = `Play Devil's Advocate. Look at the commitments in this entry: ${JSON.stringify(entry)}. Challenge them based on the adventures or obstacles listed. Be brief and punchy.`;
             break;
    }

    try {
        const response = await aiClient.models.generateContent({
            model: model,
            contents: prompt,
            config: magicType === 'mood' ? { responseMimeType: 'application/json' } : undefined
        });
        return response.text || "";
    } catch (error) {
        console.error("Magic Error:", error);
        return "Magic spell failed.";
    }
};

export const organizeNotes = async (rawText: string): Promise<string> => {
    if (!aiClient) return "API Key missing";
    
    const prompt = `
    Organize the following messy notes into clean Markdown.
    1. Fix grammar/spelling.
    2. Use H1 for title, H2 for sections.
    3. Extract action items into a checklist.
    4. Add tags at the bottom.
    
    Notes:
    ${rawText}
    `;

    try {
         const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Could not organize notes.";
    } catch (error) {
        return "Error organizing notes.";
    }
}