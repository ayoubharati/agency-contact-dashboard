# Debugging the 500 Error on Amplify

## Problem
Your deployed app at `https://main.d3jr1rt96xura8.amplifyapp.com` is returning a 500 Internal Server Error when accessing `/api/dbtest`.

## Root Causes to Check

### 1. **Most Likely: Missing Environment Variables in Amplify**
   - Amplify doesn't automatically use your local `.env` file
   - You must manually configure environment variables in the Amplify Console

### 2. **Possible: Database Connection Issues**
   - Security group misconfiguration (despite 0.0.0.0/0)
   - RDS instance not publicly accessible
   - Incorrect credentials

### 3. **Possible: Build/Runtime Issues**
   - Next.js API routes not deploying correctly
   - Import/module resolution problems

---

## Diagnostic Endpoints Created

I've created three new API endpoints to help diagnose the issue:

### 1. `/api/health` - Basic Health Check
**Purpose**: Verify the app is running and Next.js API routes work at all

**Test URL**: `https://main.d3jr1rt96xura8.amplifyapp.com/api/health`

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-28T14:30:00.000Z",
  "app": "agency-contact-dashboard",
  "version": "1.0.0",
  "node_version": "v20.x.x",
  "platform": "linux",
  "uptime": 123.456
}
```

**What it tells us**: If this fails with 500, the problem is with Next.js API routes in general, not your code.

---

### 2. `/api/dbtest` - Environment Variables Check
**Purpose**: Verify environment variables are set in Amplify

**Test URL**: `https://main.d3jr1rt96xura8.amplifyapp.com/api/dbtest`

**Expected Response**:
```json
{
  "ok": true,
  "message": "API endpoint is working!",
  "env_check": {
    "has_host": true,
    "has_user": true,
    "has_password": true,
    "has_db_name": true,
    "has_port": true
  },
  "env_vars": {
    "DB_HOST": "your-db-host.rds.amazonaws.com",
    "DB_USER": "admin",
    "DB_PASSWORD": "***SET***",
    "DB_NAME": "your_database",
    "DB_PORT": "3306"
  }
}
```

**What it tells us**: 
- If all `has_*` values are `false` → Environment variables NOT set in Amplify
- If some are `true` → Some variables are set, others are missing

---

### 3. `/api/db-connect` - Actual Database Connection Test
**Purpose**: Test actual connection to Aurora RDS

**Test URL**: `https://main.d3jr1rt96xura8.amplifyapp.com/api/db-connect`

**Expected Response (Success)**:
```json
{
  "ok": true,
  "message": "Database connection successful!",
  "duration_ms": 234,
  "test_query_result": [{"test": 1}],
  "connection_info": {
    "host": "your-db.rds.amazonaws.com",
    "database": "contacts",
    "port": "3306"
  }
}
```

**Expected Response (Failure)**:
```json
{
  "ok": false,
  "message": "Database connection failed",
  "error": {
    "message": "connect ETIMEDOUT",
    "code": "ETIMEDOUT"
  },
  "troubleshooting": {
    "check_env_vars": "...",
    "check_security_group": "...",
    "check_public_access": "..."
  }
}
```

**What it tells us**:
- `ETIMEDOUT` → Security group or network issue
- `ER_ACCESS_DENIED_ERROR` → Wrong credentials
- `ENOTFOUND` → Wrong DB_HOST
- Connection succeeds → Database is fine, problem is elsewhere

---

## Step-by-Step Testing Instructions

### **Step 1: Test Health Endpoint**
Open in browser: `https://main.d3jr1rt96xura8.amplifyapp.com/api/health`

- ✅ **If you get JSON with "healthy"**: Next.js API routes work fine
- ❌ **If you get 500 error**: There's a fundamental Next.js deployment issue

### **Step 2: Test Environment Variables**
Open in browser: `https://main.d3jr1rt96xura8.amplifyapp.com/api/dbtest`

- ✅ **All `has_*` are `true`**: Environment variables are set correctly
- ❌ **Any `has_*` are `false`**: You need to set environment variables in Amplify Console

### **Step 3: Test Database Connection**
Open in browser: `https://main.d3jr1rt96xura8.amplifyapp.com/api/db-connect`

- ✅ **`ok: true`**: Database connection works!
- ❌ **Connection error**: Follow troubleshooting based on error code

---

## How to Set Environment Variables in AWS Amplify

If Step 2 shows environment variables are missing:

1. **Go to AWS Amplify Console**
   - Navigate to your app: `agency-contact-dashboard`
   
2. **Click on "Environment variables" in the left sidebar**

3. **Add the following variables**:
   ```
   Key: DB_HOST          Value: your-aurora-endpoint.rds.amazonaws.com
   Key: DB_USER          Value: admin (or your username)
   Key: DB_PASSWORD      Value: your-database-password
   Key: DB_NAME          Value: contacts (or your database name)
   Key: DB_PORT          Value: 3306
   ```

4. **Save and Redeploy**
   - Click "Save"
   - Go to the "App settings" → "Build settings"
   - Click "Redeploy this version"

5. **Wait for deployment to complete** (2-3 minutes)

6. **Test again**: Visit `/api/dbtest` to verify environment variables are now set

---

## Common Issues & Solutions

### Issue: `/api/health` returns 500
**Solution**: Next.js API routes aren't working. Check Amplify build logs for errors.

### Issue: All environment variables show `false`
**Solution**: Environment variables not configured in Amplify Console (see instructions above)

### Issue: Database connection times out (ETIMEDOUT)
**Solutions**:
- Verify RDS Security Group allows inbound on port 3306 from 0.0.0.0/0
- Ensure RDS instance has "Publicly accessible" set to YES
- Check VPC and subnet configurations

### Issue: Access denied error (ER_ACCESS_DENIED_ERROR)
**Solution**: 
- Double-check DB_USER and DB_PASSWORD in Amplify Console
- Verify the user exists in MySQL: `SELECT user, host FROM mysql.user;`

### Issue: Host not found (ENOTFOUND)
**Solution**:
- Verify DB_HOST is the correct Aurora endpoint
- Check for typos in the endpoint URL

---

## Next Steps

1. **Deploy these changes to Amplify**
   ```bash
   git add .
   git commit -m "Add diagnostic API endpoints for debugging"
   git push origin main
   ```

2. **Wait for Amplify to build** (check build status in Amplify Console)

3. **Test each endpoint** in order (health → dbtest → db-connect)

4. **Report back** with the results from each endpoint so we can diagnose the exact issue

---

## Quick Test Script

You can also test locally first:

```bash
npm run dev
```

Then visit:
- http://localhost:3000/api/health
- http://localhost:3000/api/dbtest
- http://localhost:3000/api/db-connect

If they all work locally but fail on Amplify, it's definitely an Amplify configuration issue (most likely missing environment variables).
