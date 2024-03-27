//App.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

//View engine configuration
app.set('view engine', 'ejs');

//View directory configuration
app.set('views', path.join(__dirname, '../frontend/views'));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware to analyze application/json
app.use(bodyParser.json());

//Setting up database connection
mongoose.connect('mongodb://127.0.0.1:27017/CarDealership');
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ', err));

// Routes
app.use('/auth', require('./routes/userRoutes')); //To Users
//app.use('/cars', require('./routes/carRoutes'));

//Setting up the port number
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));