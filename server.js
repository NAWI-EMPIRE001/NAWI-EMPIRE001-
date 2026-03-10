const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// THE REAL CONNECTION (Does not close like the sample code)
// Replace <db_password> with your actual MongoDB password
const uri = "mongodb+srv://NAWI-EMPIRE:<db_password>@nawi-empire01.xhjz2iu.mongodb.net/NAWI_DATA?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log("✅ NAWI EMPIRE ENGINE: LIVE & CONNECTED"))
    .catch(err => console.log("❌ CONNECTION ERROR:", err));

// THE GHOST CEO AUTH (Checking your Secret Key)
app.post('/api/admin-auth', async (req, res) => {
    try {
        const { pin } = req.body;
        const db = mongoose.connection.db;
        const admin = await db.collection('users').findOne({ role: 'admin' });
        
        if (admin && admin.secret_key === pin) {
            return res.json({ success: true, vault: admin.balance });
        }
        res.json({ success: false });
    } catch (e) { res.status(500).send("Vault Error"); }
});

// ROUTING FOR ALL YOUR PILLARS
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/:page', (req, res) => {
    const file = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    res.sendFile(path.join(__dirname, file), (err) => {
        if (err) res.redirect('/');
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Empire Server running on Port 3000");
});
