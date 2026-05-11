# Expense Tracker Frontend

A modern, dynamic React frontend application for the Expense Tracker API.

## Features

- 🔐 **Authentication**: Login and registration with email/password
- 💰 **Expense Management**: Add, edit, delete, and view expenses
- 📊 **Visual Analytics**: Interactive charts showing expenses by category and monthly trends
- 🤖 **AI Assistant**: Chat with an AI assistant about your expenses
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with dark mode support

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:8000` (or configure `VITE_API_URL`)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

## Configuration

Create a `.env` file in the `frontend` directory (optional, defaults to `http://localhost:8000`):

```env
VITE_API_URL=http://localhost:8000
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory.

Preview the production build:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── AddExpenseModal.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── EditExpenseModal.tsx
│   │   ├── ExpenseCharts.tsx
│   │   ├── ExpenseList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/        # API service layer
│   │   └── api.ts
│   ├── store/           # State management
│   │   ├── authStore.ts
│   │   └── expenseStore.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Add Expenses**: Click "Add Expense" to record income or expenses
4. **View Analytics**: Check the charts section for visual insights
5. **Manage Expenses**: Edit or delete expenses from the list
6. **AI Assistant**: Click "AI Assistant" to chat about your expenses

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

- `POST /token` - Authentication
- `POST /register` - Register user
- `POST /Forgotpassword` - Reset password
- `GET /getexpense` - Get all expenses
- `POST /addexpense` - Add new expense
- `POST /update_expense/{id}` - Update expense
- `DELETE /delete_expense/{id}` - Delete expense
- `DELETE /multiple_items` - Delete multiple expenses
- `POST /chat` - AI chat endpoint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT


