# Overview

This is a full-stack collaboration platform called "CollabFlow" built with React, Express.js, and TypeScript. The application provides unified workspace functionality for modern teams, featuring project management, real-time chat, analytics dashboards, and document collaboration. It's designed as a premium SaaS platform with a modern UI using shadcn/ui components and Tailwind CSS for styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

**Real-Time Chat System Completed (2025-08-11)**: Successfully implemented comprehensive WebSocket-based live chat messaging:
- ✅ **WebSocket Server**: Integrated WebSocket server with Express backend using same port (/ws endpoint)
- ✅ **Authentication**: WebSocket authentication using JWT tokens from query parameters
- ✅ **Real-Time Messaging**: Live message broadcasting, channel joining/leaving, and typing indicators
- ✅ **Frontend WebSocket Client**: Auto-reconnecting WebSocket client with React hooks integration
- ✅ **Chat Interface**: Complete chat UI with message bubbles, typing indicators, and channel management
- ✅ **Database Integration**: Message persistence with PostgreSQL and real-time synchronization
- ✅ **Channel Management**: Multi-channel support with team-based channel loading
- ✅ **User Experience**: Connection status, error handling, and seamless chat experience

**Database Seeding System (2025-08-11)**: Created comprehensive test data for development:
- ✅ **Sample Users**: Admin and test users with proper password hashing
- ✅ **Team Structure**: Design and Development teams with proper ownership
- ✅ **Channels**: Multiple chat channels (general, development, project-updates)
- ✅ **Test Messages**: Sample chat messages for realistic testing
- ✅ **Login Credentials**: Demo accounts displayed in login form for easy testing

**Previous Infrastructure**:
- ✅ **Backend System**: PostgreSQL, JWT auth, REST API, Drizzle ORM
- ✅ **Frontend Integration**: React Query, authentication hooks, dashboard components
- ✅ **UI System**: shadcn/ui components, Tailwind CSS, responsive design

# System Architecture

## Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite as the build tool. The architecture follows a component-based structure with:

- **UI Components**: Built on top of Radix UI primitives with shadcn/ui components providing consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring dark mode support and glass morphism effects
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture

The backend uses Express.js with TypeScript and follows a layered architecture:

- **Server Layer**: Express.js server with middleware for logging, JSON parsing, and error handling
- **Authentication Layer**: JWT-based authentication with bcrypt password hashing and session management
- **Authorization Layer**: Role-based access control with middleware protection for routes
- **Storage Layer**: DatabaseStorage class implementing IStorage interface for all database operations
- **Routes**: Comprehensive REST API with authentication-protected endpoints for all features
- **Database**: Drizzle ORM configured for PostgreSQL with Neon serverless database
- **Validation**: Zod schemas for request validation and type safety throughout the stack

## Database Design

Database schema is managed through Drizzle ORM with:
- **Schema Definition**: Located in shared/schema.ts for type sharing between client and server
- **Migrations**: Managed through drizzle-kit with PostgreSQL dialect
- **Type Safety**: Drizzle-zod integration for runtime validation

Comprehensive schema includes:
- **Users**: Authentication profiles with roles and subscription plans
- **Teams**: Organizations with ownership and membership management
- **Projects**: Team-based projects with status tracking and metadata
- **Tasks**: Kanban-style tasks with assignments, priorities, and hierarchical structure
- **Channels**: Chat channels for team and project communication
- **Messages**: Chat messages with replies, reactions, and file attachments
- **Documents**: Collaborative documents with version control
- **Files**: File storage with team/project/task associations
- **Sessions**: Secure session management for authentication
- All tables include proper relations and foreign key constraints
- Zod schemas for comprehensive validation and type safety

## Development Environment

- **Build System**: Vite for frontend, esbuild for backend bundling
- **Hot Reloading**: Vite middleware integrated with Express in development
- **TypeScript**: Shared configuration with path mapping for clean imports
- **Code Quality**: ESM modules throughout the stack

## Design System

The application implements a premium design system with:
- **Color Palette**: Dark theme with deep blue to purple gradients
- **Glass Effects**: Backdrop blur and transparency for modern aesthetics
- **Animations**: CSS keyframes and Tailwind transitions
- **Responsive Design**: Mobile-first approach with breakpoint considerations

## Feature Modules

### Currently Implemented (Full-Stack Foundation)
**Frontend UI (100% Complete)**:
- **Landing Page**: Complete marketing site with hero section, pricing tiers, and feature showcases
- **Dashboard**: Multi-view interface with stats overview and quick actions
- **Project Management**: Kanban board UI with task cards, priority levels, and assignment
- **Chat Interface**: Channel-based messaging UI with reactions and file attachments
- **Analytics**: Data visualization dashboards with charts and performance metrics

**Backend Infrastructure (100% Complete)**:
- **Authentication System**: JWT-based auth with bcrypt password hashing
- **Database Schema**: Comprehensive PostgreSQL schema for all features
- **REST API**: Complete CRUD endpoints for users, teams, projects, tasks, channels, messages, documents
- **Authorization**: Role-based access control with middleware protection
- **Data Validation**: Zod schemas for type safety and request validation
- **Session Management**: Secure session handling with cleanup mechanisms

### Missing Core Features (Require Development)
- **Frontend-Backend Integration**: Connect UI to REST API endpoints
- **Real-Time Collaboration**: WebSocket-powered live sync for all features
- **Document Editing**: Google Docs-style collaborative editor with version history
- **Video Conferencing**: WebRTC implementation with screen sharing
- **File Management**: Cloud storage with live previews and real-time sync
- **AI Assistant**: Meeting summaries, task suggestions, and auto-reports
- **Automation Builder**: Zapier-style workflow creation system
- **Payment Processing**: Stripe integration for subscription management
- **Advanced Monetization**: Marketplace, affiliate program, white-labeling

## Component Architecture

Components are organized into logical groups:
- **Layout Components**: Header, sidebar, and page structure
- **Dashboard Components**: Specialized views for different app sections
- **Section Components**: Reusable page sections like hero and pricing
- **UI Components**: Design system primitives from shadcn/ui

# External Dependencies

## Database
- **Neon Database**: PostgreSQL serverless database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support

## UI Framework
- **Radix UI**: Comprehensive primitive components for accessibility
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Frontend build tool with HMR support
- **TypeScript**: Type safety across the entire stack
- **React Query**: Server state management and caching

## Charts and Visualization
- **Recharts**: React charting library for analytics dashboards

## Form Handling
- **React Hook Form**: Performant form library
- **Zod**: Schema validation library

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Styling and Animations
- **class-variance-authority**: Utility for creating component variants
- **clsx**: Conditional class name utility
- **date-fns**: Date manipulation library

The application is configured for deployment on Replit with specific plugins for development environment integration.