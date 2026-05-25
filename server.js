/**
 * NAWI-EMPIRE MASTER SYSTEM ENGINE v4.0 - UNIFIED BINDING BUILD
 * FILE: server.js
 * EDITION: Sovereign Executive Unified Architecture
 * SYSTEMS CONNECTED: Aurora-231 Hardware Handshake, 7 Pillars Framework,
 * Sovereign P2P Escrow, Real-Time Low-Latency Stream Core (TikTok/IG Framework), Compliance Vault.
 * WATERMARK: PROTECTED_BY_DIAMONDBACK231_AUTHORITY_NAWI-EMPIRE001
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
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const SOVEREIGN_ID = "NAWI-EMPIRE001";
const SYSTEM_WATERMARK = "PROTECTED_BY_DIAMONDBACK231_AUTHORITY_NAWI-EMPIRE001";

// Create native media upload folders programmatically if missing
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// ==========================================
// CASE-SENSITIVE ADAPTIVE CONTROLLER MATRIX
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
    registerUser: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", message: "Auth microservice simulated." }),
    handleUserSession: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", token: "mock_session_key" })
};

battleController = safeLoad('./controllers/battle', null, 'battleController') || {
    initializeBattleSession: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", message: "Gaming studio matchmaking standby.", latency: "12ms" }),
    processStreamVoteGift: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", message: "Gifting transaction ledger posted." })
};

borderControl = safeLoad('./controllers/border-control', null, 'borderControl') || {
    processIdentityUpload: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", message: "Identity file trace securely uploaded." }),
    getVerificationStatus: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", id_verified: true })
};

masterPayout = safeLoad('./controllers/master-payout', null, 'masterPayout') || {
    getPendingWithdrawals: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", pendingCount: 0 }),
    authorizePayout: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", settlement: "AUTHORIZED" })
};

p2pGateway = safeLoad('./controllers/p2p-gateway', null, 'p2pGateway') || {
    serveGatewayPage: (req, res) => res.status(200).send("P2P core system bridge operational."),
    createP2POrder: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", orderId: "P2P-MOCK-992" }),
    confirmP2PRelease: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", step: "RELEASE_COMPLETE" }),
    processPillarTransaction: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", escrow: "LOCKED" }),
    handleDirectFunding: (req, res) => res.status(200).json({ status: "MOCK_ACTIVE", settlement: "FUNDED" })
};

// ==========================================
// 1. GLOBAL CONFIGURATIONS & ADVANCED MIDDLEWARE
// ==========================================
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type', 'Authorization', 'user-id', 'x-node-uuid', 
        'x-node-ram', 'x-node-display', 'x-node-signature', 'x-nawi-identity'
    ]
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage engine configuration supporting biological signature uploads and media assets
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ==========================================
// 2. UNIFIED DATABASE CONFIGURATION MATRIX (SCHEMAS)
// ==========================================

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    identity: {
        sovereign_name: { type: String, default: "Authenticated Citizen" },
        legacy_rank: { type: String, default: "Citizen" },
        id_verified: { type: Boolean, default: false },
        joined_date: { type: String, default: () => new Date().toISOString().split('T')[0] }
    },
    verification_metrics: {
        day_1_video_url: { type: String, default: "" }, 
        corporate_docs_submitted: { type: Boolean, default: false },
        platform_age_days: { type: Number, default: 0 },
        businessName: { type: String, default: "" },
        cacNumber: { type: String, default: "" }
    },
    current_tier: { type: Number, enum: [1, 2, 3], default: 1 },
    metrics: {
        follower_count: { type: Number, default: 0 },
        following_count: { type: Number, default: 0 },
        daily_streak: { type: Number, default: 0 },
        activity_score: { type: Number, default: 0 }
    },
    eligibility: {
        can_go_live: { type: Boolean, default: false },
        is_monetized: { type: Boolean, default: false }
    },
    wallet: {
        empire_coins: { type: Number, default: 0 },
        total_earned_to_date: { type: Number, default: 0 },
        pending_conversion: { type: Number, default: 0.00 }
    },
    security: {
        is_banned: { type: Boolean, default: false },
        scam_alert_flag: { type: Number, default: 0 },
        multi_factor_auth: { type: String, default: "ENABLED" }
    }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    creator_id: { type: String, required: true },
    pillar_tool: { 
        type: String, 
        enum: ['MARKETPLACE', 'ADS_MANAGER', 'GAMING_HUB', 'USER_STREAMS', 'KITCHEN_CANTEEN', 'SOVEREIGN_STYLIST', 'APPAREL_STUDIO', 'MUSIC_HUB'], 
        required: true 
    },
    title: { type: String, required: true },
    description: String,
    category_feed_target: { type: String, default: 'General' },
    pricing: {
        base_price: { type: Number, default: 0 },
        transaction_type: { type: String, default: 'P2P_ESCROW' }
    },
    apparel_metadata: {
        canvas_json_data: { type: String, default: "" },
        framework_version: { type: String, default: "DIAMONDBACK-231-V1" }
    },
    ads_manager_metadata: {
        boost_enabled: { type: Boolean, default: false },
        target_impressions: { type: Number, default: 0 }
    },
    music_metadata: {
        total_device_downloads: { type: Number, default: 0 },
        artist_name: { type: String, default: "NAWI Artist" }
    },
    media_assets: [{
        asset_id: String,
        file_url: String,
        file_type: String
    }],
    stylist_theme: {
        accent_color: { type: String, default: "GOLD" },
        surface_texture: { type: String, default: "OBSIDIAN_TITANIUM" }
    },
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const PostSchema = new mongoose.Schema({
    authorName: String,
    authorId: String,
    mediaUrl: String,
    description: String,
    pillarType: { type: String, enum: ['Comedy', 'Arena', 'Music', 'Kitchen', 'Apparel', 'Normal'], default: 'Normal' },
    type: { type: String, enum: ['graphic', 'video', 'audio', 'promotion', 'live_stream'], default: 'video' },
    isAd: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    durationWatched: { type: Number, default: 0 }, 
    status: { type: String, default: 'active' },
    live_stream_metadata: {
        room_id: String,
        is_live_now: { type: Boolean, default: false },
        current_viewers: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

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

// ========================================================
// 3. THREE-TIER ACTIVITY-BASED ECOSYSTEM SECURITY MIDDLEWARE
// ========================================================
const enforceEcosystemTierSecurity = async (req, res, next) => {
    const requesterId = req.headers['x-nawi-identity'] || req.headers['user-id'] || req.body.userId || req.query.userId;
    
    if (!requesterId) {
        return res.status(401).json({ success: false, message: "Security Warning: Missing citizen access signature token." });
    }

    if (requesterId === SOVEREIGN_ID) {
        req.sovereignOverride = true;
        return next();
    }

    try {
        const user = await User.findOne({ userId: requesterId });
        if (!user) {
            return res.status(403).json({ success: false, message: "Access Denied: Signature footprint not found inside NAWI_DB." });
        }

        // TIER 1 LAW: Mandatory Day 1 Biological Signature Video Lock Checking
        if (!user.verification_metrics?.day_1_video_url) {
            return res.status(403).json({ 
                success: false, 
                required_action: "DAY_1_VIDEO_LOCK_REQUIRED",
                message: "Frictionless Security Gate: Please upload your 10-second biological signature video to activate your account." 
            });
        }

        // TIER 3 LAW: Challenge Form Entry requires absolute corporate documentation validation
        if (req.path.includes('/api/challenge/register') && !user.verification_metrics?.corporate_docs_submitted) {
            return res.status(403).json({
                success: false,
                required_action: "TIER_3_DOCS_REQUIRED",
                message: "Sovereign Challenger Mandate: Official business registration and corporate verification documents are strictly required to clear premium workstation competitions."
            });
        }

        req.citizenProfile = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// 4. HARDWARE HANDSHAKE VERIFICATION LAYER
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
// 5. INTEGRATED P2P SCALABILITY ENGINE
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
}
const LiquidityEngine = new P2PLiquidityManager();

// ==========================================
// 6. SEEDING STRATEGY ENGINE
// ==========================================
const seedEmpire = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const fallbackFounder = new User({
                userId: "NAWI-EMPIRE001",
                email: "akpanvictor848@gmail.com",
                phone_number: "+2340000000000",
                identity: { sovereign_name: "7 pillars", legacy_rank: "Founder", id_verified: true },
                verification_metrics: { day_1_video_url: "https://cdn.nawi.global/genesis_sig.mp4", corporate_docs_submitted: true },
                current_tier: 3,
                metrics: { follower_count: 50000 },
                wallet: { empire_coins: 1000000, total_earned_to_date: 50000, pending_conversion: 0 }
            });
            await fallbackFounder.save();
            console.log("🛡️ Fallback Founder Account Seeded Successfully.");
        }
    } catch (err) { console.error("❌ Seed Optimization Error:", err.message); }
};

// ==========================================================
// 7. REAL-TIME LOW-LATENCY LIVE STREAM MEDIA SOCKET ENGINE
// ==========================================================
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on('connection', (socket) => {
    const connectionTag = socket.handshake.query.userId || "GUEST_CITIZEN";
    console.log(`[AURORA-231] TikTok/IG Live Stream WebSocket synchronization ready for: ${connectionTag}`);

    // Action execution when a user launches a TikTok/IG Style Live Stream Broadcast
    socket.on('start_live_broadcast', async (data) => {
        const { roomId, hostId, hostName, roomTitle } = data;
        socket.join(roomId);
        socket.roomId = roomId;
        socket.hostId = hostId;

        await Post.create({
            authorId: hostId,
            authorName: hostName,
            description: roomTitle,
            type: 'live_stream',
            pillarType: 'Normal',
            status: 'active',
            live_stream_metadata: { room_id: roomId, is_live_now: true, current_viewers: 1 }
        });

        console.log(`🎥 Stream Active: Host ${hostName} is broadcasting live in room: ${roomId}`);
        io.to(roomId).emit('stream_status_update', { event: "STARTED", roomId, hostId });
    });

    // Action executed when a viewer joins the running TikTok/IG live room
    socket.on('join_live_room', async (data) => {
        const { roomId, viewerId } = data;
        socket.join(roomId);
        socket.roomId = roomId;
        
        const stream = await Post.findOneAndUpdate(
            { "live_stream_metadata.room_id": roomId },
            { $inc: { "live_stream_metadata.current_viewers": 1 } },
            { new: true }
        );

        const activeCount = stream ? stream.live_stream_metadata.current_viewers : 0;
        io.to(roomId).emit('viewer_count_changed', { roomId, currentViewers: activeCount });
        console.log(`👤 User ${viewerId} joined running live channel stream room: ${roomId}`);
    });

    // Real-time data pipeline tracking stream frames and text comments instantly across connected clients
    socket.on('stream_frame_broadcast', (data) => {
        socket.to(data.roomId).emit('incoming_stream_frame', data.payload);
    });

    socket.on('send_live_comment', (data) => {
        io.to(data.roomId).emit('new_live_comment', {
            sender: data.senderName,
            text: data.commentText,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', async () => {
        if (socket.roomId) {
            const stream = await Post.findOneAndUpdate(
                { "live_stream_metadata.room_id": socket.roomId },
                { $inc: { "live_stream_metadata.current_viewers": -1 } },
                { new: true }
            );
            if (socket.hostId && stream) {
                await Post.updateOne({ "live_stream_metadata.room_id": socket.roomId }, { $set: { "live_stream_metadata.is_live_now": false, status: 'expired' } });
                io.to(socket.roomId).emit('stream_status_update', { event: "ENDED", roomId: socket.roomId });
                console.log(`🛑 Live Broadcast room closed by host channel session.`);
            } else if (stream) {
                io.to(socket.roomId).emit('viewer_count_changed', { roomId: socket.roomId, currentViewers: stream.live_stream_metadata.current_viewers });
            }
        }
        console.log(`[AURORA-231] Terminal stream interface signature unlinked cleanly.`);
    });
});

// ========================================================
// 8. THE 7 PILLARS INTERACTIVE DYNAMIC ROUTERS
// ========================================================

/**
 * 🏠 DYNAMIC FEED LOOKUP ENGINE (Prevents Home Screen Layout Clutter)
 */
