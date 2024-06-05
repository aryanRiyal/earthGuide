require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const { seedContinents, seedWonders, emptyContinents, emptyWonders } = require('./script/seederFunctions');
const { connectDB, closeDB } = require('./config/db');

// Define the file paths
const continentFilePath = path.join(__dirname, 'data', 'continents.txt');
const wonderFilePath = path.join(__dirname, 'data', 'wonders.txt');

// Main function to seed database based on arguments
const seedDatabase = async () => {
    const args = process.argv.slice(2);
    const seedContinentsFlag = args.includes('continents');
    const seedWondersFlag = args.includes('wonders');
    const emptyAllFlag = args.includes('empty');
    const emptyContinentsFlag = args.includes('empty-continents');
    const emptyWondersFlag = args.includes('empty-wonders');

    try {
        connectDB();

        // Empty continents if requested
        if (emptyContinentsFlag) {
            await emptyContinents();
        }

        // Empty wonders if requested
        else if (emptyWondersFlag) {
            await emptyWonders();
        }

        //Empty Both
        else if(emptyAllFlag) {
            await emptyContinents();
            await emptyWonders();
        }

        // Seed continents if requested
        else if (seedContinentsFlag) {
            await seedContinents(continentFilePath);
            console.log('Database seeding completed');
        }

        // Seed wonders if requested
        else if (seedWondersFlag) {
            await seedWonders(wonderFilePath);
            console.log('Database seeding completed');
        }

        // Seed both continents and wonders if no specific flags provided
        else if (!seedContinentsFlag && !seedWondersFlag) {
            console.log('No seeding flags provided. Seeding both continents and wonders.');
            await seedContinents(continentFilePath);
            await seedWonders(wonderFilePath);
            console.log('Database seeding completed');
        }
        closeDB();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();