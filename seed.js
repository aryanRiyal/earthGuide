const path = require('path');

const {
    seedContinents,
    seedWonders,
    emptyContinents,
    emptyWonders,
    dropDatabase
} = require('./script/seederFunctions');
const { connectDB, closeDB } = require('./database/db.js');

// Define the file paths
const continentFilePath = path.join(__dirname, 'database/data', 'continents.txt');
const wonderFilePath = path.join(__dirname, 'database/data', 'wonders.txt');

const Flags = ['continents', 'wonders', 'all', 'empty', 'empty-continents', 'empty-wonders'];

//Main function to seed database based on arguments
const seedDatabase = async () => {
    await connectDB();
    try {
        const args = process.argv.slice(2);
        const invalidArgs = args.filter((arg) => !Flags.includes(arg));
        if (invalidArgs.length > 0) {
            console.log('\nInvalid flags provided: ', invalidArgs.join(', '));
            console.log(`Available flags are: [ ' ${Flags.join(" ', ' ")} ' ]\n`);
            await closeDB();
            return;
        }
        if (args.length === 0) {
            args.push('all');
        }

        const flags = Flags.reduce((acc, flag) => {
            acc[flag] = args.includes(flag);
            return acc;
        }, {});

        if (flags.empty || flags['empty-continents']) {
            await emptyContinents();
        }
        if (flags.empty || flags['empty-wonders']) {
            await emptyWonders();
        }
        if (flags.all || flags.continents) {
            await seedContinents(continentFilePath);
        }
        if (flags.all || flags.wonders) {
            await seedWonders(wonderFilePath);
        }
        if (flags.empty) {
            await dropDatabase();
        }
        await closeDB();
    } catch (err) {
        console.error('Error seeding database:', err);
        await closeDB();
    }
};
seedDatabase();
