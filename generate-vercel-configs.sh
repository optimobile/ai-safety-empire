#!/bin/bash

# Generate vercel.json for all platforms

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_DIR="/home/ubuntu/ai-safety-empire/frontend"
TEMPLATE="$BASE_DIR/vercel-config-template.json"

# Platform names
PLATFORMS=(
    "councilof-ai"
    "proofof-ai"
    "asisecurity-ai"
    "agisafe-ai"
    "suicidestop-ai"
    "transparencyof-ai"
    "ethicalgovernanceof-ai"
    "safetyof-ai"
    "accountabilityof-ai"
    "biasdetectionof-ai"
    "dataprivacyof-ai"
)

echo -e "${BLUE}📝 Generating vercel.json files for all platforms...${NC}"
echo ""

for PLATFORM in "${PLATFORMS[@]}"; do
    PROJECT_DIR="$BASE_DIR/$PLATFORM"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${BLUE}⏭️  Skipping $PLATFORM (directory not found)${NC}"
        continue
    fi
    
    # Create vercel.json from template
    sed "s/PLATFORM_NAME/$PLATFORM/g" "$TEMPLATE" > "$PROJECT_DIR/vercel.json"
    
    echo -e "${GREEN}✅ Created vercel.json for $PLATFORM${NC}"
done

echo ""
echo -e "${GREEN}🎉 All vercel.json files generated!${NC}"

