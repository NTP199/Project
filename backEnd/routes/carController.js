const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

//Setting up database connection

mongoose.connect('mongodb://127.0.0.1:27017/CarDealership');
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ', err));


//Creating the schema for the database

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'salesperson'], default: 'salesperson' }
})

const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  price: String,
  color: String,
  vin: { type: String, required: true, unique: true },
  Mileage: Number,
  image: Buffer
})

//Middleware to hash password before saving user
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    //HASH the password with bcrypt
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  }
  catch (error) {
    next(error);
  }
});

//Creating the model
const User = mongoose.model('User', UserSchema); //To Users
const Cars = mongoose.model('Cars', CarSchema); // To Cars

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Home page route (EJS)
app.get('/index', (req, res) => {
  res.render('index');
});

// Define routes (In case of .HTML)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/views/index.html'));
// });

//register route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, pin_number, password, email, security_q_1, security_q_2 } = req.body; //Extracting the information

  try {
    await User.create({ username, pin_number, password, email, security_q_1, security_q_2 }); //Creating an entry in the database
    res.send('User registered successfully!');
  }

  catch (error) {

    res.status(500).send('Registration failed!'); // Send error response

  }

});

//addCars route
app.get('/addCars', (req, res) => {
  res.render('addCars');
});

app.post('/addCars', async (req, res) => {
  const { make, model, year, price, color, vin, mileage, image } = req.body; //Extracting the information

  try {
    await Cars.create({ make, model, year, price, color, vin, mileage, image }); //Creating an entry in the database
    res.send('Car added successfully!');
  }

  catch (error) {

    res.status(500).send('Registration failed!'); // Send error response

  }

});

//Login route (Created)
app.get('/login', (req, res) => {
  res.render('login');
});

//Authentication middleware into the login route
app.post('/login', async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    req.user = user;
    //If, successfully
    res.send('Login successful!');
    //If, not successfully
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed!');
  }
});


//Setting up the port number
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));