<div align="center">
  <img src="public/logo.png" alt="KAY Dental Care Logo" width="120" height="120" />
  
  # KAY Dental Care - Frontend
  
  **Modern dental clinic management system with public website and admin dashboard**
  
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)
</div>

## Overview

Production-ready dental clinic platform featuring a bilingual public website (English/Myanmar), online appointment booking, comprehensive admin dashboard with real-time notifications, and integrated content management system.

## Features

### Public Website
- Bilingual support (English/Myanmar) with persistent language selection
- Responsive homepage with banner carousel and service showcase
- Service catalog with detailed information pages
- Doctor profiles with specialties and availability
- Photo gallery with category filtering
- Patient testimonials and reviews
- FAQ section with search functionality
- Real-time clinic status indicator (Open/Closed/Holiday)
- Multi-step appointment booking system
- Contact form with Google Maps integration
- Emergency care information page

### Admin Dashboard
- JWT-based authentication with token refresh
- Real-time notification system with sidebar badges
- Bell dropdown with unified activity feed
- Browser tab notifications for unread items
- Overview dashboard with statistics and quick actions
- Auto-refresh mechanism (30-second intervals)

### Content Management
- Appointments management with status tracking
- Contact message inbox with read/unread status
- Doctor profiles with photo uploads
- Service catalog with rich content editor
- Homepage banners with image cropping tool
- Gallery photos with category management
- Testimonials with star ratings
- FAQ management by category
- Holiday and closure date management
- Clinic settings and business hours

### Technical Features
- Image cropping tool with locked 21:9 aspect ratio
- Multi-format image support (PNG, JPG, WebP)
- Responsive design (mobile-first approach)
- Optimistic UI updates
- Server state management with React Query
- Type-safe API integration
- Framer Motion animations
- Accessible components (ARIA labels, keyboard navigation)

## Tech Stack

### Core
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling

### State Management
- **Zustand** - Client state management
- **TanStack Query** - Server state and caching
- **Axios** - HTTP client with interceptors

### UI Libraries
- **Framer Motion** - Animation library
- **Swiper.js** - Touch carousels
- **Lucide React** - Icon system
- **React Hot Toast** - Notification system
- **React Image Crop** - Image cropping tool

### Routing
- **React Router v6** - Client-side routing

## Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn/pnpm equivalent)
- Backend API service running (see backend repository)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd kay-dental-web

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Configure environment variables (see below)
# Then start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API endpoint
VITE_API_URL=http://localhost:8080/api

# Production example:
# VITE_API_URL=https://api.yourdomain.com/api
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Project Structure

