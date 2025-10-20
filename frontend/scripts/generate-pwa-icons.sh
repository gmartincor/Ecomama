#!/bin/bash

# PWA Icons Generator Script
# Generates all required PWA icons from a source SVG or PNG file
# Requires: ImageMagick (install via: brew install imagemagick)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/../public"
ICONS_DIR="$PUBLIC_DIR/icons"
SOURCE_ICON="$ICONS_DIR/icon-512x512.svg"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎨 Ecomama PWA Icons Generator${NC}"
echo "================================"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick is not installed${NC}"
    echo -e "${YELLOW}Install it with: brew install imagemagick${NC}"
    exit 1
fi

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
    echo -e "${RED}❌ Source icon not found: $SOURCE_ICON${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} ImageMagick installed"
echo -e "${GREEN}✓${NC} Source icon found: $SOURCE_ICON"
echo ""

# Icon sizes for PWA
SIZES=(72 96 128 144 152 192 384 512)

echo "Generating PWA icons..."

for size in "${SIZES[@]}"; do
    output="$ICONS_DIR/icon-${size}x${size}.png"
    echo -n "  → Generating ${size}x${size}..."
    
    convert -background none -resize "${size}x${size}" "$SOURCE_ICON" "$output"
    
    if [ -f "$output" ]; then
        echo -e " ${GREEN}✓${NC}"
    else
        echo -e " ${RED}✗${NC}"
    fi
done

echo ""
echo "Generating shortcut icons..."

# Shortcut icons (96x96)
SHORTCUTS=("marketplace" "events" "chat")

for shortcut in "${SHORTCUTS[@]}"; do
    output="$ICONS_DIR/shortcut-${shortcut}.png"
    echo -n "  → Generating shortcut-${shortcut}.png..."
    
    # For now, use the same icon for all shortcuts
    # TODO: Create specific icons for each shortcut
    convert -background none -resize "96x96" "$SOURCE_ICON" "$output"
    
    if [ -f "$output" ]; then
        echo -e " ${GREEN}✓${NC}"
    else
        echo -e " ${RED}✗${NC}"
    fi
done

echo ""
echo "Generating maskable icons (with padding)..."

for size in "${SIZES[@]}"; do
    output="$ICONS_DIR/icon-${size}x${size}-maskable.png"
    echo -n "  → Generating maskable ${size}x${size}..."
    
    # Add 20% padding for maskable icons (safe zone)
    padding=$(( size / 5 ))
    inner_size=$(( size - padding * 2 ))
    
    convert -background none \
            -gravity center \
            -extent "${size}x${size}" \
            -resize "${inner_size}x${inner_size}" \
            "$SOURCE_ICON" "$output"
    
    if [ -f "$output" ]; then
        echo -e " ${GREEN}✓${NC}"
    else
        echo -e " ${RED}✗${NC}"
    fi
done

echo ""
echo "Generating favicon..."

convert -background none -resize "48x48" "$SOURCE_ICON" "$PUBLIC_DIR/favicon.ico"
echo -e "  → favicon.ico ${GREEN}✓${NC}"

echo ""
echo -e "${GREEN}✅ All PWA icons generated successfully!${NC}"
echo ""
echo "Generated files:"
echo "  • $(ls -1 "$ICONS_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ') PNG icons"
echo "  • 1 favicon.ico"
echo ""
echo "Next steps:"
echo "  1. Verify icons in: $ICONS_DIR"
echo "  2. Test maskable icons at: https://maskable.app"
echo "  3. Rebuild Docker containers to include new icons"
echo ""
