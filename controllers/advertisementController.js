const Advertisement = require('../models/Advertisement');

/**
 * Create Advertisement
 */
exports.createAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Advertisement created successfully',
            advertisement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get All Advertisements
 */
exports.getAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.find()
            .populate('advertiser', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: advertisements.length,
            advertisements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Single Advertisement
 */
exports.getAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findById(req.params.id)
            .populate('advertiser', 'name email');

        if (!advertisement) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        res.status(200).json({
            success: true,
            advertisement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update Advertisement
 */
exports.updateAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!advertisement) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Advertisement updated successfully',
            advertisement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete Advertisement
 */
exports.deleteAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findById(req.params.id);

        if (!advertisement) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        await advertisement.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Advertisement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Approve Advertisement
 */
exports.approveAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved'
            },
            {
                new: true
            }
        );

        if (!advertisement) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Advertisement approved',
            advertisement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Reject Advertisement
 */
exports.rejectAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected'
            },
            {
                new: true
            }
        );

        if (!advertisement) {
            return res.status(404).json({
                success: false,
                message: 'Advertisement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Advertisement rejected',
            advertisement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
