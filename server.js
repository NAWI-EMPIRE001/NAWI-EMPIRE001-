/**
 * NAWI-EMPIRE MASTER SYSTEM ENGINE v3.0
 * FILE: server.js
 * EDITION: Sovereign Executive Architecture (2026 Build)
 * INTEGRATIONS: 7 Pillars, Aurora-231 Hardware Check, Modular Apparel Studio, 
 *               P2P Escrow, 35M Daily Volume Ledger, Pulse Feed, Compliance Vault.
 * SECURITY NOTICE: CEO Legal Name Restricted to Database Backend Layer.
 */

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
// 1. GLOBAL SYSTEM CONFIGURATIONS & MIDDLEWARE
// ==========================================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'x-node-uuid', 'x-node-ram', 'x-node-display', 'x-node-signature']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB Max Limit for 4K Luxury Textures

let isSystemLocked = false;

// ==========================================
// 2. UNIFIED MONGOOSE SCHEMAS (THE 7 PILLARS & STUDIOS)
// ==========================================

// Unified User Schema
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
const User = mongoose.model('User', UserSchema);

// Universal Content & Post Schema
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
const Post = mongoose.model('Post', PostSchema);

// Apparel Studio & Sovereign Stylist Modular Asset Schema
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
const ApparelAsset = mongoose.model('ApparelAsset', ApparelAssetSchema);

// Compliance Vault Schema (Hidden Secure Engine Layer)
const ComplianceVaultSchema = new mongoose.Schema({
    entityName: { type: String, default: 'NAWI-EMPIRE' },
    registeredName: { type: String, default: 'Nsikak Akpan Warri' }, 
    cacRecordNumber: { type: String, required: true },
    msmeRegistrationId: { type: String, required: true },
    encryptionKeySignature: { type: String, required: true }
});
const ComplianceVault = mongoose.model('ComplianceVault', ComplianceVaultSchema);

// Daily Transaction Tracker Schema for Sovereign Ledger Engine
const DailyLedgerSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    totalVolumeProcessedUsd: { type: Number, default: 0 },
    maxLimitCapUsd: { type: Number, default: 35000000 } // Hardcapped $35 Million Limit Configuration
});
const DailyLedger = mongoose.model('DailyLedger', DailyLedgerSchema);

// ==========================================
// 3. SOVEREIGN NODE HANDSHAKE (HARDWARE PROFILE PROTECTION)
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
// 4. P2P GATEWAY, ESCROW & SOVEREIGN LEDGER ENGINE
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
// 5. PLATFORM SEEDING FUNCTIONALITY
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
// 6. CORE FLUID API INFRASTRUCTURE ROUTING
// ==========================================

// --- THE PULSE CORE MEDIA FILTERS ---
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

// --- APPAREL PRODUCTION STUDIO ASSET REGISTRATION ---
app.post('/api/studio/apparel/asset', async (req, res) => {
    try {
        const newAsset = new ApparelAsset({
            assetId: req.body.assetId,
            name: req.body.name,
            collectionType: req.body.collectionType,
            sizeAvailability: req.body.sizeAvailability,
            fabricPhysics: {
                density: req.body.fabricPhysics.density,
                stiffness: req.body.fabricPhysics.stiffness,
                friction: req.body.fabricPhysics.friction
            },
            textures: {
                resolution: req.body.textures.resolution || '4K',
                diffuseMapUrl: req.body.textures.diffuseMapUrl,
                normalMapUrl: req.body.textures.normalMapUrl,
                roughnessMapUrl: req.body.textures.roughnessMapUrl,
                metallicMapUrl: req.body.textures.metallicMapUrl
            },
            toolManagementLogic: {
                integratedSlots: req.body.toolManagementLogic?.integratedSlots || 0,
                utilityType: req.body.toolManagementLogic?.utilityType || 'None'
            }
        });
        const savedAsset = await newAsset.save();
        res.status(201).json({ status: 'SUCCESS', asset: savedAsset });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});

// --- P2P ESCROW REGISTRATION TERMINAL ---
app.post('/api/finance/escrow/create', async (req, res) => {
    try {
        const { transactionId, amountUsd, buyerWallet, sellerWallet } = req.body;
        const escrowResult = await LiquidityEngine.createEscrowTransaction(transactionId, amountUsd, buyerWallet, sellerWallet);
        res.status(200).json({ status: 'SUCCESS', escrow: escrowResult });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});

// --- IDENTITY LAYER BRIDGES ---
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

// --- VAULT ECONOMY CHANNELS ---
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

const COIN_VAL = 0.02;
app.post('/api/convert-coins', async (req, res) => {
    const { userId, amount } = req.body;
    if (amount < 2500) return res.status(400).json({ message: "Min 2500 Coins required to execute shift." });
    try {
        const user = await User.findOne({ userId });
        if (!user || user.wallet.empire_coins < amount) return res.status(400).json({ message: "Insufficient balance markers." });
        const usdAmount = amount * COIN_VAL;
        await User.updateOne({ userId }, { $inc: { "wallet.empire_coins": -amount, "wallet.pending_conversion": usdAmount } });
        res.json({ success: true, usd: usdAmount });
    } catch (err) { res.status(500).json({ error: "Vault processing context failure." }); }
});

// --- SOVEREIGN TRACKING LEDGER METRICS ENDPOINT ---
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

// --- MASTER AUTHORITY SECURE COMMAND TERMINAL (AURORA-231 ONLY) ---
app.post('/api/admin/bypass', verifySovereignNodeHandshake, (req, res) => {
    res.status(200).json({
        status: 'SYNCHRONIZED',
        message: 'Welcome Back NAWI-EMPIRE001. Master Authority Bypass Engaged.',
        founderMandate: "This is the CEO's order and authority to protect the founders and this platform. We are not here to collect your money; the only requirement is for everyone to follow the rules of the NAWI-EMPIRE platform."
    });
});

// ==========================================
// 7. SYSTEM REBOOT & HOST SYNCHRONIZATION
// ==========================================
const MONGO_URI = "mongodb+srv://NAWI-EMPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";
const PORT = process.env.PORT || 10000;

mongoose.connect(MONGO_URI)
    .then(() => {
        seedEmpire();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 NAWI-EMPIRE MASTER ENGINE CORRELATION ONLINE ON HOSTING PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('[CRITICAL CORRUPTION]: Database operational connection aborted:', error.message);
    });

// Fallback Route to deliver Front-End interface mapping
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
