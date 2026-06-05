const express = require('express');
const router = express.Router();

const {
    createAdvertisement,
    getAdvertisements,
    getAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    approveAdvertisement,
    rejectAdvertisement
} = require('../controllers/advertisementController');

// Create ad
router.post('/create', createAdvertisement);

// Get all active ads
router.get('/', getAdvertisements);

// Get single ad
router.get('/:id', getAdvertisement);

// Update ad
router.put('/:id', updateAdvertisement);

// Delete ad
router.delete('/:id', deleteAdvertisement);

// Admin approval
router.put('/approve/:id', approveAdvertisement);

// Admin rejection
router.put('/reject/:id', rejectAdvertisement);

module.exports = router;
