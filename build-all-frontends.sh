#!/bin/bash
set -e
cd /home/ubuntu/ai-safety-empire/frontend

PLATFORMS=(councilof-ai proofof-ai asisecurity-ai agisafe-ai suicidestop-ai transparencyof-ai ethicalgovernanceof-ai safetyof-ai accountabilityof-ai biasdetectionof-ai dataprivacyof-ai)

echo "🔨 Building all 11 platforms..."
BUILT=0

for PLATFORM in "${PLATFORMS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔨 Building: $PLATFORM"
    cd "$PLATFORM"
    if npm run build 2>&1 | tail -5; then
        echo "✅ Build successful"
        ((BUILT++))
    else
        echo "⚠️  Build failed"
    fi
    cd ..
    echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Built $BUILT/11 platforms successfully!"
