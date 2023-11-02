const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Group = require('../models/group');
const Chemical = require('../models/chemical');

// Validator functions that will be used when creating and updating Group
// instance
const formValidatorFunctions = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Functional group name must not be empty')
    .isLength({ max: 100 })
    .withMessage('Functional group name cannot have more than 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description must not be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot have more than 1000 characters'),

  body('wikiUrl', 'Wiki URL must be valid URL, starting with "https://"')
    .trim()
    .optional({ values: 'falsy' })
    .isURL({ protocols: ['https'] }),
];

// Middlewares
module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allGroups = await Group.find().collation({ locale: 'en' }).sort({ name: 1 }).exec();
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

  create_get: (req, res, next) => {
    res.render('group_create', {
      title: 'Create New Group',
    });
  },

  create_post: [
    ...formValidatorFunctions,
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const group = new Group({
        name: req.body.name,
        description: req.body.description,
        wikiUrl: req.body.wikiUrl,
      });
      if (!errors.isEmpty()) {
        res.render('group_create', {
          title: 'Create New Group',
          group,
          errors: errors.mapped(),
        });
        return;
      }
      const groupOld = await Group.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 }).exec();
      if (groupOld) res.redirect(groupOld.url);
      else {
        await group.save();
        res.redirect(group.url);
      }
    }),
  ],

  update_get: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const groupOld = await Group.findById(id).exec();
    if (!groupOld) {
      const err = new Error('ID does not match any group in database');
      err.status = 404;
      next(err);
      return;
    }
    res.render('group_create', {
      title: `Edit: ${groupOld.name.toUpperCase()}`,
      group: groupOld,
      isUpdating: true,
    });
  }),

  update_post: [
  ],

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET group delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST group delete form');
  }),
};
