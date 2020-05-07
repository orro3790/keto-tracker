import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import FormInput from '../../components/form-input/form-input.component';
import { updateDietMacros } from '../../firebase/firebase.utils';
import { setUserMacros } from '../../redux/user/user.actions';
import FormHandler from '../../formHandler';
import { requiredValidation } from '../../validators';

import './profile-settings.styles.scss';

const ProfileSettings = ({ currentUser, setUserMacros }) => {
  const FIELDS = {
    fatLimit: {
      value: '',
      validations: [requiredValidation],
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

  const onSubmitDispatcher = () => {
    console.log('dispatched');
    const macros = {
      fats: parseInt(fields.fatLimit.value),
      carbs: parseInt(fields.carbLimit.value),
      protein: parseInt(fields.proteinLimit.value),
      calories: parseInt(fields.calorieLimit.value),
    };
    updateDietMacros(currentUser.id, macros);
    setUserMacros(macros);
  };

  const {
    fields,
    handleChange,
    handleSubmit,
    isSubmittable,
    errors,
  } = FormHandler(FIELDS, onSubmitDispatcher);

  console.log(errors);

  // const handleChange = (e) => {
  //   switch (e.target.name) {
  //     case 'fatLimit':
  //       setFatLimit(e.target.value);
  //       break;
  //     case 'carbLimit':
  //       setCarbLimit(e.target.value);
  //       break;
  //     case 'proteinLimit':
  //       setProteinLimit(e.target.value);
  //       break;
  //     case 'calorieLimit':
  //       setCalorieLimit(e.target.value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // if (isSubmittable === true) {
  // } else {
  //   console.log('errors exist, changes not saved');
  //   errors.map((error) => renderErrors(error));

  // Define validation error conditions
  const percentageTotals =
    parseInt(fields.fatLimit.value) +
    parseInt(fields.carbLimit.value) +
    parseInt(fields.proteinLimit.value);

  const fieldsIncomplete = isNaN(
    parseInt(fields.calorieLimit.value) +
      parseInt(fields.fatLimit.value) +
      parseInt(fields.carbLimit.value) +
      parseInt(fields.proteinLimit.value)
  );

  const caloriesFromFat =
    (fields.fatLimit.value / 100) * fields.calorieLimit.value;
  const caloriesFromCarbs =
    (fields.carbLimit.value / 100) * fields.calorieLimit.value;
  const caloriesFromProtein =
    (fields.proteinLimit.value / 100) * fields.calorieLimit.value;

  const macrosAddUpToCalories =
    caloriesFromFat + caloriesFromCarbs + caloriesFromProtein ===
    parseInt(fields.calorieLimit.value);

  // handles conditional rendering of error divs
  let keygen = 0;

  const renderErrors = (error) => {
    keygen++;
    return (
      <div className='error-message' key={keygen}>
        {error}
      </div>
    );
  };
  let errorModal;

  // conditionally style input container
  const getStyle = () => {
    if (
      percentageTotals !== 100 ||
      fieldsIncomplete === true ||
      macrosAddUpToCalories === false
    ) {
      return 'diet-input error';
    } else {
      return 'diet-input';
    }
  };

  useEffect(() => {}, [errors]);

  return (
    <div className='page-separator'>
      <div className='macro-calculator-container'>
        <div className='left-half'>
          <form className={getStyle()} onSubmit={handleSubmit}>
            <FormInput
              name='calorieLimit'
              type='number'
              placeholder='calories'
              value={fields.calorieLimit.value}
              onChange={handleChange}
            />
            <FormInput
              name='fatLimit'
              type='number'
              placeholder='fats (%)'
              value={fields.fatLimit.value}
              onChange={handleChange}
            />
            <FormInput
              name='carbLimit'
              type='number'
              placeholder='carbs (%)'
              value={fields.carbLimit.value}
              onChange={handleChange}
            />
            <FormInput
              name='proteinLimit'
              type='number'
              placeholder='protein (%)'
              value={fields.proteinLimit.value}
              onChange={handleChange}
            />

            <button
              className='save-changes-btn'
              type='submit'
              disabled={!isSubmittable}
            >
              Save
            </button>
          </form>
        </div>
        <div className='right-half'>
          <div className='error-modal'>{errorModal}</div>
        </div>
      </div>
      <div className='macro-calculator-output'>
        <div></div>
        <div>[picture]</div>
        <div></div>
        <div></div>
        <div className='calorie-output'>
          {fields.calorieLimit.value * 1} cal
        </div>
        <div></div>
        <div className='fat-output'>
          {parseInt(
            ((fields.fatLimit.value / 100) * fields.calorieLimit.value) / 9
          )}
          g
        </div>
        <div className='carb-output'>
          {parseInt(
            ((fields.carbLimit.value / 100) * fields.calorieLimit.value) / 4
          )}
          g
        </div>
        <div className='protein-output'>
          {parseInt(
            ((fields.proteinLimit.value / 100) * fields.calorieLimit.value) / 4
          )}
          g
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setUserMacros: (macros) => dispatch(setUserMacros(macros)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
