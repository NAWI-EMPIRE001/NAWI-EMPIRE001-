const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('./'));

// YOUR VERIFIED MONGODB CONNECTION
const uri = "mongodb+srv://akpanvictor848_db_user:NAWI-EMPIRE@nawi-empire.3qj9wnj.mongodb.net/?appName=NAWI-EMPIRE";
const client = new MongoClient(uri);

async function startEmpire() {
    try {
        await client.connect();
        const db = client.db("NAWI-EMPIRE");
        const users = db.collection("users");
        console.log("------------------------------------");
        console.log("7 PILLARS SYSTEM: ONLINE");
        console.log("IDENTITY PROTECTION: ACTIVE");
        console.log("------------------------------------");

        // LOGIN & IDENTITY MASKING
        app.post('/api/auth/login', async (req, res) => {
            const { email, password } = req.body;
            const user = await users.findOne({ email, password });

            if (user) {
                // FORCE THE MASK: No personal names sent to the frontend
                const identity = user.role === 'admin' ? "7 PILLARS OFFICIAL" : user.username;
                res.json({ 
                    success: true, 
                    user: { 
                        title: identity, 
                        role: user.role,
                        mission: "NAWI-EMPIRE → A digital ecosystem where people connect, learn, create, and build opportunities."
                    } 
                });
            } else {
                res.status(401).json({ success: false, error: "Unauthorized" });
            }
        });

    } catch (e) {
        console.error("WAREHOUSE CONNECTION ERROR:", e);
    }
}

startEmpire();
app.listen(3000, () => console.log("Empire listening on Port 3000"));
