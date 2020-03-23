const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(restaurantController.getRestaurants));

router.get('/add', restaurantController.addRestaurant);

router.post('/add', 
    restaurantController.upload,
    catchErrors(restaurantController.resize),
    catchErrors(restaurantController.createRestaurant));

router.post('/add/:id',
    restaurantController.upload,
    catchErrors(restaurantController.resize),
    catchErrors(restaurantController.updateRestaurant));

router.get('/restaurant/:slug', catchErrors(restaurantController.getRestaurantBySlug));

router.get('/restaurants', catchErrors(restaurantController.getRestaurants));
router.get('/restaurants/:id/edit', catchErrors(restaurantController.editRestaurant));

router.get('/tags', catchErrors(restaurantController.getRestaurantsByTag))
router.get('/tags/:tag', catchErrors(restaurantController.getRestaurantsByTag))

module.exports = router;
 