const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
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

  create_post: [
    body('chemical', 'Chemical must be specified')
      .trim()
      .isLength({ min: 1 }),
    body('sku')
      .trim()
      .custom(async (value) => {
        const exist = await Product.findOne({ sku: value }).exec();
        if (exist) throw new Error('SKU is already in use');
      })
      .withMessage('The SKU already exists in the database; create a new one.')
      .isLength({ min: 1 })
      .withMessage('SKU must not be empty')
      .isLength({ max: 20 })
      .withMessage('SKU cannot have more than 20 characters'),
    body('description')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Description must have at least 3 characters')
      .isLength({ max: 1000 })
      .withMessage('Description cannot have more than 1000 characters'),
    body('packSize')
      .trim()
      .optional({ values: 'falsy' })
      .isLength({ max: 20 })
      .withMessage('Pack size cannot have more than 20 characters'),
    body('price')
      .trim()
      .optional({ values: 'falsy' })
      .isLength({ max: 15 })
      .withMessage('Price cannot have more than 15 characters'),
    body('numberInStock')
      .trim()
      .optional({ values: 'falsy' })
      .isNumeric()
      .withMessage('Stock must have digits only')
      .isLength({ max: 15 })
      .withMessage('Stock cannot have more than 15 characters'),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      // Compulsory field first
      const productObj = {
        chemical: req.body.chemical,
        sku: req.body.sku,
        description: req.body.description,
      };
      // Optional fields, add only if not undefined
      if (req.body.packSize) productObj.packSize = req.body.packSize;
      if (req.body.price) productObj.price = req.body.price;
      if (req.body.numberInStock) productObj.numberInStock = req.body.numberInStock;
      const product = new Product(productObj);
      if (!errors.isEmpty()) {
        const allChemicals = await Chemical.find({}, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec();
        res.render('product_create', {
          title: 'Create New Product',
          allChemicals,
          product,
          errors: errors.mapped(),
        });
        return;
      }
      await product.save();
      res.redirect(product.url);
    }),
  ],

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
