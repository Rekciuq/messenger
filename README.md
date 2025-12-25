# Messenger Application

A modern real-time messaging application built with Nuxt 3, featuring JWT authentication, secure cookie management, and protected routes.

## Features

- 🔐 **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- 🛡️ **Protected Routes**: Automatic route protection with middleware
- 👤 **User Management**: Sign up, login, and logout functionality
- 🍪 **Cookie-based Sessions**: Secure session management using HTTP-only cookies
- 🎨 **Modern UI**: Beautiful and responsive user interface

## Authentication System

This application implements a complete JWT authentication system with the following features:

### Security Features

1. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **Secure Cookies**: In production, cookies are marked as `secure` (HTTPS only)
3. **SameSite Protection**: Cookies use `SameSite: lax` to prevent CSRF attacks
4. **7-Day Token Expiration**: Tokens automatically expire after 7 days

### Protected Routes

- **Public Routes**: `/login`, `/signup` - Accessible without authentication
- **Protected Routes**: All other routes require valid JWT token
- **Automatic Redirects**: 
  - Unauthenticated users → `/login`
  - Authenticated users on auth pages → `/` (dashboard)

### Authentication Flow

1. **Sign Up**: User creates account → JWT token generated → Cookie set → Redirect to dashboard
2. **Login**: User authenticates → JWT token generated → Cookie set → Redirect to dashboard
3. **Logout**: Cookie cleared → Redirect to login
4. **Auto-redirect**: Middleware checks authentication status on every route change

## Setup

### Prerequisites

- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory:

```bash
# JWT Secret Key - CHANGE THIS IN PRODUCTION!
# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-secret-key-change-in-production

# Database
DATABASE_URL="file:./database/db.db"
```

⚠️ **Important**: Change the `JWT_SECRET` to a strong, random value in production!

Generate a secure secret:
```bash
openssl rand -base64 32
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user info

### Request/Response Format

All API endpoints follow this response format:

```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": any
}
```

## Architecture

### Server Middleware

- **`server/middleware/auth.ts`**: Verifies JWT tokens for API routes
  - Allows public routes: `/api/v1/auth/login`, `/api/v1/auth/signup`
  - Requires authentication for all other `/api/*` routes

### Client Middleware

- **`app/middleware/auth.global.ts`**: Global route guard
  - Checks authentication status on every navigation
  - Redirects based on auth state and destination

### Utilities

- **`server/utils/jwt.ts`**: JWT token management
  - `generateToken()` - Create JWT tokens
  - `verifyToken()` - Validate and decode tokens
  - `setAuthCookie()` - Set secure HTTP-only cookie
  - `getAuthToken()` - Retrieve token from cookie
  - `clearAuthCookie()` - Remove auth cookie
  - `getAuthUser()` - Extract user from request

### Services

- **`server/bll/AuthService.ts`**: Business logic layer
  - User authentication
  - Password hashing with bcrypt
  - User registration

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

### Production Checklist

- [ ] Set a strong `JWT_SECRET` environment variable
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Enable rate limiting on auth endpoints
- [ ] Monitor authentication logs

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS
- **Backend**: Nuxt Server API, Prisma ORM
- **Database**: SQLite (development), PostgreSQL recommended for production
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, HTTP-only cookies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
