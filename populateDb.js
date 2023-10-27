#! /usr/bin/env node

/*
This script populates some chemicals, products, and groups to database.
Specified DB connection string as argument - e.g.: node populateDb
"mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/database_name?retryWrites=true&w=majority"
*/
/*
This file should not be included in production
*/

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Get models to manipulate with collections
const mongoose = require('mongoose');
const Chemical = require('./models/chemical');
const Product = require('./models/product');
const Group = require('./models/group');

// Connection preparation and data population
const chemicals = []; // Array of document created, to get id for referencing
const products = [];
const groups = [];
mongoose.set('strictQuery', false); // Prepare for Mongoose 7
const mongoDB = userArgs[0];

// Document creators
// Must pass idx so that can tell which document is which
// Otherwise order will jumble as the order of promise resolve is not known
async function createChemical({
  name,
  formula,
  casNo,
  mW,
  groupArr,
}, idx) {
  const chemical = new Chemical({
    name, formula, casNo, mW, groups: groupArr,
  });
  await chemical.save();
  chemicals[idx] = chemical;
  console.log(`Added chemical: ${name}`);
}

async function createProduct({
  chemical,
  sku,
  description,
  numberInStock,
  packSize,
  price,
  added,
}, idx) {
  const product = new Product({
    chemical, sku, description, numberInStock, packSize, price, added,
  });
  await product.save();
  products[idx] = product;
  console.log(`Added product: ${sku}`);
}

async function createGroup({ name, description, wikiUrl }, idx) {
  const group = new Group({ name, description, wikiUrl });
  await group.save();
  groups[idx] = group;
  console.log(`Added group: ${name}`);
}

// Functions to actually create sample documents
// Chemical refers to Group, Product refers to Chemical
// Must be called in the order: Group → Chemical → Product

async function createGroupSampleDocuments() {
  console.log('Adding groups');
  await Promise.all([
    createGroup(
      {
        name: 'alcohol',
        description:
          'Alcohol is an organic compound characterized by its structure, which includes a hydroxyl (-OH) functional group attached to a carbon atom. The alkyl group, denoted by "R", varies among different types of alcohols, such as methyl, ethyl, or propyl alcohols. Alcohols have a wide range of applications, serving as solvents, disinfectants, and key components in the production of alcoholic beverages. Their unique properties include the ability to form hydrogen bonds, which affects their physical characteristics and chemical reactivity.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alcohol_(chemistry)',
      },
      0,
    ),
    createGroup(
      {
        name: 'alkane',
        description:
          'Alkane is a type of organic compound consisting of carbon and hydrogen atoms. They have a simple structure with single covalent bonds between carbon atoms, are saturated hydrocarbons (CnH2n+2), and are found in fossil fuels. Their stable structure makes them valuable as energy sources and fuels.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alkane',
      },
      1,
    ),
    createGroup(
      {
        name: 'alkene',
        description:
          'Alkene is an organic compound featuring a unique double bond (C=C) between two carbon atoms. The general formula for alkenes is CnH2n. This double bond introduces reactivity, enabling alkenes to undergo addition reactions with other molecules, making them crucial in the synthesis of various organic compounds. They are commonly used in the production of plastics, polymers, and as intermediates in the manufacture of chemicals, such as ethanol and ethylene.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alkene',
      },
      2,
    ),
    createGroup(
      {
        name: 'carboxylic acid',
        description:
        'Carboxylic Acid is an organic compound characterized by the presence of a carboxyl functional group (-COOH), which consists of a carbonyl group (C=O) and a hydroxyl group (-OH) bonded to the same carbon atom. Carboxylic acids are versatile and crucial in various biological, chemical, and industrial processes. They often act as acids, readily donating protons (H+) and forming carboxylate anions. Common applications include their role as organic solvents, preservatives in food, and intermediates in the synthesis of pharmaceuticals, perfumes, and plastics.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Carboxylic_acid',
      },
      3,
    ),
  ]);
}

async function createChemicalSampleDocuments() {
  console.log('Adding chemicals');
  await Promise.all([
    createChemical(
      {
        name: 'ethanol',
        formula: 'CH3CH2OH',
        casNo: '64-17-5',
        mW: 46.07,
        groupArr: [groups[0]], // Or groups[0]._id? Not sure here, think Mongoose will handle that
      },
      0,
    ),
    createChemical(
      {
        name: '1-propanol',
        formula: 'CH3CH2CH2OH',
        casNo: '71-23-8',
        mW: 60.1,
        groupArr: [groups[0]],
      },
      1,
    ),
    createChemical(
      {
        name: 'propane',
        formula: 'CH3CH2CH3',
        casNo: '74-98-6',
        mW: 44.1,
        groupArr: [groups[1]],
      },
      2,
    ),
    createChemical(
      {
        name: 'ethylene',
        formula: 'CH2=CH2',
        casNo: '74-85-1',
        mW: 28.05,
        groupArr: [groups[1]._id, groups[2]._id],
      },
      3,
    ),
  ]);
}

async function createProductSampleDocuments() {
  console.log('Adding products');
  await Promise.all([
    createProduct(
      {
        chemical: chemicals[0],
        sku: '493511',
        description: '190 proof, ACS spectrophotometric grade, 95.0%',
        numberInStock: 201,
        packSize: '1 L',
        price: 'USD 182.27',
      },
      0,
    ),
    createProduct(
      {
        chemical: chemicals[0],
        sku: 'E7023',
        description: '200 proof, for molecular biology',
        numberInStock: 102,
        packSize: '500 mL',
        price: 'USD 110.70',
      },
      1,
    ),
    createProduct(
      {
        chemical: chemicals[1],
        sku: 'PHR1208',
        description:
          'Pharmaceutical Secondary Standard; Certified Reference Material',
        numberInStock: 42,
        packSize: '3x 1.2 mL',
        price: 'USD 57.44',
      },
      2,
    ),
  ]);
}

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createGroupSampleDocuments(); // Group first
  await createChemicalSampleDocuments(); // Chemical second
  await createProductSampleDocuments(); // Product last
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
