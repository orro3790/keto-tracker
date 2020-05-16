import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import FormInput from '../form-input/form-input.component';
import { updateDietSettings } from '../../firebase/firebase.utils';
import { setCurrentUser } from '../../redux/user/user.actions';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';

import './diet-settings.styles.scss';

const DietSettings = ({ currentUser, setCurrentUser }) => {
  const [confirmationMsg, setConfirmationMsg] = useState(null);
  const [modalStatus, setModalStatus] = useState(null);
  const [fatLimit, setFatLimit] = useState('');
  const [carbLimit, setCarbLimit] = useState('');
  const [proteinLimit, setProteinLimit] = useState('');
  const [calorieLimit, setCalorieLimit] = useState('');

  // load 0 as default values if currentUser.diet data hasn't been loaded into state yet
  let fats = 0;
  let protein = 0;
  let carbs = 0;
  let calories = 0;

  if (currentUser !== null) {
    fats = currentUser.diet.fats;
    protein = currentUser.diet.protein;
    carbs = currentUser.diet.carbs;
    calories = currentUser.diet.calories;
  }

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
      error: 'Sum of percentages must be 100%.',
    });
  }

  if (totalPercentage > 100) {
    metaErrors.push({
      error: 'Sum of percentages cannot be greater than 100%.',
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

  const handleSubmit = () => {
    const userCopy = Object.assign({}, currentUser);

    userCopy.diet = {
      fats: parseInt(fatsInGrams),
      carbs: parseInt(carbsInGrams),
      protein: parseInt(proteinInGrams),
      calories: parseInt(calorieLimit),
    };

    setCurrentUser(userCopy);

    // now update the data in firestore
    updateDietSettings(currentUser.id, userCopy.diet);

    setCurrentUser(userCopy);

    setConfirmationMsg({
      success: 'Diet settings successfully updated!',
    });
    setModalStatus('visible');
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
      return 'far fa-arrow-alt-circle-right output-arrow enabled';
    } else {
      return 'far fa-arrow-alt-circle-right output-arrow';
    }
  };

  const getOutputStyle = (value) => {
    if (value) {
      return 'diet-form-row enabled';
    } else {
      return 'diet-form-row disabled';
    }
  };

  const handleClose = () => {
    setModalStatus(null);
  };

  let confirmationModal;

  if (modalStatus === 'visible') {
    confirmationModal = (
      <ConfirmationModal
        messageObj={confirmationMsg}
        handleClose={handleClose}
      />
    );
  } else {
    confirmationModal = null;
  }

  let carbType = 'carbs';
  let carbLabel = 'desired % carbs';

  if (currentUser && currentUser.carbSettings === 'net') {
    carbType = 'net carbs';
    carbLabel = 'desired % net carbs';
  }

  return (
    <div>
      <div className='title'>Current Diet</div>
      {confirmationModal}
      <div className='current-macros'>
        <div className='daily-fats macro-container'>
          {fats}g<div className='label'>fats</div>
        </div>
        <div className='daily-carbs macro-container'>
          {carbs}g<div className='label'>{carbType}</div>
        </div>
        <div className='daily-protein macro-container'>
          {protein}g<div className='label'>protein</div>
        </div>
        <div className='daily-calories macro-container'>
          {calories}
          <div className='label'>calories</div>
        </div>
      </div>
      <div className='title'>Update Diet Settings</div>
      <div className='macro-calculator-container'>
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
            <button
              className='save-changes-btn diet-form-row'
              type='submit'
              disabled={!isSubmittable}
            >
              Save
            </button>
          </form>
        </div>
        <div className='center-col'>
          <div className='diet-form-row'>
            <i className={getArrowStyle(calorieLimit)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(fatLimit)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(carbLimit)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(proteinLimit)}></i>
          </div>
          <div className='diet-form-row'></div>
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
          <div className='diet-form-row'></div>
        </div>
        <div className='error-col'>{errorModal}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DietSettings);
