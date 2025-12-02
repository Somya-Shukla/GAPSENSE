# GapSense — Real-time Student Struggle Analyzer & Mentor Match

A premium, frontend-only React application built with Vite and TailwindCSS. GapSense helps students share their struggles anonymously and get matched with the right mentors.

## Features

- 🎨 **Premium Dark Theme** - Rich dark palette with glassmorphic cards and neon accents
- 🎭 **Smooth Animations** - Framer Motion animations throughout
- 🎯 **3D Hero Component** - Interactive 3D scene on landing page (lazy-loaded)
- 📊 **Analytics Dashboard** - Recharts-powered charts and insights
- 🔒 **Anonymous Support** - Share struggles anonymously
- 🤝 **Smart Mentor Matching** - AI-powered mentor recommendations
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Fast & Optimized** - Lazy loading and error boundaries

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Three Fiber** for 3D components
- **Recharts** for data visualization
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── data/            # Mock JSON data
├── utils/           # Utility functions
├── App.tsx          # Main app with routing
└── main.tsx         # Entry point
```

## Pages

- **Landing Page** (`/`) - Hero section with 3D component and feature highlights
- **Submit Struggle** (`/submit`) - Form to submit a new struggle
- **Community** (`/community`) - Browse all struggles with filters
- **Struggle Details** (`/struggle/:id`) - View full struggle details and mentor recommendations
- **Dashboard** (`/dashboard`) - Analytics and insights
- **Mentor Booking** (`/book-session`) - Book a session with a mentor
- **Profile** (`/profile`) - User profile and submitted struggles
- **Admin Panel** (`/admin`) - Admin dashboard for managing struggles and mentors
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

## Mock Data

All data is stored in JSON files in `src/data/`:
- `struggles.json` - Student struggles
- `mentors.json` - Available mentors
- `users.json` - User accounts

## Authentication

The app uses mock authentication stored in localStorage. Any email/password combination will work for demo purposes. Admin access is granted to users with "admin" in their email.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT

