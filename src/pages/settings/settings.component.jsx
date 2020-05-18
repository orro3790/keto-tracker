import React from 'react';
import Rail from '../../components/rail/rail.component';
import UpdateDiet from '../../components/update-diet/update-diet';
import CarbSettings from '../../components/carb-settings/carb-settings.component.jsx';
import CurrentDiet from '../../components/current-diet/current-diet.component';
import './settings.styles.scss';

const Settings = () => {
  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>
      <div className='outer-container'>
        <CurrentDiet />
        <CarbSettings />
        <UpdateDiet />
      </div>
    </div>
  );
};

export default Settings;
