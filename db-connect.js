/**
 * NAWI-EMPIRE MONGODB GATEWAY
 * Authority: 7 Pillars Control Center
 * Status: PERMANENT LIVE SYNC & GLOBAL PUSH
 */

const mongoose = require('mongoose');

// 🔒 THE MASTER URI (Certified & Secured)
// Password: NAWI-EMPIRE01 | Username: NAWIE-MPIRE01 (Matched to Atlas)
const uri = "mongodb+srv://NAWIE-MPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority&appName=NAWI-EMPIRE001";

const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true },
    autoIndex: true, 
};

/**
 * 🏰 PART 1: THE POWER CONNECTION (Always-On)
 */
async function connectVault() {
  try {
    // Prevent duplicate connection attempts
    if (mongoose.connection.readyState === 1) return; 
    
    await mongoose.connect(uri, clientOptions);
    console.log("🏰 NAWI EMPIRE: Vault Synchronized Successfully!");
    console.log("🚀 Status: Database is now PERMANENTLY ACTIVE.");
  } catch (error) {
    console.error("❌ Vault Connection connect:", error.message);
    // If it's a password error, we log it clearly
    if (error.message.includes("authentication connected")) {
        console.error