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

## 🚀 Deployment Instructions

### Backend Deployment (Render)

#### Step 1: Prepare Backend for Deployment
1. Ensure your `server/package.json` has a start script:
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```
2. Create a `.env` file in the `server/` directory with production values:
   ```
   MONGO_URI=your_production_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

#### Step 2: Create Render Account & Service
1. Go to https://render.com and sign up/log in
2. Click **"New +"** → **"Web Service"**
3. Choose **"Deploy an existing Git repository"**
4. Connect your GitHub account and select the `Peblo` repository
5. Configure the service:
   - **Name:** `peblo-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### Step 3: Add Environment Variables
1. In Render, go to **Environment** → **Add Environment Variable**
2. Add each variable:
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your secure JWT secret
   - `OPENAI_API_KEY` = Your OpenAI API key
3. Click **"Deploy"**

#### Step 4: Get Backend URL
- After deployment, Render will provide a URL like: `https://peblo-api.onrender.com`
- Save this URL for frontend configuration

---

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend for Deployment
1. Update API base URL in `client/src/services/apiService.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://peblo-api.onrender.com';
   ```

2. Create `.env.production` in the `client/` directory:
   ```
   VITE_API_URL=https://peblo-api.onrender.com
   ```

3. Update `client/vite.config.js` to use environment variables:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': process.env.VITE_API_URL || 'http://localhost:5000'
       }
     }
   })
   ```

#### Step 2: Create Vercel Account & Deploy
1. Go to https://vercel.com and sign up/log in with GitHub
2. Click **"New Project"**
3. Import the `Peblo` repository from GitHub
4. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 3: Add Environment Variables
1. In Vercel, go to **Settings** → **Environment Variables**
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://peblo-api.onrender.com`
3. Click **"Save"** → **"Deploy"**

#### Step 4: Get Frontend URL
- After deployment, Vercel will provide a URL like: `https://peblo.vercel.app`
- This is your production frontend URL

---

### Verify Deployment

1. **Test Backend API:**
   ```bash
   curl https://peblo-api.onrender.com/api/auth/login
   ```

2. **Test Frontend:**
   - Visit `https://peblo.vercel.app`
   - Try logging in or creating an account
   - Verify API calls are working

3. **Check Logs:**
   - Render: Dashboard → Your service → **Logs**
   - Vercel: Dashboard → Your project → **Deployments** → **Logs**

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check environment variables in Render; ensure MongoDB connection string is correct |
| Frontend shows blank page | Check browser console for errors; verify VITE_API_URL is set correctly |
| API calls fail | Ensure backend URL is correct in frontend .env; check CORS settings in backend |
| Render service spins down | Upgrade to Paid Plan or use a free service like Railway |

---

## Screenshots

> _Add screenshots of the landing page, dashboard, note editor, and analytics here._

---
## ✅ Deployment Checklist

**Before Deploying:**
- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] OpenAI API key obtained
- [ ] JWT_SECRET generated (use a secure random string)
- [ ] GitHub repository is public or Vercel/Render have access
- [ ] `.env` files created with production values

**Backend (Render):**
- [ ] Root directory set to `server`
- [ ] Start command: `npm start`
- [ ] All environment variables added in Render
- [ ] Deployment successful and service is running

**Frontend (Vercel):**
- [ ] Root directory set to `client`
- [ ] Build command: `npm run build`
- [ ] VITE_API_URL environment variable set to backend URL
- [ ] Deployment successful and app is live

**Post-Deployment:**
- [ ] Test login/register functionality
- [ ] Verify API calls work (check network tab)
- [ ] Test note creation and AI features
- [ ] Check error logs for any issues

---
## Contact
For questions or opportunities, reach out via [LinkedIn](https://www.linkedin.com/) or open an issue.

---

**Peblo AI Notes Workspace — Built for the future of productivity.**
