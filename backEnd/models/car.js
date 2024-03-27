const mongoose = require('mongoose');

//Creating the schema for the database
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

module.exports = mongoose.model('Cars', CarSchema); //To Cars
//const Cars = mongoose.model('Cars', CarSchema); // To Cars