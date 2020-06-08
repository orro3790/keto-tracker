import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormInput from '../form-input/form-input.component';
import { updateDiet } from '../../firebase/firebase.utils';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCurrentUserId,
  selectCarbSettings,
} from '../../redux/user/user.selectors';
import { GiHealthIncrease } from 'react-icons/gi';
import './update-diet.styles.scss';

const UpdateDiet = ({ toggleAlertModal, diet, userId, carbSettings }) => {
  const [fatLimit, setFatLimit] = useState('');
  const [carbLimit, setCarbLimit] = useState('');
  const [proteinLimit, setProteinLimit] = useState('');
  const [calorieLimit, setCalorieLimit] = useState('');

  // check that all fields are filled
  let fieldsFilled = false;

  if (
    fatLimit !== '' &&
    carbLimit !== '' &&
    proteinLimit !== '' &&
    calorieLimit !== ''
  ) {
    fieldsFilled = true;
  }

  // check that total percentages add up to 100
  let totalPercentage = 0;

  if (fatLimit !== '') {
    totalPercentage += parseFloat(fatLimit);
  }

  if (carbLimit !== '') {
    totalPercentage += parseFloat(carbLimit);
  }

  if (proteinLimit !== '') {
    totalPercentage += parseFloat(proteinLimit);
  }

  // in order to check whether sum of percentages === 100, apply .toPrecision(3), then convert back to int
  totalPercentage = parseInt(totalPercentage.toPrecision(3));

  // determine whether or not the form can be submitted
  let isSubmittable = false;

  if (fieldsFilled === true && totalPercentage === 100) {
    isSubmittable = true;
  }

  // handles conditional rendering of error divs

  const renderErrors = (errorsArray) => {
    return errorsArray.map((error) => (
      <div className='diet-form-row' key={error.error}>
        {error.error}
      </div>
    ));
  };

  let metaErrors = [];

  if (fieldsFilled && totalPercentage !== 100 && totalPercentage < 100) {
    metaErrors.push({
      error: 'Sum of percentages not 100%.',
    });
  }

  if (totalPercentage > 100) {
    metaErrors.push({
      error: 'Sum of percentages > 100%.',
    });
  }

  let errorModal = renderErrors(metaErrors);

  const handleChange = (e) => {
    // allow empty string or values 0-9, 0-5 digits, optionally including one decimal point /w 1 digit after decimal
    const caloriesPermitted = /^\d{0,5}(\.\d{1})?$/;

    // allow empty string or values 0-9, 0-3 digits, optionally including one decimal point /w 1 digit after decimal
    const macrosPermitted = /^\d{0,3}(\.\d{1})?$/;

    switch (e.target.name) {
      case 'calorieLimit':
        if (e.target.value.match(caloriesPermitted))
          setCalorieLimit(e.target.value);
        break;
      case 'fatLimit':
        if (e.target.value.match(macrosPermitted)) setFatLimit(e.target.value);
        break;
      case 'carbLimit':
        if (e.target.value.match(macrosPermitted)) setCarbLimit(e.target.value);
        break;
      case 'proteinLimit':
        if (e.target.value.match(macrosPermitted))
          setProteinLimit(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmittable) {
      let updatedDiet = Object.assign({}, diet);

      updatedDiet = {
        fats: parseInt(fatsInGrams),
        carbs: parseInt(carbsInGrams),
        protein: parseInt(proteinInGrams),
        calories: parseInt(calorieLimit),
      };

      // now update the data in firestore
      updateDiet(userId, updatedDiet);

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
          'Make sure all fields have been filled in before trying to save your settings.',
        img: 'error',
        status: 'visible',
        sticky: false,
      });
    }
  };

  let fatsInGrams = 0;
  let carbsInGrams = 0;
  let proteinInGrams = 0;

  if (fatLimit !== '') {
    fatsInGrams = parseInt(((fatLimit / 100) * calorieLimit) / 9);
  }

  if (carbsInGrams !== '') {
    carbsInGrams = parseInt(((carbLimit / 100) * calorieLimit) / 4);
  }

  if (proteinInGrams !== '') {
    proteinInGrams = parseInt(((proteinLimit / 100) * calorieLimit) / 4);
  }

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
              name='calorieLimit'
              type='number'
              value={calorieLimit}
              onChange={handleChange}
              label={'calories per day'}
              className='diet-form-row'
            />
            <FormInput
              name='fatLimit'
              type='number'
              value={fatLimit}
              onChange={handleChange}
              label={'desired % fats'}
              className='diet-form-row'
            />
            <FormInput
              name='carbLimit'
              type='number'
              value={carbLimit}
              onChange={handleChange}
              label={carbLabel}
              className='diet-form-row'
            />
            <FormInput
              name='proteinLimit'
              type='number'
              value={proteinLimit}
              onChange={handleChange}
              label={'desired % protein'}
              className='diet-form-row'
            />
          </form>
        </div>
        <div className='center-col'>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(calorieLimit)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(fatLimit)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(carbLimit)} />
          </div>
          <div className='diet-form-row'>
            <FaArrowAltCircleRight className={getArrowStyle(proteinLimit)} />
          </div>
        </div>
        <div className='right-col'>
          <div className={getOutputStyle(calorieLimit)}>
            {`${calorieLimit} cal / day`}
          </div>
          <div className={getOutputStyle(fatLimit)}>
            {`${fatsInGrams} g fat / day`}
          </div>
          <div className={getOutputStyle(carbLimit)}>
            {`${carbsInGrams} g carbs / day`}
          </div>
          <div className={getOutputStyle(proteinLimit)}>
            {`${proteinInGrams} g protein / day`}
          </div>
        </div>
        <button className='save-btn' type='submit' onClick={handleSubmit}>
          Save
        </button>
        <div></div>
        <div className='error'>{errorModal}</div>
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
