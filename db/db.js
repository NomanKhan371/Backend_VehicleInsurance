// db.js

const mongoose = require('mongoose');
MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Nomandb'

mongoose
    .connect(MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });

// Auth schema
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    claims: [{
        type: String
    }]
});

const Auth = mongoose.model('Auth', authSchema, 'creds'); // collection

async function find(query) {
    try {
        return await Auth.find(query).exec();
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

async function create(data) {
    try {
        const newUser = new Auth(data);
        return await newUser.save();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function addClaim({ email, policy }) {
    try {
        return await Auth.updateOne({ email }, { $push: { claims: policy } }).exec();
    } catch (error) {
        console.error('Error adding claim:', error);
        throw error;
    }
}

module.exports = { find, create, addClaim };