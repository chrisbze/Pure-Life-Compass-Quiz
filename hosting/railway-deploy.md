# 🚄 Railway Deployment Guide

## Overview
Railway is a modern deployment platform that's incredibly developer-friendly. Perfect for getting your Pure Life Compass Quiz live with minimal configuration.

## ✨ Why Railway is Great

- **🚀 Deploy in 30 seconds**: Connect GitHub and deploy automatically
- **💰 Free tier**: $0/month for hobby projects (with usage limits)
- **🔄 Auto-deployments**: Every push deploys automatically
- **🌍 Global edge**: Fast worldwide performance
- **📊 Built-in monitoring**: Metrics and logging included

---

## 🚀 2-Minute Deployment Guide

### Step 1: Connect GitHub to Railway

1. **Visit**: [railway.app](https://railway.app)
2. **Sign up**: With GitHub account
3. **New Project**: Click "New Project"
4. **Deploy from GitHub repo**: Select your repository
5. **Select**: `Pure-Life-Compass-Quiz`

### Step 2: Configure Service

**Railway will auto-detect your Node.js app:**
```yaml
# Railway automatically detects:
Build Command: npm install
Start Command: npm start (from package.json)
Port: 3000 (from environment)
```

### Step 3: Set Environment Variables

**In Railway dashboard:**
```env
NODE_ENV=production
PORT=3000
GHL_API_KEY=your_actual_ghl_api_key_here
GHL_LOCATION_ID=your_actual_location_id_here
GHL_PIPELINE_ID=your_actual_pipeline_id_here
GHL_PIPELINE_STAGE_ID=your_actual_stage_id_here
GHL_DREAMER_WORKFLOW_ID=your_dreamer_workflow_id_here
GHL_BUILDER_WORKFLOW_ID=your_builder_workflow_id_here
GHL_DRIVER_WORKFLOW_ID=your_driver_workflow_id_here
GHL_LEADER_WORKFLOW_ID=your_leader_workflow_id_here
```

### Step 4: Deploy & Get Domain

**Railway provides:**
- **Auto-generated domain**: `https://your-app-name.railway.app`
- **Custom domain**: Add your own domain in settings
- **SSL**: Automatic HTTPS certificates

---

## 📁 Railway Configuration

### railway.json (Optional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health-check",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Nixpacks Configuration
```toml
# nixpacks.toml
[phases.build]
cmds = ["npm install"]

[phases.start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
```

---

## 🔧 Advanced Railway Features

### Multiple Services
```yaml
# Deploy both backend and frontend separately
Backend Service:
- Root directory: /backend
- Build command: npm install
- Start command: npm start

Frontend Service:  
- Root directory: /frontend
- Build command: # none (static files)
- Start command: # none (static hosting)
```

### Database Integration
```javascript
// Railway provides easy database integration
const DATABASE_URL = process.env.DATABASE_URL;

// PostgreSQL example (if you add Railway PostgreSQL)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});
```

### Environment-based Configuration
```javascript
// Different configs for Railway environments
const config = {
  development: {
    port: 3000,
    cors: true
  },
  production: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || []
    }
  }
};
```

---

## 📊 Monitoring & Logging

### Built-in Features
- **📈 Resource metrics**: CPU, Memory, Network usage
- **📋 Real-time logs**: Live application logs
- **🔍 Health checks**: Automatic endpoint monitoring
- **⚡ Crash recovery**: Automatic restarts on failure

### Custom Logging
```javascript
// Enhanced logging for Railway
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

---

## 💰 Pricing

### Hobby Plan (FREE)
- **$0/month** with usage limits:
  - **500 hours/month** execution time
  - **100 GB** outbound bandwidth
  - **1 GB** memory
  - **1 GB** disk storage

### Developer Plan ($5/month)
- **Unlimited** execution time
- **100 GB** outbound bandwidth  
- **8 GB** memory
- **100 GB** disk storage

### Team Plan ($20/month)
- **Everything in Developer**
- **Team collaboration**
- **Priority support**
- **Advanced analytics**

---

## 🚀 Quick Deploy Commands

```bash
# Your repository is already ready! Just:

# 1. Push any final changes
git add .
git commit -m "Railway deployment ready"
git push origin main

# 2. Go to railway.app
# 3. New Project → Deploy from GitHub
# 4. Select Pure-Life-Compass-Quiz
# 5. Add environment variables
# 6. Deploy! 🚀
```

---

## 🔧 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check package.json scripts
{
  "scripts": {
    "start": "node server.js",
    "build": "npm install"
  }
}
```

**Port Issues:**
```javascript
// Always use Railway's PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Environment Variables:**
- Set all GHL credentials in Railway dashboard
- Use Railway's built-in environment variable system
- Never commit secrets to git

### Health Check Setup
```javascript
// Railway health checks
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## 🌐 Custom Domain Setup

### Add Custom Domain
1. **Railway Dashboard** → Project → Settings
2. **Domains** → Add Domain
3. **Enter**: your-domain.com
4. **DNS Settings**:
   ```
   Type: CNAME
   Name: @
   Value: your-app-name.railway.app
   ```

### SSL Certificate
- **Automatic**: Railway provides SSL certificates
- **Custom**: Upload your own certificates if needed

---

## 📈 Scaling & Performance

### Auto-scaling
```json
{
  "deploy": {
    "replicas": {
      "min": 1,
      "max": 10
    },
    "resources": {
      "memoryMB": 512,
      "cpuLimit": 1000
    }
  }
}
```

### Performance Tips
- **Keep builds fast**: Use .dockerignore
- **Optimize dependencies**: Only install production packages
- **Enable compression**: Use gzip middleware
- **Cache static assets**: Set proper cache headers

---

## 🎯 Advantages

### vs Heroku
- **✅ More generous free tier**
- **✅ Faster deployments**  
- **✅ Modern dashboard**
- **✅ Better pricing**

### vs Vercel
- **✅ Full backend support**
- **✅ Persistent storage**
- **✅ Database integration**
- **✅ Long-running processes**

### vs DigitalOcean App Platform
- **✅ Faster deployment**
- **✅ More affordable**
- **✅ Better developer experience**
- **⚠️ Less mature platform**

---

## 🏁 Final Result

**After Railway deployment:**
- **Live URL**: `https://your-app-name.railway.app`
- **Deploy time**: ⏱️ 30 seconds
- **Auto-deployments**: Every git push
- **Monitoring**: Built-in metrics
- **Scaling**: Automatic based on usage
- **Cost**: 💰 FREE (with usage limits)

**Perfect for:**
- **MVP launches** 
- **Development/staging** environments
- **Low-traffic** production apps
- **Cost-conscious** deployments

Your Pure Life Compass Quiz will be capturing leads in under 2 minutes! 🎉