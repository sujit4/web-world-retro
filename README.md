# Web World Retro

A retro-styled web application with a minimalist design, featuring a personal portfolio/blog structure with a nostalgic aesthetic.

## Features

- Minimalist retro-styled UI
- Blog section (under construction)
- Social media links
- Responsive design
- Secure user authentication with bcrypt password hashing
- Session management with express-session
- Protected admin area with authentication
- Subtle UI elements with retro aesthetics

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Express.js, Node.js
- **Build Tools**: Vite, esbuild
- **Database**: PostgreSQL (configured with Drizzle ORM)
- **Authentication**: bcrypt for password hashing, express-session for session management
- **State Management**: React Query

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