# BioRegs

A comprehensive patient management platform for peptide therapy protocols, built for clinicians and patients.

## Overview

BioRegs is a multi-portal application that streamlines peptide therapy management through three distinct user experiences:

- **Patient Portal** - Track protocols, log check-ins, monitor symptoms and progress
- **Clinician Portal** - Manage patients, create protocols, track visit logs
- **Admin Portal** - Manage users, peptides, and symptoms across the platform

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Framework:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (Auth + Database)
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure
```
src/
├── features/
│   ├── admin/          # Admin portal components & hooks
│   ├── clinician/      # Clinician portal components & hooks
│   ├── patient/        # Patient portal components & hooks
│   └── auth/           # Authentication & registration
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Navigation & layout components
│   └── insights/       # Charts & analytics components
├── contexts/           # React contexts (Auth, Portal, Theme)
├── hooks/              # Shared hooks
└── types/              # TypeScript type definitions
```

## Features

### Patient Portal
- Multi-step registration with phone verification
- Protocol tracking and peptide information
- Daily symptom check-ins
- Progress visualization and insights

### Clinician Portal
- Patient invitation and management
- Custom protocol creation
- Visit log tracking
- Patient insights dashboard

### Admin Portal
- User management across all roles
- Peptide and symptom management
- Platform-wide analytics

## Development
```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

Private - Chromatic Studio, LLC# Production test
# Debug test
# Debug test
