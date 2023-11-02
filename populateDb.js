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
  isProtected,
}, idx) {
  const chemical = new Chemical({
    name, formula, casNo, mW, groups: groupArr, isProtected,
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
  isProtected,
}, idx) {
  const product = new Product({
    chemical, sku, description, numberInStock, packSize, price, added, isProtected,
  });
  await product.save();
  products[idx] = product;
  console.log(`Added product: ${sku}`);
}

async function createGroup({
  name, description, wikiUrl, isProtected,
}, idx) {
  const group = new Group({
    name, description, wikiUrl, isProtected,
  });
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
        isProtected: true,
      },
      0,
    ),
    createGroup(
      {
        name: 'alkane',
        description:
          'Alkane is a type of organic compound consisting of carbon and hydrogen atoms. They have a simple structure with single covalent bonds between carbon atoms, are saturated hydrocarbons (CnH2n+2), and are found in fossil fuels. Their stable structure makes them valuable as energy sources and fuels.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alkane',
        isProtected: true,
      },
      1,
    ),
    createGroup(
      {
        name: 'alkene',
        description:
          'Alkene is an organic compound featuring a unique double bond (C=C) between two carbon atoms. The general formula for alkenes is CnH2n. This double bond introduces reactivity, enabling alkenes to undergo addition reactions with other molecules, making them crucial in the synthesis of various organic compounds. They are commonly used in the production of plastics, polymers, and as intermediates in the manufacture of chemicals, such as ethanol and ethylene.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alkene',
        isProtected: true,
      },
      2,
    ),
    createGroup(
      {
        name: 'carboxylic acid',
        description:
          'Carboxylic Acid is an organic compound characterized by the presence of a carboxyl functional group (-COOH), which consists of a carbonyl group (C=O) and a hydroxyl group (-OH) bonded to the same carbon atom. Carboxylic acids are versatile and crucial in various biological, chemical, and industrial processes. They often act as acids, readily donating protons (H+) and forming carboxylate anions. Common applications include their role as organic solvents, preservatives in food, and intermediates in the synthesis of pharmaceuticals, perfumes, and plastics.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Carboxylic_acid',
        isProtected: true,
      },
      3,
    ),
    createGroup(
      {
        name: 'amine',
        description:
          'Amines are organic compounds characterized by the presence of an amino functional group (-NH2). They are derivatives of ammonia (NH3) in which one or more hydrogen atoms have been replaced by organic groups. Amines are important in various chemical reactions, serving as building blocks for amino acids, proteins, and pharmaceuticals. They can be classified as primary, secondary, or tertiary amines based on the number of organic groups attached to the nitrogen atom.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Amine',
        isProtected: true,
      },
      4,
    ),
    createGroup(
      {
        name: 'ester',
        description:
          "Esters are organic compounds formed by the reaction of a carboxylic acid and an alcohol. They are characterized by a carbonyl group (C=O) and an ether group (R-O-R'). Esters are known for their pleasant, fruity odors and are often found in essential oils and fragrances. They are crucial in the production of flavorings, perfumes, and plastics.",
        wikiUrl: 'https://en.wikipedia.org/wiki/Ester',
        isProtected: true,
      },
      5,
    ),
    createGroup(
      {
        name: 'alkyne',
        description:
          'Alkynes are unsaturated hydrocarbons containing at least one carbon-carbon triple bond (C≡C). They are valuable in organic chemistry for their ability to participate in various reactions and serve as precursors in the synthesis of complex organic compounds. Alkynes are essential in the production of materials like plastics, adhesives, and pharmaceuticals.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Alkyne',
        isProtected: true,
      },
      6,
    ),
    createGroup(
      {
        name: 'amide',
        description:
          'Amides are organic compounds derived from carboxylic acids. They are characterized by the presence of a carbonyl group (C=O) and an amino group (NH2 or NR2) bonded to the same carbon atom. Amides play a vital role in biochemistry, serving as key components in the structure of proteins and peptides. They are also used in the synthesis of various pharmaceuticals, polymers, and agricultural chemicals.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Amide',
        isProtected: true,
      },
      7,
    ),
    createGroup(
      {
        name: 'lipid',
        description:
          'Lipids are a diverse class of organic compounds that are hydrophobic and insoluble in water. They play various essential roles in living organisms, including energy storage, cell membrane structure, and signaling. Lipids encompass a wide range of molecules, including triglycerides (fats and oils), phospholipids (major components of cell membranes), and sterols (such as cholesterol). Understanding lipids is crucial in the fields of nutrition, biology, and biochemistry.',
        wikiUrl: 'https://en.wikipedia.org/wiki/Lipid',
        isProtected: true,
      },
      8,
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
        isProtected: true,
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
        isProtected: true,
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
        isProtected: true,
      },
      2,
    ),
    createChemical(
      {
        name: 'ethylene',
        formula: 'CH2=CH2',
        casNo: '74-85-1',
        mW: 28.05,
        groupArr: [groups[1], groups[2]],
        isProtected: true,
      },
      3,
    ),
    createChemical(
      {
        name: '1-butanol',
        formula: 'CH3(CH2)3OH',
        casNo: '71-36-3',
        mW: 74.12,
        groupArr: [groups[0]],
        isProtected: true,
      },
      4,
    ),
    createChemical(
      {
        name: 'docosahexaenoic acid ethyl ester',
        formula: 'C24H36O2',
        casNo: '81926-94-5',
        mW: 356.54,
        groupArr: [groups[5]],
        isProtected: true,
      },
      5,
    ),
    createChemical(
      {
        name: 'sodium amide',
        formula: 'NaNH2',
        casNo: '7782-92-5',
        mW: 39.01,
        groupArr: [groups[7]],
        isProtected: true,
      },
      6,
    ),
    createChemical(
      {
        name: '(Δ9-Cis) PC (DOPC)',
        formula: 'C44H84NO8P',
        casNo: '4235-95-4',
        mW: 786.11,
        groupArr: [groups[8]],
        isProtected: true,
      },
      7,
    ),
    createChemical(
      {
        name: 'eicosapentaenoic acid ethyl ester',
        formula: 'C22H34O2',
        casNo: '86227-47-6',
        mW: 330.5,
        groupArr: [groups[5]],
        isProtected: true,
      },
      8,
    ),
    createChemical(
      {
        name: 'POPC',
        formula: 'C42H82NO8P',
        casNo: '67-66-3',
        mW: 760.08,
        groupArr: [groups[8]],
        isProtected: true,
      },
      9,
    ),
    createChemical(
      {
        name: 'cholesterol',
        formula: 'C27H46O',
        casNo: '57-88-5',
        mW: 386.65,
        groupArr: [groups[8]],
        isProtected: true,
      },
      10,
    ),
    createChemical(
      {
        name: 'cyclohexylacetylene',
        formula: 'C6H11C≡CH',
        casNo: '931-48-6',
        mW: 108.18,
        groupArr: [groups[1], groups[6]],
        isProtected: true,
      },
      11,
    ),
    createChemical(
      {
        name: '1-ethynyl-1-cyclohexanol',
        formula: 'HC≡CC6H10OH',
        casNo: '78-27-3',
        mW: 124.18,
        groupArr: [groups[0], groups[6]],
        isProtected: true,
      },
      12,
    ),
    createChemical(
      {
        name: 'benzoic acid',
        formula: 'C6H5COOH',
        casNo: '65-85-0',
        mW: 122.12,
        groupArr: [groups[3]],
        isProtected: true,
      },
      13,
    ),
    createChemical(
      {
        name: 'octane',
        formula: 'CH3(CH2)6CH3',
        casNo: '111-65-9',
        mW: 114.23,
        groupArr: [groups[1]],
        isProtected: true,
      },
      14,
    ),
    createChemical(
      {
        name: '1,4-diazabicyclo[2.2.2]octane',
        formula: 'C6H12N2',
        casNo: '280-57-9',
        mW: 112.17,
        groupArr: [groups[1], groups[4]],
        isProtected: true,
      },
      15,
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
        isProtected: true,
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
        isProtected: true,
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
        isProtected: true,
      },
      2,
    ),
    createProduct(
      {
        chemical: chemicals[5],
        sku: '81926-94-5',
        description: 'United States Pharmacopeia (USP) Reference Standard',
        numberInStock: 3,
        packSize: '500 mg',
        price: 'USD 1034.53',
        isProtected: true,
      },
      3,
    ),
    createProduct(
      {
        chemical: chemicals[5],
        sku: 'D2954600',
        description: 'European Pharmacopoeia (EP) Reference Standard',
        numberInStock: 12,
        packSize: '50 mg',
        price: 'USD 163.54',
        isProtected: true,
      },
      4,
    ),
    createProduct(
      {
        chemical: chemicals[6],
        sku: '208329',
        description: '98%',
        numberInStock: 17,
        packSize: '50 g',
        price: 'USD 68.65',
        isProtected: true,
      },
      5,
    ),
    createProduct(
      {
        chemical: chemicals[8],
        sku: 'PHR1790',
        description:
          'Pharmaceutical Secondary Standard: Certified Reference Material',
        numberInStock: 3,
        packSize: '1 g',
        price: 'USD 312.80',
        isProtected: true,
      },
      6,
    ),
    createProduct(
      {
        chemical: chemicals[8],
        sku: '1234307',
        description: 'United States Pharmacopeia (USP) Reference Standard',
        numberInStock: 7,
        packSize: '500 mg',
        price: 'USD 1034.53',
        isProtected: true,
      },
      7,
    ),
    createProduct(
      {
        chemical: chemicals[9],
        sku: '850855C',
        description: 'Avanti Polar Lipids',
        numberInStock: 24,
        packSize: '5 mg',
        price: 'USD 574.58',
        isProtected: true,
      },
      8,
    ),
    createProduct(
      {
        chemical: chemicals[10],
        sku: '26732',
        description: 'From lanolin, ≥99.0% (GC)',
        numberInStock: 73,
        packSize: '5 g',
        price: 'USD 52.90',
        isProtected: true,
      },
      9,
    ),
    createProduct(
      {
        chemical: chemicals[10],
        sku: 'C8667',
        description: 'Sigma Grade, ≥99%',
        numberInStock: 2,
        packSize: '100 g',
        price: 'USD 1410.73',
        isProtected: true,
      },
      10,
    ),
    createProduct(
      {
        chemical: chemicals[10],
        sku: 'C3045',
        description: 'Powder, BioReagent, suitable for cell culture, ≥99%',
        numberInStock: 7,
        packSize: '25 g',
        price: 'USD 571.43',
        isProtected: true,
      },
      11,
    ),
    createProduct(
      {
        chemical: chemicals[10],
        sku: 'PHR1533',
        description:
          'Pharmaceutical Secondary Standard; Certified Reference Material',
        numberInStock: 9,
        packSize: '500 mg',
        price: 'USD 123.65',
        isProtected: true,
      },
      12,
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
