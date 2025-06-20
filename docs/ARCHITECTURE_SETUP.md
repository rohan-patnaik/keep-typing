<!-- ARCHITECTURE_SETUP.md -->

# Architecture & Dev Setup

## Architecture Overview
```plaintext
User Browser
   ↕ HTTPS
Vercel-hosted Next.js (SSR/SSG)
   ↕ Supabase JS SDK
Supabase (Auth, Postgres)
```
- Frontend: Next.js/TypeScript, Tailwind CSS  
- Backend: Supabase (Auth, Database)  
- CI/CD: GitHub Actions → Vercel  
- Monitoring: Sentry, Plausible

## Data Flow
1. User requests page → Vercel serves SSR/SSG  
2. Frontend fetches word lists on test start  
3. Typing metrics computed client-side  
4. On completion, results saved via Supabase API  
5. Results fetched on `/results`

## Development Setup

### Prerequisites
- Node.js ≥ 14  
- npm  
- Git

### Clone & Install
```bash
git clone https://github.com/<your-org>/keep-typing.git
cd keep-typing
npm install
```

### Environment Variables
Copy `.env.example` → `.env`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=  # optional for local Postgres
```

### Local Database (Optional)
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Running Locally
```bash
npm run dev
```
Visit http://localhost:3000

### Testing
```bash
npm test
npm run cy:open   # or npm run cy:run
```

### Lint & Format
```bash
npm run lint
npm run format
```

### CI/CD
- CI pipeline: `.github/workflows/ci.yml`  
- On push/PR: runs lint, tests, build  
- Merge to `main` → Vercel auto-deploy