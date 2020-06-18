import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormInput from '../../form-input/form-input.component';
import { updateDiet } from '../../../firebase/firebase.utils';
import { toggleAlertModal } from '../../../redux/alert-modal/alert-modal.actions';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCurrentUserId,
  selectCarbSettings,
} from '../../../redux/user/user.selectors';
import { GiHealthIncrease } from 'react-icons/gi';
import './update-diet.styles.scss';

const UpdateDiet = ({ toggleAlertModal, diet, userId, carbSettings }) => {
  const [fatGoal, setFatGoal] = useState('');
  const [carbGoal, setCarbGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const grams = {
    f: 0,
    c: 0,
    p: 0,
  };

  // calculate the macro % goal in grams and store it in the grams obj
  if (fatGoal !== '') {
    grams.f = parseInt(((fatGoal / 100) * calorieGoal) / 9);
  }
  if (grams.c !== '') {
    grams.c = parseInt(((carbGoal / 100) * calorieGoal) / 4);
  }
  if (grams.p !== '') {
    grams.p = parseInt(((proteinGoal / 100) * calorieGoal) / 4);
  }

  // validation 1: check that all fields are filled
  let fieldsFilled =
    fatGoal !== '' &&
    carbGoal !== '' &&
    proteinGoal !== '' &&
    calorieGoal !== '';

  // validation 2: check that total percentages add up to 100
  let totalPercentage = 0;

  if (fatGoal !== '') {
    totalPercentage += parseFloat(fatGoal);
  }
  if (carbGoal !== '') {
    totalPercentage += parseFloat(carbGoal);
  }
  if (proteinGoal !== '') {
    totalPercentage += parseFloat(proteinGoal);
  }

  // in order to check whether sum of percentages === 100, apply .toPrecision(3), then convert back to int
  totalPercentage = parseInt(totalPercentage.toPrecision(3));

  // determine whether or not the form can be submitted
  let isSubmittable = false;

  // prevent zero grams as they will return NaN or Infinite when calculating precision
  let zeroGrams = false;

  const checkZeroGrams = (value) => {
    return value === 0;
  };

  zeroGrams = Object.values(grams).some(checkZeroGrams);

  if (fieldsFilled === true && totalPercentage === 100 && zeroGrams === false) {
    isSubmittable = true;
  }

  // collect any errors
  let errors = [];

  if (fieldsFilled && totalPercentage !== 100 && totalPercentage < 100) {
    errors.push({
      error: 'Sum of percentages not 100%.',
    });
  }

  if (totalPercentage > 100) {
    errors.push({
      error: 'Sum of percentages > 100%.',
    });
  }

  if (fieldsFilled && zeroGrams) {
    errors.push({
      error: 'All gram values must be > 0.',
    });
  }

  // render errors to UI
  const renderErrors = (errorsArray) => {
    return errorsArray.map((error) => (
      <div className='diet-form-row' key={error.error}>
        {error.error}
      </div>
    ));
  };

  let error = renderErrors(errors);

  const handleChange = (e) => {
    // allow empty string or values 0-9, 0-5 digits, optionally including one decimal point /w 1 digit after decimal
    const caloriesPermitted = /^\d{0,5}(\.\d{1})?$/;

    // allow empty string or values 0-9, 0-3 digits, optionally including one decimal point /w 1 digit after decimal
    const macrosPermitted = /^\d{0,3}(\.\d{1})?$/;

    switch (e.target.name) {
      case 'calorieGoal':
        if (e.target.value.match(caloriesPermitted))
          setCalorieGoal(e.target.value);
        break;
      case 'fatGoal':
        if (e.target.value.match(macrosPermitted)) setFatGoal(e.target.value);
        break;
      case 'carbGoal':
        if (e.target.value.match(macrosPermitted)) setCarbGoal(e.target.value);
        break;
      case 'proteinGoal':
        if (e.target.value.match(macrosPermitted))
          setProteinGoal(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmittable) {
      let goals = Object.assign({}, diet);

      goals.f = grams.f;
      goals.p = grams.p;
      goals.e = parseFloat(calorieGoal);

      // assign carb goal to either net carbs or total carbs based on user carb settings
      switch (carbSettings) {
        case 't':
          goals.c = grams.c;
          goals.k = null;
          break;
        case 'n':
          goals.k = grams.c;
          goals.c = null;
          break;
        default:
          break;
      }

      // now update the data in firestore
      updateDiet(userId, goals);

      toggleAlertModal({
        title: 'SETTINGS SAVED!',
        msg: 'Your diet settings have been updated!',
        img: 'update',
        status: 'visible',
        sticky: false,
      });
    } else {
      toggleAlertModal({
        title: 'OOPS!',
        msg:
          'Make sure all fields have been filled in properly before trying to save your settings.',
        img: 'error',
        status: 'visible',
        sticky: false,
      });
    }
  };

  const getArrowStyle = (value) => {
    if (value) {
      return 'far fa-arrow-alt-circle-right output-arrow on';
    } else {
      return 'far fa-arrow-alt-circle-right output-arrow';
    }
  };

  const getOutputStyle = (value) => {
    if (value) {
      return 'diet-form-row on';
    } else {
      return 'diet-form-row off';
    }
  };

  let carbLabel = 'desired % carbs';

  if (carbSettings === 'n') {
    carbLabel = 'desired % net carbs';
  }

  return (
    <div>
      <div className='set-h-c'>
        <GiHealthIncrease className='set-i update-i' />
        <div className='t'>Update Diet</div>
      </div>
      <div className='macro-calc-c'>
        <div className='left-col'>
          <form className='diet-form' onSubmit={handleSubmit}>
            <FormInput
              name='calorieGoal'
              type='number'
              value={calorieGoal}
              onChange={handleChange}
              label={'calories per day'}
              className='diet-form-row'
            />
            <FormInput
              name='fatGoal'
              type='number'
              value={fatGoal}
              onChange={handleChange}
              label={'desired % fats'}
              className='diet-form-row'
            />
            <FormInput
              name='carbGoal'
              type='number'
              value={carbGoal}
              onChange={handleChange}
              label={carbLabel}
              className='diet-form-row'
            />
            <FormInput
              name='proteinGoal'
              type='number'
              value={proteinGoal}
              onChange={handleChange}
              label={'desired % protein'}
              className='diet-form-row'
            />
          </form>
        </div>
        <div className='center-col'>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(calorieGoal)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(fatGoal)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(carbGoal)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(proteinGoal)} />
          </div>
        </div>
        <div className='right-col'>
          <div className={getOutputStyle(calorieGoal)}>
            {`${calorieGoal} cal / day`}
          </div>
          <div className={getOutputStyle(fatGoal)}>
            {`${grams.f} g fat / day`}
          </div>
          <div className={getOutputStyle(carbGoal)}>
            {`${grams.c} g carbs / day`}
          </div>
          <div className={getOutputStyle(proteinGoal)}>
            {`${grams.p} g protein / day`}
          </div>
        </div>
        <button className='save-btn' type='submit' onClick={handleSubmit}>
          Save
        </button>
        <div></div>
        <div className='error'>{error}</div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  diet: selectDietSettings,
  userId: selectCurrentUserId,
  carbSettings: selectCarbSettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDiet);
