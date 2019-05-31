@echo off
echo System testing starting...
TIMEOUT /T 3
@echo on
npm i && start npm start dev & cd frontend-js/ && npm i && start npm run dev