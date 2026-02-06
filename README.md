---
title: My Node Backend
sdk: docker
app_port: 7860
---



# Chat-Bot (React + Node + WebSocket + Gemini)

A real-time AI chat application with a polished UI, streaming responses, voice message support, and session management. The app now includes improved front-end UX (accessible controls, keyboard shortcuts, auto-growing input, skeleton loading) and backend support to cancel long generations mid-stream.

![Hero Preview Placeholder](Preview/hero.jpg)

## Features

- Real-time chat via WebSocket with streaming tokens
- Stop generating: cancel an in-flight response and keep partial text
- Voice messages: record and upload, then get AI response
- Accessible UI: aria labels, keyboard shortcuts, focus styles, aria-live
- Auto-grow input: Enter=send, Shift+Enter=newline, Ctrl/Cmd+Enter=send
- Message actions: copy, like/dislike (tri-state), text-to-speech
- Session sidebar: mobile drawer with ESC to close and body-scroll lock
- Notifications: concise connection and error toasts

![Chat Interface Preview](Preview/Chat-interface.png)

## Tech Stack

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express + ws (WebSocket)
- LLM: Google Gemini (generative AI)
- Auth: Firebase (client-side)
- Storage/DB: Supabase (sessions/messages) [as applicable to your env]

## Project Structure

- react-app/ — frontend app
  - src/pages/Chat — ChatPanel, ChatMessage, VoiceRecorderModal
  - src/components — Sidebar, Notifications
  - src/pages/About — About landing page
- Backend/ — server, routes, services, websocket streaming

## Getting Started

1. Install deps

```bash
# root
npm install
# frontend
cd react-app && npm install
# backend
cd ../Backend && npm install
```

2. Environment

- react-app/.env
  - VITE_FIREBASE_API_KEY=...
  - etc.
- Backend/.env
  - GEMINI_API_KEY=...
  - SUPABASE_URL=...
  - SUPABASE_SERVICE_ROLE=...

3. Run locally

```bash
# From project root in two terminals
# Backend
cd Backend && npm run dev

# Frontend
cd react-app && npm run dev
```

Navigate to https://chat-bot-beige-chi.vercel.app/

Note: Ensure the WebSocket URL in ChatPanel.jsx matches your backend (ws://localhost:8080 for local dev). A production reverse proxy should expose a proper wss:// endpoint.

## Recent Improvements

- UI
  - Skeleton loading bubble for assistant responses (reduces layout shift)
  - Stop generating button and improved connection status (aria-live)
  - Auto-growing textarea, consistent shortcuts, accessible buttons and tooltips
  - Tri-state like/dislike reactions for assistant messages
- Backend
  - Handling for { type: 'cancel' } to stop generation streaming cleanly
  - Partial text is finalized and sent as message_complete


## RAG-Powered Intelligence

Even stronger answers with grounded knowledge are planned via Retrieval-Augmented Generation (RAG).

- Knowledge Base: structured docs (services, projects, FAQs) in Markdown with metadata
- Embeddings: semantic vectors (e.g., OpenAI/Cohere/e5) stored with pgvector
- Vector Store + Hybrid Search: combine dense vector similarity with BM25/FTS for better recall
- Retrieval Pipeline: query → embed → top-k semantic + keyword matches → rerank → prompt with citations
- Citations: linkable sources under each assistant message to build trust and let users dive deeper

Status: planned and actively being prepared; the UI already has space to show citations when enabled.


## Native PWA Experience

Installable, fast, and offline-friendly.

- Manifest + icons: site.webmanifest and platform icons for Add to Home Screen
- Service worker: offline fallback page (offline.html) and asset caching
- App-like shell: responsive layout works well as a standalone PWA
- Performance: efficient bundles and minimal layout shift for smooth interactions

Build for production to enable the full PWA flow; install prompts appear on supported browsers.


## Real-Time Performance & Layout

Built for responsiveness and clarity during streamed conversations.

- WebSocket streaming: tokens appear as they arrive for instant feedback
- Skeleton bubble: assistant-side placeholder reduces layout shift (CLS) while streaming
- Input ergonomics: auto-growing textarea, Enter/Shift+Enter/Ctrl/Cmd+Enter shortcuts
- Accessibility: aria-live for connection state, labeled controls, focus rings
- Lightweight animations: subtle transitions tuned to keep 60fps on modest hardware
- Mobile-first: sticky New Chat in the drawer and body scroll lock when open


## Roadmap

- RAG (Knowledge Base + Embeddings + Vector Search + Retrieval)
- Citations + Sources UI for assistant answers
- Session rename/delete/export; rename from sidebar
- Improved WebSocket reconnection, heartbeats

## License

MIT
