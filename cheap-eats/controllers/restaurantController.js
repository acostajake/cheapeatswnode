const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant')

exports.homePage = (req, res) => {
    res.render('index')
}

exports.addRestaurant = (req, res) => {
    res.render('updateRestaurant', {
        title: 'Add restaurant'
    });
}

exports.createRestaurant = async (req, res) => {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.redirect('/');
}