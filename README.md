<div align="center">

# EduCards

**AI-Powered Smart Flashcard Platform for International O & A Level Students**

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-brightgreen?style=for-the-badge)](https://educards.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

*A full-stack study companion that transforms how Cambridge International students create, study, and test themselves on flashcards — powered by AI-generated quizzes with real-time feedback.*

---

</div>

## The Problem

Every year, over **175,000 students** across **160+ countries** sit for Cambridge International O & A Level examinations. These students face a uniquely structured curriculum — subject codes like **0620 (Chemistry)**, **9701 (Physics)**, **0500 (English)** — with syllabi that demand precise recall of definitions, reactions, formulas, and processes.

Existing flashcard tools (Quizlet, Anki, Brainscape) were built for **general audiences**. None of them solve the specific problems O/A Level students face:

- **No subject-topic hierarchy** aligned with Cambridge syllabus structure (Subject → Topic → Concept)
- **No intelligent testing** — students manually create quizzes or flip cards passively without measuring retention
- **No instant quiz generation** from existing flashcards using AI
- **No timer-based MCQ testing** that simulates actual exam pressure
- **Poor mobile experience** — most tools aren't optimized for the phones these students actually use

**EduCards solves all of this.** Built by someone who teaches these students daily, it was designed from the ground up for the Cambridge International classroom.

---

## Key Features

### AI-Powered Quiz Engine
- Automatically generates **multiple-choice questions** from your flashcards using **Groq (Llama 3.3 70B)** with **Google Gemini 2.0 Flash** as fallback
- Produces **3 plausible distractors** per question — not random wrong answers, but contextually relevant ones that test real understanding
- **60-second countdown timer** with color-coded urgency transitions (green → yellow → red)
- Instant per-question feedback with correct/wrong highlighting
- Detailed score breakdown with percentage, trophy system, and motivational feedback
- "AI Powered" badge displayed throughout the quiz experience

### Interactive Flashcard System
- **Three-level hierarchy**: Subject → Topic → Flashcard — mirrors Cambridge syllabus structure
- **Flip-card study mode** with spring physics animations — click to reveal the answer
- **Card navigation** with Previous/Next, Shuffle, and Reset controls
- **Inline card creation** — add new flashcards without leaving study mode
- Glowing border effect on answer reveal for visual satisfaction

### Full CRUD Management
- Create, read, and delete Subjects, Topics, and Flashcards
- Cascade deletion — removing a Subject deletes all its Topics and Flashcards
- Confirmation dialogs for all destructive actions
- Real-time UI updates with optimistic rendering

### Design & UX
- **Dark glassmorphism theme** — translucent cards with backdrop blur
- **Spring-based animations** using Motion (Framer Motion) for page transitions, card stagger effects, and micro-interactions
- **Responsive grid layouts** — works seamlessly on desktop, tablet, and mobile
- Custom visual effects: gradient sweeps, floating particles, button shine, glitch text
- Page transitions with blur and fade using AnimatePresence
- Time-of-day greeting (Good Morning / Afternoon / Evening / Night)

### Legal & Support
- Privacy Policy and Terms of Service pages
- Contact Support page with WhatsApp integration and FAQ section
- Vercel Analytics for usage tracking

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + TypeScript 5.8 | SPA with client-side routing |
| **Styling** | Tailwind CSS 4.1 | Utility-first with custom animations |
| **Animations** | Motion (Framer Motion) 12 | Spring physics, AnimatePresence |
| **Routing** | React Router 7.13 | BrowserRouter with 7 routes |
| **Build Tool** | Vite 6.2 | Fast HMR in dev, optimized production builds |
| **Backend (Dev)** | Express.js 4.21 | REST API on Node.js with tsx |
| **Backend (Prod)** | Vercel Serverless Functions | Individual route handlers, 60s max duration |
| **Database** | MongoDB Atlas + Mongoose 9.3 | Cloud-hosted NoSQL with ODM |
| **AI — Primary** | Groq API (Llama 3.3 70B) | Quiz question & distractor generation |
| **AI — Fallback** | Google Gemini 2.0 Flash | Automatic failover if Groq is unavailable |
| **Deployment** | Vercel | CDN, serverless API, SPA rewrites |
| **Analytics** | Vercel Analytics | Real-time web analytics |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Edge                       │
│                                                      │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │   React SPA  │────▶│  Vercel Serverless API   │  │
│  │  (Vite Build)│     │  api/v1/*.ts             │  │
│  └──────────────┘     └────────────┬─────────────┘  │
│                                    │                  │
│                           ┌────────▼────────┐        │
│                           │  MongoDB Atlas   │        │
│                           │  (Mongoose ODM)  │        │
│                           └────────┬────────┘        │
│                                    │                  │
│                    ┌───────────────▼───────────────┐  │
│                    │  AI Quiz Generation Pipeline  │  │
│                    │  Groq (Primary) → Gemini (FB) │  │
│                    └───────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Dual Backend Architecture:**
- **Local dev**: Express server with Vite HMR middleware — single process handles both API and frontend
- **Production**: Static SPA served from Vercel CDN + individual serverless functions for each API route
- **Serverless connection caching**: MongoDB connection reused across cold starts via `global.__mongooseServerlessPromise`

---

## Project Structure

```
EduCards/
├── api/                          # Vercel Serverless Functions (Production)
│   ├── _lib/json-body.ts         # JSON body parser for raw Node.js HTTP
│   └── v1/
│       ├── subjects-list.ts      # GET subjects
│       ├── subjects/             # Subject CRUD
│       ├── topics/               # Topic CRUD + cascade delete
│       ├── flashcards/           # Flashcard CRUD
│       └── quiz/
│           └── generate.ts       # POST — AI quiz generation
├── backend/                      # Express Server (Local Development)
│   ├── server.ts                 # Express entry + Vite middleware
│   ├── db.ts                     # MongoDB connection (local + serverless)
│   ├── models.ts                 # Mongoose schemas (Subject, Topic, Flashcard)
│   └── routes.ts                 # All API routes + quiz AI logic
├── frontend/                     # React SPA
│   ├── index.html
│   └── src/
│       ├── main.tsx              # ReactDOM entry
│       ├── App.tsx               # Router configuration
│       ├── index.css             # Tailwind + custom animations
│       ├── lib/api.ts            # API client (9 functions)
│       ├── components/
│       │   ├── Layout.tsx        # App shell (header, footer, transitions)
│       │   └── ConfirmDialog.tsx # Reusable delete confirmation
│       └── pages/
│           ├── Dashboard.tsx     # Home — subject management
│           ├── SubjectView.tsx   # Topics within a subject
│           ├── TopicView.tsx     # Flashcard study mode (flip cards)
│           ├── QuizMode.tsx      # AI-powered MCQ quiz
│           ├── PrivacyPolicy.tsx
│           ├── TermsOfService.tsx
│           └── ContactSupport.tsx
├── seed.ts                       # 97 pre-built IGCSE Chemistry flashcards
├── vercel.json                   # Deployment configuration
├── vite.config.ts                # Build configuration
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/subjects-list` | List all subjects |
| `POST` | `/api/v1/subjects/create` | Create a new subject |
| `GET` | `/api/v1/subjects/:id/topics` | List topics for a subject |
| `POST` | `/api/v1/subjects/:id/topics` | Create a new topic |
| `DELETE` | `/api/v1/subjects/:id/delete` | Delete subject + all topics & flashcards |
| `GET` | `/api/v1/topics/:id/flashcards` | List flashcards for a topic |
| `POST` | `/api/v1/topics/:id/flashcards` | Create a flashcard |
| `DELETE` | `/api/v1/topics/:id/delete` | Delete topic + all flashcards |
| `DELETE` | `/api/v1/flashcards/:id` | Delete a single flashcard |
| `POST` | `/api/v1/quiz/generate` | Generate AI-powered quiz from flashcards |

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local instance or Atlas cluster)

### Installation

```bash
# Clone the repository
git clone https://github.com/tahaanwar31/EduCards.git
cd EduCards

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys:
#   MONGODB_URI=mongodb://localhost:27017/educards
#   GROQ_API_KEY=your_groq_key
#   GEMINI_API_KEY=your_gemini_key

# Start development server
npm run dev
```

### Optional: Seed the Database

```bash
npx tsx seed.ts
```

This populates the database with **97 IGCSE Chemistry flashcards** across 22 topics — ready to study and quiz immediately.

---

## AI Quiz Generation Pipeline

```
Flashcards in Topic
        │
        ▼
  Random Selection (up to 10)
        │
        ▼
  ┌─────────────┐     Success     ┌──────────────────┐
  │  Groq API   │────────────────▶│  Parse Response   │
  │  (Llama 3.3)│                 │  MCQ + Distractors│
  └──────┬──────┘                 └────────┬─────────┘
         │ Failure                         │
         ▼                                 ▼
  ┌─────────────┐                  ┌──────────────────┐
  │ Google Gemini│────────────────▶│  Shuffled Options │
  │  (2.0 Flash) │                 │  Sent to Client   │
  └─────────────┘                  └──────────────────┘
```

The system sends flashcard Q&A pairs to the AI with a carefully engineered prompt that generates **3 contextually relevant wrong answers** per question — testing comprehension, not just memorization.

---

## Built With Purpose

> *I teach International O & A Level students every day. I watched them struggle with generic tools that weren't built for their curriculum. So I built one that was.*
>
> EduCards isn't a weekend project — it's a **real tool solving a real problem** for real students across the world. The AI quiz engine alone has transformed how my students revise before exams.

---

## License

This project is licensed under the Apache 2.0 License.

---

<div align="center">

**Built for Cambridge International Students, by a Cambridge International Teacher.**

</div>
