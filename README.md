# Express + TypeScript + esbuild Sample

A minimal Express.js project with TypeScript and esbuild.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![esbuild](https://img.shields.io/badge/esbuild-0.19-orange.svg)](https://esbuild.github.io/)

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build with esbuild |
| `npm run dev` | Watch mode |
| `npm start` | Start server (port 3000) |

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Hello message |
| GET | `/api/health` | Health check |

## Project Structure

```
express-typescript-sample/
├── src/
│   └── index.ts       # Express app entry point
├── dist/               # Compiled output
├── build.js            # esbuild configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies
└── README.md           # This file
```
