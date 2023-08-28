// Import & Init Packegs
const express = require('express');
require('dotenv').config();

// Import DataBase
const connectToDB = require('./config/db');

// Import Middlewares
const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errors');

// Init App
const app = express();

// Connection To Database
connectToDB();

// Apply Middlewares
app.use(express.json());
app.use(logger);

// Error Handler
// app.use(notFound);
// app.use(errorHandler);

// Import Routes 
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Init The Node.js Server
const PORT = process.env.PORT || 3001; // Decler the port of the endpoint
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`)); // Tow argument ( Port, Callback Function )