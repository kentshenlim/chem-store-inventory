const asyncHandler = require('express-async-handler');
const Group = require('../models/group');
const Chemical = require('../models/chemical');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allGroups = await Group.find().sort({ name: 1 }).exec();
    res.render('group_list', {
      title: 'All Functional Groups',
      allGroups,
    });
  }),

  details_get: asyncHandler(async (req, res, next) => {
    const [group, groupChemicals] = await Promise.all([
      Group.findById(req.params.id).exec(),
      Chemical.find({ groups: req.params.id }).exec(),
    ]);
    if (!group) {
      const err = new Error('Group ID Not Found');
      err.status = 404;
      next(err);
      return;
    }
    const groupName = group.name.toUpperCase();
    res.render('group_details', {
      title: `Functional Group: ${groupName}`,
      group,
      groupChemicals,
    });
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
