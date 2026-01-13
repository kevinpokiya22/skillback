require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const paymentRoutes = require('./routes/payments');
const enrollmentRoutes = require('./routes/enrollment');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/health', (req, res) => res.json({ status: 'ok', routes: 'loaded' }));

// Root route for "Live" message
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Skill Sphere API - Live</title>
        <style>
          body { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            text-align: center;
          }
          .container {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          h1 { font-size: 3rem; margin-bottom: 0.5rem; }
          p { font-size: 1.2rem; opacity: 0.8; }
          .status { 
            display: inline-block; 
            padding: 5px 15px; 
            background: #00f2fe; 
            color: #000; 
            border-radius: 50px; 
            font-weight: bold;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Skill Sphere API</h1>
          <p>The server is running spectacularly!</p>
          <div class="status">● SERVER IS LIVE</div>
        </div>
      </body>
    </html>
  `);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
  console.log('\x1b[32m%s\x1b[0m', `🚀 Server is live and running on port ${PORT}`);
  console.log('\x1b[34m%s\x1b[0m', `🔗 Local URL: http://localhost:${PORT}`);
  console.log('\x1b[35m%s\x1b[0m', '🛠️  Status: All systems go!');
  console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
});
