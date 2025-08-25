# Full-Stack Application Dashboard

A comprehensive full-stack application featuring QR code generation/scanning, real-time chat, REST API integration, and Firebase realtime database connectivity.

## 🚀 Features

### Frontend Technologies
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for modern styling
- **Shadcn/ui** components
- **Responsive design** for all devices

### Backend Technologies
- **Node.js** with Express server
- **Socket.io** for real-time communication
- **Python** for QR code generation
- **RESTful API** design
- **Multiple database** support

### Database Support
- **MySQL** integration
- **MongoDB** support
- **PostgreSQL** connection
- **SQLite** for development
- **Firebase Realtime Database**

### Key Features
- **QR Code Generator** - Generate QR codes from text using Python backend
- **QR Code Scanner** - Scan QR codes using JavaScript libraries
- **Real-time Chat** - Socket.io powered messaging system
- **REST API Panel** - Test connections to Django, Laravel, and Node.js backends
- **Firebase Integration** - Live data synchronization
- **Multi-database Support** - Connect to various database systems

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Quick Start

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd fullstack-app
npm install
```

2. **Setup Python Dependencies**
```bash
npm run setup:python
# or manually:
cd python && pip install -r requirements.txt
```

3. **Configure Environment**
```bash
cp .env.local.example .env.local
# Edit .env.local with your database credentials and Firebase config
```

4. **Start the Application**
```bash
# Start the full application (Socket.io + Next.js)
npm run server

# Or start development mode
npm run dev
```

5. **Access the Application**
- Open http://localhost:8000 in your browser
- The dashboard will be available with all features

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=fullstack_app

MONGODB_URI=mongodb://localhost:27017/fullstack_app

POSTGRESQL_HOST=localhost
POSTGRESQL_USER=postgres
POSTGRESQL_PASSWORD=password
POSTGRESQL_DATABASE=fullstack_app

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Server Configuration
PORT=8000
NODE_ENV=development
```

### Database Setup

#### MySQL
```sql
CREATE DATABASE fullstack_app;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON fullstack_app.* TO 'app_user'@'localhost';
```

#### PostgreSQL
```sql
CREATE DATABASE fullstack_app;
CREATE USER app_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE fullstack_app TO app_user;
```

#### MongoDB
```bash
# Start MongoDB service
mongod

# Create database (will be created automatically on first use)
```

## 🏗️ Project Structure

```
fullstack-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── qrcode/
│   │   │       └── route.ts          # QR code generation API
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main dashboard
│   ├── components/
│   │   ├── QRGenerator.tsx           # QR code generator component
│   │   ├── QRScanner.tsx             # QR code scanner component
│   │   ├── RealtimeChat.tsx          # Socket.io chat component
│   │   ├── RestAPIPanel.tsx          # REST API testing panel
│   │   ├── FirebaseRealtime.tsx      # Firebase integration
│   │   └── ui/                       # Shadcn/ui components
│   └── lib/
│       └── firebase-config.ts        # Firebase configuration
├── config/
│   └── database.config.js            # Database connections
├── python/
│   ├── qrcode_generator.py           # Python QR generator
│   └── requirements.txt              # Python dependencies
├── server.js                         # Socket.io + Express server
├── .env.local                        # Environment variables
└── README.md
```

## 🔌 API Endpoints

### QR Code API
- `POST /api/qrcode` - Generate QR code from text
- `GET /api/qrcode` - API documentation

### Server Status
- `GET /api/status` - Server health check
- `GET /health` - Detailed health information

### Database Status
- `GET /api/database/mysql` - MySQL connection status
- `GET /api/database/mongodb` - MongoDB connection status
- `GET /api/database/postgresql` - PostgreSQL connection status

## 🔄 Real-time Features

### Socket.io Events
- `connection` - User connects to chat
- `message` - Send/receive chat messages
- `join` - User joins chat room
- `disconnect` - User leaves chat
- `typing` - Typing indicators
- `stop_typing` - Stop typing indicators

### Firebase Realtime
- Live data synchronization
- Real-time message updates
- Automatic reconnection
- Offline support

## 🧪 Testing

### Test QR Code Generation
```bash
npm run test:qr
```

### Test API Endpoints
```bash
# Test QR code API
curl -X POST http://localhost:8000/api/qrcode \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello World"}'

# Test server status
curl http://localhost:8000/api/status
```

### Test Socket.io Connection
```javascript
// In browser console
const socket = io('http://localhost:8000');
socket.emit('message', { text: 'Hello', user: 'Test' });
```

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Start Socket.io server
npm run server

# Start both (requires concurrently)
npm run dev:full

# Setup Python environment
npm run setup:python

# Test QR generation
npm run test:qr

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 External Backend Integration

### Django Backend (Port 8001)
```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
]

# urls.py
urlpatterns = [
    path('api/status/', status_view),
]
```

### Laravel Backend (Port 8002)
```php
// routes/api.php
Route::get('/status', function () {
    return response()->json([
        'status' => 'running',
        'server' => 'Laravel',
        'timestamp' => now()
    ]);
});
```

### Node.js Backend (Port 8003)
```javascript
// server.js
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        server: 'Node.js',
        timestamp: new Date()
    });
});
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
```

### Environment Setup
- Configure production database connections
- Set up Firebase project
- Configure CORS for production domains
- Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Test API endpoints using the provided curl commands
- Verify database connections using the health check endpoints

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] File upload/download functionality
- [ ] Advanced QR code customization
- [ ] Chat room management
- [ ] Database migration scripts
- [ ] API rate limiting
- [ ] Comprehensive test suite
- [ ] Docker compose setup
- [ ] CI/CD pipeline
