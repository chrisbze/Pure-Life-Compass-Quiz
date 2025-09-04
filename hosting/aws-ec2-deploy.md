# ☁️ AWS EC2 Deployment Guide

## Overview
AWS EC2 provides enterprise-grade infrastructure with global availability. Perfect for scaling your Pure Life Compass Quiz worldwide.

## 🚀 Quick Start (20 minutes to live)

### Step 1: Create EC2 Instance

1. **Sign into AWS Console**: [AWS Console](https://console.aws.amazon.com/)
2. **Navigate to EC2**: Services → EC2
3. **Launch Instance**:
   - **Name**: `pure-life-compass-quiz`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t3.micro (Free tier) or t3.small ($17/month)
   - **Key Pair**: Create new or use existing
   - **Security Group**: Create with HTTP, HTTPS, SSH access
   - **Storage**: 20 GB gp3 (Free tier: 30 GB)

### Step 2: Security Group Configuration

**Create Security Group Rules:**
```
Type          Protocol  Port Range  Source      Description
SSH           TCP       22          0.0.0.0/0   SSH access
HTTP          TCP       80          0.0.0.0/0   HTTP traffic
HTTPS         TCP       443         0.0.0.0/0   HTTPS traffic
Custom TCP    TCP       3000        0.0.0.0/0   Application port (temporary)
```

### Step 3: Connect and Setup

**Connect via SSH:**
```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

**Install Dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply docker group
exit
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# Verify installations
docker --version
docker-compose --version
```

### Step 4: Deploy Application

**Upload your project:**
```bash
# Option A: Using git
git clone https://github.com/yourusername/Pure-Life-Compass-Quiz.git
cd Pure-Life-Compass-Quiz

# Option B: Upload via SCP (from local machine)
scp -i "your-key.pem" -r C:\Users\Me\Desktop\Pure-Life-Compass-Quiz ubuntu@your-ec2-public-ip:/home/ubuntu/
```

**Configure environment:**
```bash
# Copy and configure production environment
cp .env.production .env.production.local

# Edit with your GHL credentials
nano .env.production.local
```

**Deploy:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 5: Domain & SSL Setup

**Point domain to EC2:**
- Create A record: `your-domain.com` → `your-ec2-public-ip`
- Create A record: `www.your-domain.com` → `your-ec2-public-ip`

**Install SSL certificate:**
```bash
# Install certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Stop services temporarily
docker-compose -f docker-compose.prod.yml stop nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Update nginx configuration
nano nginx.conf
# Update certificate paths:
# ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Mount certificates in docker-compose.prod.yml
nano docker-compose.prod.yml
# Add under nginx volumes:
# - /etc/letsencrypt:/etc/letsencrypt:ro

# Restart services
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Advanced AWS Configuration

### Elastic IP (Recommended)
```bash
# In AWS Console: EC2 → Elastic IPs → Allocate
# Associate with your instance
# Update DNS records to use Elastic IP
```

### Application Load Balancer (For High Traffic)

**Create Target Group:**
1. EC2 → Target Groups → Create
2. **Type**: Instances
3. **Protocol**: HTTP, Port 3000
4. **Health Check**: `/api/health-check`
5. **Register**: Your EC2 instance

**Create Load Balancer:**
1. EC2 → Load Balancers → Create
2. **Type**: Application Load Balancer
3. **Scheme**: Internet-facing
4. **Listeners**: HTTP (80), HTTPS (443)
5. **Target Group**: Select created target group
6. **SSL Certificate**: Use ACM certificate

### Auto Scaling Group

**Create Launch Template:**
```bash
# Create AMI from configured instance
aws ec2 create-image --instance-id i-1234567890abcdef0 --name "pure-life-quiz-v1"
```

**Auto Scaling Configuration:**
- **Min Size**: 1
- **Desired**: 2  
- **Max Size**: 10
- **Scaling Policy**: CPU > 70% (scale up), CPU < 30% (scale down)

## 📊 Monitoring & CloudWatch

### CloudWatch Setup
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### Custom Metrics
```bash
# Send custom metrics
aws cloudwatch put-metric-data --namespace "Pure-Life-Quiz" --metric-data MetricName=QuizCompletions,Value=1,Unit=Count
```

### CloudWatch Alarms
- **High CPU**: > 80% for 2 periods
- **High Memory**: > 85% for 2 periods  
- **Application Down**: Health check failures
- **High Error Rate**: > 5% error rate

## 💾 RDS Database (Optional)

### Create RDS Instance
```yaml
# For persistent data storage (optional upgrade)
Engine: PostgreSQL
Version: 14.9
Instance: db.t3.micro (Free tier)
Storage: 20 GB
Multi-AZ: No (for cost savings)
```

### Update Application for RDS
```javascript
// Add to your backend if using database
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});
```

## 🔐 IAM Roles & Security

### Create IAM Role for EC2
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### Security Best Practices
```bash
# Update security group to remove port 3000 (use ALB instead)
# Keep only SSH (22), HTTP (80), HTTPS (443)

