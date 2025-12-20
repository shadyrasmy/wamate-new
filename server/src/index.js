require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const socketHandler = require('./socket');
const setupSecurity = require('./middlewares/security.middleware');
const { errorHandler, AppError } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const instanceRoutes = require('./routes/instance.routes');
const chatRoutes = require('./routes/chat.routes');
const contactRoutes = require('./routes/contact.routes');
const morgan = require('morgan');
require('./services/cron.service'); // Initialize daily cron jobs

// Initialize App
const app = express();
const server = http.createServer(app);

// 1. Security Middleware (Helmet, CORS, Rate Limit)
setupSecurity(app);

// 2. Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/public', express.static('public')); // Serve uploads

// Database Connection
connectDB();

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3002', '*'], // Allow * for dev flexibility if needed, or specific
        methods: ['GET', 'POST']
    }
});
global.io = io;
socketHandler(io);

// 4. Routes
app.get('/', (req, res) => {
    res.send('WaMate API is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/plans', require('./routes/plan.routes'));
app.use('/api/seats', require('./routes/seat.routes'));
app.use('/api/user', require('./routes/user.routes'));


// 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handler
app.use(errorHandler);

// Global crash handlers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down gracefully...');
    console.error(err.name, err.message, err.stack);
    // process.exit(1); // Keep it running if possible, or restart. For now, let's log and keep running if it's not critical. 
    // In production, you typically want to restart.
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err.name, err.message, err.stack);
    // server.close(() => {
    //     process.exit(1);
    // });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🔒 Security headers enabled`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
});
