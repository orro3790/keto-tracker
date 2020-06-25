import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
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
import { Diet } from '../../../redux/user/user.types';
import { RootState } from '../../../redux/root-reducer';
import './update-diet.styles.scss';
import * as AlertModalTypes from '../../../redux/alert-modal/alert-modal.types';

type Props = PropsFromRedux;

const UpdateDiet = ({
  toggleAlertModal,
  diet,
  userId,
  carbSettings,
}: Props) => {
  const [fatGoal, setFatGoal] = useState<string>('');
  const [carbGoal, setCarbGoal] = useState<string>('');
  const [proteinGoal, setProteinGoal] = useState<string>('');
  const [calorieGoal, setCalorieGoal] = useState<string>('');

  // type Macro = number | string;

  const grams: Grams = {
    f: 0,
    c: 0,
    p: 0,
  };

  interface Grams {
    f: number | string;
    c: number | string;
    p: number | string;
  }

  // calculate the macro % goal in grams and store it in the grams obj
  if (fatGoal !== '') {
    grams.f = (((+fatGoal / 100) * +calorieGoal) / 9).toFixed(0);
  }
  if (grams.c !== '') {
    grams.c = (((+carbGoal / 100) * +calorieGoal) / 4).toFixed(0);
  }
  if (grams.p !== '') {
    grams.p = (((+proteinGoal / 100) * +calorieGoal) / 4).toFixed(0);
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
    totalPercentage += +fatGoal;
  }
  if (carbGoal !== '') {
    totalPercentage += +carbGoal;
  }
  if (proteinGoal !== '') {
    totalPercentage += +proteinGoal;
  }

  // in order to check whether sum of percentages === 100, apply .toPrecision(3), then convert back to int
  totalPercentage = parseInt(totalPercentage.toPrecision(3));

  // determine whether or not the form can be submitted
  let isSubmittable = false;

  // prevent zero grams as they will return NaN or Infinite when calculating precision
  let zeroGrams = false;

  const checkZeroGrams = (value: number) => {
    return value === 0;
  };

  zeroGrams = Object.values(grams).some(checkZeroGrams);

  if (fieldsFilled === true && totalPercentage === 100 && zeroGrams === false) {
    isSubmittable = true;
  }

  // collect any errors
  interface Error {
    error: string;
  }

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
  const renderErrors = (errorsArray: Error[]) => {
    return errorsArray.map((error: Error) => (
      <div className='diet-form-row' key={error.error}>
        {error.error}
      </div>
    ));
  };

  let error = renderErrors(errors);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (isSubmittable) {
      let goals = Object.assign({}, diet);

      // convert all values to float before pushing to firebase
      goals.f = +grams.f;
      goals.p = +grams.p;
      goals.e = +calorieGoal;

      // assign carb goal to either net carbs or total carbs based on user carb settings
      switch (carbSettings) {
        case 't':
          goals.c = +grams.c;
          goals.k = null;
          break;
        case 'n':
          goals.k = +grams.c;
          goals.c = null;
          break;
        default:
          break;
      }

      // now update the data in firestore
      updateDiet(userId as string, goals);

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

  const getArrowStyle = (value: string) => {
    if (value) {
      return 'far fa-arrow-alt-circle-right output-arrow on';
    } else {
      return 'far fa-arrow-alt-circle-right output-arrow';
    }
  };

  const getOutputStyle = (value: string) => {
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

interface Selectors {
  carbSettings: 't' | 'n' | undefined;
  diet: Diet | undefined;
  userId: string | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  carbSettings: selectCarbSettings,
  diet: selectDietSettings,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (
  dispatch: Dispatch<AlertModalTypes.ToggleAlertModal>
) => ({
  toggleAlertModal: (object: AlertModalTypes.Modal) =>
    dispatch(toggleAlertModal(object)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UpdateDiet);
