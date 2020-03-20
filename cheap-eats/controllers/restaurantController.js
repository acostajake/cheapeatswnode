const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant')

exports.homePage = (req, res) => {
    res.render('restaurants', {
        title: 'Home'
    })
}

exports.addRestaurant = (req, res) => {
    res.render('updateRestaurant', {
        title: 'Add'
    });
}

exports.createRestaurant = async (req, res) => {
    const restaurant = await new Restaurant(req.body).save();
    req.flash('success', `Successfully added ${restaurant.name}! Add a review!`)
    res.redirect(`/restaurant/${restaurant.slug}`);
}

exports.getRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find();
    res.render('restaurants', {
        title: 'Update',
        restaurants
    })
}

exports.editRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findOne({ _id: req.params.id });
    console.log(restaurant)
    res.render('updateRestaurant', {
        title: 'Update',
        restaurant
    })

}

exports.updateRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec()
    req.flash('success', `Thanks! Updated ${restaurant.name}. <a href='/restaurants/${restaurant.slug}'>See update</a>`);
    res.redirect(`/restaurants/${restaurant._id}/edit`)
}