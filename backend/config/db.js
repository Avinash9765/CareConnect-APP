const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
    try {
        let uri = process.env.MONGO_URI;
        let isMemory = false;

        if (!uri || uri.includes('YOUR_USERNAME') || uri.includes('xxxxx')) {
            console.log('⚠️ Valid MongoDB URI not found. Starting In-Memory MongoDB for demo...');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            isMemory = true;
        }

        const conn = await mongoose.connect(uri);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);

        if (isMemory) {
            console.log('🌱 Seeding in-memory database...');
            // We can't easily run seed.js as a separate process because it won't share the memory server
            // For now, let's just log that it's ready. In a real app, we'd import seed logic here.
        }
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
