const router = require('express').Router();
const FoodDonation = require('../models/FoodDonation');
const User = require('../models/User');
const Event = require('../models/Event');
const Sponsorship = require('../models/Sponsorship');

router.get('/stats', async (req, res) => {
    try {
        const [totalDonations, completedDonations, availableDonations, totalNGOs, totalDonors, activeEvents, totalSponsors, monthlyData] = await Promise.all([
            FoodDonation.countDocuments(),
            FoodDonation.countDocuments({ status: 'completed' }),
            FoodDonation.countDocuments({ status: 'available', safeUntil: { $gt: new Date() } }),
            User.countDocuments({ role: 'ngo' }),
            User.countDocuments({ role: 'donor' }),
            Event.countDocuments({ status: 'upcoming' }),
            Sponsorship.countDocuments({ status: 'active' }),
            FoodDonation.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
                { $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity.amount' }
                }},
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedMonthly = monthlyData.map(d => ({ month: monthNames[d._id.month - 1], year: d._id.year, count: d.count, totalQuantity: d.totalQuantity }));
        
        // Calculate total unique volunteers
        const eventsWithVolunteers = await Event.find({ 'registeredVolunteers.0': { $exists: true } });
        const uniqueVolunteers = new Set();
        eventsWithVolunteers.forEach(e => e.registeredVolunteers.forEach(v => uniqueVolunteers.add(v.toString())));

        res.json({
            success: true,
            stats: {
                totalDonations, completedDonations, availableDonations,
                totalNGOs, totalDonors, activeEvents, totalSponsors,
                totalVolunteers: uniqueVolunteers.size,
                monthlyDonations: formattedMonthly,
                estimatedPeopleHelped: (completedDonations * 4) + (activeEvents * 10) + (uniqueVolunteers.size * 5),
                totalUsers: totalNGOs + totalDonors
            }
        });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
