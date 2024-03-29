const httpStatus = require('http-status');
const { Task, List } = require('../models');
const APIError = require('../utils/APIError');

exports.createTask = async (req, res, next) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length < 1) {
    return next(
      new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Tasks sent are invalid format`,
        isPublic: true,
      })
    );
  }

  try {
    const createdTasks = await Task.createTasks(req.body);

    return res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      data: {
        tasks: createdTasks,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.getTask(req.params.taskId);
    await task.completeTask();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: {
        task,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.getTask(req.params.taskId);

    await Task.destroy({ where: { id: req.params.taskId } });

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: 'Successfully deleted',
      data: {
        task
      }
    });
  } catch (error) {
    return next(error);
  }
};