# Regular security updates
sudo apt update && sudo apt upgrade -y

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 💰 Cost Optimization

### Instance Sizing Guide
- **t3.micro (Free tier)**: $0/month first year, then $9/month
- **t3.small**: $17/month - Up to 5,000 quiz sessions/day
- **t3.medium**: $34/month - Up to 20,000 quiz sessions/day

### Cost-Saving Tips
```bash
# Use Spot Instances for 70% savings (for non-critical)
# Schedule instance start/stop for development
# Use Reserved Instances for long-term (up to 75% savings)
```

### AWS Free Tier Benefits
- **EC2**: 750 hours/month t3.micro for 12 months
- **EBS**: 30 GB storage for 12 months
- **Data Transfer**: 15 GB outbound per month
- **CloudWatch**: 10 custom metrics

## 📈 Scaling Strategies

### Vertical Scaling
```bash
# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Change instance type
aws ec2 modify-instance-attribute --instance-id i-1234567890abcdef0 --instance-type Value=t3.small

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0
```

### Horizontal Scaling
- **Application Load Balancer**: Distribute traffic
- **Auto Scaling Group**: Automatic instance management
- **ElastiCache**: Session storage for multiple instances
- **RDS**: Shared database across instances

## 🚨 Disaster Recovery

### Backup Strategy
```bash
# Automated EBS snapshots
aws ec2 create-snapshot --volume-id vol-1234567890abcdef0 --description "Quiz app backup $(date)"

# Cross-region backup
aws ec2 copy-snapshot --source-region us-east-1 --source-snapshot-id snap-1234567890abcdef0 --destination-region us-west-2
```

### Multi-AZ Deployment
```yaml
# Deploy to multiple availability zones
AZ-1a: Primary instance
AZ-1b: Standby instance (Auto Scaling)
```

## 📋 Production Checklist

- ✅ **EC2 instance** created and configured
- ✅ **Security groups** configured properly
- ✅ **Elastic IP** allocated and associated
- ✅ **Domain** pointed to Elastic IP
- ✅ **SSL certificate** configured
- ✅ **Application** deployed and running
- ✅ **CloudWatch** monitoring enabled
- ✅ **Auto Scaling** configured (optional)
- ✅ **Load Balancer** setup (for high traffic)
- ✅ **Backups** automated

## 🎯 Final Result

**Your quiz will be live at:**
- https://your-domain.com
- Elastic IP: Fixed IP address
- Global CDN: CloudFront integration available

**Monthly costs:**
- **Basic**: $17/month (t3.small + Elastic IP)
- **Scaled**: $50-100/month (with ALB, Auto Scaling)
- **Enterprise**: $200+/month (with RDS, CloudFront, Multi-AZ)

Your Pure Life Compass Quiz is now running on enterprise-grade AWS infrastructure! 🚀