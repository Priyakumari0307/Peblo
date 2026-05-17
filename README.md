# Peblo AI Notes Workspace

A modern, full-stack note-taking application powered by AI. Peblo enables users to create, organize, and analyze notes with intelligent features, beautiful UI, and seamless cloud integration. Built for productivity, collaboration, and extensibility.

---

## Project Overview
Peblo is an AI-powered notes workspace designed to help users capture, organize, and analyze their thoughts efficiently. With features like smart note suggestions, analytics, and secure cloud storage, Peblo is perfect for students, professionals, and teams.

Frontend Link :- https://client-gilt-sigma-21.vercel.app
Backend Link :- https://server-eta-snowy.vercel.app

---

## Features
- User authentication (register, login, JWT-based sessions)
- Create, edit, archive, and share notes
- AI-powered note suggestions and summarization (OpenAI integration)
- Analytics dashboard for note insights
- Responsive, modern UI (React + Tailwind CSS)
- Dark/light theme toggle
- Secure RESTful API (Node.js + Express)
- PostgreSQL database
- Role-based access and sharing
- Error handling and loading skeletons

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (pg driver)
- **AI Integration:** Google Gemini API
- **State Management:** Zustand
- **Authentication:** JWT, bcrypt

---

## Folder Structure
```
client/
  public/
  src/
    assets/
    components/
    hooks/
    layouts/
    pages/
    services/
    store/
    types/
    utils/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
```

---

## Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Priyakumari0307/Peblo.git
cd Peblo
```

### 2. Install Dependencies
```bash
cd client
npm install
cd ../server
npm install
```

---

## 🖥️ Backend Setup
```bash
cd server
npm install
npm run dev
---

## 🌐 Frontend Setup
```bash
cd client
npm install
npm run dev
```
---

## 🐘 PostgreSQL Setup
- Install PostgreSQL from https://www.postgresql.org/download/
- Create a database:
  ```sql
  CREATE DATABASE peblo;
  ```
- Get your connection string (e.g., `postgresql://user:password@localhost:5432/peblo`)

---

## Environment Variables
Create a `.env` file in the `server/` directory:
```
DATABASE_URL=postgresql://user:password@localhost:5432/peblo
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

---

## API Routes

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user

### Notes
- `GET /api/notes` — Get all notes
- `POST /api/notes` — Create note
- `PUT /api/notes/:id` — Update note
- `DELETE /api/notes/:id` — Delete note
- `GET /api/notes/archived` — Get archived notes

### Analytics
- `GET /api/analytics` — Get user analytics

### AI
- `POST /api/ai/suggest` — Get AI-powered note suggestions

---

## Google Gemini AI Integration
- The backend uses the Google Gemini API for note summarization, action item extraction, and title suggestions.
- Requires a Gemini API key in your `.env` file.
- See `server/controllers/aiController.js` and `server/services/aiService.js` for implementation details.



---
## Contact
For questions or opportunities, reach out via [LinkedIn](https://www.linkedin.com/) or open an issue.

---

**Peblo AI Notes Workspace — Built for the future of productivity.**
