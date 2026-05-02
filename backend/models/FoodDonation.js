const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodName: { type: String, required: [true, 'Food name is required'], trim: true },
    foodType: { type: String, enum: ['cooked_meal', 'raw_ingredients', 'packaged_food', 'beverages', 'bakery', 'mixed'], required: true },
    quantity: {
        amount: { type: Number, required: true, min: 0 },
        unit: { type: String, enum: ['kg', 'grams', 'portions', 'boxes', 'litres', 'packets', 'pieces'], required: true }
    },
    cookedAt: { type: Date },
    safeUntil: { type: Date, required: [true, 'Safe until time is required'] },
    pickupAddress: { type: String, required: true },
    pickupLocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    photos: [{ type: String }],
    notes: { type: String },
    status: { type: String, enum: ['available', 'claimed', 'expired', 'completed'], default: 'available' },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    claimedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

foodDonationSchema.index({ pickupLocation: '2dsphere' });
foodDonationSchema.index({ status: 1, createdAt: -1 });
foodDonationSchema.index({ donor: 1 });
foodDonationSchema.index({ safeUntil: 1 }, { expireAfterSeconds: 0 });

foodDonationSchema.methods.isExpired = function() {
    return this.safeUntil < new Date();
};

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
