const asyncHandler = require('express-async-handler');
const Product = require('../models/product');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find({}, {
      chemical: 1, sku: 1, numberInStock: 1, added: 1,
    }).sort({ added: -1 }).populate('chemical').exec();
    res.render('product_list', {
      title: 'All Products',
      allProducts,
    });
  }),

  details_get: asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('chemical').exec();
    if (!product) {
      const err = new Error('Product ID Not Found');
      err.status = 404;
      next(err);
      return;
    }
    res.render('product_details', {
      title: `Product: ${product.sku}`,
      product,
    });
  }),

  create_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product create form');
  }),

  create_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product create form');
  }),

  update_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product update form');
  }),

  update_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product update form');
  }),

  delete_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: GET product delete form');
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: POST product delete form');
  }),
};
