const csv = require('csvtojson');
const fs = require('fs');

const batch = './usda-data/batch_0.csv';

csv()
  .fromFile(batch)
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
