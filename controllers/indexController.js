const asyncHandler = require('express-async-handler');
const Group = require('../models/group');
const Chemical = require('../models/chemical');
const Product = require('../models/product');

exports.index = asyncHandler(async (req, res, next) => {
  const [groupCount, chemicalCount, productCount] = await Promise.all([
    Group.countDocuments().exec(),
    Chemical.countDocuments().exec(),
    Product.countDocuments().exec(),
  ]);
  res.render('index', {
    title: 'ChemStore Inventory',
    groupCount,
    chemicalCount,
    productCount,
  });
});
