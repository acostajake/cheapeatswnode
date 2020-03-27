const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');

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
};

exports.homePage = (req, res) => {
    res.render('restaurants', {
        title: 'Home'
    });
};

exports.addRestaurant = (req, res) => {
    res.render('updateRestaurant', {
        title: 'Add'
    });
};

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
};

exports.createRestaurant = async (req, res) => {
    req.body.author = req.user._id;
    const restaurant = await new Restaurant(req.body).save();
    req.flash('success', `Successfully added ${restaurant.name}! Add a review!`)
    res.redirect(`/restaurant/${restaurant.slug}`);
};

exports.getRestaurants = async (req, res) => {
    const page = req.params.page || 1;
    const limit = 6;
    const skip = (page * limit) - limit;
    const restaurantsPromise = Restaurant
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });
    const countPromise = Restaurant.count();
    const [restaurants, count] = await Promise.all([restaurantsPromise, countPromise])
    const pages = Math.ceil(count / limit);
    if(!restaurants.length && skip) {
        req.flash('info', `Page ${page} not found. Redirected to ${pages} of ${pages}`);
        res.redirect(`/restaurants/page/${pages}`);
    }
    res.render('restaurants', {
        title: 'Update',
        count,
        page, 
        pages, 
        restaurants
    });
};

exports.getRestaurantBySlug = async (req, res, next) => {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug })
        .populate('author reviews');
    if(!restaurant) return next();
    res.render('restaurant', {
        title: restaurant.name,
        restaurant
    });
};

exports.getRestaurantsByTag = async (req, res) => {
    const tag = req.params.tag;
    const queryTag = tag || { $exists: true };
    const getTags = Restaurant.getTagsList();
    const getRestaurants = Restaurant.find({ tags: queryTag });
    const [tags, restaurants] = await Promise.all([getTags, getRestaurants]);
    res.render('tags', { title: 'Tags', restaurants, tags, tag });
};

const confirmAuthor = (restaurant, user) => {
    if(!restaurant.author.equals(user._id)) {
        throw Error('You can only edit a place you added.')
    }
};

exports.editRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findOne({ _id: req.params.id });
    confirmAuthor(restaurant, req.user);
    
    res.render('updateRestaurant', {
        title: 'Update',
        restaurant
    });
};

exports.updateRestaurant = async (req, res) => {
    // Updating address wipes type in mongoose, so setting here 
    req.body.location.type = 'Point'
    const restaurant = await Restaurant.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec()
    req.flash('success', `Thanks! Updated ${restaurant.name}. <a href='/restaurants/${restaurant.slug}'>See update</a>`);
    res.redirect(`/restaurants/${restaurant._id}/edit`)
};

exports.search = async (req, res) => {
    const restaurants = await Restaurant
    .find({
        $text: { $search: req.query.q }
    }, {
        score: { $meta: 'textScore' }
    }).sort({
        score: { $meta: 'textScore' }
    }).limit(8);
    res.json(restaurants);
};

exports.searchNearby = async (req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const queryData = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // = 10km or 6.2mi
            }
        }
    }
    const restaurants = await Restaurant
        .find(queryData)
        .select('slug name description location photo')
        .limit(8);
    res.json(restaurants);
};

exports.getMap = (req, res) => {
    res.render('map', { title: 'Map' });
}

exports.likePlace = async (req, res) => {
    const likes = req.user.likes.map(obj => obj.toString());
    const operator = likes.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { [operator]: { likes: req.params.id }},
        { new: true }
    );
    res.json(user);
};

exports.getLikes = async (req, res) => {
    const restaurants = await Restaurant.find({
        _id: { $in: req.user.likes }
    });
    res.render('restaurants', { title: 'My Favorites', restaurants });
};

exports.getTop = async (req, res) => {
    const restaurants = await Restaurant.getTopList();
    res.render('topPlaces', { restaurants, title: 'Best of Cheap Eats!' })
};