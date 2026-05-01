#!/bin/bash

# ScholarLink Setup Script
# Usage: ./scripts/setup.sh

set -e

echo "========================================"
echo "ScholarLink Setup Script"
echo "========================================"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}Step 1: Setting up MySQL Database...${NC}"

# Start Docker MySQL if not running
if ! docker compose ps | grep -q "Up"; then
    echo "Starting MySQL container..."
    docker compose up -d
    echo "Waiting for MySQL to be ready..."
    sleep 10
fi

# Initialize database
echo "Initializing database schema..."
docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink < backend/migrations/init/schema.sql 2>/dev/null || true

echo "Seeding data..."
docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink < backend/migrations/init/seed_data.sql 2>/dev/null || true

# Verify database
STUDENTS=$(docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink -N -e "SELECT COUNT(*) FROM Students;" 2>/dev/null | tr -d '\r')
SCHOLARSHIPS=$(docker exec -i scholarlink-mysql mysql -uroot -proot scholarlink -N -e "SELECT COUNT(*) FROM Scholarships;" 2>/dev/null | tr -d '\r')

if [ "$STUDENTS" -gt 0 ] && [ "$SCHOLARSHIPS" -gt 0 ]; then
    echo -e "${GREEN}✓ Database initialized: $STUDENTS students, $SCHOLARSHIPS scholarships${NC}"
else
    echo -e "${RED}✗ Database initialization failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Starting Backend...${NC}"

# Start backend if not running
if ! lsof -i :8000 >/dev/null 2>&1; then
    cd backend
    if [ ! -d ".venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
    else
        source .venv/bin/activate
    fi
    cd ..
    nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 > /tmp/scholarlink-backend.log 2>&1 &
    echo "Waiting for backend to start..."
    sleep 3
fi

# Test backend
if curl -s http://127.0.0.1:8000/docs >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend running at http://127.0.0.1:8000${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
fi

echo -e "${YELLOW}Step 3: Starting Frontend...${NC}"

# Start frontend if not running
if ! lsof -i :5173 >/dev/null 2>&1; then
    cd frontend
    nohup npm run dev > /tmp/scholarlink-frontend.log 2>&1 &
    cd ..
    echo "Waiting for frontend to start..."
    sleep 3
fi

# Test frontend
if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend running at http://localhost:5173${NC}"
else
    echo -e "${RED}✗ Frontend failed to start${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}ScholarLink is ready!${NC}"
echo "========================================"
echo ""
echo "Login Credentials:"
echo "  Admin:    admin / admin"
echo "  Student:  student1 / student"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://127.0.0.1:8000"
echo "  API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "To stop services:"
echo "  docker compose down          # Stop MySQL"
echo "  lsof -ti:8000 | xargs kill    # Stop backend"
echo "  lsof -ti:5173 | xargs kill    # Stop frontend"
echo ""