// THE IMPERIAL OVERSEER LOGIC
const UserSchema = new mongoose.Schema({
    // ... existing fields ...
    reputationScore: { type: Number, default: 100 }, // Starts at 100
    tasksCompleted: { type: Number, default: 0 },
    violationCount: { type: Number, default: 0 },
    isShadowBanned: { type: Boolean, default: false }
});

// AUTOMATED MONITORING FUNCTION
async function monitorCitizenActivity(userId, actionContent) {
    const user = await User.findById(userId);
    
    // 1. DETECTION OF STUBBORNNESS (Blacklisted words/Lies)
    const forbidden = ["hack", "free coins", "scam", "naked", "outside pay"];
    const hasViolation = forbidden.some(word => actionContent.toLowerCase().includes(word));

    if (hasViolation) {
        user.reputationScore -= 10;
        user.violationCount += 1;
        
        // Auto-Action: If reputation drops below 50, mute them
        if (user.reputationScore < 50) {
            user.isShadowBanned = true;
        }
    }

    // 2. AUTO-VERIFICATION (Merit Check)
    if (user.tasksCompleted >= 20 && user.reputationScore > 90 && !user.isVerified) {
        user.isVerified = true;
        user.rank = "Verified Merchant";
        // System sends you a summary once a day instead of every time
    }

    await user.save();
}
