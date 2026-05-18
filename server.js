/**
 * NAWI-EMPIRE MASTER SYSTEM ENGINE v3.7
 * FILE: server.js
 * EDITION: Sovereign Executive Architecture (Unified Production Build)
 * SYSTEMS CONNECTED: Aurora-231 Hardware Check, 7 Pillars Framework,
 * Sovereign P2P Escrow, $35M Daily Volume Ledger, Compliance Vault.
 */

require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// ==========================================
// CASE-SENSITIVE ADAPTIVE CONTROLLER MATRIX
// (Guards against case mismatch crashes on Render)
// ==========================================
let authController, battleController, borderControl, masterPayout, p2pGateway;

const safeLoad = (primaryPath, fallbackPath, moduleName) => {
    try {
        return require(primaryPath);
    } catch (e) {
        if (fallbackPath) {
            try {
                return require(fallbackPath);
            } catch (err) {
                console.warn(`⚠️ Warning: ${moduleName} missing at standard and fallback paths. Registering mock layer.`);
                return null;
            }
        }
        console.warn(`⚠️ Warning: ${moduleName} missing. Registering mock layer.`);
        return null;
    }
};

authController = safeLoad('./controllers/authController', './controllers/authcontroller', 'authController') || {
    registerUser: (req, res) => res.status(503).json({ error: "Auth service initializing" }),
    handleUserSession: (req, res) => res.status(503).json({ error: "Auth service initializing" })
};

battleController = safeLoad('./controllers/battle', null, 'battleController') || {
    initializeBattleSession: (req, res) => res.status(503).json({ error: "Battle engine standby" }),
    processStreamVoteGift: (req, res) => res.status(503).json({ error: "Gifting ledger offline" })
};

borderControl = safeLoad('./controllers/border-control', null, 'borderControl') || {
    processIdentityUpload: (req, res) => res.status(503).json({ error: "Verification desk processing" }),
    getVerificationStatus: (req, res) => res.status(503).json({ error: "Verification desk processing" })
};

masterPayout = safeLoad('./controllers/master-payout', null, 'masterPayout') || {
    getPendingWithdrawals: (req, res) => res.status(503).json({ error: "Payout vault in standby" }),
    authorizePayout: (req, res) => res.status(503).json({ error: "Payout vault in standby" })
};

p2pGateway = safeLoad('./controllers/p2p-gateway', null, 'p2pGateway') || {
    serveGatewayPage: (req, res) => res.status(503).send("P2P core system reloading... Please refresh shortly."),
    createP2POrder: (req, res) => res.status(503).json({ error: "P2P network syncing" }),
    confirmP2PRelease: (req, res) => res.status(503).json({ error: "P2P network syncing" })
};

// ==========================================
// 1. GLOBAL CONFIGURATIONS & ADVANCED MIDDLEWARE
// ==========================================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'user-id', 
        'x-node-uuid', 
        'x-node-ram', 
        'x-node-display', 
        'x-node-signature'
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

// ==========================================
// 2. UNIFIED DATABASE CONFIGURATION MATRIX (SCHEMAS)
// ==========================================

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    identity: {
        sovereign_name: { type: String, default: "Authenticated Citizen" },
        legacy_rank: { type: String, default: "Citizen" },
        id_verified: { type: Boolean, default: false },
        joined_date: { type: String, default: () => new Date().toISOString().split('T')[0] }
    },
    email: String,
    metrics: {
        follower_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        daily_streak: { type: Number, default: 0 },
        activity_score: { type: Number, default: 0 }
    },
    eligibility: {
        can_go_live: { type: Boolean, default: false },
        is_monetized: { type: Boolean, default: false },
        gate_1k_reached: { type: Boolean, default: false },
        gate_20k_reached: { type: Boolean, default: false }
    },
    wallet: {
        empire_coins: { type: Number, default: 0 },
        total_earned_to_date: { type: Number, default: 0 },
        pending_conversion: { type: Number, default: 0.00 },
        last_mint_date: String
    },
    security: {
        is_banned: { type: Boolean, default: false },
        scam_alert_flag: { type: Number, default: 0 },
        multi_factor_auth: { type: String, default: "ENABLED" }
    }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
    authorName: String,
    authorId: String,
    mediaUrl: String,
    description: String,
    pillarType: { type: String, enum: ['Comedy', 'Arena', 'Music', 'Kitchen', 'Apparel', 'Normal'], default: 'Normal' },
    type: { type: String, enum: ['graphic', 'video', 'audio', 'promotion'], default: 'video' },
    isAd: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    durationWatched: { type: Number, default: 0 }, 
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const ApparelAssetSchema = new mongoose.Schema({
    assetId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    collectionType: { type: String, enum: ['Luxury Apparel', 'Sovereign Stylist Executive'], required: true },
    sizeAvailability: {
        type: [String],
        enum: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
        required: true
    },
    fabricPhysics: {
        density: { type: Number, required: true },
        stiffness: { type: Number, required: true },
        friction: { type: Number, required: true }
    },
    textures: {
        resolution: { type: String, default: '4K' },
        diffuseMapUrl: { type: String, required: true },
        normalMapUrl: { type: String, required: true },
        roughnessMapUrl: { type: String, required: true },
        metallicMapUrl: { type: String, required: true }
    },
    toolManagementLogic: {
        integratedSlots: { type: Number, default: 0 },
        utilityType: { type: String, default: 'None' }
    },
    createdAt: { type: Date, default: Date.now }
});
const ApparelAsset = mongoose.models.ApparelAsset || mongoose.model('ApparelAsset', ApparelAssetSchema);

