const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    verificationType: {
        type: String,
        enum: [
            'identity',
            'business',
            'address',
            'phone',
            'email'
        ],
        default: 'identity'
    },

    fullName: String,

    documentType: {
        type: String,
        enum: [
            'national_id',
            'passport',
            'drivers_license',
            'voters_card',
            'business_registration'
        ]
    },

    documentNumber: String,

    frontImage: String,

    backImage: String,

    selfieImage: String,

    status: {
        type: String,
        enum: [
            'pending',
            'under_review',
            'approved',
            'rejected'
        ],
        default: 'pending'
    },

    rejectionReason: {
        type: String,
        default: ''
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    reviewedAt: Date
},
{
    timestamps: true
});

module.exports = mongoose.model(
    'Verification',
    verificationSchema
);
