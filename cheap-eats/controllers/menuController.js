const mongoose = require('mongoose');
const Menu = mongoose.model('Menu');
const Restaurant = mongoose.model('Restaurant');

exports.getMenus = async (req, res) => {
    const restaurants = await Restaurant.find();
    res.render('menus', { title: 'Menus', restaurants });
    // req.body.author = req.user._id;
    // req.body.restaurant = req.params.id;
    // const newMenu = new Menu(req.body);
    // await newMenu.save();
    // req.flash('success', 'Nice! Menu updated!');
    // res.redirect('back');
};

exports.addMenuItem = (req, res) => {
    console.log(req.body)
}