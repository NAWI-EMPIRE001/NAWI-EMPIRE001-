const express = require('express');
const cors = require('cors');
const path = require('path');

// 👑 IMPORT THE CORRECT MODEL FROM DB-CONNECT
const { mongoose, KitchenMeal, pushToGlobalMarket } = require('./db-connect');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// 📡 THE GLOBAL FEED ROUTE (FIXED)
app.get('/api/get-products', async (req, res) => {
    try {
        // This now looks in 'Kitchen-meals' as seen in your Atlas screenshot
        const products = await KitchenMeal.find({}).sort({ _id: -1 }); 
        console.log(`📦 Empire Vault: Found ${products.length} assets`);
        res.json(products);
    } catch (err) {
        console.error("❌ Vault Sync Error:", err.message);
        res.status(500).json({ message: "Internal Empire Error" });
    }
});

// 📥 VENDOR UPLOAD ROUTE
app.post('/api/add-product', async (req, res) => {
    try {
        const result = await pushToGlobalMarket(req.body);
        if (result.success) {
            res.status(201).json({ success: true, message: "Worldwide Asset Registered" });
        } else {
            throw new Error(result.error);
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Vault Entry Failed: " + err.message });
    }
});

// 🔐 FOUNDER LOGIN
const ADMIN_EMAIL = "akpanvictor848@gmail.com";
const ADMIN_PASS = "$Nsikak111";

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        return res.status(200).json({ success: true, token: "FOUNDER_001" });
    }
    res.status(401).json({ success: false, message: "Invalid Identity" });
});

app.get('/health', (req, res) => { res.status(200).send('Empire Active'); });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Empire Engine Active on Port ${PORT}`);
});
