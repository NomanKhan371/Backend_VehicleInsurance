// index.js

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
        if(result.length === 1) {
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

// Submit Claim
app.post("/submit-claim", async (req, res) => {
    try {
        const { email, pass, policy } = req.body;
        const result = await db.find({ email, pass });
        if(result.length === 1) {
            await db.addClaim({ email, policy });
            res.json({ msg: "Claimed successfully", status: 200 });
        } else {
            res.json({ msg: "Invalid user credentials", status: 400 });
        }
    } catch (error) {
        console.error('Error during claim submission:', error);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
    }
});

app.listen(3000, '0.0.0.0', () => console.log('App listening on port 3000!'));