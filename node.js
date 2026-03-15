const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// 🔗 YOUR CORRECTED CONNECTION STRING
const uri = "mongodb+srv://NAWIEMPIRE001:NAWI-EMPIRE01@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";

// Database Connection
mongoose.connect(uri)
  .then(() => console.log("🏰 NAWI EMPIRE: Database Connected Successfully"))
  .catch(err => console.log("❌ Connection Error:", err));

// Founder Credentials (Hidden from users)
const ADMIN_EMAIL = "akpanvictor848@gmail.com";
const ADMIN_PASS = "$Nsikak111";

// Login Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        return res.status(200).json({ success: true, token: "FOUNDER_001" });
    }
    res.status(401).json({ success: false, message: "Invalid Identity" });
});

// Serve the Gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Engine
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Empire Engine Active on Port ${PORT}`);
});
