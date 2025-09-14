#!/bin/bash

echo "🚀 Starting Data Intelligence Platform..."

# Create data directories if they don't exist
mkdir -p data logs

# Start all services with Docker Compose
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Backend API:  http://localhost:8000"
    echo "   API Docs:     http://localhost:8000/docs"
    echo "   MinIO Console: http://localhost:9001"
    echo ""
    echo "🔑 Default Login:"
    echo "   Email:    admin@example.com"
    echo "   Password: admin123"
else
    echo "❌ Some services failed to start. Check with: docker-compose logs"
fi