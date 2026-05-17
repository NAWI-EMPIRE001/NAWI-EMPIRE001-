const User = require('./models/User'); // Maps to NAWI_DB.users
const DailyLedger = require('./models/DailyLedger'); // Maps to NAWI_DB.dailyledgers
const ComplianceVault = require('./models/ComplianceVault'); // Maps to NAWI_DB.compliancevaults
const WithdrawalRequest = require('./models/WithdrawalRequest'); // Maps to NAWI_DB.withdrawalrequests

// SOVEREIGN BYPASS CONSTANTS
const SOVEREIGN_ID = "NAWI-EMPIRE001"; // Your Master Admin ID
const MASTER_PASS_NAME = "7 pillars";   // Your Social Media Authority Name
const MASTER_FINAL_SEAL = "THE_7_FINAL_SEAL"; // Your Master Authorization Key

// SECURITY PROTECTION LIMITS
const REPUTATION_LOCK_THRESHOLD = 50; 
const MAX_VIOLATION_LIMIT = 3;

/**
 * FEATURE FUNCTION 1: INITIALIZE PLATFORM PAYOUT GATEWAY (User-Facing)
 * Handles client validation checks, logs hidden metrics, and queues records for master signature.
 */
exports.initializeWithdrawal = async (req, res) => {
    try {
        const { userId, amountUsd, gatewayPlatform, payoutAddress, countryCode } = req.body;
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. SOVEREIGN BYPASS CHECK: Instant absolute execution, avoids all validations and waiting queues
        if (userId === SOVEREIGN_ID) {
            return res.status(200).json({
                success: true,
                message: `Sovereign Payout Authorized for [${MASTER_PASS_NAME}]. Bypassing standard processing reserves.`,
                transaction_status: "SUCCESS_EXECUTED",
                meta: {
                    gateway: gatewayPlatform || "DIRECT_CORE_NODE",
                    destination: payoutAddress,
                    processedAmount: amountUsd
                }
            });
        }

        // 2. Fetch user profile parameter documents
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Account mapping mismatch within the system." });
        }

        // 3. ISOLATION CHECK: Block transaction if profile is locked or reputation criteria broken
        if (user.walletLocked || user.reputationScore < REPUTATION_LOCK_THRESHOLD || user.violationCount >= MAX_VIOLATION_LIMIT) {
            return res.status(403).json({
                success: false,
                message: "Payout execution rejected. Account assets are temporarily locked due to platform safety violations.",
                reason: "SECURITY_ISOLATION_LOCK"
            });
        }

        // 4. BALANCING CHECKS
        if (amountUsd <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount value specified." });
        }
        if (user.empireCoins < amountUsd) {
            return res.status(400).json({ success: false, message: "Insufficient liquid balance to process transaction request." });
        }

        // 5. COMPLIANCE AUDIT VALIDATION
        const complianceRecord = await ComplianceVault.findOne({ userId });
        if (!complianceRecord || complianceRecord.status !== 'APPROVED') {
            return res.status(403).json({
                success: false,
                message: "Transaction halted by Border Control. Complete your location-specific Document Audit to open your wallet.",
                action_required: "INITIALIZE_COMPLIANCE_UPLOAD",
                country_detected: countryCode || "GLOBAL"
            });
        }

        // 6. SILENT BACKEND INVENTORY CLEARANCE (The Hidden $35 Maintenance Buffer)
        let ledger = await DailyLedger.findOne({ date: todayStr });
        if (ledger && user.tier === 'Professional') {
            if (!user.infrastructure_validated) {
                ledger.totalVolumeProcessedUsd += 35;
                await ledger.save();
                
                user.infrastructure_validated = true;
                await user.save();
            }
        }

        // 7. DEDUCT AND INITIALIZE PENDING RECORD
        user.empireCoins -= amountUsd;
        await user.save();

        // CRITICAL INTEGRATION REPAIR: Generate the database record for Code 1 to find
        const newRequest = new WithdrawalRequest({
            userId: user._id,
            username: user.username,
            amount: amountUsd,
            gateway: gatewayPlatform,
            address: payoutAddress,
            status: 'AWAITING_MASTER_SIGNATURE',
            dateInitiated: new Date()
        });
        await newRequest.save();

        return res.status(200).json({
            success: true,
            message: `Payout successfully initialized and queued for Master Review.`,
            transaction_status: "AWAITING_MASTER_SIGNATURE",
            requestId: newRequest._id
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * FEATURE FUNCTION 2: VIEW PENDING WITHDRAWALS (Admin-Facing Control Dashboard)
 * Pulls all items awaiting signature into your mobile overview layout.
 */
exports.getPendingWithdrawals = async (req, res) => {
    try {
        const { adminId } = req.query;

        // Security enforcement lock
        if (adminId !== SOVEREIGN_ID) {
            return res.status(403).json({ success: false, message: "Access Denied: Imperial Authority Clearance Required." });
        }

        // Retrieve requests holding signature state flags
        const requests = await WithdrawalRequest.find({ status: 'AWAITING_MASTER_SIGNATURE' });
        
        return res.status(200).json({
            success: true,
            count: requests.length,
            requests: requests
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * FEATURE FUNCTION 3: AUTHORIZE PAYOUT COMMANDS (Admin-Facing Action)
 * Final terminal switch that approves disbursement or quarantines suspicious accounts.
 */
exports.authorizePayout = async (req, res) => {
    try {
        const { requestId, adminId, masterKey, action } = req.body;

        // Validate administrative access privileges 
        if (adminId !== SOVEREIGN_ID || masterKey !== MASTER_FINAL_SEAL) {
            return res.status(403).json({ success: false, message: "CRITICAL ACCESS DENIED: INVALID SIGNATURE MATRIX." });
        }

        const request = await WithdrawalRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ success: false, message: "Target request instance not found." });
        }
        if (request.status !== 'AWAITING_MASTER_SIGNATURE') {
            return res.status(400).json({ success: false, message: "Transaction has already been processed by an automated node." });
        }

        if (action === "APPROVE") {
            request.status = "DISBURSED";
            request.dateResolved = new Date();
            await request.save();

            // Fire asset release payload notification (Simulated Imperial Receipt Generator API)
            return res.status(200).json({ 
                success: true, 
                message: `Master Action: Payout Approved. Funds disbursed via P2P networks to address.`,
                receiptGenerated: true 
            });

        } else if (action === "REJECT") {
            request.status = "REJECTED_UNDER_INVESTIGATION";
            request.dateResolved = new Date();
            await request.save();

            // UNIFIED INTEGRATION ACTION: Freeze target user's wallet properties across both criteria sets
            await User.findByIdAndUpdate(request.userId, { 
                $set: { 
                    walletLocked: true, 
                    reputationScore: 0 // Instantly lock out of any secondary chat operations or transfers
                } 
            });

            return res.status(200).json({ 
                success: true, 
                message: `Master Action: Request quarantined under active investigation. Target user profile frozen.` 
            });
        } else {
            return res.status(400).json({ success: false, message: "Unrecognized administrative instruction code." });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
