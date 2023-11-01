const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Chemical = require('../models/chemical');
const Product = require('../models/product');
const Group = require('../models/group');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    // const allChemicals = await Chemical.find({}, { groups: 0 }).sort({ name:
    // 1 }).populate('groups').exec();
    const page = req.params.page || 1;
    const paginateOption = {
      projection: { groups: 0 },
      sort: { name: 1 },
      limit: 8,
      page,
    };
    const paginateChemicals = await Chemical.paginate({}, paginateOption);
    res.render('chemical_list', {
      title: 'All Chemicals',
      paginateChemicals,
    });
  }),

  details_get: asyncHandler(async (req, res, next) => {
    const [chemical, chemicalProducts] = await Promise.all([
      Chemical.findById(req.params.id).populate('groups').exec(),
      Product.find({ chemical: req.params.id }).exec(),
    ]);
    if (!chemical) {
      const err = new Error('Chemical ID Not Found');
      err.status = 404;
      next(err);
    }
    const chemicalName = chemical.name.toUpperCase();
    res.render('chemical_details', {
      title: `Chemical: ${chemicalName}`,
      chemical,
      chemicalProducts,
    });
  }),

  create_get: asyncHandler(async (req, res, next) => {
    const allGroups = await Group.find({}, { name: 1 }).sort({ name: 1 }).exec();
    res.render('chemical_create', {
      title: 'Create New Chemical',
      allGroups,
    });
  }),

  create_post: [
    (req, res, next) => {
      if (!Array.isArray(req.body.groups)) {
        if (req.body.groups === undefined) req.body.groups = [];
        else req.body.groups = new Array(req.body.groups);
      }
      next();
    },
    body('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Chemical name must not be empty')
      .isLength({ max: 100 })
      .withMessage('Chemical group name cannot have more than 100 characters'),
    body('formula')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Chemical formula must not be empty')
      .isLength({ max: 100 })
      .withMessage('Chemical formula cannot have more than 100 characters'),
    body('casNo')
      .trim()
      .isLength({ min: 1 })
      .withMessage('CAS registry number must not be empty')
      .isLength({ max: 12 })
      .withMessage('CAS registry number cannot have more than 12 characters'),
    body('mW')
      .trim()
      .isNumeric()
      .withMessage('Molar mass must be number'),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const chemical = new Chemical({
        name: req.body.name,
        formula: req.body.formula,
        casNo: req.body.casNo,
        mW: req.body.mW,
        groups: req.body.groups,
      });
      if (!errors.isEmpty()) {
        const allGroups = await Group.find({}, { name: 1 }).sort({ name: 1 }).exec();
        const checkedGroups = req.body.groups;
        for (let i = 0; i < allGroups.length; i += 1) {
          const group = allGroups[i];
          if (checkedGroups.indexOf(group._id.toString()) !== -1) group.checked = true;
        }
        res.render('chemical_create', {
          title: 'Create New Chemical',
          errors: errors.mapped(),
          allGroups,
          chemical,
        });
        return;
      }
      const chemicalOld = await Chemical.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 }).exec();
      if (chemicalOld) res.redirect(chemicalOld.url);
      else {
        await chemical.save();
        res.redirect(chemical.url);
      }
    }),
  ],

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET chemical update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST chemical update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET chemical delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST chemical delete form');
  }),
};
