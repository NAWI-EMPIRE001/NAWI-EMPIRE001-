/* NAWI-EMPIRE MASTER ENGINE 
   Sovereign Edition 2026
   Target: Node.js / MongoDB Atlas
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// --- ⚙️ 1. MIDDLEWARE CONFIGURATION ---
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-id']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

const storage = multer.memoryStorage();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); 

// --- ☣️ 2. GLOBAL SYSTEM STATE ---
let isSystemLocked = false; 

// --- 🏛️ 3. DATABASE SCHEMAS & MODELS ---

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, default: "Authenticated Citizen" },
    email: String,
    password: { type: String, select: false },
    deviceId: String,
    bio: { type: String, default: "No professional knowledge shared yet." },
    pfpUrl: { type: String, default: "/assets/default-pfp.png" },
    empireCoins: { type: Number, default: 0 },
    totalEarningsUSD: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    rank: { type: String, default: "Citizen" },
    isVerifiedCitizen: { type: Boolean, default: false }, 
    mandateAcceptedAt: Date, 
    ruleViolations: { type: Number, default: 0 },
    pillarsManaged: [String],
    activityLog: [{ action: String, timestamp: { type: Date, default: Date.now } }]
});
const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
    authorName: String,
    authorId: String,
    mediaUrl: String,
    description: String,
    type: { type: String, enum: ['graphic', 'video', 'lifestyle', 'audio', 'market'], default: 'lifestyle' },
    priceInCoins: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isMasterPost: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// --- 🛡️ 4. SECURITY GATEKEEPER (OPTIMIZED) ---
app.use(async (req, res, next) => {
    const userId = req.headers['user-id'];
    
    // CEO BYPASS: NAWI-EMPIRE001 is never restricted
    if (userId === "NAWI-EMPIRE001") return next();

    // 1. Global System Lock Check
    if (isSystemLocked) {
        return res.status(503).json({ message: "SYSTEM UNDER MAINTENANCE." });
    }

    // 2. Verified Path Logic
    const publicPaths = ['/api/login', '/api/register', '/api/verify-mandate'];
    if (!publicPaths.includes(req.path) && userId) {
        try {
            const user = await User.findOne({ userId });
            if (user && !user.isVerifiedCitizen) {
                return res.status(403).json({ 
                    message: "MANDATE NOT ACCEPTED", 
                    requireVerification: true 
                });
            }
        } catch (err) {
            return res.status(500).json({ message: "Security Check Failure." });
        }
    }
    next();
});

// --- 👤 5. IDENTITY & VERIFICATION ---

// MANDATE VERIFICATION TOOL
app.post('/api/verify-mandate', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { userId: userId },
            { 
                $set: { 
                    rank: "Verified Citizen", 
                    isVerifiedCitizen: true, 
                    mandateAcceptedAt: new Date() 
                }, 
                $push: { activityLog: { action: "ACCEPTED_MANDATE" } } 
            },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "Citizen not found." });
        res.json({ success: true, message: "Citizenship confirmed in Empire Ledger." });
    } catch (err) {
        res.status(500).json({ success: false, error: "Ledger Update Failed." });
    }
});

// Authentication
app.post('/api/register', async (req, res) => {
    const { email, password, deviceId } = req.body;
    try {
        const existingDevice = await User.findOne({ deviceId });
        if (existingDevice) return res.status(403).json({ message: "One Node per Human allowed." });
        
        const newUser = new User({ email, password, deviceId, userId: new mongoose.Types.ObjectId().toString() });
        await newUser.save();
        res.json({ success: true, userId: newUser.userId });
    } catch (err) { res.status(500).json({ error: "Vault Error." }); }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    // Founder Login
    if (email === "akpanvictor848@gmail.com" && password === "$Nsikak111") {
        return res.status(200).json({ success: true, userId: "NAWI-EMPIRE001", rank: "FOUNDER" });
    }
    // Logic for regular citizens can go here
    res.status(401).json({ success: false, message: "Invalid Credentials." });
});

// --- 📡 6. CONTENT & ECONOMY ---

app.get('/api/get-feed', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).send(err.message); }
});

// --- ⚖️ 8. MONITORING & OVERRIDE ---
app.post('/api/admin/self-destruct', (req, res) => {
    if (req.body.masterPin !== "7777") return res.status(403).json({ message: "DENIED" });
    isSystemLocked = (req.body.action === "LOCK_ALL");
    res.json({ success: true, message: isSystemLocked ? "LOCKED" : "RESTORED" });
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

// --- ⚙️ 9. ENGINE START ---
const URI = "mongodb+srv://NAWI-EMPIRE001:NAWI-EMPIRE001@nawi-empire001.zwidxex.mongodb.net/NAWI_DB?retryWrites=true&w=majority";
const PORT = process.env.PORT || 10000;

mongoose.connect(URI).then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 NAWI-EMPIRE ENGINE ACTIVE ON PORT ${PORT}`);
    });
}).catch(err => console.error("Database Connection Failure:", err));
