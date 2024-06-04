const mongoose = require('mongoose');

const ContinentsEnum = [
    'Asia',
    'Europe',
    'Australia',
    'Africa',
    'North America', 
    'South America', 
    'Antarctica'
];

const continentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ContinentsEnum,
        unique: true,
        sparse: true
    },
    size: {
        type: String,
        required: true
    },
    countries: {
        type: Number,
        required: true,
        min: 0
    },
    population: {
        type: Number,
        required: true,
        min: 0
    },
    wonders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorldWonder',
        sparse: true
    }],
    habitable: {
        type: Boolean,
        required: true
    },
    funFact: {
        type: String,
        required: true
    }
// }, { autoIndex: false } );
}, { autoIndex: true } );

// continentSchema.index({ wonders: 1 }, { unique: true, sparse: true });

const Continent = mongoose.model('Continent', continentSchema);
module.exports = { ContinentsEnum, Continent };