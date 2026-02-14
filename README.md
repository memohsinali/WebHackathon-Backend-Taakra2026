# Taakra Backend

Production-ready backend for Taakra Web Application - A comprehensive competition management platform with real-time features and AI-powered chatbot support.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [WebSocket Events](#websocket-events)
- [Deployment](#deployment)
- [Security](#security)
- [Scripts](#scripts)
- [Sample Credentials](#sample-credentials)

## Overview

Taakra Backend is a robust, scalable backend system built for managing competitions, user registrations, and real-time communications. The application features JWT-based authentication with Google OAuth integration, role-based access control, real-time chat functionality using Socket.io, and an AI-powered chatbot using OpenAI's GPT models.

This backend serves as the foundation for a complete competition management platform, supporting administrators, support staff, and regular users with different permission levels and capabilities.

## Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) + Google OAuth 2.0
- **Real-time Communication**: Socket.io
- **AI Integration**: OpenAI GPT-4
- **Security**: Helmet, Express Rate Limit, bcryptjs
- **Validation**: Express Validator
- **Logging**: Winston & Morgan
- **Session Management**: Express Session
- **Development**: Nodemon

## Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Google OAuth 2.0 integration for social login
- Role-based access control (Admin, Support, User)
- Secure password hashing with bcryptjs
- Token refresh mechanism for extended sessions

### Competition Management
- Full CRUD operations for competitions
- Category-based competition organization
- Advanced filtering (by category, status, date range)
- Competition calendar view
- Admin-only competition creation and management

### Registration System
- User registration for competitions
- Registration status tracking (pending, approved, rejected)
- User-specific registration history
- Admin approval workflow
- Automated validation and error handling

### Category Management
- CRUD operations for competition categories
- Category-based filtering
- Icon and color customization support
- Admin-controlled category management

### Real-time Chat
- Socket.io-based real-time messaging
- Authenticated socket connections
- One-to-one chat functionality
- Typing indicators
- Message history and conversation tracking
- Online user presence detection

### AI Chatbot
- OpenAI GPT-4 powered chatbot
- Context-aware responses
- Integration with competition and user data
- Rate-limited API access

### Admin Features
- Dashboard statistics (users, competitions, registrations, categories)
- User management and listing
- Support member assignment
- System-wide analytics
- Registration approval system

## Project Structure

```
Taakra-Backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   ├── logger.js            # Winston logger setup
│   │   └── passport.js          # Passport Google OAuth configuration
│   ├── controllers/
│   │   ├── adminController.js   # Admin dashboard and user management
│   │   ├── authController.js    # Authentication and authorization
│   │   ├── categoryController.js # Category CRUD operations
│   │   ├── chatbotController.js # AI chatbot integration
│   │   ├── chatController.js    # Chat history and conversations
│   │   ├── competitionController.js # Competition management
│   │   └── registrationController.js # Registration handling
│   ├── middleware/
│   │   ├── auth.js              # JWT verification and role authorization
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validator.js         # Request validation middleware
│   ├── models/
│   │   ├── Category.js          # Category schema
│   │   ├── ChatMessage.js       # Chat message schema
│   │   ├── Competition.js       # Competition schema
│   │   ├── Registration.js      # Registration schema
│   │   └── User.js              # User schema with roles
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin API endpoints
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── categoryRoutes.js    # Category endpoints
│   │   ├── chatbotRoutes.js     # Chatbot endpoints
│   │   ├── chatRoutes.js        # Chat endpoints
│   │   ├── competitionRoutes.js # Competition endpoints
│   │   └── registrationRoutes.js # Registration endpoints
│   ├── seed/
│   │   └── seedData.js          # Database seeding script
│   ├── services/
│   │   └── chatbotService.js    # OpenAI integration service
│   ├── sockets/
│   │   └── chatSocket.js        # Socket.io chat implementation
│   ├── utils/
│   │   ├── errorResponse.js     # Custom error response class
│   │   └── generateToken.js     # JWT token utilities
│   └── app.js                   # Express app configuration
├── logs/                        # Application logs directory
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore configuration
├── package.json                 # Project dependencies
├── server.js                    # Server entry point
└── README.md                    # Project documentation
```

## Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local installation or MongoDB Atlas account
- **npm** or **yarn** package manager
- **OpenAI API Key** (for chatbot functionality)
- **Google OAuth Credentials** (optional, for OAuth login)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Taakra-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables))

4. **Seed the database** (optional - creates sample data)
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or your configured PORT)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/taakra
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taakra?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret
SESSION_SECRET=your_session_secret_change_this_in_production

# OpenAI API (for Chatbot)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Application environment (development/production) | Yes |
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for access token generation | Yes |
| `JWT_EXPIRES_IN` | Access token expiration time | Yes |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh token generation | Yes |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration time | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | Optional |
| `SESSION_SECRET` | Express session secret key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Optional |
| `OPENAI_MODEL` | OpenAI model to use (gpt-4, gpt-3.5-turbo) | Optional |
| `CLIENT_URL` | Frontend application URL for CORS | Yes |
| `RATE_LIMIT_WINDOW_MS` | Rate limit time window in milliseconds | Yes |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per window | Yes |

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (create a database user)
4. Configure network access (add your IP address or allow access from anywhere)
5. Get your connection string and update `MONGODB_URI` in `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taakra?retryWrites=true&w=majority
```

### Local MongoDB

1. Install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
   ```bash
   # macOS/Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```
3. Use local connection string in `.env`
   ```env
   MONGODB_URI=mongodb://localhost:27017/taakra
   ```

### Database Seeding

The application includes a seeding script that creates sample data:

```bash
npm run seed
```

This creates:
- 3 users (Admin, Support, Regular User)
- 5 categories
- 10 sample competitions
- Sample registrations

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@taakra.com",
  "password": "123456"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Admin User",
      "email": "admin@taakra.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Admin User",
    "email": "admin@taakra.com",
    "role": "admin",
    "createdAt": "2024-02-14T10:30:00.000Z"
  }
}
```

#### 5. Google OAuth Login
```http
GET /api/auth/google
```
Redirects to Google OAuth consent screen.

#### 6. Google OAuth Callback
```http
GET /api/auth/google/callback
```
Handles Google OAuth callback and redirects to client with tokens.

### Category Endpoints

#### 1. Get All Categories
```http
GET /api/categories
```

**Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Coding",
      "description": "Programming and development competitions",
      "icon": "code",
      "color": "#3B82F6",
      "createdAt": "2024-02-14T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Single Category
```http
GET /api/categories/:id
```

#### 3. Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Design",
  "description": "UI/UX and graphic design competitions",
  "icon": "palette",
  "color": "#EC4899"
}
```