const ComplianceVaultSchema = new mongoose.Schema({
    entityName: { type: String, default: 'NAWI-EMPIRE' },
    registeredName: { type: String, default: 'Nsikak Akpan Warri' }, 
    cacRecordNumber: { type: String, required: true },
    msmeRegistrationId: { type: String, required: true },
    encryptionKeySignature: { type: String, required: true }
});
const ComplianceVault = mongoose.models.ComplianceVault || mongoose.model('ComplianceVault', ComplianceVaultSchema);

const DailyLedgerSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    totalVolumeProcessedUsd: { type: Number, default: 0 },
    maxLimitCapUsd: { type: Number, default: 35000000 } 
});
const DailyLedger = mongoose.models.DailyLedger || mongoose.model('DailyLedger', DailyLedgerSchema);

// ==========================================
// 3. HARDWARE HANDSHAKE VERIFICATION LAYER
// ==========================================
const AURORA_231_HARDWARE_PROFILE = {
    expectedUuid: 'AURORA-231-MASTER-NODE-99X-7P',
    expectedRamGb: 192,
    expectedDisplaySize: 27
};

const verifySovereignNodeHandshake = (req, res, next) => {
    const systemUuid = req.headers['x-node-uuid'];
    const systemRam = parseInt(req.headers['x-node-ram'], 10);
    const systemDisplay = parseInt(req.headers['x-node-display'], 10);
    const secureSignature = req.headers['x-node-signature'];

    if (!systemUuid || !systemRam || !systemDisplay || !secureSignature) {
        return res.status(403).json({ 
            status: 'DENIED', 
            message: 'Access Violation: Unauthorized Terminal Context Detected.' 
        });
    }

    const hardwareMatches = (systemUuid === AURORA_231_HARDWARE_PROFILE.expectedUuid) && 
                           (systemRam === AURORA_231_HARDWARE_PROFILE.expectedRamGb) && 
                           (systemDisplay === AURORA_231_HARDWARE_PROFILE.expectedDisplaySize);

    const verificationPayload = `${systemUuid}-${systemRam}-${systemDisplay}`;
    const expectedSignature = crypto.createHmac('sha256', process.env.NODE_SECRET_KEY || 'NAWI_DEFAULT_KEY')
                                    .update(verificationPayload)
                                    .digest('hex');

    if (hardwareMatches && secureSignature === expectedSignature) {
        req.isMasterAuthority = true;
        next();
    } else {
        return res.status(401).json({ 
            status: 'DENIED', 
            message: 'Sovereign Handshake Failed. Terminal Authorization Rejected.' 
        });
    }
};

// ==========================================
// 4. INTEGRATED P2P SCALABILITY & LIQUIDITY MANAGEMENT
// ==========================================
class P2PLiquidityManager {
    constructor() {
        this.binanceApiUrl = 'https://api.binance.com';
        this.bybitApiUrl = 'https://api.bybit.com';
        this.geegpayApiUrl = 'https://api.geegpay.com';
    }

    async verifyAndTrackVolume(amountUsd) {
        const currentDate = new Date().toISOString().split('T')[0];
        let ledger = await DailyLedger.findOne({ date: currentDate });
        
        if (!ledger) {
            ledger = new DailyLedger({ date: currentDate, totalVolumeProcessedUsd: 0 });
        }

        if (ledger.totalVolumeProcessedUsd + amountUsd > ledger.maxLimitCapUsd) {
            return { allowed: false, currentVolume: ledger.totalVolumeProcessedUsd };
        }

        ledger.totalVolumeProcessedUsd += amountUsd;
        await ledger.save();
        return { allowed: true, currentVolume: ledger.totalVolumeProcessedUsd };
    }

