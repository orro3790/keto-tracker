import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import FormInput from '../form-input/form-input.component';
import { updateDietSettings } from '../../firebase/firebase.utils';
import { setCurrentUser } from '../../redux/user/user.actions';
import FormHandler from '../../formHandler';
import { requiredValidation, under100 } from '../../validators';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';

import './diet-settings.styles.scss';

const DietSettings = ({ currentUser, setCurrentUser }) => {
  const [confirmationMsg, setConfirmationMsg] = useState(null);
  const [modalStatus, setModalStatus] = useState(null);
  const [dietSettings, setDietSettings] = useState(null);

  const FIELDS = {
    fatLimit: {
      value: '',
      validations: [requiredValidation, under100],
    },
    carbLimit: {
      value: '',
      validations: [requiredValidation],
    },
    proteinLimit: {
      value: '',
      validations: [requiredValidation],
    },
    calorieLimit: {
      value: '',
      validations: [requiredValidation],
    },
  };

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

  const onSubmitDispatcher = () => {
    const userCopy = Object.assign({}, currentUser);

    userCopy.diet = {
      fats: parseInt(fatsInGrams),
      carbs: parseInt(carbsInGrams),
      protein: parseInt(proteinInGrams),
      calories: parseInt(fields.calorieLimit.value),
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

  const { fields, handleChange, handleSubmit } = FormHandler(
    FIELDS,
    onSubmitDispatcher
  );

  // Define meta-level validator
  const fieldsFilled = !isNaN(
    parseInt(fields.calorieLimit.value) +
      parseInt(fields.fatLimit.value) +
      parseInt(fields.carbLimit.value) +
      parseInt(fields.proteinLimit.value)
  );

  const totalPercentage =
    parseInt(fields.fatLimit.value) +
    parseInt(fields.carbLimit.value) +
    parseInt(fields.proteinLimit.value);

  const totalPercentageValidator = {
    isValid: totalPercentage === 100,
    message: '*percentages must add up to 100',
  };

  let metaErrors = [];

  if (totalPercentageValidator.isValid === false && fieldsFilled) {
    metaErrors.push(totalPercentageValidator.message);
  }

  // define whether or not the form can be submitted
  let isSubmittable = false;

  if (metaErrors.length === 0 && fieldsFilled) {
    isSubmittable = true;
  }

  // handles conditional rendering of error divs

  const renderErrors = (errorsArray) => {
    return errorsArray.map((error) => (
      <div className='diet-form-row' key={error}>
        {error}
      </div>
    ));
  };

  let errorModal = renderErrors(metaErrors);

  const fatsInGrams = parseInt(
    ((fields.fatLimit.value / 100) * fields.calorieLimit.value) / 9
  );

  const carbsInGrams = parseInt(
    ((fields.carbLimit.value / 100) * fields.calorieLimit.value) / 4
  );

  const proteinInGrams = parseInt(
    ((fields.proteinLimit.value / 100) * fields.calorieLimit.value) / 4
  );

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

  useEffect(() => {}, [currentUser]);

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

  return (
    <div>
      <div className='title'>Current Diet</div>
      {confirmationModal}
      <div className='current-macros'>
        <div className='daily-fats macro-container'>
          {fats}g<div className='label'>fats</div>
        </div>
        <div className='daily-carbs macro-container'>
          {carbs}g<div className='label'>carbs</div>
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
              value={fields.calorieLimit.value}
              onChange={handleChange}
              label={'calories per day'}
              className='diet-form-row'
            />
            <FormInput
              name='fatLimit'
              type='number'
              value={fields.fatLimit.value}
              onChange={handleChange}
              label={'desired % fats'}
              className='diet-form-row'
            />
            <FormInput
              name='carbLimit'
              type='number'
              value={fields.carbLimit.value}
              onChange={handleChange}
              label={'desired % carbs'}
              className='diet-form-row'
            />
            <FormInput
              name='proteinLimit'
              type='number'
              value={fields.proteinLimit.value}
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
            <i className={getArrowStyle(fields.calorieLimit.value)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(fields.fatLimit.value)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(fields.carbLimit.value)}></i>
          </div>
          <div className='diet-form-row'>
            <i className={getArrowStyle(fields.proteinLimit.value)}></i>
          </div>
          <div className='diet-form-row'></div>
        </div>
        <div className='right-col'>
          <div className={getOutputStyle(fields.calorieLimit.value)}>
            {`${fields.calorieLimit.value} cal / day`}
          </div>
          <div className={getOutputStyle(fields.fatLimit.value)}>
            {`${fatsInGrams} g fat / day`}
          </div>
          <div className={getOutputStyle(fields.carbLimit.value)}>
            {`${carbsInGrams} g carbs / day`}
          </div>
          <div className={getOutputStyle(fields.proteinLimit.value)}>
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
