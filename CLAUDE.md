# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language, and Claude generates/modifies code in real-time through a virtual file system (no disk I/O).

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations
npm run dev            # Development server with Turbopack (localhost:3000)
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Run all tests with Vitest
npm run db:reset       # Force reset database
```

Run a single test file:
```bash
npx vitest src/lib/transform/__tests__/jsx-transformer.test.ts
```

## Architecture

### Core Flow
```
User Chat → /api/chat (streaming) → Claude with tools → Virtual FS updates → Live Preview
```

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (chat/, editor/, preview/, ui/)
- `src/lib/` - Core logic (file-system.ts, contexts/, prompts/, tools/, transform/)
- `src/actions/` - Server actions for auth and projects
- `prisma/` - SQLite schema (User, Project models)

### State Management
Two React contexts drive the app:
- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`) - Virtual file system state
- **ChatContext** (`src/lib/contexts/chat-context.tsx`) - Wraps Vercel AI SDK's `useChat`

### AI Integration
- `/api/chat/route.ts` - Streaming endpoint using `@ai-sdk/anthropic`
- Uses Claude with two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete)
- System prompt in `src/lib/prompts/generation.tsx`
- Falls back to mock provider when `ANTHROPIC_API_KEY` is not set

### Virtual File System
- In-memory implementation in `src/lib/file-system.ts`
- Projects must have `/App.jsx` as entry point
- Use `@/` import alias for relative imports (e.g., `@/components/Button`)
- Serialized to JSON for database persistence

### Preview Rendering
- `PreviewFrame.tsx` creates sandboxed iframe
- `jsx-transformer.ts` converts virtual files to executable HTML with Babel transpilation
- Generates import maps for module resolution

### Authentication
- JWT-based sessions with HTTP-only cookies
- Server actions: `signUp`, `signIn`, `signOut`, `getUser` in `src/actions/index.ts`
- Middleware verifies tokens for protected routes
- Works with or without authentication (anonymous mode supported)

### Database
SQLite via Prisma. Projects store `messages` (chat history) and `data` (file system) as JSON strings.
