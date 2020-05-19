import React, { useEffect } from 'react';
import Rail from '../../components/rail/rail.component';
import './metrics.styles.scss';
// import { addCollectionAndDocuments } from '../../firebase/firebase.utils';
// import { foodRegistryArray } from '../../usda-data/output';

const Metrics = () => {
  useEffect(() => {
    // const parseFieldsToFloat = () => {
    //   const stringFields = ['b', 'n', 'u'];
    //   // interate through the obj, changing all values not assigned to the designated string fields, to floats
    //   for (let obj in foodRegistryArray) {
    //     for (let key in foodRegistryArray[obj]) {
    //       if (stringFields.includes(key)) {
    //       } else {
    //         foodRegistryArray[obj][key] = parseFloat(
    //           foodRegistryArray[obj][key]
    //         );
    //       }
    //     }
    //   }
    //   return foodRegistryArray;
    // };
    // const updatedFoodRegistry = parseFieldsToFloat();
    // addCollectionAndDocuments('usda', updatedFoodRegistry);
  }, []);

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div className='page-body-container'>
        <div className='title'>Metrics</div>
      </div>
    </div>
  );
};

export default Metrics;
