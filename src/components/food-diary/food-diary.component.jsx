import React, { useEffect, useState, useRef } from 'react';
import './food-diary.styles.scss';
import FormInput from './../form-input/form-input.component';
import CreateFood from '../create-food-item/create-food-item';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { connect } from 'react-redux';

export const Diary = ({ changeModalStatus, modalStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [foodItemInput, setFoodItemInput] = useState('');
  const outside = useRef();

  const handleClick = (e) => {
    e.preventDefault();
    // toggle modal popup
    if (modalStatus === 'closed') {
      changeModalStatus('open');
    } else {
      changeModalStatus('closed');
    }
  };

  const handleFoodItemInput = (e) => {
    setFoodItemInput(e.target.value);
  };

  // conditionally render the modal based on modal status
  let modal;
  if (modalStatus === 'open') {
    modal = <CreateFood />;
  } else {
    modal = null;
  }

  return (
    <div className='diary-container' ref={outside}>
      <div className='add-food-btn'>
        <i className='fas fa-plus-square' onClick={handleClick}></i>
      </div>
      {modal}
      <div className='food-item-input'>
        <form>
          <FormInput
            name='foodItemInput'
            type='text'
            onChange={handleFoodItemInput}
            value={foodItemInput}
            label='Add a food item'
            required
          />
        </form>
      </div>
      <div className='outer-container'></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modalStatus: state.createdFoods.modalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  CreateFood: (newFoodItem) => dispatch(CreateFood(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
