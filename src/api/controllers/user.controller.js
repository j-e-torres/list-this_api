const httpStatus = require('http-status');
const { User } = require('../models');
const APIError = require('../utils/APIError');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {
        users,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getLists = async (req, res, next) => {
  try {
    const user = await User.getUser(req.params.userId);

    const { lists } = user;

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {
        lists,
      },
    });
  } catch (error) {
    return next(error);
  }
};
