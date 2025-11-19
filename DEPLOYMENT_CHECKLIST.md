# 🚀 Deployment Checklist - Vercel

## ❌ Current Issue: 500 Error on `/login` and `/register`

**Root Cause**: Missing `AUTH_SECRET` environment variable in Vercel

**Solution**: Add the AUTH_SECRET environment variable following the steps below.

---

## ✅ Environment Variables Setup

### Step 1: Access Vercel Environment Variables

Go to: https://vercel.com/guillermos-projects-1bb50025/ecomama-mvp/settings/environment-variables

### Step 2: Add Required Variables

#### 1. AUTH_SECRET ⚠️ **MISSING - REQUIRED FOR LOGIN/REGISTER**

- **Key**: `AUTH_SECRET`
- **Value**: `RbBbg53XNn7AqaMj6Tf/lPkHjuc+lPyMCfyZK4wzNyQ=`
- **Environments**: ✓ Production, ✓ Preview, ✓ Development

> **Note**: You can generate a new secret with: `openssl rand -base64 32`

#### 2. DATABASE_URL ✅ **Already configured**

- **Key**: `DATABASE_URL`
- **Value**: (Already set from Neon integration)
- **Environments**: ✓ Production, ✓ Preview, ✓ Development

#### 3. NEXTAUTH_URL (Optional but recommended for Production)

- **Key**: `NEXTAUTH_URL`
- **Value**: `https://ecomama-mvp.vercel.app`
- **Environments**: ✓ Production only

#### 4. AUTH_TRUST_HOST (Optional)

- **Key**: `AUTH_TRUST_HOST`
- **Value**: `true`
- **Environments**: ✓ Production, ✓ Preview, ✓ Development

---

## 🔄 After Adding Environment Variables

1. **Redeploy**: Vercel will automatically redeploy after you save the environment variables
2. **Verify**: Visit https://ecomama-mvp.vercel.app/login
3. **Test**: Try logging in with a test account

---

## 🎯 Quick Fix (Immediate Action Required)

1. Go to: https://vercel.com/guillermos-projects-1bb50025/ecomama-mvp/settings/environment-variables
2. Click "Add New"
3. Enter:
   - **Key**: `AUTH_SECRET`
   - **Value**: `RbBbg53XNn7AqaMj6Tf/lPkHjuc+lPyMCfyZK4wzNyQ=`
4. Select: ✓ Production, ✓ Preview, ✓ Development
5. Click "Save"
6. Wait for automatic redeployment (~2 minutes)
7. Test https://ecomama-mvp.vercel.app/login

---

## 📋 Verification Steps

After deployment completes:

- [ ] Landing page works: https://ecomama-mvp.vercel.app
- [ ] Login page loads without error: https://ecomama-mvp.vercel.app/login
- [ ] Register page loads without error: https://ecomama-mvp.vercel.app/register
- [ ] Can create a new account
- [ ] Can log in with credentials
- [ ] Database connection works

---

## 🐛 Troubleshooting

If you still see errors after adding `AUTH_SECRET`:

1. Check that the environment variable is set for **Production** environment
2. Trigger a manual redeploy from the Deployments tab
3. Check the build logs for any errors
4. Verify the DATABASE_URL is correctly set

---

## 📞 Support

If issues persist, check:
- Vercel deployment logs: https://vercel.com/guillermos-projects-1bb50025/ecomama-mvp
- Database status: Neon console
- This repository's issues: https://github.com/gmartincor/Ecomama/issues
