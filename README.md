<!-- README.md -->

# keep-typing

## Overview
Keeptyping is a minimalistic, customizable typing-test webapp. Users can practice
and improve typing speed and accuracy through various modes and settings.

## Tech Stack
- Frontend: Next.js, React, TypeScript, Tailwind CSS  
- Backend: Supabase (Auth, Postgres)  
- Testing: Jest, Cypress  
- CI/CD & Hosting: GitHub Actions, Vercel

## Getting Started

### Prerequisites
- Node.js ≥ 14  
- npm or Yarn  
- Git

### Installation
```bash
git clone https://github.com/<your-org>/keep-typing.git
cd keep-typing
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and set:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=  # optional for local Postgres
```

### Running Locally
```bash
npm run dev
```
Visit http://localhost:3000

### Testing
- Unit & integration: `npm test`  
- E2E: `npm run cy:open` or `npm run cy:run`

### Lint & Format
```bash
npm run lint
npm run format
```

### Deployment
1. Connect GitHub repo to Vercel  
2. Set env vars in Vercel dashboard  
3. Push to `main` to trigger CI/CD & deploy

## Project Structure
```plaintext
keep-typing/
├── .github/
│   ├── workflows/ci.yml
│   └── ISSUE_TEMPLATE/
├── public/
├── src/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── test.tsx
│   │   └── results.tsx
│   ├── components/
│   ├── lib/
│   ├── styles/
│   └── types/
├── cypress/
├── prisma/        # optional
├── .env.example
├── next.config.js
└── package.json
```