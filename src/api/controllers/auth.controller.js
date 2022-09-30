const httpStatus = require('http-status');
const { User } = require('../models');
const APIError = require('../utils/APIError');
const { jwtSecret } = require('../../config/vars');
const jwt = require('jwt-simple');

const createResponseToken = (user, accessToken) => {
  const tokenType = 'Bearer';
  // const refreshToken = RefreshToken.generate(user).token;
  // const expiresIn = moment().add(jwtExpirationInterval, 'minutes');

  return {
    tokenType,
    accessToken,
    // refreshToken,
    // expiresIn,
  };
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = createResponseToken(user, user.token());

    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    return next(User.checkDuplicateUsername(error));
  }
};

exports.login = async (req, res, next) => {

  try {
    const { user, accessToken } = await User.authenticate(req.body);

    if (!user) {
      return next(new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'User not found with credentials',
        isPublic: true,
      }));
    }

    const token = createResponseToken(user, accessToken);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.tokenLogin = async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    status: httpStatus.OK,
    data: {
      user: req.user,
    },
  });
}
