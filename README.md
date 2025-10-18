# Math Problem Generator - Developer Assessment Starter Kit

## Overview

This is a fully functional AI-powered math problem generator application. The application uses AI to generate math word problems suitable for Primary 5 students, saves the problems and user submissions to a database, and provides personalized feedback. The project includes bonus features like difficulty levels, score tracking, and problem history.

## Current Status: ✅ COMPLETED

All core requirements have been implemented and the application is fully functional with additional bonus features.

## View Demo

🚀 **Live Application**: [https://math-problem-generator-eta-one.vercel.app/](https://math-problem-generator-eta-one.vercel.app/)

Experience the full functionality including:
- AI-powered math problem generation
- Difficulty level selection with dropdown menu
- Score tracking and streaks
- Problem history
- Personalized feedback

## Implemented Features

### Core Features
- ✅ AI-powered math problem generation using Google Gemini
- ✅ Difficulty levels (Easy/Medium/Hard) with dropdown selection
- ✅ Answer submission and validation
- ✅ Personalized AI feedback
- ✅ Database persistence with Supabase
- ✅ Responsive UI with Tailwind CSS

### Bonus Features
- ✅ Score tracking with points and streaks
- ✅ Problem history with scrollable view
- ✅ TypeScript enums for type safety
- ✅ Comprehensive error handling
- ✅ Loading states and user feedback
- ✅ Mobile-responsive design

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd math-problem-generator
```

### 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API to find your:
   - Project URL (starts with `https://`)
   - Anon/Public Key

### 3. Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database.sql`
3. Click "Run" to create the tables and policies

### 4. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 6. Install Dependencies

```bash
npm install
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your Task

### 1. Implement Frontend Logic (`app/page.tsx`)

Complete the TODO sections in the main page component:

- **generateProblem**: Call your API route to generate a new math problem
- **submitAnswer**: Submit the user's answer and get feedback

### 2. Create Backend API Route (`app/api/math-problem/route.ts`)

Create a new API route that handles:

#### POST /api/math-problem (Generate Problem)
- Use Google's Gemini AI to generate a math word problem
- The AI should return JSON with:
  ```json
  {
    "problem_text": "A bakery sold 45 cupcakes...",
    "final_answer": 15
  }
  ```
- Save the problem to `math_problem_sessions` table
- Return the problem and session ID to the frontend

#### POST /api/math-problem/submit (Submit Answer)
- Receive the session ID and user's answer
- Check if the answer is correct
- Use AI to generate personalized feedback based on:
  - The original problem
  - The correct answer
  - The user's answer
  - Whether they got it right or wrong
- Save the submission to `math_problem_submissions` table
- Return the feedback and correctness to the frontend

### 3. Requirements Checklist

- [x] AI generates appropriate Primary 5 level math problems
- [x] Problems and answers are saved to Supabase
- [x] User submissions are saved with feedback
- [x] AI generates helpful, personalized feedback
- [x] UI is clean and mobile-responsive
- [x] Error handling for API failures
- [x] Loading states during API calls

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Assessment Submission

When submitting your assessment, provide:

1. **GitHub Repository URL**: Make sure it's public
2. **Live Demo URL**: Your Vercel deployment
3. **Supabase Credentials**: Add these to your README for testing:
   ```
   SUPABASE_URL: https://tykbszfeydrywsnnhlgi.supabase.co
   SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5a2JzemZleWRyeXdzbm5obGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTk1MDksImV4cCI6MjA3NjI5NTUwOX0.Eg7c7Sg-iRzATHyW1db2NEjftsfyDK-3KF2mlSxbiMc
   ```

## Implementation Notes

*Please fill in this section with any important notes about your implementation, design decisions, challenges faced, or features you're particularly proud of.*

### My Implementation:

- **API Architecture**: Implemented two separate REST endpoints (`/api/math-problem` and `/api/math-problem/submit`) following proper API design patterns with clear separation of concerns
- **AI Integration**: Successfully integrated Google Gemini 2.5-flash model for both problem generation and personalized feedback, with robust prompt engineering for age-appropriate content
- **Database Design**: Created comprehensive Supabase schema with proper relationships, TypeScript types, and Row Level Security policies for data protection
- **Error Handling**: Implemented comprehensive error handling across all layers - API routes, database operations, AI responses, and frontend interactions with user-friendly error messages
- **User Experience**: Built responsive UI with loading states, form validation, and smooth transitions using Tailwind CSS with mobile-first design approach
- **Performance Optimization**: Optimized API responses with efficient database queries, proper error boundaries, and minimal bundle size through Next.js optimization
- **Bonus Features**: Implemented difficulty levels (Easy/Medium/Hard) with dropdown selection, score tracking with points and streaks, and comprehensive problem history with scrollable view
- **Type Safety**: Used TypeScript enums for difficulty level validation and comprehensive type definitions for all data structures
- **UI/UX Enhancements**: Added dropdown menu for difficulty selection, real-time score display, and organized problem history with difficulty indicators

## Additional Features (Optional)

If you have time, consider adding:

- [x] Difficulty levels (Easy/Medium/Hard) - **IMPLEMENTED**
- [x] Problem history view - **IMPLEMENTED**
- [x] Score tracking - **IMPLEMENTED**
- [ ] Different problem types (addition, subtraction, multiplication, division)
- [ ] Hints system
- [ ] Step-by-step solution explanations

---

Good luck with your assessment! 🎯