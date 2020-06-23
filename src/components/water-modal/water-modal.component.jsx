import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { RiWaterFlashLine } from 'react-icons/ri';
import { MdCheck, MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { selectWaterSettings } from '../../redux/user/user.selectors';
import { selectEntry } from '../../redux/date-selector/date-selector.selectors';
import { selectMeal } from '../../redux/search-modal/search-modal.selectors';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import {
  toggleSearchModal,
  allowUpdateFirebase,
} from '../../redux/search-modal/search-modal.actions';
import { setEntry } from '../../redux/date-selector/date-selector.actions';
import { toggleWaterModal } from '../../redux/water-modal/water-modal.actions';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import {
  dateWriteable,
  updateGoalsAndPrecision,
} from '../../firebase/firebase.utils';
import './water-modal.styles.scss';

const WaterModal = ({
  waterSettings,
  createFoodReference,
  toggleSearchModal,
  toggleWaterModal,
  toggleAlertModal,
  meal,
  entry,
  setEntry,
  allowUpdateFirebase,
}) => {
  const [input, setInput] = useState('');
  const [toggle, setToggle] = useState('add');

  const UNITS = {
    c: 'cups',
    m: 'mL',
    o: 'oz',
  };

  const handleClose = () => {
    toggleWaterModal({
      status: 'hidden',
    });
  };

  const handleBack = () => {
    toggleWaterModal({
      status: 'hidden',
    });
    createFoodReference('');
    toggleSearchModal({
      status: 'visible',
      meal: meal,
      editMode: {
        enabled: false,
        food: '',
        index: '',
      },
    });
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only allow updates to the entry if the entry date is +/- 7 days from today's date to limit abuse
    if (dateWriteable(entry.t.seconds * 1000) === true) {
      if (input !== '') {
        // will need to refactor to include unit conversions
        let copy = Object.assign({}, entry);
        let totalMl = 0;
        let remainder = 0;
        let title;
        let alertMsg;
        let img;
        let negIntake = false;
        let conversion;

        // determine add or remove ==> handle conversion to totalMl ==>  calculate remainder for alerts
        const calculateRemainder = () => {
          if (toggle === 'add') {
            title = 'WATER ADDED';
            switch (waterSettings.u) {
              case 'm':
                totalMl = copy.w.t + parseFloat(input);
                break;
              case 'c':
                totalMl = copy.w.t + parseFloat(input) * 250;
                break;
              case 'o':
                totalMl = copy.w.t + parseFloat(input) * 29.5735;
                break;
              default:
                break;
            }
          } else if (toggle === 'remove') {
            title = 'WATER REMOVED';
            switch (waterSettings.u) {
              case 'm':
                totalMl = copy.w.t - parseFloat(input);
                break;
              case 'c':
                conversion = parseFloat(input) * 250;
                totalMl = copy.w.t - conversion;
                break;
              case 'o':
                conversion = parseFloat(input) * 250;
                totalMl = copy.w.t - conversion;
                break;
              default:
                break;
            }
          }
          // handle negative daily water intake
          if (totalMl < 0) {
            totalMl = 0;
            negIntake = true;
          }
          remainder = waterSettings.g - totalMl;
        };

        switch (waterSettings.u) {
          case 'm':
            calculateRemainder();
            // alert: goal not yet reached
            if (remainder > 1 && negIntake === false) {
              alertMsg = `${remainder.toFixed(
                0
              )} mL to go to reach your goal today.`;
            }
            // alert: goal reached, allow for rounding errors, remainder between 0 - 1 mL
            else if (remainder < 1 && remainder >= 0) {
              alertMsg = `Great job! You reached your goal of drinking ${waterSettings.g} mL of water today!`;
              img = 'goal-reached';
            }
            // alert: extra consumed
            else if (remainder < 0) {
              alertMsg = `Great job! You drank an extra ${
                parseInt(remainder.toFixed(0)) * -1
              } mL of water today.`;
              img = 'goal-reached';
            }
            // alert: negative daily water intake
            if (negIntake === true) {
              alertMsg = `${waterSettings.g.toFixed(
                0
              )} mL to go to reach your goal today.`;
              img = '';
            }
            break;
          case 'c':
            calculateRemainder();
            // alert: goal not yet reached
            if (remainder > 1 && negIntake === false) {
              // alert: only 1 cup left to hit goal
              if (remainder.toFixed(0) === '250') {
                alertMsg = `1 cup to go to reach your goal today!`;
                // alert: negative daily water intake
              } else {
                alertMsg = `${(remainder / 250).toFixed(
                  2
                )} cups to go to reach your goal today!`;
              }
            }
            // alert: goal reached, allow for rounding errors, remainder between 0 - 1 mL
            else if (
              parseInt(remainder.toFixed(1)) < 1 &&
              parseInt(remainder.toFixed(1)) >= 0
            ) {
              alertMsg = `Great job! You reached your goal of drinking ${(
                waterSettings.g / 250
              ).toFixed(2)} cups of water today!`;
              img = 'goal-reached';
            }
            // alert: extra consumed
            else if (remainder < 0) {
              if (parseFloat((remainder / 250).toFixed(2)) * -1 === 1) {
                alertMsg = `Great job! You drank an extra cup of water today.`;
              } else
                alertMsg = `Great job! You drank an extra ${
                  parseFloat((remainder / 250).toFixed(2)) * -1
                } cups of water today.`;
              img = 'goal-reached';
            }
            // alert: negative values
            else if (negIntake === true) {
              alertMsg = `${(waterSettings.g / 250).toFixed(
                2
              )} cups to go to reach your goal today.`;
              img = '';
            }
            break;
          case 'o':
            calculateRemainder();
            // alert: goal not yet reached
            if (remainder > 1 && negIntake === false) {
              alertMsg = `${(remainder / 29.5735).toFixed(
                2
              )} oz to go to reach your goal today!`;
            }
            // alert: goal reached, allow for rounding errors, remainder between 0 - 1 mL
            else if (
              parseInt(remainder.toFixed(1)) < 1 &&
              parseInt(remainder.toFixed(1)) >= 0
            ) {
              alertMsg = `Great job! You reached your goal of drinking ${(
                waterSettings.g / 29.5735
              ).toFixed(2)} oz of water today!`;
              img = 'goal-reached';
            }
            // alert: extra consumed
            else if (remainder < 0) {
              alertMsg = `Great job! You drank an extra ${
                parseFloat((remainder / 29.5735).toFixed(2)) * -1
              } oz of water today.`;
              img = 'goal-reached';
            }
            // alert: negative values
            else if (negIntake === true) {
              alertMsg = `${(waterSettings.g / 29.5735).toFixed(
                2
              )} oz to go to hit your water goal today.`;
              img = '';
            }
            break;
          default:
            break;
        }

        // save adjusted water value & handle cases of negative daily water consumption.
        if (totalMl === 0) {
          copy.w.t = totalMl;
        } else {
          copy.w.t = parseFloat(totalMl.toFixed(2));
        }

        const goals = {
          w: waterSettings.g,
        };

        copy = updateGoalsAndPrecision(copy, goals);

        allowUpdateFirebase(true);

        setEntry(copy);

        handleClose();

        toggleAlertModal({
          title: title,
          msg: alertMsg,
          img: img,
          status: 'visible',
          sticky: false,
        });
      }
    } else {
      toggleAlertModal({
        title: 'Sorry!',
        msg:
          "Entries can not be added, removed, or updated beyond one week from today's date.",
        img: 'error',
        status: 'visible',
        sticky: false,
      });
    }
  };

  const getBtnStyle = () => {
    if (input !== '') {
      return 'submit-btn on';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (input !== '') {
      return 'fas fa-check add-i on';
    } else {
      return 'fas fa-check add-i';
    }
  };

  let goal = waterSettings.g;

  switch (waterSettings.u) {
    case 'c':
      goal = (waterSettings.g / 250).toFixed(2);
      break;
    case 'o':
      goal = (waterSettings.g / 29.5735).toFixed(2);
      break;
    default:
      break;
  }

  const toggleAdd = () => {
    setToggle('add');
  };

  const toggleRemove = () => {
    setToggle('remove');
  };

  const getStyle = (className) => {
    if (className === toggle) {
      if (toggle === 'add') {
        return 'on-add';
      } else {
        return 'on-rem';
      }
    } else {
      return 'off';
    }
  };

  return (
    <div>
      <div className='submit-template-m'>
        <div className='btn-c'>
          <div></div>
          <div className='back-btn' onClick={handleBack}>
            <FaArrowLeft className='fas fa-arrow-left' />
          </div>
          <div className='close-btn' onClick={handleClose}>
            <FaTimes className='fas fa-times' />
          </div>
        </div>
        <div className='inner-c'>
          <div className='energy-i'>
            <RiWaterFlashLine />
            <div className='desc'>
              Your goal is to consume
              <span className='goal'>
                {goal} {UNITS[waterSettings.u]}
              </span>{' '}
              per day.
            </div>
          </div>

          <div className='add-rem-set-c'>
            <div className='toggle'>
              <div className={`${getStyle('add')} add opt`} onClick={toggleAdd}>
                <MdAddCircle />
              </div>
              <div className='separator'></div>
              <div
                className={`${getStyle('remove')} remove opt`}
                onClick={toggleRemove}
              >
                <MdRemoveCircle />
              </div>
            </div>
          </div>

          <div className='water-s'>
            <span className='water-l'>Size</span>
            <form className='water-f' onSubmit={handleSubmit}>
              <FormInput
                name='size'
                type='number'
                value={input}
                onChange={handleChange}
                placeholder='0'
              />
            </form>
            <div className='water-unit'>
              <div>{UNITS[waterSettings.u]}</div>
            </div>
          </div>
        </div>
        <div className='water-submit-r'>
          <div type='submit' className={getBtnStyle()} onClick={handleSubmit}>
            <MdCheck className={getIconStyle()} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  waterSettings: selectWaterSettings,
  meal: selectMeal,
  entry: selectEntry,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleWaterModal: (status) => dispatch(toggleWaterModal(status)),
  setEntry: (entry) => dispatch(setEntry(entry)),
  allowUpdateFirebase: (status) => dispatch(allowUpdateFirebase(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterModal);
