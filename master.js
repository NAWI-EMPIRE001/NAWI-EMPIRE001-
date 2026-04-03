// THE MASTER OMNI-CONTROL (server.js)
const MasterControlSchema = new mongoose.Schema({
    masterId: String,
    targetUserId: String,
    action: { type: String, enum: ['ENTER_PRIVATE_LIVE', 'FREEZE_COINS', 'DELETE_POST', 'SHUTDOWN_STREAM'] },
    timestamp: { type: Date, default: Date.now }
});

// THE "OMNI-PASS" MIDDLEWARE
app.get('/api/master/entry/:streamId', async (req, res) => {
    const { adminSecret, myUserId } = req.query;

    // Check if the user is the Master (YOU)
    if (adminSecret !== "EMPIRE_7_SECRET_2024") {
        return res.status(403).json({ message: "You do not have Master Authority." });
    }

    // Master enters any stream - Bypass "Request to Join"
    res.json({
        access: "GRANTED",
        role: "THE_MASTER",
        capabilities: ["Can_Mute_All", "See_Private_Gifts", "End_Stream"]
    });
});

// THE 7 PILLARS REVENUE TRACKER (For Your Eyes Only)
app.get('/api/master/vault-stats', async (req, res) => {
    // Total Coins Bought ($0.10) vs Total Coins Gifted ($0.02)
    const totalVault = await Vault.findOne(); 
    res.json({
        nairaReserve: totalVault.naira,
        usdSpread: totalVault.usdSpread, // The 80% profit you keep
        activeStreams: await LiveSession.countDocuments()
    });
});
