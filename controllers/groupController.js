const asyncHandler = require('express-async-handler');
const Group = require('../models/group');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allGroups = await Group.find().sort({ name: 1 }).exec();
    res.render('group_list', {
      title: 'All Functional Groups',
      allGroups,
    });
  }),

  details_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: GET group detail for id ${req.params.id}`);
  }),

  create_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group create form');
  }),

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group delete form');
  }),
};
