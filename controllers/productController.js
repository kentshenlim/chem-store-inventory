const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const Product = require('../models/product');
const Chemical = require('../models/chemical');

// For parsing multipart form later, multipart form should be parsed before
// validation
const sdsMaxSize = 1 * 10 ** 6; // 1 MB
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory, not disk, as buffer
  limits: { fileSize: sdsMaxSize }, // 1 MB
});

// Validator functions that will be used when creating and updating Product
// instance
const formValidatorFunctions = [
  body('chemical', 'Chemical must be specified').trim().isLength({ min: 1 }),
  body('sku')
    .trim()
    .custom(async (value, { req }) => {
      const exist = await Product.findOne({ sku: value }).exec();
      if (exist) {
        if (!req.params.id) throw new Error('SKU is already in use'); // Create, must not exist
        // Otherwise, updating, will only accept if same document (click update
        // then save without changing)
        if (req.params.id !== exist._id.toString()) { throw new Error('SKU is already in use'); }
      }
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
  body('sds', 'File type must be pdf') // Validator to check file type
    .custom((_, { req }) => {
      if (!req.file) return true; // Accept no file
      return req.file.mimetype === 'application/pdf';
    }),
];

// Middlewares
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
    upload.single('sds'), // Multer must be used before validation to parse multipart form correctly
    ...formValidatorFunctions, // Multipart form has been parsed, can validate the body as usual
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
      if (req.file && !req.body.noSds) productObj.sds = req.file.buffer; // Store the buffer into DB
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
    const { id } = req.params;
    const [productOld, allChemicals] = await Promise.all([
      Product.findById(id).exec(),
      Chemical.find({}, { name: 1 }).sort({ name: 1 }).collation({ locale: 'en', strength: 2 }).exec(),
    ]);
    if (!productOld) {
      const err = new Error('ID does not match any product in database');
      err.status = 404;
      next(err);
      return;
    }
    if (productOld.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    res.render('product_create', {
      title: `Update Product: ${productOld.sku}`,
      allChemicals,
      product: productOld,
      isUpdating: true,
    });
  }),

  update_post: [
    upload.single('sds'),
    ...formValidatorFunctions,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const productOld = await Product.findById(id).exec();
      if (!productOld) {
        const err = new Error('ID does not match any product in database');
        err.status = 404;
        next(err);
        return;
      }
      if (productOld.isProtected) {
        res.render('access_denied', {
          title: 'Access Denied',
        });
        return;
      }
      next();
    }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const productObj = {
        chemical: req.body.chemical,
        sku: req.body.sku,
        description: req.body.description,
        _id: req.params.id,
      };
      if (req.body.packSize) productObj.packSize = req.body.packSize;
      if (req.body.price) productObj.price = req.body.price;
      if (req.body.numberInStock) productObj.numberInStock = req.body.numberInStock;
      // Remove any SDS
      if (req.body.noSds) productObj.$unset = { sds: 1 };
      // Not removing, and replacing
      else if (req.file) productObj.sds = req.file.buffer;
      // Otherwise, not removing, not replacing, do nothing, so no need update
      const product = new Product(productObj);
      if (!errors.isEmpty()) {
        const allChemicals = await Chemical.find({}, { name: 1 })
          .sort({ name: 1 })
          .collation({ locale: 'en', strength: 2 })
          .exec();
        res.render('product_create', {
          title: `Update Product: ${product.sku}`,
          allChemicals,
          product,
          errors: errors.mapped(),
          isUpdating: true,
        });
        return;
      }
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {}).exec();
      res.redirect(updatedProduct.url);
    }),
  ],

  delete_get: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).exec();
    if (!product) {
      res.redirect('/product');
      return;
    }
    if (product.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    res.render('product_delete', {
      title: `Delete Product: ${product.sku}`,
      product,
    });
  }),

  delete_post: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).exec();
    if (!product) {
      res.redirect('/product');
      return;
    }
    if (product.isProtected) {
      res.render('access_denied', {
        title: 'Access Denied',
      });
      return;
    }
    await Product.findByIdAndDelete(req.body.deleteId).exec();
    res.redirect('/product');
  }),

  sds_get: asyncHandler(async (req, res, next) => {
    // Send PDF
    const product = await Product.findById(req.params.id, { sds: 1 });
    if (!product) {
      const err = new Error('ID does not match any product in database');
      err.status = 404;
      next(err);
      return;
    }
    const pdfBuffer = product.sds;
    if (!pdfBuffer) {
      const err = new Error('Current product does not have sds in record');
      err.status = 404;
      next(err);
      return;
    }
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  }),
};