    async createEscrowTransaction(transactionId, amountUsd, buyerWallet, sellerWallet) {
        const volumeCheck = await this.verifyAndTrackVolume(amountUsd);
        if (!volumeCheck.allowed) {
            throw new Error(`Transaction Blocked: Limit Breached. $35 Million Daily Cap Reached.`);
        }
        return {
            transactionId: transactionId,
            escrowStatus: 'PENDING',
            amountUsd: amountUsd,
            buyer: buyerWallet,
            seller: sellerWallet,
            currentDailyPlatformVolume: volumeCheck.currentVolume,
            timestamp: Date.now()
        };
    }

    async processGeegpayPayout(virtualAccountNo, amountUsd, destinationBankCode) {
        const volumeCheck = await this.verifyAndTrackVolume(amountUsd);
        if (!volumeCheck.allowed) {
            return { success: false, error: "Daily processing system threshold exceeded." };
        }
        try {
            const response = await axios.post(`${this.geegpayApiUrl}/v1/payout`, {
                accountNumber: virtualAccountNo,
                amount: amountUsd,
                currency: 'USD',
                bankCode: destinationBankCode
            }, {
                headers: { 'Authorization': `Bearer ${process.env.GEEGPAY_SECRET_KEY}` }
            });
            return response.data;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
const LiquidityEngine = new P2PLiquidityManager();

// ==========================================
// 5. SEEDING STRATEGY ENGINE
// ==========================================
const seedEmpire = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const templatePath = path.join(__dirname, 'templates', 'user-schema.json');
            if (fs.existsSync(templatePath)) {
                const data = fs.readFileSync(templatePath, 'utf8');
                const template = JSON.parse(data);
                template.userId = "NAWI-EMPIRE001";
                template.email = "akpanvictor848@gmail.com"; 
                const founder = new User(template);
                await founder.save();
                console.log("🏛️ NAWI-EMPIRE001: Genesis Founder Seeded via Template Asset.");
            } else {
                const fallbackFounder = new User({
                    userId: "NAWI-EMPIRE001",
                    email: "akpanvictor848@gmail.com",
                    identity: { sovereign_name: "Architect", legacy_rank: "Founder", id_verified: true },
                    metrics: { follower_count: 50000 },
                    wallet: { empire_coins: 1000, total_earned_to_date: 0, pending_conversion: 0 }
                });
                await fallbackFounder.save();
                console.log("🛡️ Fallback Founder Account Seeded Successfully.");
            }
        }
    } catch (err) { console.error("❌ Seed Optimization Error:", err.message); }
};

// ==========================================
// 6. ROUTING SYSTEM INTERFACES (MODULES & ENDPOINTS)
// ==========================================

// --- CORE IDENTITY CHANNELS ---
app.post('/api/auth/register', (req, res, next) => authController.registerUser(req, res, next));
app.post('/api/auth/session', (req, res, next) => authController.handleUserSession(req, res, next));

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === "akpanvictor848@gmail.com" && password === "$Nsikak111") {
        return res.status(200).json({ success: true, userId: "NAWI-EMPIRE001", rank: "FOUNDER" });
    }
    res.status(401).json({ success: false, message: "Invalid Credentials." });
});

app.get('/api/inbox/:userId', async (req, res) => {
    try {
        const messages = [{
            id: "msg_001",
            sender: "SYSTEM",
            text: "Welcome to NAWI-EMPIRE. Your Connection Vault is now active.",
            type: "ANNOUNCEMENT",
            timestamp: new Date()
        }];
        res.json(messages);
    } catch (err) { res.status(500).json({ error: "Inbox Bridge Failure" }); }
});

