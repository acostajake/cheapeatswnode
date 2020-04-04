const mongoose = require('mongoose');
const Menu = mongoose.model('Menu');
const Restaurant = mongoose.model('Restaurant');

exports.getMenus = async (req, res) => {
    const restaurants = await Restaurant.find().select('name');
    const lettersArray = await restaurants
        .reduce(( acc, curr ) => !acc.includes(curr.name.charAt(0)) ? acc.concat(curr.name.charAt(0)) : null, [])
        .sort((a, b) => a > b);
    const names = restaurants.map(each => each.name)
    res.render('menus', { title: 'Menus', names, restaurants, lettersArray });
};

exports.searchByLetter = async (req, res) => {
    const letterParam = req.query.letter.toLowerCase()
    const restaurants = await Restaurant.find().select('name');
    const filteredResults = restaurants.filter(each => each.name.toLowerCase().startsWith(letterParam));
    const lettersArray = await restaurants
        .reduce(( acc, curr ) => !acc.includes(curr.name.charAt(0)) ? acc.concat(curr.name.charAt(0)) : '', [])
        .sort((a, b) => a > b);
    res.render('menus', { title: `Menus by ${req.params.letter}`, restaurants, lettersArray, filteredResults });
}

exports.addMenuItem = (req, res) => {
    console.log(req.body)
    // req.body.author = req.user._id;
    // req.body.restaurant = req.params.id;
    // const newMenu = new Menu(req.body);
    // await newMenu.save();
    // req.flash('success', 'Nice! Menu updated!');
    // res.redirect('back');
}