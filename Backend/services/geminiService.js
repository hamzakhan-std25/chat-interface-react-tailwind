
// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  }

  
  async generateResponseStream(chatHistory, onChunk, onComplete, onError, options = {}) {
    try {
      const result = await this.model.generateContentStream({
        contents: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      let fullResponse = '';
      let canceled = false;

      for await (const chunk of result.stream) {
        if (options?.shouldCancel && options.shouldCancel()) {
          canceled = true;
          break;
        }
        const chunkText = chunk.text();
        fullResponse += chunkText;

        if (onChunk) {
          onChunk(chunkText, fullResponse);
        }
      }

      if (onComplete) {
        onComplete(fullResponse);
      }

      return fullResponse;

    } catch (error) {
      if (error.status === 429) {
        console.error("Quota exceeded. Please wait a moment before trying again.");
        // You can return a custom message to the frontend here
        throw new Error("Bot is sleepy (Rate Limit). Try again in 30 seconds.");
      }
      if (onError) onError(error);
      throw error;
    }
  }

  async generateResponse(chatHistory) {
    try {
      console.log('inside generate response: try');
      console.log('gemin api key :', process.env.GEMINI_API_KEY)


      const result = await this.model.generateContent({
        contents: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate response');
    }
  }
}

module.exports = new GeminiService();