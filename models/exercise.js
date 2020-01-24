const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Exercise = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
        index: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 32
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String
    }
});

module.exports = mongoose.model('Exercise', Exercise);