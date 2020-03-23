const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true)
        } else {
            next({ message: 'File type not allowed' }, false);
        }
    }
}

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

// Multer adds a body object and a file or files object to the request object.
exports.upload = multer(multerOptions).single('photo')
 
exports.resize = async (req, res, next) => {
    if(!req.file) {
        return next();
    }
    // Give unique id to each photo from all users, resize to something practical
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
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

exports.getRestaurantBySlug = async (req, res, next) => {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if(!restaurant) return next();
    res.render('restaurant', {
        title: restaurant.name,
        restaurant
    });
}

exports.getRestaurantsByTag = async (req, res) => {
    const tag = req.params.tag;
    const queryTag = tag || { $exists: true };
    const getTags = Restaurant.getTagsList();
    const getRestaurants = Restaurant.find({ tags: queryTag });
    const [tags, restaurants] = await Promise.all([getTags, getRestaurants]);
    res.render('tags', { title: 'Tags', restaurants, tags, tag });
}

exports.editRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findOne({ _id: req.params.id });
    res.render('updateRestaurant', {
        title: 'Update',
        restaurant
    })
}

exports.updateRestaurant = async (req, res) => {
    // Updating address wipes type in mongoose, so setting here 
    req.body.location.type = 'Point'
    const restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec()
    req.flash('success', `Thanks! Updated ${restaurant.name}. <a href='/restaurants/${restaurant.slug}'>See update</a>`);
    res.redirect(`/restaurants/${restaurant._id}/edit`)
}