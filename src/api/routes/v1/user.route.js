const router = require('express').Router();
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middleware/auth');

/*
 * /v1/users
 */

/*
 * Routes require Authenticated users
 */

router.use(authMiddleware.authenticate);

router.route('/').get(authMiddleware.authorize(), userController.getUsers);

router.route('/:userId/lists').get(userController.getLists);

module.exports = router;
