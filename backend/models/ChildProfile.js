const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
    anonymousId: { type: String, unique: true },
    age: { type: Number, required: true, min: 1, max: 17 },
    grade: { type: String, required: true },
    interests: [String],
    dream: String,
    story: String,
    supportNeeded: { type: String, enum: ['books', 'fees', 'full'], required: true },
    orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailableForSponsorship: { type: Boolean, default: true },
    avatarColor: String,
    createdAt: { type: Date, default: Date.now }
});

childProfileSchema.pre('save', function(next) {
    if (!this.anonymousId) {
        this.anonymousId = 'Child-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 900 + 100);
    }
    next();
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);
