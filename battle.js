const mongoose = require('mongoose');
const User = require('./models/User'); // Maps to NAWI_DB.users
const KitchenMeal = require('./models/KitchenMeal'); // Maps to NAWI_DB.Kitchen-meals
const VaultMeal = require('./models/VaultMeal'); // Maps to NAWI_VAULT.meals
const DailyLedger = require('./models/DailyLedger'); // Maps to NAWI_DB.dailyledgers

// SOVEREIGN BYPASS CONSTANTS
const SOVEREIGN_ID = "NAWI-EMPIRE001"; // Your Master Admin ID
const MASTER_PASS_NAME = "7 pillars";   // Your Social Media Authority Name

// UNIFIED BOX BATTLE SCHEMA DEFINITION
const BattleSchema = new mongoose.Schema({
    battleId: { type: String, required: true, unique: true },
    participants: [{ 
        userId: String, 
        username: String, 
        coinsReceived: { type: Number, default: 0 } 
    }],
    timer: { type: Number, default: 300 }, // 5 Minutes in seconds
    isActive: { type: Boolean, default: true },
    section: { type: String, default: 'Gaming' } // Can dynamically be 'Gaming' or 'Kitchen'
});

// Avoid compile overwrite errors if model already compiled in server.js
const Battle = mongoose.models.Battle || mongoose.model('Battle', BattleSchema);

/**
 * CODE 2 - PART A: INITIALIZE OR JOIN ACTIVE SESSION
 * Sets up the jury anchor metrics for both structural zones.
 */
