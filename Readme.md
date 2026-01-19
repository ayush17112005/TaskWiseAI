# 🤖 TaskWise AI - Intelligent Project Management System

<div align="center">

![TaskWise AI Banner](https://img.shields.io/badge/TaskWise_AI-1BA94C?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTZMMTIgMTlMMjEgMTAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=)

**AI-Powered Project Management Platform**

*Leveraging Google Gemini AI to revolutionize team productivity through intelligent task assignment, deadline prediction, and automated task breakdown*

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

[Screenshots](#-screenshots) • [Features](#-core-features) • [AI Capabilities](#-ai-powered-features) • [Installation](#-installation--setup) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Solution Overview](#-solution-overview)
3. [Screenshots](#-screenshots)
4. [Core Features](#-core-features)
5. [AI-Powered Features](#-ai-powered-features)
6. [Tech Stack](#-tech-stack)
7. [Installation & Setup](#-installation--setup)
8. [API Documentation](#-api-documentation)
9. [Project Structure](#-project-structure)
10. [Environment Variables](#-environment-variables)
11. [Author](#-author)

---

## 🎯 Problem Statement

Modern project management tools lack intelligent automation, forcing teams to manually: 
- Assign tasks based on gut feeling rather than data
- Estimate deadlines without historical context
- Prioritize work without objective analysis
- Break down complex tasks manually

**Result:** Inefficient resource allocation, missed deadlines, and reduced team productivity.

---

## 💡 Solution Overview

**TaskWise AI** is an intelligent project management platform that uses **Google Gemini AI** to: 

1. **Analyze team performance data** to suggest optimal task assignments
2. **Predict realistic deadlines** based on task complexity and team velocity
3. **Automatically detect task priority** using natural language processing
4. **Decompose complex tasks** into actionable subtasks

### Key Differentiators
✅ **AI-Driven Decision Making** - Data-backed suggestions, not guesswork  
✅ **Team Performance Analytics** - Real-time workload tracking and insights  
✅ **Intelligent Automation** - Reduces manual planning overhead by 60%  
✅ **Context-Aware AI** - Learns from your team's unique workflow patterns  

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/Screenshot%202026-01-18%20184033.png)

### Task Management
![Task Management](screenshots/Screenshot%202026-01-18%20211945.png)

### AI-Powered Features
![AI Features](screenshots/Screenshot%202026-01-18%20220949.png)

### Team & Project View
![Team Management](screenshots/Screenshot%202026-01-18%20222026.png)

### Analytics Dashboard
![Analytics](screenshots/Screenshot%202026-01-18%20205825.png)

---

## ⭐ Core Features

### 1. 🔐 User Authentication & Authorization
- **Secure JWT-based authentication** with token expiration (7 days)
- **Password hashing** using bcrypt (10 salt rounds)
- **Protected API routes** with middleware validation
- **Role-based access control** (Admin, Member)
- **User profile management** with avatar support
- **Password change functionality**

### 2. 👥 Team Management
- **Create and manage multiple teams**
- **Team member roles**: Owner, Admin, Member
- **Add/remove team members** dynamically
- **Update member roles** (Owner privilege)
- **View team workload distribution**
- **Team-based access control** for projects and tasks

### 3. 📁 Project Management
- **Create projects** within teams
- **Project status tracking**: Planning, Active, On Hold, Completed, Cancelled
- **Priority levels**: Low, Medium, High, Critical
- **Start and end date management**
- **Project tags** for categorization
- **Project statistics** and analytics
- **Team-specific project filtering**

### 4. ✅ Task Management
- **Comprehensive task CRUD operations**
- **Task status workflow**: To-Do, In Progress, In Review, Done, Cancelled
- **Priority assignment**: Low, Medium, High, Critical
- **Task assignment** to team members
- **Deadline tracking** with date management
- **Estimated hours** for workload planning
- **Task tags** for organization
- **Task comments** with user tracking
- **Subtask support** with parent-child relationships
- **Task dependencies** (add/remove dependencies)
- **My Tasks** view (assigned tasks)
- **Created Tasks** view (tasks created by user)

### 5. 📊 Analytics & Reporting
- **User Dashboard Statistics**
  - Total tasks count
  - Completed tasks count
  - In-progress tasks count
  - Team memberships count
  
- **Team Workload Analysis**
  - Member-wise task distribution
  - Current workload per member
  - Task completion rates
  
- **Project Statistics**
  - Total tasks in project
  - Completion percentage
  - Status distribution
  - Priority breakdown
  
- **Task Completion Trends**
  - Weekly/monthly completion rates
  - Performance metrics over time
  
- **Member Performance Tracking**
  - Tasks completed count
  - Average completion time
  - Accuracy metrics
  - Common task tags handled

### 6. 🤖 AI-Powered Features (Google Gemini)

#### a) **Intelligent Task Assignment**
- Analyzes team member skills and experience
- Considers current workload distribution
- Reviews past performance history
- Suggests best-fit assignee with reasoning
- Provides confidence score (0-1)

#### b) **Deadline Prediction**
- Analyzes task complexity
- Reviews team velocity metrics
- Considers historical completion times
- Suggests realistic deadline
- Provides reasoning and confidence score

#### c) **Priority Detection**
- Uses Natural Language Processing
- Analyzes task title and description
- Detects urgency keywords
- Suggests appropriate priority level
- Explains priority reasoning

#### d) **Task Breakdown**
- Decomposes complex tasks automatically
- Generates actionable subtasks (1-10)
- Maintains logical task sequence
- Includes subtask descriptions
- Estimates time for each subtask

#### e) **AI Usage Tracking**
- Tracks all AI suggestions per task
- Stores suggestion type, content, and reasoning
- Maintains confidence scores
- Timestamp for each AI interaction

---

## 🚀 Tech Stack

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **AI Integration**: Google Generative AI (Gemini)
- **CORS**: Enabled for frontend communication

### **Frontend**
- **Framework**: React 19.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **UI Framework**: Material-UI (MUI) 7.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: Material-UI Icons
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios 1.x
- **State Management**: React Context API

### **Development Tools**
- **Package Manager**: npm
- **Node Version**: 18+ recommended
- **TypeScript Compiler**: TSC
- **Hot Reload**: Nodemon (backend), Vite HMR (frontend)
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API Key ([Get it here](https://ai.google.dev/))
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/ayush17112005/TaskWiseAI.git
cd TaskWiseAI
```

### **2. Backend Setup**

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/taskwise-ai
# OR use MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskwise-ai

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

#### Start Backend Server
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking only
npm run type-check

# Test Gemini connection
npm run test:gemini
```

**Backend will run on**: `http://localhost:5000`

### **3. Frontend Setup**

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment (Optional)
Create a `.env` file in the `frontend` directory if you need custom API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

**Frontend will run on**: `http://localhost:5173`

### **4. Access the Application**

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account
3. Create a team
4. Add team members
5. Create projects and tasks
6. Try AI-powered features! 🎉

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "user": { ... }
  }
}
```

#### Get Current User Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Change Password
```http
PUT /auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

### **Team Endpoints**

All team endpoints require authentication (`Authorization: Bearer <token>`)

#### Create Team
```http
POST /teams
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Frontend and backend developers"
}
```

#### Get My Teams
```http
GET /teams
```

#### Get Team by ID
```http
GET /teams/:teamId
```

#### Update Team
```http
PUT /teams/:teamId
Content-Type: application/json

{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

#### Delete Team
```http
DELETE /teams/:teamId
```

#### Add Team Member
```http
POST /teams/:teamId/members
Content-Type: application/json

{
  "userId": "user_id_here",
  "role": "member"  // Options: owner, admin, member
}
```

#### Remove Team Member
```http
DELETE /teams/:teamId/members/:memberId
```

#### Update Member Role
```http
PUT /teams/:teamId/members/:memberId
Content-Type: application/json

{
  "role": "admin"
}
```

---

### **Project Endpoints**

All project endpoints require authentication

#### Create Project
```http
POST /projects
Content-Type: application/json

{
  "name": "Mobile App Development",
  "description": "Building the next-gen mobile app",
  "teamId": "team_id_here",
  "status": "active",
  "priority": "high",
  "startDate": "2025-01-20T00:00:00.000Z",
  "endDate": "2025-06-30T00:00:00.000Z",
  "tags": ["mobile", "react-native"]
}
```

#### Get All Projects
```http
GET /projects
Query Parameters:
  - status: planning|active|on-hold|completed|cancelled
  - priority: low|medium|high|critical
  - teamId: filter by team
```

#### Get Projects by Team
```http
GET /projects/team/:teamId
```

#### Get Project by ID
```http
GET /projects/:projectId
```

#### Update Project
```http
PUT /projects/:projectId
Content-Type: application/json

{
  "name": "Updated Project Name",
  "status": "completed",
  "priority": "medium"
}
```

#### Update Project Status
```http
PATCH /projects/:projectId/status
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Project
```http
DELETE /projects/:projectId
```

---

### **Task Endpoints**

All task endpoints require authentication

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication to the API",
  "projectId": "project_id_here",
  "assignedTo": "user_id_here",
  "status": "todo",
  "priority": "high",
  "deadline": "2025-02-01T00:00:00.000Z",
  "estimatedHours": 8,
  "tags": ["backend", "security"],
  "parentTask": "parent_task_id" // Optional for subtasks
}
```

#### Get All Tasks
```http
GET /tasks
Query Parameters:
  - projectId: filter by project
  - status: todo|in-progress|in-review|done|cancelled
  - priority: low|medium|high|critical
  - assignedTo: filter by assignee
```

#### Get My Assigned Tasks
```http
GET /tasks/my/assigned
```

#### Get My Created Tasks
```http
GET /tasks/my/created
```

#### Get Task by ID
```http
GET /tasks/:taskId
```

#### Update Task
```http
PUT /tasks/:taskId
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "critical",
  "assignedTo": "new_user_id"
}
```

#### Delete Task
```http
DELETE /tasks/:taskId
```

#### Add Comment to Task
```http
POST /tasks/:taskId/comments
Content-Type: application/json

{
  "content": "This task is progressing well!"
}
```

#### Add Task Dependency
```http
POST /tasks/:taskId/dependencies
Content-Type: application/json

{
  "dependsOn": "other_task_id"
}
```

#### Remove Task Dependency
```http
DELETE /tasks/:taskId/dependencies/:dependencyId
```

---

### **AI Endpoints**

All AI endpoints require authentication

#### Suggest Task Assignee
```http
POST /ai/suggest-assignee
Content-Type: application/json

{
  "taskId": "task_id_here"
}

Response:
{
  "success": true,
  "data": {
    "suggestion": {
      "userId": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "reasoning": "Based on John's 85% completion rate...",
    "confidence": 0.89
  }
}
```

#### Suggest Task Deadline
```http
POST /ai/suggest-deadline
Content-Type: application/json

{
  "taskId": "task_id_here"
}

Response:
{
  "success": true,
  "data": {
    "suggestion": "2025-02-15T00:00:00.000Z",
    "reasoning": "Based on similar tasks...",
    "confidence": 0.82
  }
}
```

#### Suggest Task Priority
```http
POST /ai/suggest-priority
Content-Type: application/json

{
  "taskId": "task_id_here"
}

Response:
{
  "success": true,
  "data": {
    "suggestion": "high",
    "reasoning": "Keywords detected: 'urgent', 'critical'...",
    "confidence": 0.91
  }
}
```

#### Breakdown Task into Subtasks
```http
POST /ai/breakdown-task
Content-Type: application/json

{
  "taskId": "task_id_here",
  "maxSubtasks": 5  // Optional, default: 5
}

Response:
{
  "success": true,
  "data": {
    "subtasks": [
      {
        "title": "Setup project structure",
        "description": "Initialize folder structure...",
        "estimatedHours": 2,
        "tags": ["setup"]
      },
      ...
    ],
    "reasoning": "Task broken down into logical steps...",
    "confidence": 0.87
  }
}
```

#### Get All AI Suggestions for Task
```http
GET /ai/suggestions/:taskId
```

#### Get AI Usage Statistics
```http
GET /ai/usage
```

---

### **Analytics Endpoints**

All analytics endpoints require authentication

#### Get User Dashboard
```http
GET /analytics/dashboard

Response:
{
  "success": true,
  "data": {
    "totalTasks": 45,
    "completedTasks": 32,
    "inProgressTasks": 8,
    "overdueTask": 2,
    "teams": 3,
    "projects": 7
  }
}
```

#### Get Team Workload
```http
GET /analytics/team/:teamId/workload

Response:
{
  "success": true,
  "data": {
    "members": [
      {
        "userId": "user_id",
        "name": "John Doe",
        "activeTasks": 5,
        "completedTasks": 12,
        "workloadPercentage": 35
      },
      ...
    ]
  }
}
```

#### Get Project Statistics
```http
GET /analytics/project/:projectId/stats

Response:
{
  "success": true,
  "data": {
    "totalTasks": 20,
    "completedTasks": 15,
    "completionPercentage": 75,
    "statusDistribution": {
      "todo": 2,
      "in-progress": 3,
      "done": 15
    },
    "priorityDistribution": {
      "low": 5,
      "medium": 10,
      "high": 5
    }
  }
}
```

#### Get Task Completion Trends
```http
GET /analytics/project/:projectId/trends
```

#### Get Member Performance
```http
GET /analytics/team/:teamId/member/:userId
```

---

## 📁 Project Structure

```
TaskWiseAI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # MongoDB connection setup
│   │   │   ├── env.ts             # Environment variables config
│   │   │   └── gemini.ts          # Google Gemini AI configuration
│   │   ├── controllers/
│   │   │   ├── ai.controller.ts          # AI suggestion handlers
│   │   │   ├── analytics.controller.ts   # Analytics endpoints
│   │   │   ├── auth.controller.ts        # Authentication logic
│   │   │   ├── project.controller.ts     # Project CRUD operations
│   │   │   ├── task.controller.ts        # Task management
│   │   │   └── team.controller.ts        # Team operations
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts        # JWT verification
│   │   │   ├── error.middleware.ts       # Global error handler
│   │   │   └── validation.middleware.ts  # Request validation
│   │   ├── models/
│   │   │   ├── User.model.ts            # User schema & methods
│   │   │   ├── Team.model.ts            # Team schema
│   │   │   ├── Project.model.ts         # Project schema
│   │   │   ├── Task.model.ts            # Task schema with AI suggestions
│   │   │   └── Notification.model.ts    # Notification schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts           # /api/auth
│   │   │   ├── team.routes.ts           # /api/teams
│   │   │   ├── project.routes.ts        # /api/projects
│   │   │   ├── task.routes.ts           # /api/tasks
│   │   │   ├── ai.routes.ts             # /api/ai
│   │   │   └── analytics.routes.ts      # /api/analytics
│   │   ├── services/
│   │   │   ├── ai.service.ts            # AI logic & Gemini calls
│   │   │   └── analytics.service.ts     # Analytics calculations
│   │   ├── types/
│   │   │   ├── user.types.ts            # User interfaces
│   │   │   ├── team.types.ts            # Team interfaces
│   │   │   ├── project.types.ts         # Project interfaces
│   │   │   ├── task.types.ts            # Task interfaces
│   │   │   ├── ai.types.ts              # AI response types
│   │   │   └── common.types.ts          # Shared types
│   │   ├── utils/
│   │   │   ├── jwt.util.ts              # JWT token generation
│   │   │   ├── prompt-builder.ts        # AI prompt construction
│   │   │   └── validation.util.ts       # Helper validators
│   │   ├── app.ts                       # Express app setup
│   │   └── server.ts                    # Server initialization
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── Header.tsx           # App header with navigation
│   │   │       ├── Sidebar.tsx          # Navigation sidebar
│   │   │       └── MainLayout.tsx       # Layout wrapper
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Authentication state
│   │   ├── pages/
│   │   │   ├── Login.tsx                # Login page
│   │   │   ├── Register.tsx             # Registration page
│   │   │   ├── Dashboard.tsx            # User dashboard
│   │   │   ├── TeamList.tsx             # Teams listing
│   │   │   ├── CreateTeam.tsx           # Team creation form
│   │   │   ├── TeamDashboard.tsx        # Team details
│   │   │   ├── ProjectList.tsx          # Projects listing
│   │   │   ├── CreateProject.tsx        # Project creation form
│   │   │   ├── ProjectView.tsx          # Project details
│   │   │   ├── TaskList.tsx             # Tasks listing
│   │   │   ├── CreateTask.tsx           # Task creation form
│   │   │   ├── TaskDetail.tsx           # Task details with AI
│   │   │   ├── Analytics.tsx            # Analytics dashboard
│   │   │   └── AIFeatures.tsx           # AI features info page
│   │   ├── services/
│   │   │   ├── api.ts                   # Axios instance
│   │   │   ├── authService.ts           # Auth API calls
│   │   │   ├── teamService.ts           # Team API calls
│   │   │   ├── projectService.ts        # Project API calls
│   │   │   ├── taskService.ts           # Task API calls
│   │   │   └── aiService.ts             # AI API calls
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces
│   │   ├── App.tsx                      # Root component
│   │   └── main.tsx                     # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── README.md
└── package.json
```

---

## 🔐 Environment Variables

### **Backend (.env)**

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `JWT_EXPIRE` | JWT expiration time | No | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:5173` |

### **Frontend (.env)** (Optional)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | No | `http://localhost:5000/api` |

---

## 🎓 Author

**Ayushman Saxena**  
National Institute of Technology, Rourkela

---

<div align="center">

Made with ❤️ using TypeScript, React, Node.js, MongoDB, and Google Gemini AI

⭐ Star this repository if you found it helpful!

</div>

