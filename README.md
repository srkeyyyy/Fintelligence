# Fintelligence
Fintelligence is a full-stack financial tracking and intelligence platform that helps users manage transactions, budgets, spending analytics, receipt extraction, and personalized financial guidance through an interactive assistant.

## Features
- User authentication with JWT
- Transaction tracking for income and expenses
- Budget creation and budget usage monitoring
- Category-wise spending analytics
- Spending timeline and financial summary dashboard
- Receipt image upload with intelligent transaction detail extraction
- MonAI finance assistant for personalized financial insights
- Redis caching for faster analytics and reduced repeated backend computation
- Responsive React frontend with animated transitions and modern UI

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google Gemini API
- Upstash Redis

## Project Structure

```txt
ai-finance-platform/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── routes/
        └── services/
```

## Core Modules

- **Authentication:** Signup, login, protected routes, JWT-based session handling
- **Transactions:** Add, view, delete, and categorize transactions
- **Budgets:** Create monthly/category budgets and track usage
- **Analytics:** Summary, category breakdown, spending timeline, recent transactions
- **Receipt Extraction:** Upload receipt images and prefill transaction fields
- **Assistant:** MonAI answers finance questions using user-specific analytics
- **Caching:** Redis cache for repeated analytics and insight requests

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_REST_TOKEN=
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

## Highlights

- Built a complete finance dashboard with authentication, analytics, budgets, and transaction workflows
- Integrated Gemini for receipt understanding and finance assistant responses
- Added Redis caching to reduce backend load and improve analytics response time
- Designed an animated, responsive frontend using React, Tailwind CSS, and Framer Motion

## License

This project is for learning and portfolio purposes.
