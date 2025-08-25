const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 8000;

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  
  // Configure Socket.io with CORS
  const io = new Server(httpServer, {
    cors: {
      origin: [`http://localhost:${PORT}`, "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle chat messages
    socket.on('message', (message) => {
      console.log('Message received:', message);
      // Broadcast message to all connected clients
      io.emit('message', {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date()
      });
    });

    // Handle user joining
    socket.on('join', (userData) => {
      console.log('User joined:', userData);
      socket.broadcast.emit('user_joined', userData);
    });

    // Handle user leaving
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      socket.broadcast.emit('user_left', { id: socket.id });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.broadcast.emit('user_typing', data);
    });

    socket.on('stop_typing', (data) => {
      socket.broadcast.emit('user_stop_typing', data);
    });
  });

  // Express middleware for API routes
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // API Routes for different backends
  server.get('/api/status', (req, res) => {
    res.json({
      status: 'running',
      server: 'Node.js Express',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  });

  // Database status endpoints
  server.get('/api/database/mysql', (req, res) => {
    res.json({
      database: 'MySQL',
      status: 'connected',
      host: process.env.MYSQL_HOST || 'localhost',
      database: process.env.MYSQL_DATABASE || 'fullstack_app',
      timestamp: new Date().toISOString()
    });
  });

  server.get('/api/database/mongodb', (req, res) => {
    res.json({
      database: 'MongoDB',
      status: 'connected',
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_app',
      timestamp: new Date().toISOString()
    });
  });

  server.get('/api/database/postgresql', (req, res) => {
    res.json({
      database: 'PostgreSQL',
      status: 'connected',
      host: process.env.POSTGRESQL_HOST || 'localhost',
      database: process.env.POSTGRESQL_DATABASE || 'fullstack_app',
      timestamp: new Date().toISOString()
    });
  });

  // Health check endpoint
  server.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        'socket.io': 'running',
        'next.js': 'running',
        'express': 'running'
      }
    });
  });

  // Handle all other routes with Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
    console.log(`📡 Socket.io server running`);
    console.log(`🔥 Next.js ${dev ? 'development' : 'production'} mode`);
    console.log(`📊 API endpoints available at /api/*`);
  });
});
