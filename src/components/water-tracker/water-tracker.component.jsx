import React, { useState, useEffect } from 'react';
// import {connect} from 'react-redux'
import { GiWaterDrop } from 'react-icons/gi';
import './water-tracker.styles.scss';

const WaterTracker = () => {
  const [percentage, setPercentage] = useState(10);

  const addWater = () => {
    setPercentage(percentage + 10);
    console.log(percentage);
  };

  // useEffect(() => {
  // }, [percentage])

  return (
    <div>
      <GiWaterDrop className='droplet' />
    </div>
  );
};

export default WaterTracker;