#### 4. Update Category (Admin Only)
```http
PUT /api/categories/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

#### 5. Delete Category (Admin Only)
```http
DELETE /api/categories/:id
Authorization: Bearer {accessToken}
```

### Competition Endpoints

#### 1. Get All Competitions
```http
GET /api/competitions?category=65f1a2b3c4d5e6f7g8h9i0j1&status=active&search=hackathon
```

**Query Parameters**:
- `category`: Filter by category ID
- `status`: Filter by status (upcoming, active, completed)
- `search`: Search in title and description
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)

**Response (200)**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Annual Hackathon 2026",
      "description": "48-hour coding competition",
      "category": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "Coding"
      },
      "startDate": "2026-03-01T00:00:00.000Z",
      "endDate": "2026-03-03T00:00:00.000Z",
      "registrationDeadline": "2026-02-25T00:00:00.000Z",
      "maxParticipants": 100,
      "currentParticipants": 45,
      "venue": "Tech Hub",
      "status": "upcoming",
      "prize": "$10,000",
      "createdAt": "2024-02-14T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Single Competition
```http
GET /api/competitions/:id
```

#### 3. Get Competitions Calendar
```http
GET /api/competitions/calendar
```

Returns competitions grouped by month for calendar view.

#### 4. Create Competition (Admin Only)
```http
POST /api/competitions
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Web Development Challenge",
  "description": "Build a full-stack web application",
  "category": "65f1a2b3c4d5e6f7g8h9i0j1",
  "startDate": "2026-04-01",
  "endDate": "2026-04-15",
  "registrationDeadline": "2026-03-25",
  "maxParticipants": 50,
  "venue": "Online",
  "prize": "$5,000"
}
```

#### 5. Update Competition (Admin Only)
```http
PUT /api/competitions/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Updated Title",
  "maxParticipants": 75
}
```

#### 6. Delete Competition (Admin Only)
```http
DELETE /api/competitions/:id
Authorization: Bearer {accessToken}
```

### Registration Endpoints

#### 1. Create Registration
```http
POST /api/registrations
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "competition": "65f1a2b3c4d5e6f7g8h9i0j1",
  "teamName": "Code Warriors",
  "teamMembers": ["member1@example.com", "member2@example.com"],
  "additionalInfo": "We have experience in React and Node.js"
}
```

#### 2. Get My Registrations
```http
GET /api/registrations/my
Authorization: Bearer {accessToken}
```

#### 3. Get All Registrations (Admin/Support Only)
```http
GET /api/registrations
Authorization: Bearer {accessToken}
```

#### 4. Approve Registration (Admin Only)
```http
PUT /api/registrations/:id/approve
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "approved"
}
```

#### 5. Delete Registration
```http
DELETE /api/registrations/:id
Authorization: Bearer {accessToken}
```

### Chat Endpoints

#### 1. Get Conversations
```http
GET /api/chat/conversations
Authorization: Bearer {accessToken}
```

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Support User",
      "email": "support@taakra.com",
      "role": "support",
      "lastMessage": "How can I help you?",
      "timestamp": "2024-02-14T10:30:00.000Z",
      "unreadCount": 2
    }
  ]
}
```

