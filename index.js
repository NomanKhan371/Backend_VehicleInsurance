const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./db/db');

app.use(bodyparser.json());

app.get('/', (req, res) => res.send('Hello World!'));

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, pass } = req.body;
        const result = await db.find({ email, pass });
        if (result.length === 1) {
            res.json({ msg: "Login successful", status: 200 });
        } else {
            res.json({ msg: "Login Failed", status: 400 });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

// Register
app.post("/register", async (req, res) => {
    try {
        const body = req.body;
        const result = await db.create(body);
        res.status(201).json({ msg: "User registered successfully", status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

// Fetch policies
app.get("/policies", async (req, res) => {
    try {
        const policies = await db.getPolicies();
        res.json(policies);
    } catch (error) {
        console.error('Error fetching policies:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

// Add a new policy
app.post("/policies", async (req, res) => {
    try {
        const body = req.body;
        const result = await db.createPolicy(body);
        res.status(201).json({ msg: "Policy added successfully", status: 201 });
    } catch (error) {
        console.error('Error adding policy:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

// Submit claim
app.post("/submitClaim", async (req, res) => {
    try {
        const claimData = req.body;
        await db.createClaim(claimData);
        res.json({ msg: "Claim submitted successfully", status: 200 });
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

// Fetch user claims
app.get("/claims", async (req, res) => {
    try {
        const { email } = req.query;
        const claims = await db.getUserClaims(email);
        res.json(claims);
    } catch (error) {
        console.error('Error fetching user claims:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});


// Endpoint to fetch user profile by email
app.get("/userProfile", async (req, res) => {
    const email = req.query.email;
    try {
        const user = await db.getUserProfile(email);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3000, '0.0.0.0', () => console.log('App listening on port 3000!'));
