const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Nomandb'

mongoose
    .connect(MONGO_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });

// Existing Auth schema
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    }
});

const Auth = mongoose.model('Auth', authSchema, 'creds'); // collection

// New Policy schema
// Policy schema
const policySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true
    }
});

const Policy = mongoose.model('Policy', policySchema, 'policies'); //collection

// New Claim schema
const claimSchema = new mongoose.Schema({
    email: String,
    policy: policySchema,
    date: { type: Date, default: Date.now },
    staus: String
});

const Claim = mongoose.model('Claim', claimSchema, 'claims');

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

async function getPolicies() {
    try {
        return await Policy.find().exec();
    } catch (error) {
        console.error('Error fetching policies:', error);
        throw error;
    }
}
async function createPolicy(data) {
    try {
        const newPolicy = new Policy(data);
        return await newPolicy.save();
    } catch (error) {
        console.error('Error creating policy:', error);
        throw error;
    }
}

async function createClaim(claimData) {
    try {
        const newClaim = new Claim(claimData);
        return await newClaim.save();
    } catch (error) {
        console.error('Error creating claim:', error);
        throw error;
    }
}

async function getUserClaims(email) {
    try {
        return await Claim.find({ email }).exec();
    } catch (error) {
        console.error('Error fetching user claims:', error);
        throw error;
    }
}

async function getUserProfile(email) {
    try {
        return await Auth.findOne({ email }).exec();
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
}

module.exports = { find, create, getPolicies, createPolicy,createClaim, getUserClaims, getUserProfile };



