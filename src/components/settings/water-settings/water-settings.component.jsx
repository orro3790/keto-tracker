import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selectors';
import FormInput from '../../form-input/form-input.component';
import { toggleAlertModal } from '../../../redux/alert-modal/alert-modal.actions';
import { updateWaterSettings } from '../../../firebase/firebase.utils';
import { RiWaterFlashLine } from 'react-icons/ri';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { cloneDeep } from 'lodash';
import './water-settings.styles.scss';

const WaterSettings = ({ currentUser, toggleAlertModal }) => {
  const [unitToggle, setUnitToggle] = useState(currentUser.w.u);
  const [goalInput, setGoalInput] = useState('');
  const [trackingToggle, setTrackingToggle] = useState(currentUser.w.e);

  const UNITS = {
    c: 'cups',
    m: 'mL',
    o: 'oz',
  };

  const handleAlert = (result) => {
    let msg = '',
      title,
      img;

    const msgFormatter = {
      unitToggle: `Water consumption will now be displayed in ${UNITS[unitToggle]}. `,
      goal: `Your new goal is to drink ${goalInput} ${UNITS[unitToggle]} each day. `,
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
      if (currentUser.w.u !== unitToggle) {
        msg += msgFormatter.unitToggle;
      }
      if (currentUser.w.e !== trackingToggle) {
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

      userCopy.w.g = parseFloat(goalInput);
      userCopy.w.u = unitToggle;
      userCopy.w.e = trackingToggle;
    } else {
      title = 'OOPS!';
      msg =
        "There was an error saving your settings. Don't worry, support has been notified!";
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
    setUnitToggle('m');
  };

  const toggleCups = () => {
    setUnitToggle('c');
  };

  const toggleOz = () => {
    setUnitToggle('o');
  };

  const getStyle = (className) => {
    if (className === unitToggle) {
      return 'on';
    } else {
      return 'off';
    }
  };

  const handleSubmit = async () => {
    // settings will be passed to firestore update func ==> cloneDeep to preserve currentUser.w
    const settings = cloneDeep(currentUser.w);

    // case 1: check if unit settings changed
    if (currentUser.w !== unitToggle) {
      settings.u = unitToggle;
    }

    // case 2: check if goal changed ==> convert units if necessary
    if (goalInput !== '') {
      switch (settings.u) {
        case 'm':
          settings.g = parseFloat(goalInput);
          break;
        case 'c':
          settings.g = parseFloat((goalInput * 250).toFixed(2));
          break;
        case 'o':
          settings.g = parseFloat((goalInput * 29.5735).toFixed(2));
          break;
        default:
          break;
      }
    }

    // case 3: check if tracking settings changed
    if (currentUser.w.e !== trackingToggle) {
      settings.e = trackingToggle;
      // If tracking is disabled, also set goal to null
      if (trackingToggle === false) {
        settings.g = null;
      } else {
        // If the user enabled tracking but did not provide a value, set it to a goal of 1250 mL.
        if (goalInput === '') {
          settings.g = 1250;
        }
      }
    }

    // compare currentUser settings in firestore and settings in state
    if (
      currentUser.w.g !== settings.g ||
      currentUser.w.u !== settings.u ||
      currentUser.w.e !== settings.e
    ) {
      // try to update firebase, store results to check if error or success
      await updateWaterSettings(currentUser.id, settings).then((result) => {
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
    case 'm':
      waterDescription = (
        <div>
          <div>Water consumption will be displayed in mL by default.</div>
        </div>
      );
      break;
    case 'c':
      waterDescription = (
        <div>
          <div>Water consumption will be displayed in cups by default.</div>
        </div>
      );
      break;
    case 'o':
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

  switch (currentUser.w.u) {
    case 'm':
      currentGoal = currentUser.w.g;
      break;
    case 'c':
      currentGoal = (currentUser.w.g / 250).toFixed(2);
      break;
    case 'o':
      currentGoal = (currentUser.w.g / 29.5735).toFixed(2);
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
              value={goalInput}
              onChange={handleChange}
              placeholder={`set goal (${UNITS[unitToggle]})`}
              className='water-in'
            />
          </div>
          <div>
            Current goal is {currentGoal} {UNITS[currentUser.w.u]} per day.
          </div>
        </div>
      </div>
    );

    unitDesc = (
      <div className='water-set-c'>
        <div className='toggle'>
          <div className={`${getStyle('m')} mL opt`} onClick={toggleMl}>
            ML
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('c')} cups opt`} onClick={toggleCups}>
            CUPS
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('o')} oz opt`} onClick={toggleOz}>
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
        <button className={'save-btn'} type='submit' onClick={handleSubmit}>
          Save
        </button>
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
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterSettings);
