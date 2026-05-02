require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const FoodDonation = require('./models/FoodDonation');
const Event = require('./models/Event');
const ChildProfile = require('./models/ChildProfile');
const Sponsorship = require('./models/Sponsorship');

async function seedDatabase() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Promise.all([User.deleteMany(), FoodDonation.deleteMany(), Event.deleteMany(), ChildProfile.deleteMany(), Sponsorship.deleteMany()]);
    console.log('Cleared existing data');
    
    // Create Users
    const adminUser = await User.create({ name: 'Admin CareConnect', email: 'admin@careconnect.com', password: 'admin123', role: 'admin' });
    const donorUser = await User.create({ name: 'Ravi Sharma', email: 'ravi@example.com', password: 'donor123', role: 'donor', phone: '+91 98765 43210', location: { address: 'Koramangala, Bangalore', lat: 12.9352, lng: 77.6245 } });
    const ngoUser = await User.create({ name: 'Hope Foundation', email: 'hope@ngo.com', password: 'ngo12345', role: 'ngo', organization: 'Hope Foundation Trust', phone: '+91 80-2345-6789', location: { address: 'Indiranagar, Bangalore', lat: 12.9719, lng: 77.6412 } });
    console.log('Users created: admin, donor, NGO');
    
    // Create Food Donations
    const now = Date.now();
    await FoodDonation.create([
        { donor: donorUser._id, foodName: 'Chicken Biryani', foodType: 'cooked_meal', quantity: { amount: 8, unit: 'portions' }, cookedAt: new Date(now - 30 * 60 * 1000), safeUntil: new Date(now + 3.5 * 60 * 60 * 1000), pickupAddress: '12 MG Road, Koramangala, Bangalore', pickupLocation: { type: 'Point', coordinates: [77.6245, 12.9352] }, status: 'available', notes: 'Freshly cooked. No nuts.' },
        { donor: donorUser._id, foodName: 'White Rice and Dal', foodType: 'cooked_meal', quantity: { amount: 12, unit: 'portions' }, cookedAt: new Date(now - 1 * 60 * 60 * 1000), safeUntil: new Date(now + 2.5 * 60 * 60 * 1000), pickupAddress: '45 HSR Layout, Bangalore', pickupLocation: { type: 'Point', coordinates: [77.6478, 12.9116] }, status: 'available' },
        { donor: donorUser._id, foodName: 'Whole Wheat Bread Loaves', foodType: 'packaged_food', quantity: { amount: 6, unit: 'boxes' }, safeUntil: new Date(now + 48 * 60 * 60 * 1000), pickupAddress: '22 Whitefield Road, Bangalore', pickupLocation: { type: 'Point', coordinates: [77.7480, 12.9698] }, status: 'available' },
        { donor: donorUser._id, foodName: 'Fresh Fruits Basket', foodType: 'raw_ingredients', quantity: { amount: 5, unit: 'kg' }, safeUntil: new Date(now + 24 * 60 * 60 * 1000), pickupAddress: '8 Jayanagar, Bangalore', pickupLocation: { type: 'Point', coordinates: [77.5946, 12.9308] }, status: 'claimed', claimedBy: ngoUser._id, claimedAt: new Date() },
        { donor: donorUser._id, foodName: 'Idli and Sambar', foodType: 'cooked_meal', quantity: { amount: 20, unit: 'portions' }, cookedAt: new Date(now - 2 * 60 * 60 * 1000), safeUntil: new Date(now + 2 * 60 * 60 * 1000), pickupAddress: '3 Rajajinagar, Bangalore', pickupLocation: { type: 'Point', coordinates: [77.5558, 12.9899] }, status: 'completed', claimedBy: ngoUser._id, completedAt: new Date() }
    ]);
    console.log('5 food donations created');
    
    // Create Events
    await Event.create([
        { title: 'Bangalore City Food Drive 2025', type: 'food_drive', description: 'Join us for a massive food drive covering all of Bangalore.', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), location: { address: 'Cubbon Park, Bangalore', lat: 12.9763, lng: 77.5929 }, organizer: ngoUser._id, maxVolunteers: 50, registeredVolunteers: [donorUser._id], tags: ['Physical', 'Weekend', 'Food'], contactEmail: 'events@hope.org', status: 'upcoming' },
        { title: "Children's Art and Creativity Day", type: 'orphanage', description: 'Spend the day with 30 wonderful children at Hope Foundation.', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), location: { address: 'Hope Foundation, Indiranagar, Bangalore', lat: 12.9719, lng: 77.6412 }, organizer: ngoUser._id, maxVolunteers: 15, registeredVolunteers: [], tags: ['Indoor', 'Children', 'Art'], contactEmail: 'events@hope.org', status: 'upcoming' },
        { title: 'Coding Workshop for Orphanage Kids', type: 'workshop', description: 'Teach basic Python programming to children aged 12-16.', date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), location: { address: 'Online via Zoom', lat: 0, lng: 0 }, organizer: ngoUser._id, maxVolunteers: 10, registeredVolunteers: [], tags: ['Online', 'Tech', 'Kids'], contactEmail: 'events@hope.org', status: 'upcoming' }
    ]);
    console.log('3 events created');
    
    // Create Child Profiles
    await ChildProfile.create([
        { age: 8, grade: 'Grade 3', interests: ['Drawing', 'Football', 'Stories'], dream: 'Wants to become a teacher', supportNeeded: 'fees', orphanageId: ngoUser._id, isAvailableForSponsorship: true, avatarColor: '#1D9E75' },
        { age: 12, grade: 'Grade 7', interests: ['Cricket', 'Reading', 'Maths'], dream: 'Wants to become a doctor', supportNeeded: 'full', orphanageId: ngoUser._id, isAvailableForSponsorship: true, avatarColor: '#2563eb' },
        { age: 10, grade: 'Grade 5', interests: ['Dancing', 'Cooking', 'Crafts'], dream: 'Wants to open a bakery', supportNeeded: 'books', orphanageId: ngoUser._id, isAvailableForSponsorship: true, avatarColor: '#d97706' },
        { age: 15, grade: 'Grade 10', interests: ['Coding', 'Chess', 'Science'], dream: 'Wants to build technology', supportNeeded: 'fees', orphanageId: ngoUser._id, isAvailableForSponsorship: false, avatarColor: '#7c3aed' }
    ]);
    console.log('4 child profiles created');
    
    const children = await ChildProfile.find();
    await Sponsorship.create([
        { sponsor: donorUser._id, child: children[0]._id, tier: 'fees', amount: 1000, status: 'active', startDate: new Date(), nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), totalPaid: 1000 },
        { sponsor: donorUser._id, child: children[1]._id, tier: 'books', amount: 500, status: 'active', startDate: new Date(), nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), totalPaid: 500 }
    ]);
    console.log('2 sponsorships created');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@careconnect.com / admin123');
    console.log('Donor: ravi@example.com / donor123');
    console.log('NGO: hope@ngo.com / ngo12345');
    
    await mongoose.connection.close();
    console.log('Connection closed. Seeding complete.');
}

seedDatabase().catch(err => { console.error('Seed failed:', err); process.exit(1); });
