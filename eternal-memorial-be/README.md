# Eternal Memories Backend API

A Node.js/Express backend for the Eternal Memories memorial website. This API provides endpoints for managing memorials, users, comments, and candle lighting features.

## Features

- User authentication (JWT)
- Memorial creation and management
- Comments system
- Candle lighting feature
- Admin dashboard API
- Image upload (Cloudinary integration)
- Content moderation
- Analytics and reporting

## Prerequisites

- Node.js >= 16
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image hosting)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.example to .env and fill in your values:
   ```bash
   cp .env.example .env
   ```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdminPassword123!
FRONTEND_URL=http://localhost:3000
```

## Setup

1. Create initial admin account:
   ```bash
   npm run create-admin
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Start production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Users
- GET /api/users/me - Get user profile
- PUT /api/users/me - Update user profile

### Memorials
- POST /api/memorials - Create memorial
- GET /api/memorials - List/search memorials
- GET /api/memorials/:id - Get memorial details
- PUT /api/memorials/:id - Update memorial
- DELETE /api/memorials/:id - Delete memorial

### Comments
- GET /api/memorials/:id/comments - Get memorial comments
- POST /api/memorials/:id/comments - Add comment
- PUT /api/memorials/:id/comments/:commentId - Edit comment
- DELETE /api/memorials/:id/comments/:commentId - Delete comment

### Candles
- POST /api/memorials/:id/candles - Light a candle
- GET /api/memorials/:id/candles/stats - Get candle statistics (admin)

### Admin Routes
- GET /api/admin/dashboard/stats - Get dashboard statistics
- GET /api/admin/memorials - List all memorials
- GET /api/admin/users - List all users
- PUT /api/admin/users/:id/ban - Ban/unban user
- GET /api/admin/reports - List content reports
- PUT /api/admin/reports/:id - Handle report

## Frontend Integration

1. Set backend URL in your frontend environment:
   ```javascript
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. Add authentication header to axios:
   ```javascript
   axios.defaults.baseURL = process.env.REACT_APP_API_URL;
   axios.interceptors.request.use(config => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

## Deployment

### Backend Deployment (Render/Railway)

1. Create new web service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from .env

### MongoDB Atlas Setup

1. Create cluster
2. Create database user
3. Get connection string
4. Add to environment variables

### Cloudinary Setup (Optional)

1. Create account
2. Get credentials
3. Add to environment variables

## Security Considerations

- All passwords are hashed using bcrypt
- JWT used for authentication
- CORS configured for frontend domain
- Rate limiting on critical endpoints
- Input validation and sanitization
- Helmet for security headers

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License

ISC

## Support

For support, email support@eternalmemories.com
