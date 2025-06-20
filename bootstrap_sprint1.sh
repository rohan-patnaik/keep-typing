#!/usr/bin/env bash
set -e

# 1) Generate Tailwind & PostCSS configs
npx tailwindcss init -p

# 2) Write tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
EOF

# 3) ESLint & Prettier configs
cat > .eslintrc.json << 'EOF'
{ "extends": "next/core-web-vitals" }
EOF

cat > .prettierrc << 'EOF'
{ "semi": true, "singleQuote": true, "printWidth": 80, "trailingComma": "es5" }
EOF

# 4) Folders & CSS
mkdir -p src/pages src/styles
cat > src/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 5) Minimal pages
cat > src/pages/_app.tsx << 'EOF'
import '../styles/globals.css';
import type { AppProps } from 'next/app';
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
EOF

cat > src/pages/index.tsx << 'EOF'
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome to Keep Typing!
      </h1>
    </div>
  );
}
EOF

# 6) .gitignore & .env.example
cat > .gitignore << 'EOF'
node_modules/
.next/
out/
.env.local
.env.*.local
.DS_Store
EOF

cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF

echo "✅ Sprint 1 scaffold done. Now run:"
echo "  npm run dev"