# FlowTrack

A project and issue management system inspired by Jira, designed to help teams plan, track, and deliver work efficiently.

## Project Structure

```
flow_task/
├── client/          # Frontend React application
└── backend/         # Backend API (future implementation)
```

## Features

### Core Features (MVP)
- ✅ Project Management
- ✅ Issue Management (Task, Bug, Story, Epic)
- ✅ Kanban Board with drag & drop
- ✅ Sprint Board with backlog
- ✅ Workflow Management
- ✅ User Roles & Permissions
- ✅ Dark/Light Mode

### Tech Stack

**Frontend:**
- React 18 + Vite
- Ant Design (UI components)
- @dnd-kit (Drag & Drop)
- Recharts (Charts - ready for future use)
- Zustand (State Management)
- React Router (Routing)

**Backend:**
- Reserved for future implementation

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Demo Login

The application includes mock users. On the login page, select any user to login:
- John Doe (Admin)
- Jane Smith (Project Manager)
- Bob Johnson (Developer)
- Alice Williams (QA)
- Charlie Brown (Viewer)

## Project Structure (Client)

```
client/
├── src/
│   ├── components/     # Reusable components
│   │   ├── boards/     # Board-related components
│   │   ├── issues/     # Issue-related components
│   │   └── layout/     # Layout components
│   ├── pages/          # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── boards/     # Board pages
│   │   ├── dashboard/  # Dashboard
│   │   ├── issues/     # Issues page
│   │   └── projects/   # Project pages
│   ├── store/          # Zustand stores
│   ├── data/           # Mock data
│   └── App.jsx         # Main app component
└── package.json
```

## Features Overview

### Dashboard
- Overview statistics
- Recent issues
- Project list

### Projects
- Create, edit, delete projects
- Project detail view
- Project settings

### Issues
- Create, edit, delete issues
- Issue types: Task, Bug, Story, Epic
- Priority levels
- Status workflow
- Assignees and reporters
- Story points
- Labels

### Kanban Board
- Drag and drop issues between statuses
- Visual status columns
- Real-time updates

### Sprint Board
- Backlog view
- Active sprint view
- Status-based organization

## Future Enhancements (Phase 2)

- Sprint planning
- Velocity tracking
- Burndown charts
- Comments on issues
- File attachments
- Activity history
- Advanced search & filters
- Email notifications
- Team velocity reports

## License

MIT
