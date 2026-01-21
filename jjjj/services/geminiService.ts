import { GoogleGenAI } from "@google/genai";
import { Task, Habit } from '../types';

// Initialize the client
// Note: process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const getMotivation = async (habits: Habit[], tasks: Task[]): Promise<string> => {
  try {
    const completedTasks = tasks.filter(t => t.completed).length;
    const completedHabits = habits.filter(h => h.completedToday).length;
    
    const prompt = `
      You are a high-energy productivity coach. 
      The user has completed ${completedTasks} tasks and ${completedHabits} habits today.
      Total pending tasks: ${tasks.length - completedTasks}.
      Give a short, punchy, 2-sentence motivational quote or advice specific to this status.
      Do not use markdown. Just plain text.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Keep pushing forward! You're doing great.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Focus on the step in front of you, not the whole staircase.";
  }
};

export const suggestSubtasks = async (taskTitle: string): Promise<string[]> => {
  try {
    const prompt = `
      Break down the following task into 3-5 smaller, actionable sub-steps.
      Task: "${taskTitle}"
      Return ONLY a JSON array of strings. No markdown formatting.
      Example: ["Step 1", "Step 2"]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getProductivityTip = async (topic: string): Promise<string> => {
  try {
    const prompt = `
      Provide a unique, unconventional, and highly effective productivity hack or psychological trick regarding "${topic}". 
      Keep it under 60 words. Be witty and actionable. 
      Do not use markdown.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Consistency is key. Just start small.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Action creates motivation, not the other way around.";
  }
};