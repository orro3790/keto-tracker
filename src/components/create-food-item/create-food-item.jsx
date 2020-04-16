import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  createFoodItem,
  changeModalStatus,
} from '../../redux/create-food-item/create-food-item.actions.js';
import FormHandler from './../../formHandler.js';
import './create-food-item.styles.scss';

const CreateFood = ({ createFoodItem, changeModalStatus, modalStatus }) => {
  const FIELDS = {
    name: {
      value: '',
    },
    description: {
      value: '',
    },
    grams: {
      value: '',
    },
    fats: {
      value: '',
    },
    carbs: {
      value: '',
    },
    protein: {
      value: '',
    },
    calories: {
      value: '',
    },
  };

  const { fields, isSubmitting, handleChange, handleSubmit } = FormHandler(
    FIELDS
  );

  // useEffect(() => {

  // });

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const newFoodItem = {
  //     name: foodName,
  //     description: foodDescription,
  //     grams: grams,
  //     fats: fats,
  //     carbs: carbs,
  //     protein: protein,
  //     calories: calories,
  //   };
  //   createFoodItem(newFoodItem);
  //   console.log('submitted!');
  // };

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
              {/* <i className='fas fa-eraser' onClick={handleReset}></i> */}
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
          <div className='next-btn' type='submit' onClick={handleSubmit}>
            <div className='next-btn-text'>
              Add to Diary
              <i className='fas fa-plus'></i>
            </div>
          </div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
