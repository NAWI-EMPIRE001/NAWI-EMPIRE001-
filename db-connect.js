const mongoose = require('mongoose');
const Meal = require('./models/Meal'); // Importing the Master Schema

// --- 🛡️ MASTER CONNECTION CONFIGURATION ---
const MONGO_URI = "mongodb+srv://akpanvictor848:vickypara848@nawi-empire01.7588n.mongodb.net/NAWI_VAULT?retryWrites=true&w=majority";

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true } 
};

/**
 * Establishes a permanent link to the NAWI-EMPIRE Vault.
 * Includes auto-reconnect logic to ensure 100% uptime.
 */
async function connectVault() {
    try {
        if (mongoose.connection.readyState === 1) return; 
        
        await mongoose.connect(MONGO_URI, clientOptions);
        console.log("🏰 NAWI EMPIRE: Vault Synchronized & Locked Open!");
    } catch (error) {
        console.error("⚠️ VAULT SYNC FAILURE:", error.message);
        // If connection fails, retry every 5 seconds
        setTimeout(connectVault, 5000); 
    }
}

// Execute Master Connection
connectVault();

// --- 🥘 KITCHEN & MARKETPLACE LOGIC ---

/**
 * Pushes a new asset to the Global Market Audit.
 * Every entry starts as 'PENDING_AUDIT' for Founder (001) approval.
 */
async function pushToGlobalMarket(mealData) {
    try {
        const newMeal = new Meal({
            sellerId: mealData.sellerId,
            mealName: mealData.mealName,
            origin: mealData.origin || "Global",
            description: mealData.description,
            price: mealData.price,
            currency: "🪙 Empire Coins",
            category: mealData.category,
            images: mealData.images || [],
            status: 'PENDING_AUDIT' // Requires HQ Authorization
        });

        const savedMeal = await newMeal.save();
        console.log(`✨ MARKET ENTRY LOGGED: ${savedMeal.mealName}`);
        
        return { 
            success: true, 
            message: "Asset sent to HQ for Audit", 
            mealId: savedMeal._id 
        };
    } catch (error) {
        console.error("❌ MARKET ENTRY ERROR:", error.message);
        return { 
            success: false, 
            message: "Vault Entry Failed", 
            error: error.message 
        };
    }
}

// --- 📤 MASTER EXPORTS ---
module.exports = {
    mongoose,
    KitchenMeal: Meal, // Exporting as KitchenMeal to stay compatible with server.js
    pushToGlobalMarket
};
