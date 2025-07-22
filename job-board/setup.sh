#!/bin/bash

echo "�� Setting up Job Board Application..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating backend .env file..."
  cp .env.example .env
  echo "⚠️  Please update the .env file with your configuration!"
fi

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating frontend .env file..."
  cp .env.example .env
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "🔥 To start the application:"
echo "   npm run dev        # Start both backend and frontend"
echo "   npm run start:backend  # Start only backend"
echo "   npm run start:frontend # Start only frontend"
echo ""
echo "📝 Don't forget to:"
echo "   1. Start MongoDB service"
echo "   2. Update backend/.env with your database and email settings"
echo "   3. Visit http://localhost:3000 to access the application"
