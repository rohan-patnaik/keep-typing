// scripts/create-issues-from-prd.js

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'rohan-patnaik';
const REPO_NAME = 'keep-typing';
const PRD_PATH = path.join(__dirname, '../docs/PRD.md');

if (!GITHUB_TOKEN) {
  console.error('⛔ GITHUB_TOKEN missing in .env');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function run() {
  const content = fs.readFileSync(PRD_PATH, 'utf8');
  const lines = content.split(/\r?\n/);
  const issueRegex = /^- \[([ xX])\] #(\d+)\s+(.+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(issueRegex);
    if (!m) continue;
    const [, flag, num, desc] = m;
    const title = `#${num} – ${desc.trim()}`;
    const phase = getPhase(lines, i);
    const phaseLabel = phase.startsWith('Phase 1') ? 'phase-1' : 'phase-2';

    try {
      const { data: issue } = await octokit.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title,
        body: `Auto-generated from PRD: **${title}**\n\n**Phase:** ${phase}`,
        labels: ['task', phaseLabel],
      });
      console.log(`✅ Created issue #${issue.number}: ${title}`);

      if (flag.toLowerCase() === 'x') {
        await octokit.issues.update({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          issue_number: issue.number,
          state: 'closed',
        });
        console.log(`🔒 Closed #${issue.number} (already done)`);
      }
    } catch (e) {
      if (e.status === 422) {
        console.warn(`⚠️  Issue exists or invalid: ${title}`);
      } else {
        console.error(`❌ Error on ${title}:`, e);
      }
    }
  }
}

function getPhase(lines, idx) {
  for (let j = idx; j >= 0; j--) {
    if (lines[j].startsWith('## 2. Phase 1')) return 'Phase 1: MVP';
    if (lines[j].startsWith('## 3. Phase 2')) return 'Phase 2: Enhancements';
  }
  return 'Unknown Phase';
}

run();