// --- PULSE STREAM FEED & ENGAGEMENT METRICS ---
app.get('/api/feed', async (req, res) => {
    try {
        const limit = 12;
        const feedItems = await Post.aggregate([{ $match: { status: 'active' } }, { $sample: { size: limit } }]);
        res.json(feedItems);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/track-engagement', async (req, res) => {
    const { contentId, duration } = req.body;
    try {
        await Post.findByIdAndUpdate(contentId, { $inc: { durationWatched: duration } });
        res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
});

// --- JURY ENGINE BATTLE STREAM ROUTES ---
app.post('/api/battle/initialize', (req, res, next) => battleController.initializeBattleSession(req, res, next));
app.post('/api/battle/vote-gift', (req, res, next) => battleController.processStreamVoteGift(req, res, next));

// --- APPAREL REPOSITORY REGISTRATIONS ---
app.post('/api/studio/apparel/asset', async (req, res) => {
    try {
        const newAsset = new ApparelAsset(req.body);
        const savedAsset = await newAsset.save();
        res.status(201).json({ status: 'SUCCESS', asset: savedAsset });
    } catch (error) { res.status(500).json({ status: 'ERROR', message: error.message }); }
});

// --- BORDER CONTROL IDENTITY VERIFICATION HOOKS ---
app.post('/api/border/upload-document', (req, res, next) => borderControl.processIdentityUpload(req, res, next));
app.get('/api/border/verify-status/:userId', (req, res, next) => borderControl.getVerificationStatus(req, res, next));

// --- FINANCIAL VAULTS & P2P LIQUIDITY ESCROW PORTS ---
app.get('/p2p-bridge', (req, res, next) => p2pGateway.serveGatewayPage(req, res, next));
app.post('/api/p2p/create-order', (req, res, next) => p2pGateway.createP2POrder(req, res, next));
app.post('/api/p2p/confirm-release', (req, res, next) => p2pGateway.confirmP2PRelease(req, res, next));
app.post('/api/request-withdrawal', (req, res, next) => p2pGateway.createP2POrder(req, res, next)); 

app.post('/api/finance/escrow/create', async (req, res) => {
    try {
        const { transactionId, amountUsd, buyerWallet, sellerWallet } = req.body;
        const escrowResult = await LiquidityEngine.createEscrowTransaction(transactionId, amountUsd, buyerWallet, sellerWallet);
        res.status(200).json({ status: 'SUCCESS', escrow: escrowResult });
    } catch (error) { res.status(500).json({ status: 'ERROR', message: error.message }); }
});

app.get('/api/vault/balance/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ error: "Citizen profile context missing" });
        res.json({
            coins: user.wallet.empire_coins,
            usd: user.wallet.total_earned_to_date,
            pending: user.wallet.pending_conversion
        });
    } catch (err) { res.status(500).json({ error: "Vault Link Failed" }); }
});

app.post('/api/convert-coins', async (req, res) => {
    const { userId, amount } = req.body;
    const COIN_VAL = 0.02;
    if (amount < 2500) return res.status(400).json({ message: "Min 2500 Coins required to execute shift." });
    try {
        const user = await User.findOne({ userId });
        if (!user || user.wallet.empire_coins < amount) return res.status(400).json({ message: "Insufficient balance markers." });
        const usdAmount = amount * COIN_VAL;
        await User.updateOne({ userId }, { $inc: { "wallet.empire_coins": -amount, "wallet.pending_conversion": usdAmount } });
        res.json({ success: true, usd: usdAmount });
    } catch (err) { res.status(500).json({ error: "Vault processing context failure." }); }
});

app.get('/api/ledger/volume-status', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const ledger = await DailyLedger.findOne({ date: currentDate }) || { totalVolumeProcessedUsd: 0, maxLimitCapUsd: 35000000 };
        res.status(200).json({
            status: 'ACTIVE',
            date: currentDate,
            totalVolumeProcessedUsd: ledger.totalVolumeProcessedUsd,
            remainingAllocationUsd: ledger.maxLimitCapUsd - ledger.totalVolumeProcessedUsd,
            hardCapLimitUsd: ledger.maxLimitCapUsd
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMINISTRATIVE & SOVEREIGN BYPASS SIGNATURE CHANNELS ---
app.get('/api/master/pending-withdrawals', (req, res, next) => masterPayout.getPendingWithdrawals(req, res, next));
app.post('/api/master/authorize-payout', (req, res, next) => masterPayout.authorizePayout(req, res, next));

app.post('/api/admin/bypass', verifySovereignNodeHandshake, (req, res) => {
    res.status(200).json({
        status: 'SYNCHRONIZED',
        message: 'Welcome Back NAWI-EMPIRE001. Master Authority Bypass Engaged.',
        founderMandate: "This is the CEO's order and authority to protect the founders and this platform. We are not here to collect your money; the only requirement is for everyone to follow the rules of the NAWI-EMPIRE platform."
    });
});

// Global Fallback Health Check Route for Render Node Monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ONLINE",
        node: "Aurora-231 Main Terminal Core",
        timestamp: new Date().toISOString()
    });
});

// Default asset route mapping delivery layout configurations
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

// ==========================================
// 7. SYSTEM BINDING & DATABASE INTERFACE REBOOT
// ==========================================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://NAWI-EMPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";
const PORT = process.env.PORT || 10000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("====================================================================");
        console.log("DATABASE STATUS: Secured Connection to NAWI_DB Collections Managed.");
        console.log("====================================================================");
        seedEmpire();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 NAWI-EMPIRE ENGINE TERMINAL ONLINE ON PORT [${PORT}]`);
        });
    })
    .catch((error) => {
        console.error('[CRITICAL CORRUPTION]: Database operational connection aborted:', error.message);
        process.exit(1);
    });
