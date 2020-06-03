import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import FormInput from '../form-input/form-input.component';
import { setCurrentUser } from '../../redux/user/user.actions';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { updateWaterSettings } from '../../firebase/firebase.utils';
import { RiWaterFlashLine } from 'react-icons/ri';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { cloneDeep } from 'lodash';
import './water-settings.styles.scss';

const WaterSettings = ({ currentUser, toggleAlertModal }) => {
  const [unitToggle, setUnitToggle] = useState(currentUser.waterSettings.u);
  const [goalInput, setGoalInput] = useState('');
  const [trackingToggle, setTrackingToggle] = useState(
    currentUser.waterSettings.e
  );

  console.log('rendered');

  const handleAlert = (result) => {
    let msg = '',
      title,
      img;

    const msgFormatter = {
      unitToggle: `Water consumption will now be displayed in ${unitToggle}. `,
      goal: `Your new goal is to drink ${goalInput} ${unitToggle} each day. `,
      tracking: {
        true: `Water tracking has been enabled.`,
        false: `Water tracking has been disabled. `,
      },
    };

    if (result === 'success') {
      // check for changes in water settings ==> format alert message ==> push changes to currentUser in state
      if (goalInput !== '') {
        msg += msgFormatter.goal;
      }
      if (currentUser.waterSettings.u !== unitToggle) {
        msg += msgFormatter.unitToggle;
      }
      if (currentUser.waterSettings.e !== trackingToggle) {
        if (trackingToggle === true) {
          msg += msgFormatter.tracking.true;
        }
        // if water tracking is disabled, only alert the user that it has been disabled
        else {
          msg = msgFormatter.tracking.false;
        }
      }

      title = 'SETTINGS SAVED!';
      img = 'success';

      // push the changes to currentUser state in app
      const userCopy = Object.assign({}, currentUser);

      userCopy.waterSettings.g = parseFloat(goalInput);
      userCopy.waterSettings.u = unitToggle;
      userCopy.waterSettings.e = trackingToggle;

      setCurrentUser(userCopy);
    } else {
      title = 'ERROR!';
      msg = 'There was an error saving your settings.';
      img = 'error';
    }

    toggleAlertModal({
      title: title,
      msg: msg,
      img: img,
      status: 'visible',
      sticky: false,
    });
  };

  const toggleMl = () => {
    setUnitToggle('mL');
  };

  const toggleCups = () => {
    setUnitToggle('cups');
  };

  const toggleOz = () => {
    setUnitToggle('oz');
  };

  const getStyle = (className) => {
    if (className === unitToggle) {
      return 'on';
    } else {
      return 'off';
    }
  };

  const handleSubmit = async () => {
    // settings will be passed to firestore update func ==> cloneDeep to preserve currentUser.waterSettings
    const settings = cloneDeep(currentUser.waterSettings);

    // case 1: check if unit settings changed
    if (currentUser.waterSettings !== unitToggle) {
      settings.u = unitToggle;
    }

    // case 2: check if goal changed ==> convert units if necessary
    if (goalInput !== '') {
      switch (settings.u) {
        case 'mL':
          settings.g = parseFloat(goalInput);
          break;
        case 'cups':
          settings.g = parseFloat((goalInput * 250).toFixed(2));
          break;
        case 'oz':
          settings.g = parseFloat((goalInput * 29.5735).toFixed(2));
          break;
        default:
          break;
      }
    }

    // case 3: check if tracking settings changed
    if (currentUser.waterSettings.e !== trackingToggle) {
      settings.e = trackingToggle;
    }

    // compare currentUser settings in firestore and settings in state
    if (
      currentUser.waterSettings.g !== settings.g ||
      currentUser.waterSettings.u !== settings.u ||
      currentUser.waterSettings.e !== settings.e
    ) {
      // try to update firebase, store results to check if error or success
      await updateWaterSettings(currentUser, settings).then((result) => {
        handleAlert(result);
      });
    }
  };

  const handleChange = (e) => {
    // allow 0-9, 0-5 digits before decimal, optionally includes one decimal point /w 2 digits after decimal
    const rule2 = /^(\d{0,1}|[1-9]\d{0,4})(\.\d{1,2})?$/;
    if (e.target.value.match(rule2)) setGoalInput(e.target.value);
  };

  const handleClick = () => {
    setTrackingToggle(!trackingToggle);
  };

  let waterDescription;

  switch (unitToggle) {
    case 'mL':
      waterDescription = (
        <div>
          <div>Water consumption will be displayed in mL by default.</div>
        </div>
      );
      break;
    case 'cups':
      waterDescription = (
        <div>
          <div>Water consumption will be displayed in cups by default.</div>
        </div>
      );
      break;
    case 'oz':
      waterDescription = (
        <div>
          <div>Water consumption will be displayed in ounces by default.</div>
        </div>
      );
      break;
    default:
      break;
  }

  let toggleIcon, goalDesc, unitDesc, currentGoal;

  switch (currentUser.waterSettings.u) {
    case 'mL':
      currentGoal = currentUser.waterSettings.g;
      break;
    case 'cups':
      currentGoal = (currentUser.waterSettings.g / 250).toFixed(2);
      break;
    case 'oz':
      currentGoal = (currentUser.waterSettings.g / 29.5735).toFixed(2);
      break;
    default:
      break;
  }

  if (trackingToggle === true) {
    toggleIcon = <BsToggleOn className='on' onClick={handleClick} />;
    goalDesc = (
      <div className='water-set-c'>
        <div className='desc-c-split'>
          <div>
            <FormInput
              name='calorieLimit'
              type='number'
              inputType='input'
              value={goalInput}
              onChange={handleChange}
              placeholder={`set goal (${unitToggle})`}
              className='water-in'
            />
          </div>
          <div>
            Current goal is {currentGoal} {currentUser.waterSettings.u} per day.
          </div>
        </div>
      </div>
    );

    unitDesc = (
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

        <button className={'save-btn'} type='submit' onClick={handleSubmit}>
          Save
        </button>
      </div>
    );
  } else {
    toggleIcon = <BsToggleOff className='off' onClick={handleClick} />;
    goalDesc = (
      <div className='water-set-c'>
        <div className='desc-c'>
          <div>Water tracking has been disabled.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='set-h-c'>
        <RiWaterFlashLine className='set-i water-i' />
        <div className='t'>Water Settings</div>
      </div>

      <div className='track-water-c'>
        {toggleIcon}
        <div>TRACK WATER</div>
      </div>

      {goalDesc}

      {unitDesc}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterSettings);
