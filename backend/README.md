# 🥋 Martial Arts Portal - Standalone Headless API Server

This is the standalone Node/Express API server optimized for separate hosting services (e.g., Render, Railway, Fly.io, Heroku).

## 🚀 Speedrun Deployment
1. **Choose host**: Deploy to **Render** (Web Service), **Railway**, or **Fly.io**.
2. **Environment Configuration**: Set your variables in your provider's Dashboard:
   - `JWT_SECRET` (string - e.g. some random long key)
   - `GEMINI_API_KEY` (string - your key from Google AI Studio)
   - **Database fallback**: If mysql keys are blank, it saves values securely in a local JSON server (`data/events.json`).
   - If using **MySQL**, set database credentials:
     - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_DATABASE`, `MYSQL_PASSWORD`, `MYSQL_PORT`

## 🛠️ Local Development
```bash
# 1. Install dependencies
npm install

# 2. Setup your env file
cp .env.example .env

# 3. Spin up API server locally
npm run dev
```
