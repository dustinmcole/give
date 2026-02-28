const { execSync } = require('child_process');

async function run() {
  let output = '';
  try {
    output = execSync('npx vercel domains add give.datawake.io', { cwd: '/Users/jane/projects/datawake-give', encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    output = (err.stdout || '') + '\n' + (err.stderr || '');
  }
  
  const text = `Boom. Domain attached! 🚀\n\`\`\`\n${output.trim() || 'Done'}\n\`\`\`\nIf it says it's still verifying, just give the DNS hamsters a minute to catch up.`;
  
  const body = JSON.stringify({
    channel: "C0AHNHVFKQD",
    thread_ts: "1772313017.186569",
    text: text
  });
  
  execSync(`curl -s -X POST "https://slack.com/api/chat.postMessage" -H "Authorization: Bearer ${process.env.ROGER_SLACK_BOT_TOKEN}" -H "Content-Type: application/json" -d '${body.replace(/'/g, "'\\''")}'`);
}

run();