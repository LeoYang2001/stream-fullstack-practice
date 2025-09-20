# 🏀 Live Sports Score Ticker - Complete Guide & Lessons Learned

## 📋 Project Overview

Built a real-time basketball score streaming system using:

- **Backend**: Node.js + Fastify + HTTP streaming
- **Frontend**: Vite + TypeScript (planned)
- **Protocol**: Simple HTTP JSON streaming
- **Workspace**: pnpm workspaces + TypeScript

---

## 🛠️ Successful Implementation Steps

### Phase 1: Foundation Setup

1. ✅ pnpm workspace with `backend` and `frontend` packages
2. ✅ buf configuration for Protocol Buffers (even though we didn't use it in final version)
3. ✅ TypeScript setup for both packages
4. ✅ Generated proto code (learning exercise)

### Phase 2: Backend Development

1. ✅ Simple HTTP streaming server with Fastify
2. ✅ Live score simulation with realistic quarter progression
3. ✅ CORS support for web clients
4. ✅ JSON streaming over HTTP

### Phase 3: Testing

1. ✅ curl testing for immediate verification
2. ✅ Node.js test client for programmatic testing
3. ✅ Real-time streaming confirmed working

---

## ❌ Mistakes Made & Solutions

### 1. Package Name Errors

```json
// ❌ WRONG
"@fastify/fastify": "^4.24.0"
// ✅ CORRECT
"fastify": "^4.24.0"
```

**Lesson**: Always verify package names in npm registry before adding dependencies.

### 2. ConnectRPC Complexity

**Problems:**

- Protocol envelope errors (`promised 577200493 bytes, got 25 bytes`)
- Complex content-type headers (`application/connect+json`)
- Binary serialization issues
- Import path confusion (`.ts` vs `.js`)

**Solution:** Simplified to plain HTTP streaming with JSON

```typescript
// Simple and reliable
reply.raw.write(JSON.stringify(update) + "\n");
```

**Lesson**: Start simple, add complexity only when needed.

### 3. Import Path Issues

```typescript
// ❌ WRONG - TypeScript extensions at runtime
import { ScoreUpdate } from "./generated/proto/scoreboard_pb.ts";
// ✅ CORRECT - JavaScript extensions for runtime
import { ScoreUpdate } from "./generated/proto/scoreboard_pb.js";
```

**Lesson**: Runtime imports need `.js` extensions even in TypeScript projects with `"type": "module"`.

### 4. buf Configuration Versioning

```yaml
# ❌ WRONG - v1 with unsupported syntax
version: v1
build:
  roots:
    - proto
# ✅ CORRECT - Simple v1 syntax
version: v1
lint:
  use:
    - DEFAULT
```

**Lesson**: Check buf documentation for correct version syntax.

### 5. Workspace Command Issues

```bash
# ❌ WRONG - tsx not found in local directory
cd backend && tsx src/simple-server.ts
# ✅ CORRECT - Run from workspace root
pnpm -F backend dev:simple
# OR
npx tsx backend/src/simple-server.ts
```

**Lesson**: Workspace dependencies are installed at root level.

### 6. Protocol Buffer vs Plain Objects

```typescript
// ❌ WRONG - Plain object with Protocol Buffer type
const update: ScoreUpdate = { gameId: "test" };
// ✅ CORRECT - Protocol Buffer class instance
const update = new ScoreUpdate({ gameId: "test" });
```

**Lesson**: Protocol Buffers generate classes, not plain object types.

---

## 🎯 Final Working Solution

### Backend (simple-server.ts)

```typescript
// Simple HTTP streaming with JSON
server.post("/scoreboard/stream", async (request, reply) => {
  reply.type("text/plain");
  reply.header("Cache-Control", "no-cache");
  reply.header("Connection", "keep-alive");
  // Stream JSON updates
  reply.raw.write(JSON.stringify(update) + "\n");
});
```

### Testing

```bash
# Works perfectly
curl -X POST http://localhost:8080/scoreboard/stream \
  -H "Content-Type: application/json" \
  -d '{"gameId": "test-game"}'
```

---

## 📚 Key Lessons for Next Time

### 1. Start Simple

- Begin with plain HTTP/JSON streaming
- Add complexity (Protocol Buffers, gRPC) only when needed
- Get basic functionality working first

### 2. Verify Dependencies Early

- Check package names in npm registry
- Test basic imports before building complex features
- Use `pnpm install` from workspace root

### 3. Test Incrementally

- Use curl for immediate backend testing
- Build simple test clients before complex ones
- Verify each layer works before adding the next

### 4. Workspace Structure

```
project-root/
├── package.json          # Root workspace config
├── pnpm-workspace.yaml   # Package definitions
├── backend/package.json  # Backend dependencies
├── frontend/package.json # Frontend dependencies
└── node_modules/         # All deps at root level
```

### 5. When to Use Each Approach

- **Simple HTTP streaming**: Quick prototypes, easy debugging, web compatibility
- **ConnectRPC/gRPC**: Production microservices, type safety, binary performance
- **Protocol Buffers**: Schema evolution, multiple language support

---

## 🚀 Next Steps Template

1. **Backend working** ✅
2. **Frontend setup**: Vite + TypeScript + fetch streaming
3. **UI components**: Real-time scoreboard display
4. **Enhanced features**: Multiple games, different sports
5. **Production**: Docker, deployment, monitoring

---

## 🎯 Quick Reference Commands

```bash
# Start development
pnpm install
pnpm -F backend dev:simple

# Test streaming
curl -X POST http://localhost:8080/scoreboard/stream \
  -H "Content-Type: application/json" \
  -d '{"gameId": "test-game"}'

# Generate proto (if needed)
pnpm run build:proto
```

**This guide should save hours of debugging next time!** 🏀✨