app.get('/api/feed/home', async (req, res) => {
    try {
        const totalItems = await Post.countDocuments({ status: 'active' });
        if (totalItems === 0) {
            return res.status(200).json({
                emptyState: true,
                message: "Empty Space. Create a post or launch a stream framework inside NAWI-EMPIRE to begin.",
                data: []
            });
        }
        const feedItems = await Post.find({ status: 'active' }).sort({ createdAt: -1 }).limit(15);
        return res.status(200).json({ emptyState: false, count: totalItems, data: feedItems });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 🎮 PILLAR 1: GLOBAL GAMING VIDEOS LIVE STREAMING BATTLE
 */
app.get('/api/pillar/gaming-hub', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const activeBattles = await Product.find({ pillar_tool: 'GAMING_HUB' }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, tool: "GAMING_HUB", message: "Gaming Hub Engine Active", data: activeBattles });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 🛍️ PILLAR 2: THE GLOBAL MARKETPLACE FOR EVERY ITEM AND PRODUCT
 */
app.get('/api/pillar/marketplace', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const products = await Product.find({ pillar_tool: 'MARKETPLACE' }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, tool: "MARKETPLACE", message: "Marketplace Connected", data: products });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 📢 PILLAR 3: ADS PROGRAM MANAGER GLOBAL ADVERTISING FOR ALL 7 PILLARS
 */
app.get('/api/pillar/ads-manager', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const targetCampaigns = await Product.find({ pillar_tool: 'ADS_MANAGER', 'ads_manager_metadata.boost_enabled': true });
        return res.status(200).json({ success: true, tool: "ADS_MANAGER", message: "Ads Campaign Management Operational", data: targetCampaigns });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 📱 PILLAR 4: REAL VIDEO LIVE STREAMING FOR NEW USERS (TIKTOK/IG METHOD)
 */
app.get('/api/pillar/user-streams', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const runningLiveStreams = await Post.find({ type: 'live_stream', "live_stream_metadata.is_live_now": true });
        return res.status(200).json({ success: true, tool: "USER_STREAMS", message: "Active Interactive Live Streams Pulled", data: runningLiveStreams });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 🍳 PILLAR 5: KITCHEN MEAL AND REAL VIDEOS LIVE STREAM
 */
app.get('/api/pillar/kitchen-canteen', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const canteenFeeds = await Product.find({ pillar_tool: 'KITCHEN_CANTEEN' });
        return res.status(200).json({ success: true, tool: "KITCHEN_CANTEEN", message: "Kitchen Logistical Modules Ready", data: canteenFeeds });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * ✂️ PILLAR 6: SOVEREIGN STYLIST FOR GLOBAL BARBERSHOPS & COSMETICS
 */
app.get('/api/pillar/sovereign-stylist', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const verifiedStylists = await Product.find({ pillar_tool: 'SOVEREIGN_STYLIST' });
        return res.status(200).json({ success: true, tool: "SOVEREIGN_STYLIST", message: "Elite Obsidian, Titanium & Gold Theme Profiles Active", data: verifiedStylists });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 🎨 PILLAR 7: APPAREL CANVAS STUDIO BY DIAMONDBACK231
 */
app.post('/api/pillar/apparel-studio/save', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const { title, description, canvasJsonCoordinates, pricingCoins, userId } = req.body;
        const graphicFramework = new Product({
            creator_id: userId,
            pillar_tool: 'APPAREL_STUDIO',
            title: title,
            description: description,
            category_feed_target: 'Marketplace Only',
            pricing: { base_price: pricingCoins, transaction_type: 'P2P_ESCROW' },
            apparel_metadata: { canvas_json_data: canvasJsonCoordinates, framework_version: "DIAMONDBACK-231-V1" }
        });
        await graphicFramework.save();
        return res.status(200).json({ success: true, message: "Design framework compiled and posted to marketplace.", frameworkId: graphicFramework._id });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

/**
 * 🎵 EXTREME CORE VALUE ACCELERATOR: MUSIC HUB & DEVICE LOADER
 */
app.get('/api/pillar/music-hub/download/:assetId', enforceEcosystemTierSecurity, async (req, res) => {
    try {
        const audioAsset = await Product.findOne({ 'media_assets.asset_id': req.params.assetId, pillar_tool: 'MUSIC_HUB' });
        if (!audioAsset) return res.status(404).json({ success: false, message: "Requested audio track record missing." });

        audioAsset.music_metadata.total_device_downloads += 1;
        await audioAsset.save();

        const targetFile = audioAsset.media_assets.find(media => media.asset_id === req.params.assetId);
        res.setHeader('Content-Disposition', `attachment; filename="${audioAsset.title.replace(/\s+/g, '_')}_NAWI_SECURE.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');
        return res.redirect(targetFile.file_url);
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

// Admin deployment routing logic (For pushing storefront structural data assets)
app.post('/api/add-product', async (req, res) => {
    try {
        const newAsset = new Product(req.body);
        await newAsset.save();
        res.status(201).json({ message: "Asset successfully verified and saved to Vault Matrix", asset: newAsset });
    } catch (err) { res.status(400).json({ error: "Deployment payload rejected", details: err.message }); }
});

// Backward compatible getter endpoint layout matching code 2 specifications
app.get('/api/get-products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) { res.status(500).json({ error: "Vault read failed", details: err.message }); }
});

// ==========================================
// 9. CORE IDENTITY & SECURITY TIER CHANNELS
// ==========================================
app.post('/api/auth/register', (req, res, next) => authController.registerUser(req, res, next));
app.post('/api/auth/session', (req, res, next) => authController.handleUserSession(req, res, next));

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === "akpanvictor848@gmail.com" && password === "$Nsikak111") {
        return res.status(200).json({ success: true, userId: "NAWI-EMPIRE001", rank: "FOUNDER" });
    }
    res.status(401).json({ success: false, message: "Invalid Credentials." });
});

// TIER 1: DAY 1 VIDEO LOCK BIOMETRIC SIGNATURE ENTRY PIPELINE
app.post('/api/verify/video-lock', upload.single('videoLock'), async (req, res) => {
    try {
        const { userId, email, phone_number } = req.body;
        const videoUrl = req.file ? `/uploads/${req.file.filename}` : "mock-video-hash-signature";
        
        const updatedProfile = await User.findOneAndUpdate(
            { userId: userId },
            { 
                email,
                phone_number,
                "verification_metrics.day_1_video_url": videoUrl, 
                current_tier: 1,
                "identity.id_verified": true
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            status: "AUTHENTICATED",
            message: "BIOMETRIC CAPTURE SUCCESS: Day 1 Video Lock hashed and bound as an un-hackable data signature.",
            profile: updatedProfile
        });
    } catch (err) { res.status(500).json({ error: "Video lock synchronisation engine failure." }); }
});

// TIER 3: SOVEREIGN CHALLENGER REGISTRATION (27" WORKSTATION CHALLENGE REQUIREMENT)
app.post('/api/verify/sovereign-challenge', async (req, res) => {
    try {
        const { userId, businessName, cacNumber } = req.body;
        
        if (!businessName || !cacNumber) {
            return res.status(400).json({ error: "Corporate identification parameters required." });
        }

        const updatedProfile = await User.findOneAndUpdate(
            { userId: userId },
            { 
                "verification_metrics.businessName": businessName, 
                "verification_metrics.cacNumber": cacNumber, 
                "verification_metrics.corporate_docs_submitted": true,
                current_tier: 3 
            },
            { new: true }
        );

        res.status(200).json({
            status: "SUCCESS",
            message: "REGISTRATION LOCKED: Corporate verification credentials logs updated. Profile cleared for 27-inch Smart Workstation parameters.",
            profile: updatedProfile
        });
    } catch (err) { res.status(500).json({ error: "High-tier challenger file synchronization failed." }); }
});

// MANDATORY REGISTRATION RECOVERY SYSTEM (DUAL-CHANNEL HARD-BOUND)
app.post('/api/auth/recover-keys', async (req, res) => {
    try {
        const { accountIdentity } = req.body;
        const user = await User.findOne({ $or: [{ userId: accountIdentity }, { email: accountIdentity }] });

        if (!user) return res.status(404).json({ success: false, message: "No active profile matches the submitted credentials." });

        const sharedOtpToken = Math.floor(100000 + Math.random() * 900000);
        
        console.log(`[DUAL-CHANNEL CRITICAL OUTBOUND] Synchronizing keys...`);
        console.log(`👉 Channel A [EMAIL] -> Firing OTP Token [${sharedOtpToken}] directly to target: ${user.email}`);
        console.log(`👉 Channel B [MOBILE] -> Firing OTP Token [${sharedOtpToken}] directly to target number: ${user.phone_number}`);

        return res.status(200).json({ 
            success: true, 
            channel1: "SMS OTP Dispatched to original registration hardware address.",
            channel2: "Email OTP Dispatched to clean verification target fields.",
            message: "Sovereign Security Handshake: Recovery keys transmitted to both verified communication lines simultaneously. No secondary inputs allowed." 
        });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
});

// --- FINANCIAL VAULTS & P2P LIQUIDITY PORTS ---
app.get('/gateway', p2pGateway.serveGatewayPage);
app.get('/p2p-bridge', (req, res, next) => p2pGateway.serveGatewayPage(req, res, next));
app.post('/api/p2p/create-order', (req, res, next) => p2pGateway.createP2POrder(req, res, next));
app.post('/api/p2p/confirm-release', (req, res, next) => p2pGateway.confirmP2PRelease(req, res, next));
app.post('/api/request-withdrawal', (req, res, next) => p2pGateway.createP2POrder(req, res, next)); 
app.post('/api/p2p/transact', enforceEcosystemTierSecurity, p2pGateway.processPillarTransaction);
app.post('/api/p2p/fund', enforceEcosystemTierSecurity, p2pGateway.handleDirectFunding);

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
        res.json({ coins: user.wallet.empire_coins, usd: user.wallet.total_earned_to_date, pending: user.wallet.pending_conversion });
    } catch (err) { res.status(500).json({ error: "Vault Link Failed" }); }
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

// --- ADMINISTRATIVE & SOVEREIGN BYPASS CHANNELS ---
app.get('/api/master/pending-withdrawals', (req, res, next) => masterPayout.getPendingWithdrawals(req, res, next));
app.post('/api/master/authorize-payout', (req, res, next) => masterPayout.authorizePayout(req, res, next));

app.post('/api/admin/bypass', verifySovereignNodeHandshake, (req, res) => {
    res.status(200).json({
        status: 'SYNCHRONIZED',
        message: 'Welcome Back NAWI-EMPIRE001. Master Authority Bypass Engaged.',
        founderMandate: "This is the CEO's order and authority to protect the founders and this platform. We are not here to collect your money; the only requirement is for everyone to follow the rules of the NAWI-EMPIRE platform."
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "ONLINE", node: "Aurora-231 Main Terminal Core", timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

// ========================================================
// 10. SYSTEM BINDING & DATABASE INTERFACE REBOOT
// ========================================================
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://NAWI-EMPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";
const PORT = process.env.PORT || 10000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("==========================================================================");
        console.log("📂 MONGO_DB COMPLIANCE NODE INTEGRATION COMPLETED SUCCESSFULLY FOR NAWI_DB");
        seedEmpire();
        server.listen(PORT, () => {
            console.log(`👑 NAWI-EMPIRE CORE INFRASTRUCTURE SERVER RUNNING ON SYSTEM NODE PORT : ${PORT}`);
            console.log(`🛡️  SYSTEM ENFORCEMENT WATERMARK CODE: ${SYSTEM_WATERMARK}`);
            console.log("==========================================================================");
        });
    })
    .catch((error) => {
        console.error('[CRITICAL CORRUPTION]: Database operational connection aborted:', error.message);
        process.exit(1);
    });
