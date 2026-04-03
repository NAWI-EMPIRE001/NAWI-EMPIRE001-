// THE ADVERTISEMENT SCHEMA (server.js)
const AdSchema = new mongoose.Schema({
    clientName: String,
    adType: { type: String, enum: ['MUSIC', 'MARKET', 'APPAREL', 'GENERAL'] },
    mediaUrl: String, // The 3D Frame or Video
    targetLink: String, // Where it leads (e.g., a user's Market profile)
    impressionsLeft: Number, // How many times it should be shown
    isActive: { type: Boolean, default: true },
    expiresAt: Date
});
const Ad = mongoose.model('Ad', AdSchema);

// THE "TRANSMISSION" INJECTION (How it appears in the feed)
app.get('/api/get-sponsored-content', async (req, res) => {
    // Pick one active ad randomly for the user's feed
    const ads = await Ad.find({ isActive: true, impressionsLeft: { $gt: 0 } });
    if (ads.length > 0) {
        const selectedAd = ads[Math.floor(Math.random() * ads.length)];
        
        // Subtract one "view" from the client's balance
        selectedAd.impressionsLeft -= 1;
        await selectedAd.save();
        
        res.json(selectedAd);
    } else {
        res.json(null);
    }
});
