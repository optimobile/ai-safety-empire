#!/bin/bash

# AI Safety Empire - DigitalOcean Deployment Script
# This script deploys the entire stack to DigitalOcean

set -e  # Exit on error

echo "🚀 AI Safety Empire - DigitalOcean Deployment"
echo "=============================================="
echo ""

# Check if required environment variables are set
if [ -z "$DO_API_TOKEN" ]; then
    echo "❌ Error: DO_API_TOKEN environment variable is not set"
    exit 1
fi

# Configuration
DROPLET_NAME="ai-safety-empire"
REGION="nyc3"
SIZE="s-2vcpu-4gb"
IMAGE="ubuntu-22-04-x64"
SSH_KEY_NAME="ai-safety-key"

echo "📋 Configuration:"
echo "   Droplet Name: $DROPLET_NAME"
echo "   Region: $REGION"
echo "   Size: $SIZE"
echo "   Image: $IMAGE"
echo ""

# Install doctl if not present
if ! command -v doctl &> /dev/null; then
    echo "📦 Installing doctl..."
    cd ~
    wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
    tar xf doctl-1.98.1-linux-amd64.tar.gz
    sudo mv doctl /usr/local/bin
    rm doctl-1.98.1-linux-amd64.tar.gz
fi

# Authenticate with DigitalOcean
echo "🔐 Authenticating with DigitalOcean..."
doctl auth init --access-token "$DO_API_TOKEN"

# Create SSH key if it doesn't exist
if ! doctl compute ssh-key list | grep -q "$SSH_KEY_NAME"; then
    echo "🔑 Creating SSH key..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/ai_safety_key -N ""
    doctl compute ssh-key import "$SSH_KEY_NAME" --public-key-file ~/.ssh/ai_safety_key.pub
fi

# Get SSH key ID
SSH_KEY_ID=$(doctl compute ssh-key list --format ID,Name --no-header | grep "$SSH_KEY_NAME" | awk '{print $1}')

# Create droplet
echo "🖥️  Creating droplet..."
doctl compute droplet create "$DROPLET_NAME" \
    --region "$REGION" \
    --size "$SIZE" \
    --image "$IMAGE" \
    --ssh-keys "$SSH_KEY_ID" \
    --wait

# Get droplet IP
echo "📡 Getting droplet IP..."
DROPLET_IP=$(doctl compute droplet list --format Name,PublicIPv4 --no-header | grep "$DROPLET_NAME" | awk '{print $2}')

echo "✅ Droplet created: $DROPLET_IP"
echo ""

# Wait for SSH to be ready
echo "⏳ Waiting for SSH to be ready..."
until ssh -o StrictHostKeyChecking=no -i ~/.ssh/ai_safety_key root@$DROPLET_IP "echo 'SSH is ready'" &> /dev/null; do
    echo "   Waiting..."
    sleep 5
done

echo "✅ SSH is ready"
echo ""

# Setup script to run on droplet
SETUP_SCRIPT=$(cat <<'EOF'
#!/bin/bash
set -e

echo "📦 Installing dependencies..."
apt-get update
apt-get install -y docker.io docker-compose git curl

echo "🔧 Starting Docker..."
systemctl start docker
systemctl enable docker

echo "📥 Cloning repository..."
cd /opt
git clone https://github.com/ai-safety-empire/ai-safety-empire.git
cd ai-safety-empire

echo "⚙️  Setting up environment..."
cp .env.example .env

# Update .env with production values
sed -i 's/ENVIRONMENT=development/ENVIRONMENT=production/' .env
sed -i "s/JWT_SECRET_KEY=.*/JWT_SECRET_KEY=$(openssl rand -hex 32)/" .env

echo "🚀 Starting services..."
docker-compose up -d

echo "✅ Deployment complete!"
echo ""
echo "Services:"
echo "  API: http://$(curl -s ifconfig.me):8000"
echo "  Docs: http://$(curl -s ifconfig.me):8000/docs"
echo "  Grafana: http://$(curl -s ifconfig.me):3001"
EOF
)

# Copy and execute setup script
echo "🔧 Setting up services on droplet..."
ssh -o StrictHostKeyChecking=no -i ~/.ssh/ai_safety_key root@$DROPLET_IP "bash -s" <<< "$SETUP_SCRIPT"

echo ""
echo "=============================================="
echo "🎉 Deployment Complete!"
echo "=============================================="
echo ""
echo "📍 Droplet IP: $DROPLET_IP"
echo ""
echo "🌐 Access your services:"
echo "   API: http://$DROPLET_IP:8000"
echo "   API Docs: http://$DROPLET_IP:8000/docs"
echo "   Health: http://$DROPLET_IP:8000/health"
echo "   Grafana: http://$DROPLET_IP:3001"
echo ""
echo "🔐 SSH Access:"
echo "   ssh -i ~/.ssh/ai_safety_key root@$DROPLET_IP"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure domain DNS to point to $DROPLET_IP"
echo "   2. Set up SSL certificates (Let's Encrypt)"
echo "   3. Deploy smart contracts to Polygon"
echo "   4. Update .env with contract addresses"
echo ""

