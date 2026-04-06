# Personal Expense Analyzer

Personal Expense Analyzer is a full-stack SE lab project built with React, Node.js, Express, and MongoDB. It supports secure login, expense and income tracking, budget management, notifications, monthly reports, and admin user management.

## Tech Stack

- Frontend: React + Vite + Recharts + Axios
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Project Structure

```text
se_lab/
|-- client/          React frontend
|-- server/          Express + MongoDB backend
|-- docs/            SRS, DFD, structured design, and UML documents
|-- package.json     Root workspace scripts
```

## Features

- User registration and login
- Admin role support and user management
- Expense CRUD with category tracking
- Income CRUD with source tracking
- Weekly and monthly budgets
- Budget-overrun and unusual-spending notifications
- Dashboard with financial summaries and charts
- Monthly report view with analysis

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment files

Create `server/.env` from `server/.env.example`.

Create `client/.env` from `client/.env.example`.

### 3. Start MongoDB

Use a local MongoDB server or MongoDB Atlas and update `MONGODB_URI` in `server/.env`.

### 4. Run the development servers

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 5. Seed an admin user

```bash
npm run seed:admin
```

Default admin credentials come from `server/.env.example` and should be changed before submission.

## Build

```bash
npm run build
```

## Lab Documents

- [Experiment 1: System Requirements](docs/01-system-requirements.md)
- [Experiment 2: Data Flow Diagram](docs/02-dfd.md)
- [Experiment 3: Structured Design](docs/03-structured-design.md)
- [Experiment 4: UML Use Case Model](docs/04-use-case-model.md)
- [Experiment 5: UML Behavioral Diagrams](docs/05-uml-behavioral-diagrams.md)
- [Experiment 6: Class and State Diagrams](docs/06-class-state-diagrams.md)
