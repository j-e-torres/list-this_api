const router = require('express').Router();
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../middleware/auth')

// /v1/auth

router.route('/register').post(authController.register);

router.route('/login')
  .post(authController.login)
  .get(authenticate, authController.tokenLogin);


module.exports = router;
