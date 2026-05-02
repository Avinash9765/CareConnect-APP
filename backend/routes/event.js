const router = require('express').Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST / (create event, all authenticated users for demo)
router.post('/', protect, async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, organizer: req.user._id });
        res.status(201).json({ success: true, event });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET / (list events with filters)
router.get('/', async (req, res) => {
    try {
        const { type, upcoming, page, limit } = req.query;
        const query = {};
        if (type) query.type = type;
        if (upcoming === 'true') {
            query.status = 'upcoming';
            query.date = { $gte: new Date() };
        }
        
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const total = await Event.countDocuments(query);
        const events = await Event.find(query).populate('organizer', 'name organization avatar').sort({ date: 1 }).skip((pageNum - 1) * limitNum).limit(limitNum);
        
        res.json({ success: true, total, page: pageNum, totalPages: Math.ceil(total / limitNum), events });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name organization phone').populate('registeredVolunteers', 'name avatar');
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, event });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /:id/register (volunteer registers)
router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        if (event.registeredVolunteers.includes(req.user._id)) return res.status(400).json({ success: false, message: 'Already registered for this event' });
        if (event.registeredVolunteers.length >= event.maxVolunteers) return res.status(400).json({ success: false, message: 'Event is full' });
        
        event.registeredVolunteers.push(req.user._id);
        await event.save();
        res.json({ success: true, message: 'Successfully registered for event', volunteersCount: event.registeredVolunteers.length });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /:id/unregister
router.delete('/:id/unregister', protect, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, { $pull: { registeredVolunteers: req.user._id } }, { new: true });
        res.json({ success: true, message: 'Unregistered from event' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /my-registered (events user volunteered for)
router.get('/my-registered', protect, async (req, res) => {
    try {
        const events = await Event.find({ registeredVolunteers: req.user._id }).populate('organizer', 'name organization').sort({ date: 1 });
        res.json({ success: true, events });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
