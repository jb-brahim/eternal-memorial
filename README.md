# Eternal Memorial

A digital memorial platform to honor and remember loved ones.

## Features

- Create and manage digital memorials
- Upload multiple images (up to 5 per memorial)
- Share stories and memories
- Light virtual candles
- Comment on memorials
- Admin dashboard for content moderation
- User authentication and authorization
- Responsive design

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- JWT Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Cloudinary (image storage)
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB
- Cloudinary account
- npm or pnpm package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd eternal-memorial
```

2. Backend Setup
```bash
cd eternal-memorial-be
npm install

# Create .env file with the following variables:
# PORT=5000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret

npm run dev
```

3. Frontend Setup
```bash
cd eternal-memorial-fe
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000

npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

### Frontend
```
eternal-memorial-fe/
├── app/                 # Next.js pages and routing
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
└── styles/            # Global styles
```

### Backend
```
eternal-memorial-be/
├── config/            # Configuration files
├── middleware/        # Express middlewares
├── models/           # MongoDB models
├── routes/           # API routes
├── scripts/          # Utility scripts
└── utils/            # Helper functions
```

## API Documentation

The API documentation is available in the Postman collection: `eternal-memories-api.postman_collection.json`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.