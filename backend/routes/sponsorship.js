const router = require('express').Router();
const ChildProfile = require('../models/ChildProfile');
const Sponsorship = require('../models/Sponsorship');
const { protect } = require('../middleware/authMiddleware');

const TIER_AMOUNTS = { books: 500, fees: 1000, full: 2000 };

// GET /children
router.get('/children', async (req, res) => {
    try {
        const children = await ChildProfile.find({ isAvailableForSponsorship: true }).populate('orphanageId', 'organization location');
        res.json({ success: true, count: children.length, children });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST / (create sponsorship)
router.post('/', protect, async (req, res) => {
    try {
        const { childId, tier } = req.body;
        if (!TIER_AMOUNTS[tier]) return res.status(400).json({ success: false, message: 'Invalid sponsorship tier. Use: books, fees, or full' });
        
        const existing = await Sponsorship.findOne({ sponsor: req.user._id, child: childId, status: 'active' });
        if (existing) return res.status(400).json({ success: false, message: 'You are already sponsoring this child' });
        
        const child = await ChildProfile.findById(childId);
        if (!child) return res.status(404).json({ success: false, message: 'Child profile not found' });
        
        const startDate = new Date();
        const nextPaymentDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const sponsorship = await Sponsorship.create({ sponsor: req.user._id, child: childId, tier, amount: TIER_AMOUNTS[tier], startDate, nextPaymentDate });
        
        await sponsorship.populate('child');
        res.status(201).json({ success: true, message: 'Sponsorship activated!', sponsorship });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /my
router.get('/my', protect, async (req, res) => {
    try {
        const sponsorships = await Sponsorship.find({ sponsor: req.user._id }).populate('child').sort({ startDate: -1 });
        res.json({ success: true, count: sponsorships.length, sponsorships });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /:id/pause
router.put('/:id/pause', protect, async (req, res) => {
    try {
        const s = await Sponsorship.findOne({ _id: req.params.id, sponsor: req.user._id });
        if (!s) return res.status(404).json({ success: false, message: 'Sponsorship not found' });
        s.status = 'paused';
        await s.save();
        res.json({ success: true, message: 'Sponsorship paused', sponsorship: s });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /:id/end
router.put('/:id/end', protect, async (req, res) => {
    try {
        const s = await Sponsorship.findOne({ _id: req.params.id, sponsor: req.user._id });
        if (!s) return res.status(404).json({ success: false, message: 'Sponsorship not found' });
        s.status = 'ended';
        await s.save();
        res.json({ success: true, message: 'Sponsorship ended', sponsorship: s });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
