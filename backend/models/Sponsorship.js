const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    child: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
    tier: { type: String, enum: ['books', 'fees', 'full'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['active', 'paused', 'ended'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    nextPaymentDate: Date,
    totalPaid: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

sponsorshipSchema.index({ sponsor: 1, status: 1 });
sponsorshipSchema.index({ child: 1 });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
