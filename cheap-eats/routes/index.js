const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const restaurantController = require('../controllers/restaurantController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(restaurantController.getRestaurants));

router.get('/add', authController.isLoggedIn, restaurantController.addRestaurant);
router.post('/add', 
    restaurantController.upload,
    catchErrors(restaurantController.resize),
    catchErrors(restaurantController.createRestaurant));
router.post('/add/:id',
    restaurantController.upload,
    catchErrors(restaurantController.resize),
    catchErrors(restaurantController.updateRestaurant));

router.get('/map', restaurantController.getMap);

router.get('/restaurants', catchErrors(restaurantController.getRestaurants));
router.get('/restaurants/:id/edit', catchErrors(restaurantController.editRestaurant));
router.get('/restaurants/page/:page', catchErrors(restaurantController.getRestaurants));
router.get('/restaurant/:slug', catchErrors(restaurantController.getRestaurantBySlug));

router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/tags', catchErrors(restaurantController.getRestaurantsByTag))
router.get('/tags/:tag', catchErrors(restaurantController.getRestaurantsByTag))

// auth routes
router.get('/login', userController.logInUser);
router.post('/login', authController.logInAuth)

router.get('/signup', userController.signup);
router.post('/signup',
    userController.validateSignup,
    userController.addUserToDB,
    authController.logInAuth
);

router.get('/logout', authController.logOut);

router.get('/account', authController.isLoggedIn, userController.viewAccount);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgotPassword));
router.get('/account/reset/:token', catchErrors(authController.resetPassword));
router.post('/account/reset/:token',
    authController.checkPasswords,
    catchErrors(authController.updatePasswords)
);

router.get('/likes', authController.isLoggedIn, catchErrors(restaurantController.getLikes));

router.get('/top', catchErrors(restaurantController.getTop));

// handle API
router.get('/api/search', catchErrors(restaurantController.search));

router.get('/api/restaurants/near', catchErrors(restaurantController.searchNearby));

router.post('/api/restaurants/:id/like', catchErrors(restaurantController.likePlace))

module.exports = router;
 