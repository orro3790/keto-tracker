import React from 'react';
import Rail from '../../components/rail/rail.component';
import ProfileSettings from '../../components/profile-settings/profile-settings.component';
import Slider from '../../components/slider/slider.component';
import './settings.styles.scss';

const Settings = () => {
  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div className='outer-container'>
        <div className='page-title'>Settings</div>
        <ProfileSettings />
        <Slider name='calories' />
        <div className='spacer'></div>

        <Slider name='fats' />
      </div>
      <div></div>
    </div>
  );
};

export default Settings;
