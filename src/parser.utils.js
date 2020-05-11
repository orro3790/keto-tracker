const csv = require('csvtojson');
const fs = require('fs');

const foodRegistryPath = './usda-data/food_registry.csv';

csv()
  .fromFile(foodRegistryPath)
  .then((jsonObj) => {
    fs.writeFile(
      './usda-data/output.js',
      'export const foodRegistryArray = ' + JSON.stringify(jsonObj),
      (err) => {
        if (err) throw err;
        console.log('food registry successfully saved');
      }
    );
  });
