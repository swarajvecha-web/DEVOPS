# How to Start the Frontend

## Prerequisites Check

Before starting, ensure you have:
1. **Node.js 18+** installed
2. **npm** or **yarn** or **pnpm** installed

### Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

## Quick Start Steps

### 1. Navigate to the frontend directory
```bash
cd projects/fastapi/expense_tracker/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The frontend will start at: **http://localhost:3000**

## Alternative Package Managers

If you prefer using yarn or pnpm:

**Using Yarn:**
```bash
yarn install
yarn dev
```

**Using pnpm:**
```bash
pnpm install
pnpm dev
```

## Troubleshooting

### Port 3000 already in use?
Change the port in `vite.config.ts` or use:
```bash
npm run dev -- --port 3001
```

### Dependencies installation fails?
Try:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend not running?
Make sure your FastAPI backend is running on `http://localhost:8000`
Or set `VITE_API_URL` in `.env` file to your backend URL.

## Production Build

To build for production:
```bash
npm run build
```

The built files will be in the `dist` folder.


