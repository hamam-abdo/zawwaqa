# FoodieRank AI Development Guide

## Project Overview

FoodieRank (ذوّاقة) is an Arabic-first Next.js application for discovering and rating restaurants. The application uses modern React patterns with TypeScript and follows a specific architectural approach.

## Core Architecture

### Tech Stack

- Next.js 16.0 with App Router
- TypeScript
- Redux Toolkit for state management
- Supabase for backend/authentication
- TailwindCSS for styling
- Leaflet for maps integration

### Key Directories

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `store/` - Redux store configuration and slices
- `utils/` - Utility functions and Supabase client setup

## Important Patterns

### State Management

- Use Redux for global state management
- State is organized into slices in `store/` directory:
  - `auth/` - Authentication state
  - `user/` - User profile data
  - `loves/` - User favorites
  - `notifications/` - System notifications

### Authentication

- Supabase handles authentication via `@supabase/ssr`
- OAuth implementation in `components/oauth/`
- Auth state managed in `store/auth/Slice.ts`

### Localization

- App is Arabic-first with RTL support
- Uses Cairo font for Arabic text optimization
- All user-facing strings should be in Arabic
- Metadata in `app/layout.tsx` follows Arabic SEO best practices

### Maps Integration

- Uses Leaflet with React-Leaflet wrapper
- Map components in `app/MapPicker.tsx` and `app/MapPicker2.tsx`
- Geosearch functionality integrated via `leaflet-geosearch`

## Development Workflow

### Environment Setup

1. Ensure Supabase environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Common Commands

```bash
npm run dev     # Start development server
npm run build   # Production build
npm run lint    # Run ESLint
```

### Adding New Features

1. State changes should be implemented through Redux slices
2. New components should be added to `components/` directory
3. Page routes go under `app/` following Next.js 13+ conventions
4. Map-related features should extend existing Leaflet implementation

## Security Considerations

- Follow Snyk security guidelines in `.github/instructions/snyk_rules.instructions.md`
- Validate all user inputs on both client and server side
- Use Supabase RLS policies for data access control

## Integration Points

- Supabase for data storage and authentication
- Leaflet for maps and location services
- Redux for state management and data flow
- Next.js App Router for routing and server components
