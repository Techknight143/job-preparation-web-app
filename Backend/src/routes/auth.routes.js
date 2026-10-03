const express = require('express');
const authController = require('../controllers/auth.conroller');
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access Public
 */

router.post("/register" ,authController.registerUserController );

/**
 * @route POST /api/auth/login
 * @description login a user
 * @access Public
 */
router.post("/login" ,authController.loginUserController );


/**
 * @route GET /api/auth/logout
 * @description clear token from the user cookie and add the token in blacklist
 * @access Public
 */
router.get("/logout",authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description get a user
 * @access private
 */
router.get("/get-me",authMiddleware.authUser,authController.getMeController);
module.exports = router;
