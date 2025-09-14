#!/bin/bash

echo "🧪 Testing Data Intelligence Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
    docker-compose logs backend
fi

# Check frontend (Next.js might take longer to start)
echo "⏳ Waiting for frontend..."
sleep 15

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not responding"
    docker-compose logs frontend
fi

# Check database
if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
    docker-compose logs postgres
fi

echo ""
echo "🌐 Application URLs:"
echo "   Frontend:      http://localhost:3000"
echo "   Backend API:   http://localhost:8000"
echo "   API Docs:      http://localhost:8000/docs"
echo "   MinIO Console: http://localhost:9001"
echo ""
echo "🔑 Default Login:"
echo "   Email:    admin@example.com"
echo "   Password: admin123"
echo ""
echo "📊 Sample data file created: sample_data.csv"
echo "   Use this file to test the upload functionality"