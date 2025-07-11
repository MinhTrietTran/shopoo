require('dotenv').config();
const express  = require('express');
const session  = require('express-session');
const path     = require('path');
const mongoose = require('mongoose');

/* ----- Kết nối Redis (khởi tạo client) ----- */
require('./src/config/databases/redis');

/* ------------- App & Middlware ------------- */
const app = express();

// JSON, form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret            : process.env.SESSION_SECRET || 'dev_secret',
  resave            : false,
  saveUninitialized : false,
  cookie: { secure: false }                     
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

/* ------------- View engine (EJS) ------------ */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));   // gốc = /views


//routes
app.use('/', require('./src/routes/web/home'));       // /
app.use('/auth', require('./src/routes/web/auth'));   // /auth/*
app.use('/products', require('./src/routes/web/products'));
app.use('/dashboard', require('./src/routes/web/dashboard'));
app.use('/auth/cart', require('./src/routes/web/cart'));
//404
app.use('*', (req, res) =>
  res.status(404).render('pages/404', {
    title: '404 Not Found',
    user : req.session?.user || null
  })
);

// Kết nối Mongo rồi khởi chạy 
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://admin:password123@mongodb:27017/shopoo?authSource=admin';

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀  Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error('❌  MongoDB connection error:', err));
