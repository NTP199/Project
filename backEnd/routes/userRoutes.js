// userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const user = require('../models/user');

// Register route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body; // Extracting the information

  try {
    console.log('Attempting to register user:', username);

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already in use', username });
    }

    //Comapre provided password with hashed password stored in the database.
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Credentials! Please, try again!' })
    }

    // Set role to 'salesperson' whether it is 'none' or 'empty'
    const userRole = role && (role.trim().toLowerCase() === 'none' || role.trim() === '') ? 'salesperson' : role;

    // Creating a new user entry in the database
    const newUser = new User({ username, password, role: userRole });

    // Saving the new user in the database
    await newUser.save();
    console.log('User registered successfully:', username);
    res.send('User registered successfully!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Registration failed!'); // Send error response
  }
});


// // Rota para autenticação de usuário
// router.post('/login', async (req, res) => {
//   // Implementação da rota de login aqui...
// });

module.exports = router;

