# Web World Retro

A retro-styled web application with a minimalist design, featuring a personal portfolio/blog structure with a nostalgic aesthetic.

## Deployment

This application is configured for deployment on Vercel with GitHub integration for automatic deployments. The application uses a serverless architecture with Express.js backend and Vite frontend.

### Production Deployment

The application is deployed on Vercel. The production environment uses:

- Secure session cookies with proper CORS configuration
- Rate limiting for authentication endpoints
- Security headers via Helmet and Vercel.json configuration
- Memory-based session storage (can be upgraded to PostgreSQL-based storage)
- Environment variables for configuration

### Environment Variables

For production deployment, the following environment variables should be set in your Vercel project settings:

- `NODE_ENV`: Set to "production"
- `SESSION_SECRET`: A strong random string for signing session cookies
- `DATABASE_URL`: Your production database connection string
- `CORS_ORIGIN`: Your frontend domain (if different from the API domain)
- `PORT`: (Optional) The port to run the server on (defaults to 3000)

For local development and testing, please follow the instructions below.

## Features

- Minimalist retro-styled UI
- Blog section (under construction)
- Social media links
- Responsive design
- Secure user authentication with bcrypt password hashing
- Session management with express-session
- Protected admin area with authentication
- Subtle UI elements with retro aesthetics
- Production-ready security features

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Express.js, Node.js
- **Build Tools**: Vite, esbuild
- **Database**: PostgreSQL (configured with Drizzle ORM)
- **Authentication**: bcrypt for password hashing, express-session for session management
- **State Management**: React Query
- **Security**: Helmet, CORS, rate limiting
- **Deployment**: Vercel

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-world-retro.git
   cd web-world-retro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (for database configuration if needed):
   ```
   DATABASE_URL=your_database_connection_string
   SESSION_SECRET=your_session_secret_key
   ```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

- `client/` - Frontend React application
  - `src/` - Source code
    - `components/` - UI components
    - `pages/` - Page components
      - `Home.tsx` - Landing page
      - `Blog.tsx` - Blog page
      - `Admin.tsx` - Admin authentication page
      - `not-found.tsx` - 404 page
    - `hooks/` - Custom React hooks
    - `lib/` - Utility functions
- `server/` - Backend Express application
  - `index.ts` - Server entry point
  - `routes.ts` - API routes
  - `storage.ts` - Data storage interface
  - `vite.ts` - Vite configuration for development
- `shared/` - Shared code between frontend and backend
  - `schema.ts` - Database schema

## License

MIT 

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Request body: `{ "username": "user", "password": "password" }`
  - Response: `{ "id": 1, "username": "user" }`

- `POST /api/auth/login` - Login with existing credentials
  - Request body: `{ "username": "user", "password": "password" }`
  - Response: `{ "id": 1, "username": "user" }`

- `GET /api/auth/check` - Check if user is authenticated
  - Response (authenticated): `{ "authenticated": true, "username": "user" }`
  - Response (not authenticated): `{ "authenticated": false }`

- `POST /api/auth/logout` - Logout and destroy session
  - Response: `{ "message": "Logged out successfully" }`

## Admin Area

The application includes a protected admin area that requires authentication:

1. Access the admin area by clicking the subtle "ADMIN" link at the bottom of the home page
2. Login with valid credentials
3. Upon successful authentication, you'll see the "PWNED" message indicating successful access

### Default Admin User

For testing purposes, you can create an admin user with:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"securepwd123"}' http://localhost:3000/api/auth/register
```

## Session Management

The application uses express-session with a memory store for session management. In production, it's recommended to use a more robust session store like Redis or a database-backed store 

## Deployment

This project is set up with a CI/CD pipeline for automatic deployments:

1. The code is hosted on GitHub
2. Automatic deployments are configured through GitHub Actions and Vercel
3. When changes are pushed to the `main` branch or when a pull request is merged into `main`, the application is automatically deployed to production

### Deployment Configuration

The deployment is configured using:
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Vercel configuration (`vercel.json`)

### Required Secrets for GitHub Actions

The following secrets need to be set in your GitHub repository settings:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Environment Variables

Create a `.env` file based on the `.env.example` template for local development. For production, set these environment variables in your Vercel project settings.

### Development Workflow

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes and commit them: `git commit -m "Add your feature"`
3. Push your branch to GitHub: `git push origin feature/your-feature-name`
4. Create a Pull Request on GitHub
5. Once the PR is reviewed and merged, the changes will be automatically deployed to production 

# Deployment Status
[![Deploy to Production](https://github.com/sujit4/web-world-retro/actions/workflows/deploy.yml/badge.svg)](https://github.com/sujit4/web-world-retro/actions/workflows/deploy.yml) 