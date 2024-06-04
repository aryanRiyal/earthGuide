const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true 
    },
    authority: {
        type: String,
        required: true,
        enum: ["Admin", "Guide", "Guest", "Visitor"],
        unique: true
    }
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;