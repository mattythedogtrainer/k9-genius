#!/bin/bash
# ========================================
# K9 Genius — GitHub + Netlify Deploy Setup
# ========================================
# Paste this entire script into Terminal and run it.
# Prerequisites: Git installed, GitHub account, Netlify account
# ========================================

set -e

echo ""
echo "🐕 K9 Genius Deploy Setup"
echo "========================="
echo ""

# ---- Step 1: Navigate to project ----
cd ~/Desktop/k9-genius
echo "✅ In project directory: $(pwd)"

# ---- Step 2: Initialize git repo ----
if [ ! -d ".git" ]; then
  git init
  echo "✅ Git repo initialized"
else
  echo "✅ Git repo already exists"
fi

# ---- Step 3: Stage and commit all files ----
git add -A
git commit -m "feat: K9 Genius LMS — full scaffold with Firestore, tRPC, Next.js

- Student LMS app (apps/lms) with 14 pages
- Admin CMS LMS routes (apps/admin/lms) with 9 pages
- 8 tRPC routers (enrollment, lesson, quiz, roadmap, cert, resource, entitlement, community)
- Webhook endpoint for Shopify/SamCart/Stripe provisioning
- QuizPlayer component with multi-type question support
- K9 Design System theming (teal/cream/coral palette)
- All routers using Firebase/Firestore" 2>/dev/null || echo "✅ Nothing new to commit"

echo "✅ Files committed"

# ---- Step 4: Create GitHub repo ----
echo ""
echo "📋 NEXT STEPS (do these manually):"
echo ""
echo "1️⃣  CREATE A GITHUB REPO:"
echo "   → Go to https://github.com/new"
echo "   → Name: k9-genius"
echo "   → Private repo (recommended)"
echo "   → Do NOT initialize with README"
echo "   → Click 'Create repository'"
echo ""
echo "2️⃣  PUSH TO GITHUB (paste these after creating the repo):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/k9-genius.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  DEPLOY LMS ON NETLIFY:"
echo "   → Go to https://app.netlify.com/start"
echo "   → Connect to GitHub → select 'k9-genius' repo"
echo "   → Build settings:"
echo "     Base directory:    apps/lms"
echo "     Build command:     cd ../.. && npm install && cd apps/lms && npm run build"
echo "     Publish directory: apps/lms/.next"
echo "   → Add environment variables (Site settings > Environment):"
echo "     FIREBASE_PROJECT_ID        = (your Firebase project ID)"
echo "     FIREBASE_CLIENT_EMAIL      = (your service account email)"
echo "     FIREBASE_PRIVATE_KEY       = (your service account private key)"
echo "     NEXT_PUBLIC_FIREBASE_API_KEY         = (from Firebase console)"
echo "     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN     = (from Firebase console)"
echo "     NEXT_PUBLIC_FIREBASE_PROJECT_ID      = (from Firebase console)"
echo "     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  = (from Firebase console)"
echo "     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = (from Firebase console)"
echo "     NEXT_PUBLIC_FIREBASE_APP_ID          = (from Firebase console)"
echo "   → Click 'Deploy site'"
echo ""
echo "4️⃣  DEPLOY ADMIN ON NETLIFY (separate site):"
echo "   → Same process, but change:"
echo "     Base directory:    apps/admin"
echo "     Build command:     cd ../.. && npm install && cd apps/admin && npm run build"
echo "     Publish directory: apps/admin/.next"
echo "   → Same environment variables as above"
echo ""
echo "5️⃣  INSTALL THE NETLIFY NEXT.JS PLUGIN:"
echo "   → In each Netlify site: Plugins > Search '@netlify/plugin-nextjs' > Install"
echo ""
echo "🎉 Once deployed, Netlify will give you URLs like:"
echo "   LMS:   https://k9-genius-lms.netlify.app"
echo "   Admin: https://k9-genius-admin.netlify.app"
echo ""
