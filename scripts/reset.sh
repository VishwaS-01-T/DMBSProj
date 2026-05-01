#!/bin/bash

# ScholarLink Reset Script
# Usage: ./scripts/reset.sh
# WARNING: This will delete all data!

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${RED}WARNING: This will delete all data!${NC}"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo -e "${YELLOW}Stopping services...${NC}"

# Kill backend
if lsof -ti:8000 >/dev/null 2>&1; then
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
fi

# Kill frontend
if lsof -ti:5173 >/dev/null 2>&1; then
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

echo -e "${YELLOW}Stopping and removing MySQL container...${NC}"
docker compose down -v

echo -e "${YELLOW}Starting fresh MySQL...${NC}"
docker compose up -d
sleep 10

echo -e "${YELLOW}Running setup...${NC}"
./scripts/setup.sh

echo -e "${GREEN}Reset complete!${NC}"