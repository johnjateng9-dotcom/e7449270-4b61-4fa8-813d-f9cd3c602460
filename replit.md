# Overview

This is a full-stack collaboration platform called "CollabFlow" built with React, Express.js, and TypeScript. The application provides unified workspace functionality for modern teams, featuring project management, real-time chat, analytics dashboards, and document collaboration. It's designed as a premium SaaS platform with a modern UI using shadcn/ui components and Tailwind CSS for styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

**Migration Completed (2025-01-08)**: Successfully migrated the CollabFlow project from Lovable to Replit environment:
- Fixed React Router compatibility by migrating from react-router-dom to wouter
- Installed missing dependencies (react-router-dom, sonner) 
- Resolved routing and location hook issues in NotFound component
- Verified all features are working: Landing page, Dashboard, Project Management, Chat Interface, Analytics
- All design system components (glass morphism, gradients, animations) are properly configured
- Application is running successfully on port 5000
- Created comprehensive features.md documentation file outlining implemented and planned features
- All frontend components are fully functional with premium design system
- Ready for backend integration and real-time features implementation

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
- **Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation for development
- **Routes**: Centralized route registration system with API prefix convention
- **Database**: Drizzle ORM configured for PostgreSQL with Neon serverless database

## Database Design

Database schema is managed through Drizzle ORM with:
- **Schema Definition**: Located in shared/schema.ts for type sharing between client and server
- **Migrations**: Managed through drizzle-kit with PostgreSQL dialect
- **Type Safety**: Drizzle-zod integration for runtime validation

Current schema includes:
- Users table with id, username, and password fields
- Zod schemas for insert validation

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

- **Landing Page**: Marketing site with hero section, pricing tiers, and feature showcases
- **Dashboard**: Multi-view interface with stats overview and quick actions
- **Project Management**: Kanban boards with task management functionality
- **Chat Interface**: Real-time messaging with channel organization
- **Analytics**: Data visualization with charts and performance metrics

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