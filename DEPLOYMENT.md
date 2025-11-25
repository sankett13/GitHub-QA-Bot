# Deployment Guide - Free Options

## 🆓 Free Deployment Options

### Option 1: Render + Vercel (Recommended)

**Backend on Render (Free Tier):**

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo, root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   ```
   GEMINI_API_KEY=your_actual_key
   PORT=8000
   NODE_ENV=production
   ```

**Frontend on Vercel (Free):**

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `frontend/github_qa_bot`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Vercel auto-deploys

### Option 2: Netlify + Render

**Backend on Render** (same as above)

**Frontend on Netlify:**

1. Create account at [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Base directory: `frontend/github_qa_bot`
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Option 3: Railway Community Plan

Railway still offers a community plan with limited free usage.

## Alternative: Deploy both on Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repository

3. **Configure the service**:

   - Select the `backend` folder as the root directory
   - Railway will auto-detect the Node.js app

4. **Add environment variables** in Railway dashboard:

   ```
   GEMINI_API_KEY=
   PORT=8000
   NODE_ENV=production
   ```

5. **Railway will automatically deploy** and provide you with a domain like:
   `https://your-app-name.railway.app`

## Frontend Deployment on Vercel

1. **Update environment variables**:

   - Edit `frontend/github_qa_bot/.env.production`
   - Replace `https://your-backend-url.railway.app` with your actual Railway URL

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend/github_qa_bot`
   - Vercel will auto-deploy

## Alternative: Deploy both on Railway

You can also deploy both frontend and backend on Railway:

1. Deploy backend as described above
2. Create another Railway service for frontend
3. Set root directory to `frontend/github_qa_bot`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

## Alternative: Deploy on Render

### Backend on Render:

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo, root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

### Frontend on Render:

1. Create new Static Site
2. Root directory: `frontend/github_qa_bot`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

## Environment Variables Summary

### Backend (.env):

```
GEMINI_API_KEY=your_actual_key
PORT=8000
NODE_ENV=production
```

### Frontend (.env.production):

```
VITE_API_URL=https://your-backend-domain.com
```
