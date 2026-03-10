const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// CONNECTING TO THE VAULT
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ NAWI EMPIRE: DATABASE CONNECTED"))
    .catch(err => console.log("❌ CONNECTION ERROR:", err));

// THE USER/CREATOR SCHEMA
const userSchema = new mongoose.Schema({
    username: String,
    balance: Number,
    role: String,
    secret_key: String,
    followers: [String], // Array of IDs for the follow system
    following: [String]
});
const User = mongoose.model('User', userSchema, 'users');

// API: HIDDEN ADMIN AUTH (For the Ghost CEO)
app.post('/api/ghost-login', async (req, res) => {
    const { pin } = req.body;
    const admin = await User.findOne({ role: 'admin' });
    if (admin && admin.secret_key === pin) {
        res.json({ success: true, vault: admin.balance });
    } else {
        res.json({ success: false });
    }
});

// API: SOCIAL FOLLOW LOGIC
app.post('/api/follow', async (req, res) => {
    // Logic to handle "I follow you, you follow me"
    res.json({ success: true, message: "Mutual connection established" });
});

// ROUTING THE 7 PILLARS
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `${req.params.page}.html`), (err) => {
        if (err) res.status(404).send("Pillar Not Found");
    });
});

app.listen(process.env.PORT || 3000);
