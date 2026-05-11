# 🚀 Quick Start Guide - Frontend Application

## ✅ All Files Created Successfully!

Your frontend application is ready with all files in place:
- ✅ React + TypeScript setup
- ✅ All components created
- ✅ API integration configured
- ✅ State management setup
- ✅ Charts and visualizations
- ✅ AI chat interface
- ✅ Authentication pages

## 📋 Next Steps to Run the Frontend

### Step 1: Install Node.js (if not installed)

**Download and install Node.js:**
- Visit: https://nodejs.org/
- Download the LTS version (recommended)
- Run the installer
- Restart your terminal/PowerShell after installation

**Verify installation:**
```bash
node --version
npm --version
```

### Step 2: Navigate to Frontend Directory

```bash
cd projects\fastapi\expense_tracker\frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages (React, Vite, Tailwind, etc.)

### Step 4: Start Development Server

**Option A: Use the start script (Windows)**
```bash
.\start.bat
```

**Option B: Manual start**
```bash
npm run dev
```

### Step 5: Access the Application

Once started, open your browser and go to:
**http://localhost:3000**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # UI Components
│   │   ├── AddExpenseModal.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── EditExpenseModal.tsx
│   │   ├── ExpenseCharts.tsx
│   │   ├── ExpenseList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Page Components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/            # API Services
│   │   └── api.ts
│   ├── store/               # State Management
│   │   ├── authStore.ts
│   │   └── expenseStore.ts
│   ├── types/               # TypeScript Types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── start.bat               # Windows start script
├── start.sh                # Linux/Mac start script
└── README.md
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`

## ⚠️ Important Notes

1. **Backend Must Be Running**: Make sure your FastAPI backend is running on `http://localhost:8000` before using the frontend.

2. **First Time Setup**: The first `npm install` may take 2-5 minutes depending on your internet connection.

3. **Port Conflicts**: If port 3000 is already in use, Vite will automatically use the next available port.

## 🎯 Features Available

Once running, you'll have access to:

- ✅ **Login/Register** - User authentication with OTP
- ✅ **Dashboard** - Overview with statistics
- ✅ **Add Expenses** - Record income and expenses
- ✅ **View Expenses** - List all expenses with filtering
- ✅ **Edit/Delete** - Manage your expenses
- ✅ **Charts** - Visual analytics (Pie & Bar charts)
- ✅ **AI Chat** - Chat with AI assistant about expenses

## 🐛 Troubleshooting

### npm command not found
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Port already in use
```bash
npm run dev -- --port 3001
```

### Dependencies installation fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend connection errors
- Ensure backend is running: `uvicorn main:app --reload --port 8000`
- Check `VITE_API_URL` in `.env` file
- Verify CORS settings in backend

## 📚 Additional Resources

- See `README.md` for detailed documentation
- See `START.md` for alternative start methods
- See `../SETUP.md` for complete backend + frontend setup

## 🎉 You're All Set!

Once Node.js is installed, just run:
```bash
cd projects\fastapi\expense_tracker\frontend
npm install
npm run dev
```

Happy coding! 🚀


