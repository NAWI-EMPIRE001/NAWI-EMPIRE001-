const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ==========================================================
 * NAWI-EMPIRE001 AUTHORIZATION GATEWAY
 * Protected By Diamondback 231 Authority
 * ==========================================================
 */

/**
 * Verify JWT Token
 */
exports.protect = async (req, res, next) => {
    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token missing'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.security?.is_banned === true) {
            return res.status(403).json({
                success: false,
                message: 'Account suspended'
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid authentication token'
        });

    }
};

/**
 * ==========================================================
 * Verification Levels
 * ==========================================================
 */

exports.requireVerification = (
    minimumLevel = 1
) => {

    return async (req, res, next) => {

        try {

            const level =
                req.user?.verification?.verificationLevel || 0;

            if (level < minimumLevel) {
                return res.status(403).json({
                    success: false,
                    message:
                        `Verification level ${minimumLevel} required`
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };
};

/**
 * ==========================================================
 * Seven Pillars Access Control
 * ==========================================================
 */

exports.authorizePillar = (
    pillarName
) => {

    return async (req, res, next) => {

        try {

            const allowedPillars = [

                'ARENA_NODE',

                'SOVEREIGN_EXCHANGE',

                'VISIBILITY_ENGINE',

                'CULINARY_MATRIX',

                'AESTHETIC_NEXUS',

                'DIAMONDBACK_FORGE',

                'SONIC_LEDGER'
            ];

            if (
                !allowedPillars.includes(
                    pillarName
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid pillar'
                });
            }

            req.pillar = pillarName;

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };
};

/**
 * ==========================================================
 * Merchant Access
 * ==========================================================
 */

exports.requireMerchant = async (
    req,
    res,
    next
) => {

    try {

        const merchantVerified =
            req.user?.verification?.merchantVerified;

        if (!merchantVerified) {
            return res.status(403).json({
                success: false,
                message:
                    'Merchant verification required'
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/**
 * ==========================================================
 * Admin Access
 * ==========================================================
 */

exports.requireAdmin = async (
    req,
    res,
    next
) => {

    try {

        const role =
            req.user?.identity?.legacy_rank;

        if (
            role !== 'Founder' &&
            role !== 'Administrator'
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Administrative authorization required'
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/**
 * ==========================================================
 * Escrow Shield Protection
 * ==========================================================
 */

exports.requireEscrowAccess = async (
    req,
    res,
    next
) => {

    try {

        if (
            req.user.security?.is_banned
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Escrow access restricted'
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/**
 * ==========================================================
 * Visibility Engine Access
 * ==========================================================
 */

exports.requireAdvertisingAccess =
    async (
        req,
        res,
        next
    ) => {

        try {

            if (
                req.user.security?.scam_alert_flag > 5
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        'Advertising privileges restricted'
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };

/**
 * ==========================================================
 * Diamondback Forge Creator Access
 * ==========================================================
 */

exports.requireCreatorAccess =
    async (
        req,
        res,
        next
    ) => {

        try {

            if (
                req.user.security?.is_banned
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        'Creator privileges restricted'
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    };
