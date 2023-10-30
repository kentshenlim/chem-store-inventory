const asyncHandler = require('express-async-handler');
const Chemical = require('../models/chemical');
const Product = require('../models/product');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allChemicals = await Chemical.find({}, { groups: 0 }).sort({ name: 1 }).populate('groups').exec();
    res.render('chemical_list', {
      title: 'All Chemicals',
      allChemicals,
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
    res.send('NOT IMPLEMENTED: GET chemical create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
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
