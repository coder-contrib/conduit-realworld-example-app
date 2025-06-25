#!/bin/bash

# Start Conduit dev server script

# Create tmux sessions for frontend and backend
BACKEND_SESSION="conduit-backend"
FRONTEND_SESSION="conduit-frontend"
# Use relative path to work in any environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Kill existing sessions if they exist
tmux has-session -t "$BACKEND_SESSION" 2>/dev/null && tmux kill-session -t "$BACKEND_SESSION"
tmux has-session -t "$FRONTEND_SESSION" 2>/dev/null && tmux kill-session -t "$FRONTEND_SESSION"

echo "📋 Tmux Keyboard Shortcuts:"
echo "  • Scroll: Use mouse wheel or enter copy mode with Ctrl+b ["
echo "  • Copy Mode Navigation: Arrow keys, Page Up/Down"
echo "  • Exit Copy Mode: q"
echo "  • Split Window: Ctrl+b % (vertical) or Ctrl+b \" (horizontal)"
echo "  • Switch Panes: Ctrl+b arrow keys"
echo "  • Detach: Ctrl+b d"
echo ""

# Create and setup backend session
echo "🔧 Setting up backend..."
tmux new-session -d -s "$BACKEND_SESSION"
tmux send-keys -t "$BACKEND_SESSION" "cd $PROJECT_DIR/backend" C-m
tmux send-keys -t "$BACKEND_SESSION" "npm install" C-m
tmux send-keys -t "$BACKEND_SESSION" "cp -n .env.example .env" C-m

# Run backend server
echo "🚀 Starting backend server..."
tmux send-keys -t "$BACKEND_SESSION" "npm run dev" C-m

# Wait for backend to start
sleep 5

# Create and setup frontend session
echo "🔧 Setting up frontend..."
tmux new-session -d -s "$FRONTEND_SESSION"
tmux send-keys -t "$FRONTEND_SESSION" "cd $PROJECT_DIR/frontend" C-m
tmux send-keys -t "$FRONTEND_SESSION" "npm install" C-m

# Run frontend server
echo "🚀 Starting frontend server..."
tmux send-keys -t "$FRONTEND_SESSION" "npm run dev" C-m

# Wait for both servers to start
echo "⏳ Waiting for servers to start..."
sleep 10

# Run setup script to create test user and articles
echo "🛠️ Running setup script to create test data..."
cd "$PROJECT_DIR"
npm run setup

echo ""
echo "✅ Conduit is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🌐 Backend: http://localhost:3001"
echo ""
echo "👤 Login with:"
echo "- Email: test@example.com"
echo "- Password: password123"
echo ""
echo "To attach to server sessions:"
echo "- Backend: tmux attach -t $BACKEND_SESSION"
echo "- Frontend: tmux attach -t $FRONTEND_SESSION"
echo ""
echo "To stop servers: tmux kill-session -t $BACKEND_SESSION && tmux kill-session -t $FRONTEND_SESSION"