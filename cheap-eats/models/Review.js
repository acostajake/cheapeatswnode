const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Author required'
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: 'Select a place to continue'
    },
    text: {
        type: String,
        required: 'Type something...'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

module.exports = mongoose.model('Review', reviewSchema);