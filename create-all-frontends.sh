#!/bin/bash
# Create all 10 remaining frontend platforms

set -e
cd /home/ubuntu/ai-safety-empire/frontend

PLATFORMS=(
    "proofof-ai:Deepfake Detection & Content Verification"
    "asisecurity-ai:AI Security & Threat Detection"
    "agisafe-ai:AGI Safety Monitoring & Risk Assessment"
    "suicidestop-ai:Mental Health Crisis Intervention"
    "transparencyof-ai:AI Transparency & Explainability"
    "ethicalgovernanceof-ai:Ethical AI Governance Framework"
    "safetyof-ai:General AI Safety & Risk Prevention"
    "accountabilityof-ai:AI Accountability & Responsibility Tracking"
    "biasdetectionof-ai:AI Bias Detection & Fairness Analysis"
    "dataprivacyof-ai:Data Privacy & Protection"
)

echo "🚀 Creating 10 frontend platforms..."
echo ""

for PLATFORM_DATA in "${PLATFORMS[@]}"; do
    IFS=':' read -r PLATFORM_NAME DESCRIPTION <<< "$PLATFORM_DATA"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Creating: $PLATFORM_NAME"
    echo "📝 Description: $DESCRIPTION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Copy from councilof-ai template
    if [ ! -d "$PLATFORM_NAME" ]; then
        cp -r councilof-ai "$PLATFORM_NAME"
        echo "✅ Copied template"
    else
        echo "⏭️  Directory exists, skipping copy"
    fi
    
    cd "$PLATFORM_NAME"
    
    # Update package.json
    sed -i "s/councilof-ai/$PLATFORM_NAME/g" package.json
    
    echo "✅ Updated package.json"
    
    cd ..
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All 10 platforms created!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
