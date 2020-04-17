import React from 'react';
import { connect } from 'react-redux';
import {
  createFoodItem,
  changeModalStatus,
  toggleConfirmation,
} from '../../redux/create-food-item/create-food-item.actions.js';
import FormHandler from './../../formHandler.js';
import { requiredValidation } from './../../validators.js';
import './create-food-item.styles.scss';

const CreateFood = ({
  createFoodItem,
  changeModalStatus,
  modalStatus,
  createdFoods,
  toggleConfirmation,
}) => {
  const FIELDS = {
    name: {
      value: '',
      validations: [requiredValidation],
    },
    description: {
      value: '',
      validations: [],
    },
    grams: {
      value: '',
      validations: [requiredValidation],
    },
    fats: {
      value: '',
      validations: [requiredValidation],
    },
    carbs: {
      value: '',
      validations: [requiredValidation],
    },
    protein: {
      value: '',
      validations: [requiredValidation],
    },
    calories: {
      value: '',
      validations: [requiredValidation],
    },
  };

  const onSubmitDispatcher = () => {
    // errors and validations do not need to be stored in item creation
    Object.keys(fields).map((key) => delete fields[key].errors);
    Object.keys(fields).map((key) => delete fields[key].validations);
    createFoodItem(fields);
    toggleConfirmation('true');
    setTimeout(function () {
      toggleConfirmation('false');
    }, 2000);
    changeModalStatus('closed');
  };

  const { fields, handleChange, handleSubmit, isSubmittable } = FormHandler(
    FIELDS,
    onSubmitDispatcher
  );

  const handleClose = () => {
    // control the modal window
    if (modalStatus === 'closed') {
      changeModalStatus('open');
    } else {
      changeModalStatus('closed');
    }
  };

  return (
    <div>
      <form className='modal'>
        <div className='modal-outer-box'>
          <div className='modal-inner-box'>
            <span className='reset-fields-btn'>
              <i className='fas fa-times-circle' onClick={handleClose}></i>
            </span>
            <div className='title-section'>
              <input
                className='food-name-input'
                name='name'
                type='text'
                value={fields.name.value}
                onChange={handleChange}
                placeholder='Add a name...'
                maxLength='35'
                required
              />
            </div>
            <div className='description-section'>
              <textarea
                className='description-area'
                name='description'
                value={fields.description.value}
                onChange={handleChange}
                placeholder='Add a description...'
                maxLength='200'
              ></textarea>
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              <input
                className={'macro-input'}
                name='grams'
                type='text'
                value={fields.grams.value}
                onChange={handleChange}
                placeholder='0'
                maxLength='7'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='text'
                value={fields.fats.value}
                onChange={handleChange}
                placeholder='0'
                maxLength='7'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='text'
                value={fields.carbs.value}
                onChange={handleChange}
                placeholder='0'
                maxLength='7'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='text'
                value={fields.protein.value}
                onChange={handleChange}
                placeholder='0'
                maxLength='7'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='text'
                value={fields.calories.value}
                onChange={handleChange}
                placeholder='0'
                maxLength='7'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <button
            className='add-to-diary-btn'
            disabled={!isSubmittable}
            type='submit'
            onClick={handleSubmit}
          >
            <div className='add-to-diary-btn-text'>
              Add to Diary
              <i className='fas fa-plus'></i>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  createdFoods: state.createdFoods.createdFoods,
  modalStatus: state.createdFoods.modalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodItem: (newFoodItem) => dispatch(createFoodItem(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
  toggleConfirmation: (status) => dispatch(toggleConfirmation(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
