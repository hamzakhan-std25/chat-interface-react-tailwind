// services/geminiStrService.js
export class GeminiService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.chatHistory = [];
        this.abortController = null;
    }

    async sendMessageStream(message, callbacks = {}) {
        const {
            onStreamUpdate,
            onComplete,
            onError,
            onStart
        } = callbacks;

        // Abort previous request if any
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            this.chatHistory.push({
                role: 'user',
                parts: [{ text: message }]
            });

            if (onStart) onStart();

            const response = await fetch(
                `${this.baseURL}/gemini-2.0-flash:streamGenerateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: this.chatHistory,
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000,
                        }
                    }),
                    signal: this.abortController.signal
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                const text = data.candidates[0].content.parts[0].text;
                                fullResponse += text;

                                if (onStreamUpdate) {
                                    onStreamUpdate(fullResponse, text);
                                }
                            }
                        } catch (e) {
                            // Skip parsing errors
                        }
                    }
                }
            }

            this.chatHistory.push({
                role: 'model',
                parts: [{ text: fullResponse }]
            });

            if (onComplete) onComplete(fullResponse);

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                console.error('Stream error:', error);
                if (onError) onError(error);
            }
        } finally {
            this.abortController = null;
        }
    }

    abortRequest() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    clearHistory() {
        this.chatHistory = [];
    }

    getHistory() {
        return this.chatHistory;
    }
}

export const geminiStrService = new GeminiService(
    import.meta.env.VITE_APP_GEMINI_API_KEY
);