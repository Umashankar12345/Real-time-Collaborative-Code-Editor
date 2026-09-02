# CodeCollab: Real-Time Collaborative IDE

CodeCollab is a production-grade, highly scalable real-time collaborative code editor built for technical interviews, pair programming, and remote team collaboration. 

## 🚀 Key Features

*   **Conflict-Free Real-Time Editing**: Powered by **Yjs (CRDT)** to ensure perfect document synchronization across multiple concurrent users without cursor jumping or data loss.
*   **Scalable Architecture**: Utilizes **Redis Pub/Sub** via Socket.IO adapter to allow horizontal scaling across multiple Node.js instances.
*   **Sandboxed Code Execution**: Integrates with the **Piston API** to safely execute arbitrary user code (Python, JS, C++, Java, Go) in isolated environments.
*   **Role-Based Access Control (RBAC)**: Enforces Owner/Admin/Editor/Viewer permissions at the MongoDB and WebSocket layers.
*   **Extensive QA Automation**: Fully automated CI/CD pipeline featuring Playwright (E2E), Supertest (API integration), and Artillery (WebSocket Load Testing).

---

## 🏗️ Architecture

                  ┌──────────────┐
                  │    Client    │
                  │ React/Monaco │
                  └──────┬───────┘
                         │
              ┌──────────┴──────────┐
              │                     │
          REST API              WebSocket
              │                     │
              ↓                     ↓
        ┌───────────┐        ┌───────────┐
        │ Node.js   │        │ Node.js   │
        │ Backend   │        │ Servers   │
        └─────┬─────┘        └─────┬─────┘
              │                    │
              ↓                    ↓
          MongoDB               Redis
              │                    │
              │                 (Pub/Sub)
              ↓
       Authentication
       Authorization
       Room Management

                  Code Execution
                       │
                       ↓
                  Piston API

### Design Decisions & Trade-offs
1.  **Yjs (CRDT) vs Operational Transformation (OT)**: Chosen Yjs over OT because CRDTs handle concurrent edits symmetrically without relying on a central sequencing server, significantly simplifying the backend logic and eliminating complex edge-case conflict resolution.
2.  **Redis for WebSocket Scaling**: Standard Socket.IO connections are stateful and bound to a single node. We utilize `@socket.io/redis-adapter` to distribute presence and chat events across all nodes, enabling true horizontal scalability.
3.  **Piston API vs Local Docker**: For code execution, managing local Docker containers introduces significant operational overhead (DooD, namespaces, resource limits). We offload execution to the sandboxed Piston API, prioritizing security and minimizing server load.

---

## 🛠️ Testing Strategy & QA Automation

This project is built with an SDET-first mindset, utilizing a multi-layered testing strategy to guarantee stability and correctness.

```text
tests/
├── api/             → Supertest (Authentication, RBAC, File System)
├── e2e/             → Playwright (Concurrent 2-Browser CRDT Sync)
└── load/            → Artillery (WebSocket Load Testing)
```

*   **Unit & API Integration (Supertest/Jest)**: Tests validate JWT authentication, RBAC authorization boundaries (e.g., ensuring Viewers receive 403 Forbidden when attempting to edit), and CRUD operations on the virtual file system.
*   **E2E Concurrent Testing (Playwright)**: The "killer" test simulates multiple isolated browser contexts joining the same room simultaneously, typing concurrently, and verifying that the Yjs CRDT algorithm correctly resolves and renders state without conflicts.
*   **Load Testing (Artillery)**: Generates sustained WebSocket traffic to validate Redis adapter performance and Node.js event loop latency under heavy load.

### Performance Metrics (Example Target)
*   **Concurrent Users**: 100+
*   **Messages Processed**: 10,000+
*   **Failed Connections**: 0
*   **Average Latency**: < 50ms

---

## 🚀 Getting Started

```bash
# 1. Start MongoDB & Redis (or use Docker)
docker run -d -p 27017:27017 mongo
docker run -d -p 6379:6379 redis

# 2. Start the backend
cd backend
npm install
npm run dev

# 3. Start the frontend
cd frontend
npm install
npm run dev
```

Run the automated test suite:
```bash
# API Tests
npm run test:api --prefix backend

# E2E Tests
npx playwright test --prefix frontend
```
