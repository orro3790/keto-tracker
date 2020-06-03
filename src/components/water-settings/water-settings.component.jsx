import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectEntries } from '../../redux/date-selector/date-selector.selectors';
import { RiWaterFlashLine } from 'react-icons/ri';
import FormInput from '../form-input/form-input.component';
import { setCurrentUser } from '../../redux/user/user.actions';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { updateWaterSettings } from '../../firebase/firebase.utils';
import './water-settings.styles.scss';

const WaterSettings = ({ currentUser, toggleAlertModal, entries }) => {
  const [toggle, setToggle] = useState(null);
  const [waterValue, setWaterValue] = useState('');

  // set the initial state of toggle based on user settings upon mount
  useEffect(() => {
    switch (currentUser.waterSettings.u) {
      case 'mL':
        setToggle('mL');
        break;
      case 'cups':
        setToggle('cups');
        break;
      case 'oz':
        setToggle('oz');
        break;
      default:
        break;
    }
  }, [currentUser]);

  let waterDescription = (
    <div>
      <div>Track water by mL.</div>
      <div>Water consumption will be displayed in mL by default.</div>
      <div>Set your daily water goal below.</div>
    </div>
  );

  switch (toggle) {
    case 'cups':
      waterDescription = (
        <div>
          <div>Track water by cups.</div>
          <div>Water consumption will be displayed in cups by default.</div>
          <div>Set your daily water goal below.</div>
        </div>
      );
      break;
    case 'oz':
      waterDescription = (
        <div>
          <div>Track water by ounces.</div>
          <div>Water consumption will be displayed in ounces by default.</div>
          <div>Set your daily water goal below.</div>
        </div>
      );
      break;
    default:
      break;
  }

  const handleAlert = () => {
    let msg;
    if (waterValue !== '') {
      msg = `Water consumption will now be displayed in ${toggle}. Your goal is to drink ${waterValue} ${toggle} each day.`;
    } else {
      msg = `Water consumption will now be displayed in ${toggle}.`;
    }
    toggleAlertModal({
      title: 'SETTINGS SAVED!',
      msg: msg,
      img: 'update',
      status: 'visible',
      sticky: false,
    });
  };

  const toggleMl = () => {
    setToggle('mL');
  };

  const toggleCups = () => {
    setToggle('cups');
  };

  const toggleOz = () => {
    setToggle('oz');
  };

  const getStyle = (className) => {
    if (className === toggle) {
      return 'on';
    } else {
      return 'off';
    }
  };

  const handleSubmit = () => {
    if (currentUser.waterSettings !== toggle) {
      const settings = {
        u: toggle,
      };
      if (waterValue !== '') {
        settings.g = parseFloat(waterValue);
      }
      // only push update if there's a change between state and user settings in firebase
      updateWaterSettings(currentUser.id, settings);
      const userCopy = Object.assign({}, currentUser);
      userCopy.waterSettings.u = toggle;
      setCurrentUser(userCopy);
    }

    handleAlert();
  };

  const handleChange = (e) => {
    // allow 0-9, 0-5 digits before decimal, optionally includes one decimal point /w 2 digits after decimal
    const rule2 = /^(\d{0,1}|[1-9]\d{0,4})(\.\d{1,2})?$/;
    if (e.target.value.match(rule2)) setWaterValue(e.target.value);
  };

  return (
    <div>
      <div className='set-h-c'>
        <RiWaterFlashLine className='set-i water-i' />
        <div className='t'>Water Settings</div>
      </div>
      <div className='water-set-c'>
        <div className='toggle'>
          <div className={`${getStyle('mL')} mL opt`} onClick={toggleMl}>
            ML
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('cups')} cups opt`} onClick={toggleCups}>
            CUPS
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('oz')} oz opt`} onClick={toggleOz}>
            OZ
          </div>
        </div>
        <div className='desc-c'>{waterDescription}</div>

        <FormInput
          name='calorieLimit'
          type='number'
          inputType='input'
          value={waterValue}
          onChange={handleChange}
          label={`${toggle} per day`}
          className='water-in'
        />

        <button className={'save-btn'} type='submit' onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  entries: selectEntries,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterSettings);
