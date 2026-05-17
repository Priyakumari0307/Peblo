# Peblo AI Notes Workspace

A modern, full-stack note-taking application powered by AI. Peblo enables users to create, organize, and analyze notes with intelligent features, beautiful UI, and seamless cloud integration. Built for productivity, collaboration, and extensibility.

---

## Project Overview
Peblo is an AI-powered notes workspace designed to help users capture, organize, and analyze their thoughts efficiently. With features like smart note suggestions, analytics, and secure cloud storage, Peblo is perfect for students, professionals, and teams.

---

## Features
- User authentication (register, login, JWT-based sessions)
- Create, edit, archive, and share notes
- AI-powered note suggestions and summarization (OpenAI integration)
- Analytics dashboard for note insights
- Responsive, modern UI (React + Tailwind CSS)
- Dark/light theme toggle
- Secure RESTful API (Node.js + Express)
- MongoDB cloud database
- Role-based access and sharing
- Error handling and loading skeletons

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **AI Integration:** OpenAI API
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
git clone https://github.com/yourusername/peblo-ai-notes.git
cd peblo-ai-notes
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
```
- The backend runs on `http://localhost:5000` by default.

---

## 🌐 Frontend Setup
```bash
cd client
npm install
npm run dev
```
- The frontend runs on `http://localhost:5173` by default.

---

## 🍃 MongoDB Setup
- Create a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
- Create a new cluster and database.
- Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/peblo`)

---

## Environment Variables
Create a `.env` file in the `server/` directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
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

## OpenAI Integration
- The backend uses the OpenAI API for note suggestions and summarization.
- Requires an OpenAI API key in your `.env` file.
- See `server/controllers/aiController.js` and `server/services/aiService.js` for implementation details.

---

## Deployment Instructions
1. Set environment variables on your deployment platform (e.g., Vercel, Heroku, Render).
2. Deploy the backend (`server/`) and frontend (`client/`) separately.
3. Update API URLs in the frontend if deploying to production.
4. Ensure MongoDB Atlas and OpenAI API keys are set in production.

---

## Contact
For questions or opportunities, reach out via [LinkedIn](https://www.linkedin.com/) or open an issue.

---

**Peblo AI Notes Workspace — Built for the future of productivity.**
