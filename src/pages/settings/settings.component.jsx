import React from 'react';
import Rail from '../../components/rail/rail.component';
import ProfileSettings from '../../components/profile-settings/profile-settings.component';
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
      </div>
      <div></div>
    </div>
  );
};

export default Settings;
