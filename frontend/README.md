# 🥋 Martial Arts Portal - Frontend Client

This is the standalone React/Vite client designed for separate hosting services (e.g., Vercel, Netlify, Cloudflare Pages).

## 🚀 Speedrun Deployment
1. **Host Frontend**: Upload this folder to **Vercel** or **Netlify**.
2. **Configure Environment Variables**:
   Set `VITE_API_URL` pointing to your live backend domain URL (without trailing slash).
   - Local testing: `VITE_API_URL=http://localhost:3000`
   - Production: `VITE_API_URL=https://your-martial-arts-backend.onrender.com`

## 🛠️ Local Development
```bash
# 1. Install dependencies
npm install

# 2. Setup your env file
cp .env.example .env

# 3. Spin up development server
npm run dev
```
