const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Chemical = require('../models/chemical');
const Product = require('../models/product');
const Group = require('../models/group');

// Validator functions that will be used when creating and updating Chemical
// instance
const formValidatorFunctions = [
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
    .withMessage('Chemical formula cannot have more than 100 characters')
    .escape(), // Need to escape because will have to use unescaped version in pug
  body('casNo')
    .trim()
    .isLength({ min: 1 })
    .withMessage('CAS registry number must not be empty')
    .isLength({ max: 12 })
    .withMessage('CAS registry number cannot have more than 12 characters'),
  body('mW').trim().isNumeric().withMessage('Molar mass must be number'),
];

// Middlewares
module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    // const allChemicals = await Chemical.find({}, { groups: 0 }).sort({ name:
    // 1 }).populate('groups').exec();
    const page = req.params.page || 1;
    const paginateOption = {
      projection: { groups: 0 },
      sort: { name: 1 },
      collation: { locale: 'en', strength: 2 },
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
      Product.find({ chemical: req.params.id }, { sku: 1 }).exec(),
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
    const allGroups = await Group.find({}, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec();
    res.render('chemical_create', {
      title: 'Create New Chemical',
      allGroups,
    });
  }),

  create_post: [
    ...formValidatorFunctions,
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
    const { id } = req.params;
    const [chemicalOld, allGroups] = await Promise.all([
      Chemical.findById(id).exec(),
      Group.find({}, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec(),
    ]);
    if (!chemicalOld) {
      const err = new Error('ID does not match any chemical in database');
      err.status = 404;
      next(err);
      return;
    }
    if (chemicalOld.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    // Mark selected group before rendering to populate groups with selected
    // groups
    const checkedGroups = chemicalOld.groups.map((_id) => _id.toString());
    for (let i = 0; i < allGroups.length; i += 1) {
      const group = allGroups[i];
      if (checkedGroups.indexOf(group._id.toString()) !== -1) group.checked = true;
    }
    res.render('chemical_create', {
      title: `Update Chemical: ${chemicalOld.name.toUpperCase()}`,
      allGroups,
      chemical: chemicalOld,
      isUpdating: true,
    });
  }),

  update_post: [
    ...formValidatorFunctions,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const chemicalOld = await Chemical.findById(id).exec();
      if (!chemicalOld) {
        const err = new Error('ID does not match any chemical in database');
        err.status = 404;
        next(err);
        return;
      }
      if (chemicalOld.isProtected) {
        res.render('access_denied', {
          title: 'Access Denied',
        });
        return;
      }
      next();
    }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const chemical = new Chemical({
        name: req.body.name,
        formula: req.body.formula,
        casNo: req.body.casNo,
        mW: req.body.mW,
        groups: req.body.groups,
        _id: req.params.id,
      });
      if (!errors.isEmpty()) {
        const allGroups = await Group.find({}, { name: 1 })
          .sort({ name: 1 })
          .exec();
        const checkedGroups = req.body.groups;
        for (let i = 0; i < allGroups.length; i += 1) {
          const group = allGroups[i];
          if (checkedGroups.indexOf(group._id.toString()) !== -1) group.checked = true;
        }
        res.render('chemical_create', {
          title: `Update Chemical: ${chemical.name.toUpperCase()}`,
          errors: errors.mapped(),
          allGroups,
          chemical,
          isUpdating: true,
        });
        return;
      }
      const updatedChemical = await Chemical.findByIdAndUpdate(req.params.id, chemical, {}).exec();
      res.redirect(updatedChemical.url);
    }),
  ],

  delete_get: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const [chemical, chemicalProducts] = await Promise.all([
      Chemical.findById(id).exec(),
      Product.find({ chemical: id }, { sku: 1 }).exec(),
    ]);
    if (!chemical) {
      res.redirect('/chemical');
      return;
    }
    if (chemical.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    res.render('chemical_delete', {
      title: `Delete Chemical: ${chemical.name.toUpperCase()}`,
      chemical,
      chemicalProducts,
    });
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const chemical = await Chemical.findById(id);
    if (!chemical) {
      res.redirect('/chemical');
      return;
    }
    if (chemical.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    await Chemical.findByIdAndRemove(req.body.deleteId).exec();
    res.redirect('/chemical');
  }),
};
