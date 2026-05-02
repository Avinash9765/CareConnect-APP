const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['food_drive', 'orphanage', 'fundraiser', 'workshop'], required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { address: { type: String, required: true }, lat: Number, lng: Number },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    maxVolunteers: { type: Number, required: true, min: 1 },
    registeredVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    tags: [String],
    contactEmail: String,
    coverImage: String,
    createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
