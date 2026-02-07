// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chatHistory = [];
  }

  async sendMessage(message) {
    try {
      // Add user message to chat history
      this.chatHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Generate content with chat history context
      const result = await this.model.generateContent({
        contents: this.chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const response = await result.response;
      const responseText = response.text();

      // Add AI response to chat history
      this.chatHistory.push({
        role: 'model',
        parts: [{ text: responseText }]
      });

      return {
        success: true,
        message: responseText,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error. Please try again.',
        error: error.message
      };
    }
  }

  // Clear chat history
  clearHistory() {
    this.chatHistory = [];
  }

  // Get current chat history
  getHistory() {
    return this.chatHistory;
  }
}

export default new GeminiService();