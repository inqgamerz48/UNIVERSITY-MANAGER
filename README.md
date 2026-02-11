# UNI Manager - College Management System

A comprehensive B2B SaaS platform for educational institution management built with Next.js 14, Supabase, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS v4 with custom dark + gold theme
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Database**: Prisma ORM
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives + shadcn/ui
- **Deployment**: Vercel
- **Email**: Resend
- **Testing**: Jest + React Testing Library

## 📋 Features

### Core Modules
- **Authentication**: Role-based (Student, Faculty, Admin, Super Admin)
- **Dashboard**: Personalized dashboards for each role
- **Assignments**: Create, submit, grade assignments with file uploads
- **Attendance**: Real-time attendance marking and tracking
- **Notices**: Announcements with priority levels and categories
- **Complaints**: Complaint submission and status tracking
- **Fee Management**: Fee structure and payment tracking
- **Subjects**: Course/subject catalog management

### Technical Features
- **Real-time Updates**: Supabase Realtime for live notifications
- **File Storage**: Supabase Storage for assignments and documents
- **Row Level Security**: Database-level access control
- **Server Actions**: Type-safe server-side operations
- **API Routes**: RESTful endpoints for all modules
- **Type Safety**: End-to-end TypeScript coverage

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd unimanager-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
DATABASE_URL=your-database-url
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Role-based dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   └── dashboard/         # Dashboard components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   ├── utils.ts           # Utility functions
│   ├── validations.ts    # Zod schemas
│   └── env-validator.ts   # Environment validation
├── actions/               # Server Actions
├── hooks/                 # Custom React hooks
├── stores/                # Zustand stores
└── types/                 # TypeScript definitions
```

## 🔐 User Roles

| Role | Dashboard | Permissions |
|------|-----------|-------------|
| Student | /student/dashboard | View, submit assignments, track attendance |
| Faculty | /faculty/dashboard | Create assignments, grade, mark attendance |
| Admin | /admin/dashboard | User management, analytics |
| Super Admin | /admin/dashboard | Full system access |

## 🎨 Design System

### Color Palette
- **Background**: #0A0A0A
- **Cards**: #1A1A1A
- **Borders**: #2A2A2A
- **Primary**: #D4AF37 (Gold)
- **Hover**: #F5E6B3

### Typography
- **Primary**: Inter (Variable Font)
- **Monospace**: JetBrains Mono

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Email auth provider
3. Set up Row Level Security policies
4. Create storage buckets for assignments

### Database Schema

Run migrations to set up the database:
```bash
npx prisma migrate deploy
```

Generate Prisma client:
```bash
npx prisma generate
```

## 📄 API Documentation

All API routes are located in `src/app/api/`:
- `/api/auth` - Authentication endpoints
- `/api/assignments` - Assignment management
- `/api/attendance` - Attendance tracking
- `/api/notices` - Notice management
- `/api/complaints` - Complaint handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