#### 2. Get Chat History
```http
GET /api/chat/:userId
Authorization: Bearer {accessToken}
```

**Response (200)**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "sender": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "receiver": {
        "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Support User",
        "email": "support@taakra.com"
      },
      "message": "I need help with registration",
      "createdAt": "2024-02-14T10:30:00.000Z"
    }
  ]
}
```

### Chatbot Endpoints

#### 1. Get Chatbot Response
```http
POST /api/chatbot
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "message": "What competitions are available?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you with Taakra competitions?"
    }
  ]
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "response": "We currently have 10 active competitions across various categories including Coding, Design, Business, and more. Would you like me to provide details about any specific category?"
  }
}
```

### Admin Endpoints

#### 1. Get Dashboard Statistics (Admin Only)
```http
GET /api/admin/stats
Authorization: Bearer {accessToken}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalCompetitions": 25,
    "totalRegistrations": 320,
    "totalCategories": 5,
    "pendingRegistrations": 12,
    "activeCompetitions": 8
  }
}
```

#### 2. Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer {accessToken}
```

**Response (200)**:
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-02-14T10:30:00.000Z"
    }
  ]
}
```

#### 3. Add Support Member (Admin Only)
```http
POST /api/admin/support
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "newsupport@taakra.com"
}
```

## WebSocket Events

### Client Events (Emitted by Client)

#### 1. authenticate
Authenticate the socket connection with JWT token.
```javascript
socket.emit('authenticate', accessToken);
```

#### 2. sendMessage
Send a message to another user.
```javascript
socket.emit('sendMessage', {
  receiverId: '65f1a2b3c4d5e6f7g8h9i0j1',
  message: 'Hello, I need help!'
});
```

#### 3. typing
Indicate that user is typing.
```javascript
socket.emit('typing', {
  receiverId: '65f1a2b3c4d5e6f7g8h9i0j1'
});
```

#### 4. stopTyping
Indicate that user stopped typing.
```javascript
socket.emit('stopTyping', {
  receiverId: '65f1a2b3c4d5e6f7g8h9i0j1'
});
```

### Server Events (Received by Client)

#### 1. authenticated
Confirmation of successful authentication.
```javascript
socket.on('authenticated', (data) => {
  console.log('Authenticated as:', data.name, data.role);
});
```

#### 2. receiveMessage
Receive a new message.
```javascript
socket.on('receiveMessage', (message) => {
  console.log('New message from:', message.sender.name);
  console.log('Message:', message.message);
});
```

#### 3. messageSent
Confirmation that message was sent successfully.
```javascript
socket.on('messageSent', (message) => {
  console.log('Message sent successfully:', message);
});
```

#### 4. userTyping
Another user is typing.
```javascript
socket.on('userTyping', (data) => {
  console.log('User is typing:', data.userId);
});
```

#### 5. userStopTyping
Another user stopped typing.
```javascript
socket.on('userStopTyping', (data) => {
  console.log('User stopped typing:', data.userId);
});
```

#### 6. error
Error occurred during socket operation.
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

### Socket.io Client Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

// Authenticate
socket.emit('authenticate', yourAccessToken);

// Listen for authentication confirmation
socket.on('authenticated', (data) => {
  console.log('Connected as:', data.name);
});

// Send message
socket.emit('sendMessage', {
  receiverId: 'user123',
  message: 'Hello!'
});

// Receive messages
socket.on('receiveMessage', (message) => {
  displayMessage(message);
});

// Handle errors
socket.on('error', (error) => {
  console.error(error.message);
});
```

