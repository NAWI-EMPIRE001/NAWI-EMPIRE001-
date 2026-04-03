const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    // 👤 THE CREATOR
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    isVerifiedMerchant: { type: Boolean, default: false }, // Only Pros get the "Gold" check

    // 🖼️ THE CONTENT
    contentType: { type: String, enum: ['image', 'video', 'graphic', 'album'], required: true },
    mediaUrl: { type: String, required: true }, // The link to the high-res 3D frame or MP4
    description: { type: String, maxLength: 1000 },
    
    // 💰 THE ECONOMY
    priceInCoins: { type: Number, default: 0 }, // For items listed in the Market
    giftEarnings: { type: Number, default: 0 }, // Tracks total "7" coins received ($0.02 rate)
    
    // 📊 ACTIVITY TRACKING (From Day 1)
    createdAt: { type: Date, default: Date.now },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    
    // 🛡️ SECURITY & QUALITY CONTROL
    status: { type: String, enum: ['pending', 'active', 'flagged'], default: 'active' },
    isMasterPost: { type: Boolean, default: false } // Special flag for your CEO posts
});

module.exports = mongoose.model('Post', PostSchema);
