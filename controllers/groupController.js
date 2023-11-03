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
    if (groupOld.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    res.render('group_create', {
      title: `Edit Group: ${groupOld.name.toUpperCase()}`,
      group: groupOld,
      isUpdating: true,
    });
  }),

  update_post: [
    ...formValidatorFunctions,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const groupOld = await Group.findById(id).exec();
      if (!groupOld) {
        const err = new Error('ID does not match any group in database');
        err.status = 404;
        next(err);
        return;
      }
      if (groupOld.isProtected) {
        res.render('access_denied', {
          title: 'Access Denied',
        });
        return;
      }
      next();
    }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const group = new Group({
        name: req.body.name,
        description: req.body.description,
        wikiUrl: req.body.wikiUrl,
        _id: req.params.id,
      });
      if (!errors.isEmpty()) {
        res.render('group_create', {
          title: `Edit Group: ${group.name.toUpperCase()}`,
          group,
          errors: errors.mapped(),
          isUpdating: true,
        });
        return;
      }
      const updatedGroup = await Group.findByIdAndUpdate(req.params.id, group, {}).exec();
      res.redirect(updatedGroup.url);
    }),
  ],

  delete_get: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const [group, groupChemicals] = await Promise.all([
      Group.findById(id).exec(),
      Chemical.find({ groups: id }, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec(),
    ]);
    if (!group) { // If group to be deleted does not exist, just redirect to the list (job done)
      res.redirect('/group');
      return;
    }
    if (group.isProtected) { // If group to be deleted is sample document
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    res.render('group_delete', {
      title: `Delete Group: ${group.name.toUpperCase()}`,
      group,
      groupChemicals,
    });
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    // Need to check again; someone might have added new chemical after GET
    // before POST
    const { id } = req.params;
    const group = await Group.findById(id).exec();
    if (!group) {
      res.redirect('/group');
      return;
    }
    if (group.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    await Group.findByIdAndRemove(req.body.deleteId).exec();
    res.redirect('/group');
  }),
};
