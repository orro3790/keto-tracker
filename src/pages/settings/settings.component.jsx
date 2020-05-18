import React from 'react';
import Rail from '../../components/rail/rail.component';
import DietSettings from '../../components/diet-settings/diet-settings.component';
import CarbSettings from '../../components/carb-settings/carb-settings.component.js';
import './settings.styles.scss';

const Settings = () => {
  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div className='outer-container'>
        <div className='page-title'>Settings</div>
        <DietSettings />
        <CarbSettings />
      </div>
      <div></div>
    </div>
  );
};

export default Settings;
