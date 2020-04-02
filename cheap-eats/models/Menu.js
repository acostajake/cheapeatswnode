const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const menuSchema = new mongoose.Schema({
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
    menu: {
        type: String,
        required: 'Type something...'
    },
    menuItem: {
        name: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            max: 7
        },
        description: {
            type: String,
            trim: true
        }
    }
});

function autopopulate(next) {
    this.populate('author');
    next();
};

menuSchema.pre('find', autopopulate);
menuSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Menu', menuSchema);