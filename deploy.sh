#!/bin/bash

# Pure Life Compass Quiz - Production Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Pure Life Compass Quiz Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found!"
    print_warning "Please copy .env.production template and fill in your actual credentials"
    exit 1
fi

# Check for required environment variables
print_status "Validating production environment variables..."
if grep -q "your_actual_ghl_api_key_here" .env.production; then
    print_error "Production environment not configured!"
    print_warning "Please replace placeholder values in .env.production with your actual GHL credentials"
    exit 1
fi

# Build Docker image
print_status "Building Docker image..."
docker build -t pure-life-compass-quiz:latest .
print_success "Docker image built successfully"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Start production services
print_status "Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Health check
print_status "Performing health check..."
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health-check > /dev/null 2>&1; then
        print_success "Health check passed!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Health check failed after 30 attempts"
        print_warning "Check logs: docker-compose -f docker-compose.prod.yml logs"
        exit 1
    fi
    sleep 2
done

# Test GHL integration (if not using test credentials)
print_status "Testing GHL integration..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health-check)
if [ "$response" = "200" ]; then
    print_success "GHL integration test passed"
else
    print_warning "GHL integration test returned status: $response"
fi

print_success "🎉 Deployment completed successfully!"
print_status "Your Pure Life Compass Quiz is now running at:"
print_status "- API: http://localhost:3000"
print_status "- Health Check: http://localhost:3000/api/health-check"

print_status "Useful commands:"
print_status "- View logs: docker-compose -f docker-compose.prod.yml logs -f"
print_status "- Stop services: docker-compose -f docker-compose.prod.yml down"
print_status "- Restart services: docker-compose -f docker-compose.prod.yml restart"

echo "✅ Deployment complete!"