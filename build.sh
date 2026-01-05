#!/bin/bash

# Build script for Copy Current URL Chrome Extension

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extension info
NAME="copy-current-url"
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)
OUTPUT_DIR="dist"
ZIP_NAME="${NAME}-v${VERSION}.zip"

echo -e "${YELLOW}Building ${NAME} v${VERSION}...${NC}"

# Clean previous builds
if [ -d "$OUTPUT_DIR" ]; then
    echo "Cleaning previous builds..."
    rm -rf "$OUTPUT_DIR"
fi

mkdir -p "$OUTPUT_DIR"

# Files to include in the build
FILES=(
    "manifest.json"
    "background.js"
    "content.js"
    "options.html"
    "options.js"
    "icons"
)

# Validate required files exist
echo "Validating files..."
for file in "${FILES[@]}"; do
    if [ ! -e "$file" ]; then
        echo -e "${RED}Error: Required file '$file' not found${NC}"
        exit 1
    fi
done

# Validate manifest.json
echo "Validating manifest.json..."
if ! python3 -c "import json; json.load(open('manifest.json'))" 2>/dev/null; then
    echo -e "${RED}Error: manifest.json is not valid JSON${NC}"
    exit 1
fi

# Check manifest version
MANIFEST_VERSION=$(grep -o '"manifest_version": [0-9]*' manifest.json | grep -o '[0-9]*')
if [ "$MANIFEST_VERSION" != "3" ]; then
    echo -e "${YELLOW}Warning: Using Manifest V${MANIFEST_VERSION} (V3 recommended)${NC}"
fi

# Create zip
echo "Creating package..."
zip -r "${OUTPUT_DIR}/${ZIP_NAME}" "${FILES[@]}" -x "*.DS_Store" -x "*.git*"

# Calculate size
SIZE=$(du -h "${OUTPUT_DIR}/${ZIP_NAME}" | cut -f1)

echo ""
echo -e "${GREEN}Build successful!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  Package: ${OUTPUT_DIR}/${ZIP_NAME}"
echo -e "  Size:    ${SIZE}"
echo -e "  Version: ${VERSION}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Test the extension locally"
echo "  2. Upload to Chrome Web Store Developer Dashboard"
echo "     https://chrome.google.com/webstore/devconsole"
