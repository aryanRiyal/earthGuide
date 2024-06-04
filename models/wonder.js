const mongoose = require('mongoose');

const WorldWonderEnum = [
    'Colosseum',
    'Petra',
    'Chichén Itzá',
    'Christ the Redeemer',
    'Machu Picchu',
    'Taj Mahal',
    'The Great Wall of China'
];

const wonderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: WorldWonderEnum,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    continent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Continent',
        required: true,
    },
    yearBuilt: {
        type: String
    }
});

const WorldWonder = mongoose.model('WorldWonder', wonderSchema);
module.exports ={WorldWonderEnum, WorldWonder};