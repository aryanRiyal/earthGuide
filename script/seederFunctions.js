const mongoose = require('mongoose');
const fs = require('fs');
const { ContinentsEnum, Continent } = require('../models/continent');
const { WorldWonderEnum, WorldWonder } = require('../models/wonder');

// Helper function to read data from a file
const readDataFromFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
};

// Helper function to validate continent name
const validateContinentName = (name) => {
    const trimmedName = name.trim();
    if (!ContinentsEnum.includes(trimmedName)) {
        throw new Error(`Invalid continent name: ${trimmedName}`);
    }
    return trimmedName;
};

// Helper function to validate wonder name
const validateWonderName = (name) => {
    const trimmedName = name.trim();
    if (!WorldWonderEnum.includes(trimmedName)) {
        throw new Error(`Invalid wonder name: ${trimmedName}`);
    }
    return trimmedName;
};

// Function to empty continents collection
const emptyContinents = async () => {
    try {
        await WorldWonder.deleteMany({});
        await Continent.deleteMany({});
        console.log('Continents collection emptied!');
    } catch (error) {
        console.error('Error emptying continents:', error);
    }
};

// Function to empty wonders collection
const emptyWonders = async () => {
    try {
        // Remove wonders from continents
        await Continent.updateMany({}, { $set: { wonders: [] } });
        await WorldWonder.deleteMany({});
        console.log('Wonders collection emptied!');
    } catch (error) {
        console.error('Error emptying wonders:', error);
    }
};

// Function to drop the database
const dropDatabase = async () => {
    try {
        await mongoose.connection.db.dropDatabase();
        console.log('Database dropped!');
    } catch (error) {
        console.error('Error dropping database:', error);
    }
};

// Function to seed continents data
const seedContinents = async (filePath) => {
    try {
        const continentsData = readDataFromFile(filePath);
        const continents = continentsData.map((line) => {
            const [name, size, countries, population, habitable, funFact] = line
                .split('|')
                .map((item) => item.trim());
            return {
                name: validateContinentName(name),
                size,
                countries: parseInt(countries, 10),
                population: parseInt(population, 10),
                habitable: habitable === 'true',
                funFact
            };
        });
        await emptyContinents();
        await Continent.insertMany(continents);
        console.log('Continents seeded!');
    } catch (error) {
        console.error('Error seeding continents:', error);
    }
};

// Function to seed wonders data
const seedWonders = async (filePath) => {
    try {
        const wondersData = readDataFromFile(filePath);
        await emptyWonders();
        const wonders = await Promise.all(
            wondersData.map(async (line) => {
                const [name, location, continentName, yearBuilt] = line
                    .split('|')
                    .map((item) => item.trim());
                const continent = await Continent.findOne({
                    name: validateContinentName(continentName)
                });
                if (!continent) {
                    throw new Error(`Continent not found for wonder: ${name}`);
                }
                const wonder = new WorldWonder({
                    name: validateWonderName(name),
                    location,
                    continentName,
                    continentInfo: continent._id,
                    yearBuilt
                });
                await wonder.save();
                // Update the continent's wonders array
                continent.wonders.push(wonder._id);
                await continent.save();
                return wonder;
            })
        );
        console.log('Wonders seeded and continents updated!');
    } catch (error) {
        console.error('Error seeding wonders:', error);
    }
};

module.exports = { seedContinents, seedWonders, emptyContinents, emptyWonders, dropDatabase };
