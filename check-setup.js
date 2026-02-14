#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking your MSFC website setup...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasUrl = envContent.includes('SUPABASE_URL=');
    const hasKey = envContent.includes('SUPABASE_KEY=');
    const hasPassword = envContent.includes('ADMIN_PASSWORD=');
    console.log(`   - SUPABASE_URL: ${hasUrl ? '✅' : '❌'}`);
    console.log(`   - SUPABASE_KEY: ${hasKey ? '✅' : '❌'}`);
    console.log(`   - ADMIN_PASSWORD: ${hasPassword ? '✅' : '❌'}`);
} else {
    console.log('❌ .env file missing');
}

// Check if script.js has placeholders
const scriptPath = path.join(__dirname, 'script.js');
if (fs.existsSync(scriptPath)) {
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const hasPlaceholders = scriptContent.includes('PLACEHOLDER');
    console.log(`✅ script.js exists ${hasPlaceholders ? '(has placeholders - good for production)' : '(has real values - run npm run dev first)'}`);
} else {
    console.log('❌ script.js missing');
}

// Check workflow
const workflowPath = path.join(__dirname, '.github', 'workflows', 'deploy.yml');
if (fs.existsSync(workflowPath)) {
    console.log('✅ GitHub Actions workflow exists');
} else {
    console.log('❌ GitHub Actions workflow missing');
}

console.log('\n📋 Next steps:');
console.log('1. Run: npm run dev (for local testing)');
console.log('2. Push to GitHub and run workflow (for production)');
console.log('3. Check: https://aaronajit09.github.io/tamumsfc/');