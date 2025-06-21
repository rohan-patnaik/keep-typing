#!/usr/bin/env bash
set -e

# 1) Jest config
cat > jest.config.js << 'EOF'
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
EOF

# 2) Jest setup
cat > jest.setup.ts << 'EOF'
import '@testing-library/jest-dom';
EOF

# 3) Cypress config
cat > cypress.config.ts << 'EOF'
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});
EOF

# 4) Cypress dirs & boilerplate
mkdir -p cypress/fixtures cypress/e2e cypress/support

# .gitkeep for empty dirs
touch cypress/fixtures/.gitkeep
touch cypress/e2e/.gitkeep

# support/e2e.ts
cat > cypress/support/e2e.ts << 'EOF'
// cypress/support/e2e.ts
import './commands';
EOF

# support/commands.ts
cat > cypress/support/commands.ts << 'EOF'
// cypress/support/commands.ts
// add custom Cypress commands here
EOF

echo "✅ Jest & Cypress files scaffolded."