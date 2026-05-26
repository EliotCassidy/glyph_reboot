set -e
REPO=/Users/cassidy/Downloads/github-archive
cd "$REPO"
printf "Loading nvm (if present)...\n"
if [ -s "$NVM_DIR/nvm.sh" ]; then . "$NVM_DIR/nvm.sh"; elif [ -f "$HOME/.nvm/nvm.sh" ]; then . "$HOME/.nvm/nvm.sh"; fi

printf "Attempting nvm install/use 16...\n"
if command -v nvm >/dev/null 2>&1; then
  nvm install 16 || true
  nvm use 16 || true
else
  if [ -f "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
    nvm install 16 || true
    nvm use 16 || true
  else
    printf "nvm not found. Please install nvm and rerun, or run Node 16 manually.\n"
  fi
fi

printf "Node version: "; node -v || true
printf "Npm version: "; npm -v || true
printf "Yarn available: "; command -v yarn >/dev/null && echo yes || echo no

# Backend
printf "\nInstalling backend dependencies (npm install)...\n"
cd backend
npm install --silent || true

printf "Starting backend with npm run dev (nohup -> ../backend-dev.log)...\n"
nohup npm run dev > ../backend-dev.log 2>&1 &
BACK_PID=$!
sleep 3

# Frontend
printf "\nInstalling frontend dependencies (npm install)...\n"
cd ../frontend
npm install --silent || true

printf "Starting frontend with npm start (nohup -> ../frontend-dev.log)...\n"
nohup npm start > ../frontend-dev.log 2>&1 &
FRONT_PID=$!

sleep 10

printf "\nProcesses matching node/react: \n"
ps -p $BACK_PID -o pid,cmd || true
ps -p $FRONT_PID -o pid,cmd || true
ps aux | egrep 'babel-watch|craco|react-scripts|node' | egrep -v 'egrep|nohup' || true

printf "\n--- backend log tail ---\n"
if [ -f ../backend-dev.log ]; then tail -n 80 ../backend-dev.log; else printf "backend log not present\n"; fi

printf "\n--- frontend log tail ---\n"
if [ -f ../frontend-dev.log ]; then tail -n 80 ../frontend-dev.log; else printf "frontend log not present\n"; fi
