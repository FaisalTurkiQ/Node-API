require('dotenv').config();

const express = require('express');
const responseHandler = require('./src/handlers/responseHandler');
const addRequestId = require('node-express-req-id')({type: 'cuid'});
const auth = require('./src/api/middlewares/auth');

const authRoutes = require('./src/api/routes/authRoute');
const blogRoutes = require('./src/api/routes/blogRoute');

require("./src/config/db");

const app = express();

app.set('view engine', 'ejs');

// Middlewares
app.use(addRequestId);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);

app.use('/api/auth', authRoutes);

// Apply auth middleware where necessary, or globally if all routes require authentication
app.use(auth);

// Route definitions
app.use('/api/blogs', blogRoutes);

// Default route
app.get('/', (req, res) => {
    res.send(`<h3>Staging ENVIRONMENT!</h3>`);
});

// Not-found handler
app.use("*", (req, res) => {
    res.status(404).json({message: `Method: ${req.method} Path : ${req.originalUrl} - Not found`});
});

// Error handling middleware
const errorHandler = require('./src/handlers/errorHandler');
app.use(errorHandler);

// Start server
app.listen(process.env.PORT, () => {
    console.log(`run on http://localhost:${process.env.PORT}`)
});
