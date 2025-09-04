# 🌊 DigitalOcean Deployment Guide

## Overview
DigitalOcean is the **recommended hosting option** for your Pure Life Compass Quiz. It offers excellent performance, simple setup, and great value at $6-12/month.

## 🚀 Quick Start (15 minutes to live)

### Step 1: Create DigitalOcean Droplet

1. **Sign up**: [DigitalOcean](https://www.digitalocean.com/) (get $200 credit with referral)
2. **Create Droplet**:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month - 1GB RAM, 1 vCPU, 25GB SSD)
   - **Region**: Choose closest to your audience
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: `pure-life-quiz`

### Step 2: Initial Server Setup

**Connect to your droplet:**
```bash
ssh root@your_droplet_ip
```

**Install Docker & Docker Compose:**
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### Step 3: Deploy Your Application

**Upload your project:**
```bash
# Option A: Using git (recommended)
git clone https://github.com/yourusername/Pure-Life-Compass-Quiz.git
cd Pure-Life-Compass-Quiz

# Option B: Upload via SCP
# From your local machine:
scp -r C:\Users\Me\Desktop\Pure-Life-Compass-Quiz root@your_droplet_ip:/root/
```

**Configure environment:**
```bash
# Copy and edit production environment
cp .env.production .env.production.local

# Edit with your actual GHL credentials
nano .env.production.local
```

**Deploy:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 4: Configure Domain & SSL

**Point your domain to the droplet:**
- Add an A record: `your-domain.com` → `your_droplet_ip`
- Add an A record: `www.your-domain.com` → `your_droplet_ip`

**Get free SSL certificate:**
```bash
# Install certbot
apt install snapd
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Update nginx.conf with certificate paths
nano nginx.conf
# Update these lines:
# ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

## 🔧 Advanced Configuration

### Automatic SSL Renewal
```bash
# Add to crontab
crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /root/Pure-Life-Compass-Quiz/docker-compose.prod.yml restart nginx
```

### Firewall Setup
```bash
# Install UFW
apt install ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### Backup Script
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup application and logs
tar -czf $BACKUP_DIR/quiz-backup-$DATE.tar.gz \
  /root/Pure-Life-Compass-Quiz \
  --exclude=node_modules

# Keep only last 7 days of backups
find $BACKUP_DIR -name "quiz-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: quiz-backup-$DATE.tar.gz"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

## 📊 Monitoring Setup

**Install monitoring:**
```bash
# Start monitoring service
nohup node monitoring.js > monitoring.out 2>&1 &

# View monitoring logs
tail -f monitoring.log
```

**Set up log rotation:**
```bash
cat > /etc/logrotate.d/quiz-logs << 'EOF'
/root/Pure-Life-Compass-Quiz/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    copytruncate
}
EOF
```

## 🚨 Troubleshooting

### Common Issues

**Docker permission denied:**
```bash
usermod -aG docker $USER
newgrp docker
```

**Port 80/443 in use:**
```bash
# Check what's using the ports
ss -tulpn | grep :80
ss -tulpn | grep :443

# Stop conflicting services
systemctl stop apache2
systemctl stop nginx
systemctl disable apache2
systemctl disable nginx
```

**SSL certificate issues:**
```bash
# Test certificate renewal
certbot renew --dry-run

# Check certificate status
certbot certificates
```

## 💰 Cost Optimization

### Droplet Sizing Guide
- **$6/month (1GB RAM)**: Up to 1,000 quiz sessions/day
- **$12/month (2GB RAM)**: Up to 5,000 quiz sessions/day
- **$24/month (4GB RAM)**: Up to 20,000 quiz sessions/day

### Monitoring Costs
```bash
# Check resource usage
htop
df -h
docker stats
```

## 🎯 Production Checklist

- ✅ **Droplet created** with Ubuntu 22.04
- ✅ **Docker installed** and configured
- ✅ **Application deployed** and running
- ✅ **Domain configured** with A records
- ✅ **SSL certificate** obtained and configured
- ✅ **Firewall configured** (UFW)
- ✅ **Monitoring enabled** with health checks
- ✅ **Backups scheduled** daily
- ✅ **Log rotation** configured

## 📈 Scaling Options

### Vertical Scaling (Upgrade Droplet)
```bash
# Resize droplet in DigitalOcean dashboard
# Application automatically adapts to new resources
```

### Horizontal Scaling (Load Balancer)
- Add DigitalOcean Load Balancer ($12/month)
- Deploy multiple droplets
- Use managed databases for session storage

## 🔗 Useful DigitalOcean Features

- **Monitoring**: Free basic monitoring included
- **Backups**: $1.20/month for automated snapshots  
- **Floating IPs**: $4/month for IP that doesn't change
- **Managed Databases**: PostgreSQL/MySQL if needed
- **CDN**: Global content delivery network

---

## 🎉 Final Result

**Your quiz will be live at:**
- https://your-domain.com
- API: https://your-domain.com/api/health-check

**Total monthly cost: $6-12/month** for a production-ready setup that can handle thousands of quiz sessions!

### Next Steps After Deployment
1. **Test your quiz** thoroughly
2. **Set up GHL workflows** with real credentials
3. **Monitor performance** with the included monitoring system
4. **Scale up** as your traffic grows

Your Pure Life Compass Quiz is now running on professional infrastructure! 🚀