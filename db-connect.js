const mongoose = require('mongoose');

// 🛡️ MASTER CONNECTION STRING
// Using your verified NAWI-EMPIRE001 credentials directly for 100% uptime.
const uri = "mongodb+srv://NAWI-EMPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true } 
};

async function connectVault() {
  try {
    if (mongoose.connection.readyState === 1) return; 
    
   // Connect and STAY connected. No disconnect command used here.
    await mongoose.connect(uri, clientOptions);
    console.log("🏰 NAWI EMPIRE: Vault Synchronized & Locked Open!");
  } catch (error) {
    console.error("⚠️ SYNC FAILURE:", error.message);
    setTimeout(connectVault, 5000); // Reconnect if signal drops
  }
}

// Execute connection
connectVault();

// 📂 SCHEMA STRUCTURE
// We force the collection name to 'Kitchen-meals' to match your Atlas dashboard.
const kitchenSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    price: String,
    tier: { type: String, default: "7 Pillars Elite" },
    category: { type: String, default: "Global Asset" }
}, { collection: 'Kitchen-meals' });

const KitchenMeal = mongoose.model('KitchenMeal', kitchenSchema);

// 🚀 MASTER EXPORTS
// We export the Model so server.js can find the products
// We export the Function so vendor.html can add new products
async function pushToGlobalMarket(productData) {
    try {
        const finalProduct = new KitchenMeal(productData);
        const result = await finalProduct.save();
        return { success: true, id: result._id };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = { mongoose, KitchenMeal, pushToGlobalMarket };
