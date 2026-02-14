#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

// Read script.js
const scriptPath = path.join(__dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace placeholders with actual values
scriptContent = scriptContent
    .replace('ADMIN_PASSWORD_PLACEHOLDER', envVars.ADMIN_PASSWORD || 'msfc2024')
    .replace('SUPABASE_URL_PLACEHOLDER', envVars.SUPABASE_URL || 'https://txkkrcpcwgwgehogwisx.supabase.co')
    .replace('SUPABASE_KEY_PLACEHOLDER', envVars.SUPABASE_KEY || 'sb_publishable_CfWcrYO5PbZ15FdyLOItww_hOY6HpIA')
    .replace('NEWSLETTERS_BUCKET_PLACEHOLDER', envVars.NEWSLETTERS_BUCKET || 'newsletters')
    .replace('NEWSLETTER_COVERS_BUCKET_PLACEHOLDER', envVars.NEWSLETTER_COVERS_BUCKET || 'newsletter-covers');

// Write back to script.js
fs.writeFileSync(scriptPath, scriptContent);

console.log('✅ Local build complete - secrets injected from .env');