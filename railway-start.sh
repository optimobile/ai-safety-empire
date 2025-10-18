#!/bin/bash
# Railway startup script for AI Safety Empire

echo "🚀 Starting AI Safety Empire on Railway..."
echo "📍 Working directory: $(pwd)"
echo "🐍 Python version: $(python --version)"

# Navigate to backend directory
cd /home/ubuntu/ai-safety-empire/backend || cd backend || echo "Already in correct directory"

# Install dependencies if needed
if [ -f "../requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip install -r ../requirements.txt
elif [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check API keys
echo "🔑 Checking API keys..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  WARNING: OPENAI_API_KEY not set"
else
    echo "✅ OpenAI API key configured"
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  WARNING: ANTHROPIC_API_KEY not set"
else
    echo "✅ Anthropic API key configured"
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  WARNING: GEMINI_API_KEY not set"
else
    echo "✅ Gemini API key configured"
fi

# Start the application
echo "🏛️ Starting Council of 13 AIs..."
echo "🌐 Starting FastAPI server on port ${PORT:-8000}..."

python app.py

