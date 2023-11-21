/* eslint-disable jest/no-identical-title */
/* eslint-disable no-unused-vars */
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../app');
const { List, User } = require('../../models');
const { populateTestDB, cleanDB } = require('../utils');

describe('List API routes', () => {
  let newList;
  let newTasks;
  let adminAccessToken;
  let userAccessToken;
  let supermanAdmin;
  let wondergirl;
  let traderjoes;
  let keyfood;
  let apples;
  let oranges;

  beforeEach(async () => {
    newList = {
      listName: 'trader',
      listNotes: 'blah',
    };

    newTasks = [{ taskName: 'x' }, { taskName: 'y' }, { taskName: 't' }];

    const { tokens, users, lists, tasks } = await populateTestDB();

    [adminAccessToken, userAccessToken] = tokens;
    [supermanAdmin, wondergirl] = users;
    [traderjoes, keyfood] = lists;
    [apples, oranges] = tasks;
  });

  afterEach(async () => {
    // await cleanDB();
  });

  describe('GET routes', () => {
    describe('GET /v1/lists/:listId', () => {
      test('should get list with id', async () => {
        const res = await request(app)
          .get(`/v1/lists/${traderjoes.id}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          // .expect(httpStatus.OK);
        console.log('GETLISTEST', res.data);

        expect(res.body.data.list.id).toBe(traderjoes.id);
      });
    });

    describe('GET /v1/lists/:listId/users', () => {
      test('should get list with id with users', async () => {
        const res = await request(app)
          .get(`/v1/lists/${traderjoes.id}/users`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK);

        const resData = res.body.data;

        expect(resData.users[0].id).toBe(supermanAdmin.id);
      });
    });
  });

  describe('POST routes', () => {
    describe('POST /v1/lists', () => {
      test('Should be able to create a list with tasks when request is ok', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: newTasks,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.CREATED);

        const {
          data: { list },
        } = res.body;

        expect(list.listName).toBe(newList.listName);
        expect(list).toHaveProperty('tasks');
        expect(list.tasks).toHaveLength(3);
      });

      test('Should report error when `listname` or `listowner` is missing', async () => {
        newList.listOwner = wondergirl.username;
        newList.listName = '';

        const req = {
          list: {},
          tasks: newTasks,
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.message).toBe('List name required');
      });

      test('Should report error when `tasks` is not an array or an empty array', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: 'newTasks',
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.message).toBe('Tasks sent are invalid format');
      });

      test('Should report error when `tasks` do not have `taskName`', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: [''],
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.errors[0].message).toBe('Task name required');
      });
      test('Should report error when `tasks` do not have `taskName`', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: [''],
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send(req)
          .expect(httpStatus.BAD_REQUEST);

        expect(res.body.errors[0].message).toBe('Task name required');
      });
      test('Should report error when `token` is not valid', async () => {
        newList.listOwner = wondergirl.username;

        const req = {
          list: newList,
          tasks: [''],
        };

        const res = await request(app)
          .post('/v1/lists')
          .set('Authorization', `Bearer qqq`)
          .send(req)
          .expect(httpStatus.UNAUTHORIZED);

        expect(res.body.message).toBe('Invalid token');
      });
    });
  });

  describe('DELETE routes', () => {
    describe('DELETE /v1/lists/:listId', () => {
      test('Should be able to delete a list', async () => {
        await request(app)
          .delete(`/v1/lists/${traderjoes.id}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NO_CONTENT);

        const lists = await List.findAll();
        expect(lists).toHaveLength(1);
      });
    });
  });

  describe('PUT routes', () => {
    describe('PUT /v1/lists/:listId/users', () => {
      test('`listOwner` should be able to add user to list', async () => {
        const req = {
          username: wondergirl.username,
          list: {
            listOwner: supermanAdmin.username,
          },
        };

        const res = await request(app)
          .put(`/v1/lists/${traderjoes.id}/users`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(req)
          .expect(httpStatus.OK);
        expect(res.body.data.users).toHaveLength(2);
      });
    });
  });
});
