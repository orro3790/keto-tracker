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
import { createCreateFoodDocument } from './../../firebase/firebase.utils.js';

const CreateFood = ({
  createFoodItem,
  changeModalStatus,
  modalStatus,
  createdFoods,
  toggleConfirmation,
  currentUser,
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
    // create the new item
    createFoodItem(fields);
    // try to push to firebase
    pushToFirebase();
  };

  const { fields, handleChange, handleSubmit, isSubmittable } = FormHandler(
    FIELDS,
    onSubmitDispatcher
  );

  const handleClose = () => {
    // control the modal window
    if (modalStatus === 'closed') {
      changeModalStatus('opened');
    } else {
      changeModalStatus('closed');
    }
  };

  const pushToFirebase = async () => {
    const results = await createCreateFoodDocument(currentUser, fields);
    if (results === 'successful') {
      // close the createFood modal
      changeModalStatus('closed');
      toggleConfirmation('opened-success');
    } else {
      toggleConfirmation('opened-error');
    }
  };

  return (
    <div>
      <form className='modal'>
        <div className='modal-outer-box'>
          <div className='modal-inner-box'>
            <span className='close-modal-btn'>
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
                maxLength='40'
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
                type='number'
                value={fields.grams.value}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='number'
                value={fields.fats.value}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='number'
                value={fields.carbs.value}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='number'
                value={fields.protein.value}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='number'
                value={fields.calories.value}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <button
            className='submit-btn'
            disabled={!isSubmittable}
            type='submit'
            onClick={handleSubmit}
          >
            <div className='submit-btn-text'>
              Add to Database
              <i className='fas fa-plus'></i>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  currentUser: state.user.currentUser,
  createdFoods: state.createFoodItem.createdFoods,
  modalStatus: state.createFoodItem.modalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodItem: (newFoodItem) => dispatch(createFoodItem(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
  toggleConfirmation: (status) => dispatch(toggleConfirmation(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
