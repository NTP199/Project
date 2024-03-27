//User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Creating the schema for the database
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, unique: false },
  role: { type: String, enum: ['admin', 'salesperson'], default: 'salesperson', require: false }
});

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

module.exports = mongoose.model('User', UserSchema); //To Users
//const User = mongoose.model('User', UserSchema); //To Users