## Deployment

### Deployment on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables from your `.env` file
5. Deploy

### Deployment on Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB database (or use MongoDB Atlas)
4. Configure environment variables
5. Deploy automatically on push

### Deployment on Heroku

1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create taakra-backend
   ```
4. Add MongoDB add-on or use MongoDB Atlas:
   ```bash
   heroku addons:create mongodb:sandbox
   ```
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set OPENAI_API_KEY=your_key
   # ... set all other variables
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```

### Production Checklist

- [ ] Update all secret keys in environment variables
- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Configure MongoDB Atlas for production database
- [ ] Set `NODE_ENV=production`
- [ ] Update `CLIENT_URL` to production frontend URL
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting appropriately
- [ ] Review and update Google OAuth callback URL
- [ ] Set up database backups
- [ ] Configure firewall rules

## Security

This application implements multiple security best practices:

### Authentication & Authorization
- **JWT Tokens**: Secure access and refresh token mechanism
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Role-Based Access Control (RBAC)**: Admin, Support, and User roles with different permissions
- **Google OAuth 2.0**: Secure third-party authentication

### API Security
- **Helmet**: Security headers to protect against common vulnerabilities
- **CORS**: Configured Cross-Origin Resource Sharing
- **Rate Limiting**: Protection against brute-force and DDoS attacks
- **Input Validation**: Express Validator for request validation
- **MongoDB Injection Protection**: Mongoose schema validation

### Session Management
- **Secure Sessions**: Express session with secret key
- **Token Expiration**: Configurable token lifetimes
- **Refresh Token Rotation**: Secure token refresh mechanism

### WebSocket Security
- **Authenticated Sockets**: JWT verification for socket connections
- **User Validation**: Verification of sender/receiver in messages
- **Connection Tracking**: Secure user presence management

### Error Handling
- **Global Error Handler**: Centralized error processing
- **Custom Error Responses**: Sanitized error messages
- **Logging**: Winston logger for audit trails

### Additional Security Measures
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Ready**: Configured for SSL/TLS in production
- **MongoDB Connection Security**: Support for authenticated connections
- **Password Policies**: Minimum length and confirmation validation

## Scripts

```bash
# Install dependencies
npm install

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Seed database with sample data
npm run seed

# Run tests (to be implemented)
npm test
```

### Available NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `node server.js` | Start production server |
| `dev` | `nodemon server.js` | Start development server with auto-reload |
| `seed` | `node src/seed/seedData.js` | Seed database with sample data |
| `test` | `echo "Error: no test specified"` | Run tests (placeholder) |

## Sample Credentials

After running `npm run seed`, you can use these credentials to test the application:

### Admin Account
- **Email**: admin@taakra.com
- **Password**: 123456
- **Role**: Admin
- **Permissions**: Full access to all features, user management, competition management, registration approval

### Support Account
- **Email**: support@taakra.com
- **Password**: 123456
- **Role**: Support
- **Permissions**: View registrations, manage user queries, access chat features

### Regular User Account
- **Email**: user@taakra.com
- **Password**: 123456
- **Role**: User
- **Permissions**: Register for competitions, view competitions, use chat features

**Important**: Change these passwords immediately in production environments!

---

**Note**: This is a production-ready backend application. Always follow security best practices, use strong passwords, keep dependencies updated, and regularly review security configurations.

For issues, feature requests, or contributions, please contact the development team.

**Built with Node.js, Express, MongoDB, Socket.io, and OpenAI** | **License**: ISC
#   W e b H a c k a t h o n - B a c k e n d - T a a k r a 2 0 2 6  
 