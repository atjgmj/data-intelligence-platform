#!/bin/bash

echo "🛑 Stopping Data Intelligence Platform..."

# Stop all services
docker-compose down

echo "✅ All services stopped successfully!"