exports.initializeBattleSession = async (req, res) => {
    try {
        const { userId, mealId, sectionType } = req.body;
        const currentSection = sectionType || 'Kitchen';

        // 1. SOVEREIGN BYPASS CHECK: Full structural access
        if (userId === SOVEREIGN_ID) {
            return res.status(200).json({
                success: true,
                message: `Sovereign Authority Verified: Welcome, [${MASTER_PASS_NAME}]. All ecosystem protocols bypassed.`,
                bypass_active: true,
                arena_status: "MASTER_OVERRIDE_ENABLED"
            });
        }

        // 2. Fetch tracking details from live frontend repository
        const activeMeal = await KitchenMeal.findById(mealId);
        if (!activeMeal) return res.status(404).json({ success: false, message: "Challenge arena target missing." });

        // 3. Initialize or sync with the Automated Jury Watch-Node in NAWI_VAULT
        let juryTracker = await VaultMeal.findOne({ mealId: mealId });
        if (!juryTracker) {
            juryTracker = new VaultMeal({
                mealId: mealId,
                title: activeMeal.title,
                host_chef: activeMeal.chef_id,
                total_watch_time_mins: 0,
                hype_score: 0,
                token_votes_count: 0,
                battle_date: new Date().toISOString().split('T')[0],
                is_challenge_validated: false,
                category_scope: currentSection
            });
            await juryTracker.save();
        }

        return res.status(200).json({
            success: true,
            message: "Automated Jury Engine attached to stream session.",
            arena: {
                title: juryTracker.title,
                current_hype: juryTracker.hype_score,
                validated: juryTracker.is_challenge_validated,
                section: currentSection
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * CODE 1 FEATURE & CODE 2 INTEGRATION: REAL-TIME GIFT SYNC ROUTE
 * Automatically translates sent token gifts into Automated Jury Hype progress.
 */
exports.sendBattleGift = async (req, res) => {
    try {
        const { battleId, targetUserId, giftValue, senderUserId, mealId } = req.body;
        const isSovereign = (senderUserId === SOVEREIGN_ID);

        // Find the active box battle record
        const battle = await Battle.findOne({ battleId });
        if (!battle) return res.status(404).json({ success: false, message: "Box Battle instance not found." });

        const participant = battle.participants.find(p => p.userId === targetUserId);
        if (participant) {
            // Apply token update (Maximize instantly if you are testing via your admin pass)
            participant.coinsReceived += isSovereign ? 10000 : giftValue;
            await battle.save();
        }

        // Forward token gift weight directly into the Automated Jury Metrics
        if (mealId) {
            let juryTracker = await VaultMeal.findOne({ mealId });
            if (juryTracker) {
                // Gifts heavily accelerate the hype validation metrics
                juryTracker.token_votes_count += 1;
                juryTracker.hype_score += isSovereign ? 100 : (giftValue * 2); 
                
                // Evaluate auto-conclusion check right inside the gift transaction
                if (juryTracker.hype_score >= 100 && !juryTracker.is_challenge_validated) {
                    juryTracker.is_challenge_validated = true;
                    
                    // Update active storefront status map
                    await KitchenMeal.findByIdAndUpdate(mealId, {
                        $set: { "trust_and_security.is_verified_seller": true }
                    });

                    // Reward matching activity points to sender automatically
                    if (!isSovereign) {
                        await User.findByIdAndUpdate(senderUserId, {
                            $inc: { current_xp: 25 },
                            $set: { "daily_tasks.$[elem].completed": true }
                        }, {
                            arrayFilters: [{ "elem.task_id": "TASK_KITCHEN_01" }]
                        });
                    }
                }
                await juryTracker.save();
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: "Gift synchronized across engine ledgers.",
            currentStandings: battle.participants 
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * CODE 2 - PART B: MANUAL/AUTOMATED JURY METRIC LOGGING
 * Monitors baseline streams, handles leveling scaling, and tracks the hidden daily values.
 */
exports.processJuryInteraction = async (req, res) => {
    try {
        const { userId, mealId, watchTimeIncrement, actionType } = req.body;
        const isSovereign = (userId === SOVEREIGN_ID);

        let juryTracker = await VaultMeal.findOne({ mealId: mealId });
        let activeMeal = await KitchenMeal.findById(mealId);
        
        if (!juryTracker || !activeMeal) {
            return res.status(404).json({ success: false, message: "Active structural tracking nodes missing." });
        }

        if (isSovereign) {
            juryTracker.hype_score = 100;
            juryTracker.total_watch_time_mins += 100;
        } else {
            juryTracker.total_watch_time_mins += watchTimeIncrement;
            
            if (actionType === "TOKEN_VOTE") {
                juryTracker.token_votes_count += 1;
                juryTracker.hype_score += 5;
            } else if (actionType === "STREAM_COMMENT") {
                juryTracker.hype_score += 1;
            }
        }

        // Evaluate milestone targets
        if (juryTracker.hype_score >= 100 && !juryTracker.is_challenge_validated) {
            juryTracker.is_challenge_validated = true;
            
            activeMeal.trust_and_security = { is_verified_seller: true };
            await activeMeal.save();

            if (!isSovereign) {
                await User.findByIdAndUpdate(userId, {
                    $inc: { current_xp: 25 },
                    $set: { "daily_tasks.$[elem].completed": true }
                }, {
                    arrayFilters: [{ "elem.task_id": "TASK_KITCHEN_01" }]
                });
            }

            // INVISIBLE LEDGER VALIDATION: Trigger secret metrics check on milestone upgrade
            const todayStr = new Date().toISOString().split('T')[0];
            let ledger = await DailyLedger.findOne({ date: todayStr });
            if (ledger) {
                ledger.totalVolumeProcessedUsd += 35; // Process system layer value silently
                await ledger.save();
            }
        }

        await juryTracker.save();

        return res.status(200).json({
            success: true,
            message: juryTracker.is_challenge_validated ? "Worldwide Challenge Concluded. Winner Validated." : "Jury metric recorded.",
            metrics: {
                hype_score: juryTracker.hype_score,
                total_watch_time: juryTracker.total_watch_time_mins,
                challenge_complete: juryTracker.is_challenge_validated
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