```
src/
├── api/                      # API client layer
│   ├── adminApi.ts          # Admin endpoints
│   ├── publicApi.ts         # Public endpoints
│   ├── authApi.ts           # Authentication
│   └── axiosInstance.ts     # Axios configuration
│
├── components/              # Reusable components
│   ├── admin/               # Admin-specific components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   └── ConfirmDeleteModal.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useAdminData.ts
│   └── usePublicData.ts
│
├── layouts/                 # Layout components
│   ├── AdminLayout.tsx
│   └── PublicLayout.tsx
│
├── pages/                   # Route pages
│   ├── admin/               # Admin dashboard pages
│   └── ...                  # Public pages
│
├── store/                   # Zustand stores
│   ├── useAuthStore.ts
│   └── useLanguageStore.ts
│
├── types/                   # TypeScript definitions
│   └── index.ts
│
├── utils/                   # Utility functions
│   ├── formatters.ts
│   ├── clinicStatus.ts
│   └── settingsMapper.ts
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## Design System

### Color Palette

```css
Primary Green:    #16a34a
Primary Dark:     #15803d
Primary Light:    #dcfce7
Accent Yellow:    #facc15
Background:       #ffffff
Surface:          #f9fafb
Text Primary:     #1f2937
Text Secondary:   #6b7280
```

### Typography

- **Primary Font:** Inter
- **Myanmar Font:** Noto Sans Myanmar
- **Minimum Body Size:** 14px (mobile), 16px (desktop)

### Layout

- **Container Max Width:** 1400px
- **Horizontal Padding:** 16px / 24px / 32px (responsive)
- **Card Border Radius:** 16px (rounded-2xl)
- **Button Border Radius:** 12px (rounded-xl)

### Responsive Breakpoints

```
Mobile:    0px - 640px
Tablet:    641px - 1024px
Desktop:   1025px - 1400px
Wide:      1401px+
```

## API Integration

### Expected Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/login` | Admin authentication |
| GET    | `/api/banners/active` | Get active banners |
| GET    | `/api/doctors` | List all doctors |
| GET    | `/api/doctors/{id}` | Get doctor details |
| GET    | `/api/services` | List all services |
| GET    | `/api/services/{slug}` | Get service by slug |
| GET    | `/api/gallery` | Get gallery photos |
| GET    | `/api/testimonials` | Get testimonials |
| GET    | `/api/faqs` | Get FAQs |
| GET    | `/api/clinic/settings` | Get clinic information |
| GET    | `/api/clinic/status` | Get open/closed status |
| GET    | `/api/holidays/active` | Get current holiday |
| POST   | `/api/appointments` | Create appointment |
| POST   | `/api/contact` | Submit contact form |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET    | `/api/admin/messages/unread-count` | Unread messages count |
| GET    | `/api/admin/messages/unread` | Recent unread messages |
| CRUD   | `/api/admin/banners` | Manage banners |
| CRUD   | `/api/admin/appointments` | Manage appointments |
| CRUD   | `/api/admin/doctors` | Manage doctors |
| CRUD   | `/api/admin/services` | Manage services |
| CRUD   | `/api/admin/holidays` | Manage holidays |
| CRUD   | `/api/admin/gallery` | Manage gallery |
| CRUD   | `/api/admin/testimonials` | Manage testimonials |
| CRUD   | `/api/admin/faqs` | Manage FAQs |
| CRUD   | `/api/admin/messages` | Manage messages |
| GET/PUT| `/api/admin/settings` | Manage settings |
| POST   | `/api/admin/upload/image` | Upload image |

## Image Specifications

| Type | Aspect Ratio | Recommended Size | Format |
|------|--------------|------------------|--------|
| Homepage Banner | 21:9 (locked) | 1920×823px | JPG |
| Doctor Photo | 3:4 | 800×1200px | JPG/PNG |
| Service Image | 4:3 | 800×600px | JPG/PNG |
| Gallery Photo | Any | 1000×1000px+ | JPG/PNG |
| Testimonial Avatar | 1:1 | 400×400px | JPG/PNG |

## Deployment

### Recommended Stack

| Component | Service | Free Tier Limit |
|-----------|---------|-----------------|
| Frontend | Vercel | Unlimited bandwidth |
| Backend | Render | 750 hours/month |
| Database | Neon | 3GB storage |
| Image Storage | Cloudinary | 25GB storage |

### Deploy to Vercel

1. Push code to GitHub repository
2. Import project on [vercel.com](https://vercel.com)
3. Configure build settings:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
5. Deploy

### Build for Production

```bash
npm run build
```

The optimized build will be generated in the `dist/` directory, ready for deployment to any static hosting service.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Chrome/Safari (iOS 14+, Android 10+)

## Performance

- Lighthouse Performance Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Bundle Size: ~200KB (gzipped)

## Security

- JWT-based authentication with automatic token refresh
- Protected admin routes with role-based access
- CORS configuration for API requests
- Environment variables for sensitive configuration
- XSS prevention through React's built-in escaping
- Input validation on all forms

## Troubleshooting

### API Connection Issues

Verify the following:
- Backend service is running on the expected port
- CORS is properly configured on the backend
- `VITE_API_URL` matches the backend URL
- No firewall or network issues blocking requests

### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

### Development Server Issues

```bash
# Kill process on port 5173 (Unix/Mac)
lsof -ti:5173 | xargs kill -9

# Windows equivalent
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Related Repositories

- **Backend API:** `kay-dental-api` (Spring Boot + PostgreSQL)

## Contributing

This is a private project. For internal contribution guidelines, please refer to the internal documentation.

## License

Copyright © 2026. All rights reserved. This is proprietary software.

## Version

Current version: **1.0.0**
