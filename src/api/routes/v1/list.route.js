const router = require('express').Router();
const listController = require('../../controllers/list.controller');
const authMiddleware = require('../../middleware/auth');

/*
 * /v1/lists
 */

/*
 * Authenticated routes below
 */
router.use(authMiddleware.authenticate);

router.route('/').post(listController.createList);

router.route('/:listId').delete(listController.deleteList).get(listController.getList);

router.route('/:listId/users').put(listController.addUser);

module.exports = router;
