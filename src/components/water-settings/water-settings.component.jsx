import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectWaterSettings } from '../../redux/user/user.selectors';
import { RiWaterFlashLine } from 'react-icons/ri';
import './water-settings.styles.scss';

const WaterSettings = ({ waterSettings }) => {
  const [toggle, setToggle] = useState(null);

  useEffect(() => {
    switch (waterSettings.u) {
      case 'ml':
        setToggle('ml');
        break;
      case 'cups':
        setToggle('cups');
        break;
      default:
        break;
    }
  }, [waterSettings]);

  let waterDescription = (
    <div className='total-list'>
      <div>Track water by mL</div>
      <div>Water consumption will be displayed in mL by default.</div>
    </div>
  );

  if (toggle === 'cups') {
    waterDescription = (
      <div className='net-list'>
        <div>Track water by cups</div>
        <div>Water consumption will be displayed in cups by default.</div>
      </div>
    );
  }

  const toggleTotal = () => {
    setToggle('mL');
  };

  const toggleNet = () => {
    setToggle('cups');
  };

  const getStyle = (className) => {
    if (className === toggle) {
      return 'on';
    } else {
      return 'off';
    }
  };

  const saveCarbSettings = () => {
    console.log('saved');
  };

  return (
    <div>
      <div className='set-h-c'>
        <RiWaterFlashLine className='set-i water-i' />
        <div className='t'>Water Settings</div>
      </div>
      <div className='water-set-c'>
        <div className='toggle'>
          <div className={`${getStyle('mL')} mL opt`} onClick={toggleTotal}>
            ML
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('cups')} cups opt`} onClick={toggleNet}>
            CUPS
          </div>
        </div>
        <div className='desc-c'>{waterDescription}</div>
        <button className={'save-btn'} type='submit' onClick={saveCarbSettings}>
          Save
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  waterSettings: selectWaterSettings,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WaterSettings);
