const asyncHandler = require('express-async-handler');
const Group = require('../models/group');
const Chemical = require('../models/chemical');
const Product = require('../models/product');

exports.index = asyncHandler(async (req, res, next) => {
  const [groupCount, chemicalCount, productCount, recentProducts] = await Promise.all([
    Group.countDocuments().exec(),
    Chemical.countDocuments().exec(),
    Product.countDocuments().exec(),
    Product.find({}, { chemical: 1, sku: 1, added: 1 }).sort({ added: -1 }).limit(5).populate('chemical')
      .exec(),
  ]);
  res.render('index', {
    title: 'ChemStore Inventory',
    groupCount,
    chemicalCount,
    productCount,
    recentProducts,
  });
});
