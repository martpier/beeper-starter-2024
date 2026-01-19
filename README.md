# Beeper

A Twitter-like social media application built with React and Express.

## Project Structure

This repository contains two independent projects:

- **`/api`** - Express.js API server with Auth0 JWT authentication
- **`/client`** - React SPA with Auth0 authentication

Each project has its own dependencies, configuration, and can be deployed independently.

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Auth0 account with API and SPA application configured

### API Setup

```bash
cd api
npm install
cp .env.example .env
# Configure .env with your credentials
npm run dev
```

API runs on http://localhost:3000

### Client Setup

```bash
cd client
npm install
cp .env.example .env
# Configure .env with your Auth0 credentials
npm run dev
```

Client runs on http://localhost:5173

## Development

1. Start the API server:
   ```bash
   cd api && npm run dev
   ```

2. In a separate terminal, start the client:
   ```bash
   cd client && npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Auth0 Configuration

### API (Auth0 API)

1. Create an API in Auth0 Dashboard
2. Set Identifier to `https://beeper-api`
3. Set Signing Algorithm to `RS256`

### Client (Auth0 SPA)

1. Create a Single Page Application in Auth0 Dashboard
2. Configure:
   - Allowed Callback URLs: `http://localhost:5173, https://your-production-url.com`
   - Allowed Logout URLs: `http://localhost:5173, https://your-production-url.com`
   - Allowed Web Origins: `http://localhost:5173, https://your-production-url.com`

## License

ISC
