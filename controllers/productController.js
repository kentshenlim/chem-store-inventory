const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const Chemical = require('../models/chemical');

module.exports = {
  list_get: asyncHandler(async (req, res, next) => {
    // const allProducts = await Product.find({}, {
    //   chemical: 1, sku: 1, numberInStock: 1, added: 1,
    // }).sort({ added: -1 }).populate('chemical').exec();
    const page = req.params.page || 1;
    const paginateOption = {
      projection: {
        chemical: 1, sku: 1, numberInStock: 1, added: 1,
      },
      sort: { added: -1 },
      populate: 'chemical',
      limit: 8,
      page,
    };
    const paginateProducts = await Product.paginate({}, paginateOption);
    res.render('product_list', {
      title: 'All Products',
      paginateProducts,
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
    const allChemicals = await Chemical.find({}, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec();
    res.render('product_create', {
      title: 'Create New Product',
      allChemicals,
    });
  }),

  create_post: asyncHandler(async (req, res, next) => {
    console.log(req.body.chemical);
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
