const fs = require('fs');
const { ContinentsEnum, Continent } = require('../models/continent');
const { WorldWonderEnum, WorldWonder } = require('../models/wonder');
// const { ContinentsEnum } = require('./models/continent');
// const { WorldWonderEnum } = require('./models/wonder');

// Helper function to read data from file
const readDataFromFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
};

// Helper function to trim and validate continent name
const validateContinentName = (name) => {
    const trimmedName = name.trim();
    if (!ContinentsEnum.includes(trimmedName)) {
        throw new Error(`Invalid continent name: ${trimmedName}`);
    }
    return trimmedName;
};

// Helper function to trim and validate wonder name
const validateWonderName = (name) => {
    const trimmedName = name.trim();
    if (!WorldWonderEnum.includes(trimmedName)) {
        throw new Error(`Invalid wonder name: ${trimmedName}`);
    }
    return trimmedName;
};

// Function to seed continents
const seedContinents = async (filePath) => {
    try {
        const continentsData = readDataFromFile(filePath);
        const continents = continentsData.map(line => {
            const [name, size, countries, population, habitable, funFact] = line.split('|').map(item => item.trim());
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

// Function to seed wonders
const seedWonders = async (filePath) => {
    try {
        const wondersData = readDataFromFile(filePath);
        const wonders = await Promise.all(wondersData.map(async line => {
            const [name, location, continentName, yearBuilt] = line.split('|').map(item => item.trim());
            const continent = await Continent.findOne({ name: validateContinentName(continentName) });
            if (!continent) {
                throw new Error(`Continent not found for wonder: ${name}`);
            }
            return {
                name: validateWonderName(name),
                location,
                continent: continent._id,
                yearBuilt
            };
        }));
        await emptyWonders();
        await WorldWonder.insertMany(wonders);
        console.log('Wonders seeded!');
    } catch (error) {
        console.error('Error seeding wonders:', error);
    }
};

// Function to empty continents
const emptyContinents = async () => {
    try {
        await Continent.deleteMany({});
        console.log('Continents collection emptied!');
    } catch (error) {
        console.error('Error emptying continents:', error);
    }
};

// Function to empty wonders
const emptyWonders = async () => {
    try {
        await WorldWonder.deleteMany({});
        console.log('Wonders collection emptied!');
    } catch (error) {
        console.error('Error emptying wonders:', error);
    }
};

module.exports = { seedContinents, seedWonders, emptyContinents, emptyWonders };