const asyncHandler = require('express-async-handler');
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

  create_post: asyncHandler(async (req, res, next) => {
    console.log(req.body.groups);
    res.send('NOT IMPLEMENTED: POST chemical create form');
  }),

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
