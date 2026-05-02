const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, organization } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email is already registered' });
        
        const user = await User.create({ name, email, password, role: role || 'donor', organization: organization || null });
        const token = generateToken(user._id);
        
        res.status(201).json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization } 
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
        
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        
        const token = generateToken(user._id);
        res.json({ 
            success: true, 
            token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization } 
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /me (protected)
router.get('/me', protect, async (req, res) => {
    res.json({ 
        success: true, 
        user: { 
            id: req.user._id, 
            name: req.user.name, 
            email: req.user.email, 
            role: req.user.role, 
            organization: req.user.organization, 
            phone: req.user.phone, 
            location: req.user.location, 
            avatar: req.user.avatar, 
            createdAt: req.user.createdAt 
        } 
    });
});

// PUT /profile (protected)
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, location, avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, phone, location, avatar }, { new: true, runValidators: true });
        res.json({ success: true, user });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
