// services/geminiSimpleService.js


class GeminiSimpleService {



    constructor() {
        this.apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.chatHistory = [];
    }
    
    async sendMessage(message) {
        try {
            // For Gemini Pro try both endpoints
            // const endpoint = `${this.baseURL}/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
            const endpoint = `${this.baseURL}/gemini-2.0-flash:streamGenerateContent?key=${this.apiKey}`;

            let response;
            let lastError;




            try {
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{
                                text: this.chatHistory.map(msg => msg.parts[0].text).join('\n') + '\n' + message
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000,
                        }
                    })
                });


            } catch (error) {
                lastError = error;
                console.log(lastError);
                // continue;
            }


            if (!response || !response.ok) {
                throw lastError || new Error(`HTTP error! status: ${response?.status}`);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0]) {
                throw new Error('Invalid response format from API');
            }

            const responseText = data.candidates[0].content.parts[0].text;

            // Update chat history
            this.chatHistory.push({
                role: 'user',
                parts: [{ text: message }]
            });
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

    clearHistory() {
        this.chatHistory = [];
    }

    getHistory() {
        return this.chatHistory;
    }
}

export default new GeminiSimpleService();