const router = require('express').Router();
const FoodDonation = require('../models/FoodDonation');
const { protect } = require('../middleware/authMiddleware');

// POST / (create donation)
router.post('/', protect, async (req, res) => {
    try {
        const { foodName, foodType, quantity, cookedAt, safeUntil, pickupAddress, pickupLocation, photos, notes } = req.body;
        
        let computedSafeUntil = safeUntil;
        if (foodType === 'cooked_meal' && cookedAt && !safeUntil) {
            const cookedDate = new Date(cookedAt);
            computedSafeUntil = new Date(cookedDate.getTime() + 4 * 60 * 60 * 1000);
        }
        
        if (!computedSafeUntil) return res.status(400).json({ success: false, message: 'Safe until time is required' });
        if (new Date(computedSafeUntil) <= new Date()) return res.status(400).json({ success: false, message: 'Safe until time must be in the future' });
        
        const donation = await FoodDonation.create({
            donor: req.user._id, foodName, foodType, quantity, cookedAt, safeUntil: computedSafeUntil,
            pickupAddress, pickupLocation: pickupLocation || { type: 'Point', coordinates: [0, 0] }, photos: photos || [], notes
        });
        
        await donation.populate('donor', 'name avatar phone');
        res.status(201).json({ success: true, donation });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET / (list with filters)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, maxDistance, foodType, status, page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        
        let query = { status: status || 'available', safeUntil: { $gt: new Date() } };
        if (foodType && foodType !== 'all') query.foodType = foodType;
        
        let donations, total;
        
        if (lat && lng) {
            const maxDist = (parseFloat(maxDistance) || 20) * 1000;
            donations = await FoodDonation.find({
                ...query,
                pickupLocation: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                        $maxDistance: maxDist
                    }
                }
            }).populate('donor', 'name avatar phone').populate('claimedBy', 'name organization').skip(skip).limit(limitNum);
            total = donations.length; // Approximate for $near
        } else {
            total = await FoodDonation.countDocuments(query);
            donations = await FoodDonation.find(query).populate('donor', 'name avatar phone').sort({ createdAt: -1 }).skip(skip).limit(limitNum);
        }
        
        res.json({ success: true, count: donations.length, total, page: pageNum, totalPages: Math.ceil(total / limitNum), donations });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /my (current user's donations)
router.get('/my', protect, async (req, res) => {
    try {
        const donations = await FoodDonation.find({ donor: req.user._id }).populate('claimedBy', 'name organization').sort({ createdAt: -1 });
        res.json({ success: true, count: donations.length, donations });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /:id (single donation)
router.get('/:id', async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id).populate('donor', 'name avatar phone location').populate('claimedBy', 'name organization phone');
        if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
        if (donation.status === 'available' && donation.safeUntil < new Date()) {
            donation.status = 'expired';
            await donation.save();
        }
        res.json({ success: true, donation });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /:id/claim (NGO claims donation)
router.put('/:id/claim', protect, async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
        if (donation.status !== 'available') return res.status(400).json({ success: false, message: `Cannot claim a donation with status: ${donation.status}` });
        if (donation.safeUntil < new Date()) {
            donation.status = 'expired';
            await donation.save();
            return res.status(400).json({ success: false, message: 'This donation has expired' });
        }
        if (donation.donor.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: 'You cannot claim your own donation' });
        
        donation.status = 'claimed';
        donation.claimedBy = req.user._id;
        donation.claimedAt = new Date();
        await donation.save();
        await donation.populate('donor', 'name phone');
        await donation.populate('claimedBy', 'name organization');
        res.json({ success: true, message: 'Donation claimed successfully', donation });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /:id/complete
router.put('/:id/complete', protect, async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
        
        const isDonor = donation.donor.toString() === req.user._id.toString();
        const isClaimer = donation.claimedBy && donation.claimedBy.toString() === req.user._id.toString();
        
        if (!isDonor && !isClaimer) return res.status(403).json({ success: false, message: 'Not authorized to complete this donation' });
        
        donation.status = 'completed';
        donation.completedAt = new Date();
        await donation.save();
        res.json({ success: true, message: 'Donation marked as completed', donation });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);
        if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
        if (donation.donor.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized to delete this donation' });
        if (donation.status === 'claimed') return res.status(400).json({ success: false, message: 'Cannot delete a claimed donation' });
        
        await donation.deleteOne();
        res.json({ success: true, message: 'Donation deleted successfully' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
