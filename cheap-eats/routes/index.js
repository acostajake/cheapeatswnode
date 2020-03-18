const express = require('express');
const storeController = require('../controllers/storeController')
const router = express.Router();

// Routes
router.get('/', storeController.myMiddleware, storeController.homePage)

module.exports = router;
 