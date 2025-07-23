 # Bedaya Authentication App

A Next.js app with Ant Design and NextAuth for authentication, using MongoDB with Mongoose.

## Features

- Next.js 15 with App Router
- Ant Design UI components
- NextAuth.js for authentication
- MongoDB with Mongoose for data storage
- Email and password authentication
- Protected routes
- Responsive UI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bedaya-v2.git
cd bedaya-v2
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bedaya
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/` - Next.js pages and layouts
- `src/app/api/` - API routes
- `src/models/` - Mongoose schema models
- `src/services/` - Service layer for business logic
- `src/providers/` - React context providers
- `src/lib/` - Utility functions and libraries

## Authentication Flow

1. Users can register with email and password
2. Passwords are securely hashed with bcrypt
3. Upon login, a JWT token is created
4. Protected routes check for authentication

## API Routes

- `POST /api/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication routes

## License

This project is licensed under the MIT License.
