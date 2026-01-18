# NewTuple Chat Assignment

A full-stack AI-powered chat application built with Next.js, Node.js, and PostgreSQL. Features real-time streaming responses, persistent chat history, and secure authentication.

## Features

-   [x] **User Authentication**: Secure Login and Signup using JWT and HttpOnly cookies.
-   [x] **Real-time AI Chat**: Interactive chat interface powered by OpenAI.
-   [x] **Streaming Responses**: Real-time text streaming for AI responses.
-   [x] **Chat History**: Persistent storage of chat sessions and messages using PostgreSQL.
-   [x] **Session Management**: Create new chats, switch between sessions, and delete old ones.
-   [x] **Auto-title Generation**: Automatically generates concise titles for new chat sessions.
-   [x] **Responsive UI**: Modern interface with verified auto-scrolling and timestamp displays.
-   [x] **Theme Support**: Dark/Light mode support (via Shadcn/Next-themes).

## Tech Stack & Libraries

### Client
-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS 4
-   **UI Components**: Shadcn UI, Radix UI, Lucide React
-   **State/Data**: React Hooks, SWR/Fetch

### Server
-   **Runtime**: Bun / Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Drizzle ORM
-   **Real-time**: Socket.IO for chat messaging and streaming
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.js
-   **AI Integration**: OpenAI SDK

## Prerequisites

Before running the project, ensure you have the following installed:
-   **Node.js** (v18+) or **Bun** (v1.0+)
-   **PostgreSQL** (Active database instance)
-   **Git**

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/yourdbname

# Authentication
JWT_SECRET=your_secure_secret_key

# External Services
OPENAI_API_KEY=sk-proj-...
```

> A `.env.example` file is provided in the `server` directory for reference.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd newtuple_assignment
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
# OR if using Bun
bun install
```

Start the Database and Run Migrations:
```bash
# Ensure your PostgreSQL database is running and DATABASE_URL is set in .env
npx drizzle-kit push
# OR
bunx drizzle-kit push
```

Start the Server:
```bash
# Development mode
npm run dev
# OR with Bun
bun dev:bun
```
The server will start on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
# OR
bun install
```

Start the Client:
```bash
npm run dev
# OR
bun dev
```
The application will be available at `http://localhost:3000`.

## 📜 Assignment details

-   **Time Spent**: 12 hours
-   **Demo Video**: [Insert Demo Video Link]

## Commands

| Command | Description |
| :--- | :--- |
| **Server** | |
| `bun dev:bun` | Runs the server in watch mode using Bun |
| `npm run dev` | Runs the server using Nodemon |
| `npx drizzle-kit studio` | Opens Drizzle Studio to view DB content |
| **Client** | |
| `npm run dev` | Starts Next.js development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |

