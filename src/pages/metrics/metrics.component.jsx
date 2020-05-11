import React, { useEffect } from 'react';
import Rail from '../../components/rail/rail.component';
import './metrics.styles.scss';
// import { addCollectionAndDocuments } from '../../firebase/firebase.utils';
import { foodRegistryArray } from '../../usda-data/output';

const Metrics = () => {
  useEffect(() => {
    const parseFieldsToFloat = () => {
      const stringFields = ['description'];
      // interate through the obj, changing all values not assigned to the designated string fields, to floats
      for (let obj in foodRegistryArray) {
        for (let key in foodRegistryArray[obj]) {
          if (stringFields.includes(key)) {
            // console.log(`Not changing ${key} data type! Passing.`);
          } else {
            foodRegistryArray[obj][key] = parseFloat(
              foodRegistryArray[obj][key]
            );
          }
        }
      }
      return foodRegistryArray;
    };

    // const updatedFoodRegistry = parseFieldsToFloat();

    // push to the food data to firebase
    // addCollectionAndDocuments('usda', updatedFoodRegistry);
    console.log('Data has been pushed to firebase!');
    // batch upload ONLY ONCE, trigger on mount
  }, []);

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div>
        <h1>Metrics</h1>
      </div>
    </div>
  );
};

export default Metrics;
