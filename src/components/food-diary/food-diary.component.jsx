import React, { useEffect, useState, useRef } from 'react';
import './food-diary.styles.scss';
import FoodItem from './../food-item/food-item.component';
import FormInput from './../form-input/form-input.component';
import Modal from './../modal/modal.component';
import { connect } from 'react-redux';
import { addFoodItem } from './../../redux/food-item/food-item.actions';

export const Diary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [foodItemInput, setFoodItemInput] = useState('');
  const outside = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // toggle modal popup
    setIsOpen(true);
  };

  const handleFoodItemInput = (e) => {
    setFoodItemInput(e.target.value);
  };

  const handleClick = (e) => {
    // if the click occurs within the modal, don't do anything, else ==> change isOpen to false
    if (outside.current.contains(e.target)) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    // Listen for click events, and call the handleClick function
    const getClick = function () {
      document.addEventListener('click', handleClick);
    };
    return () => {
      getClick();
    };
  });

  return (
    <div className='diary-container' ref={outside}>
      <Modal isOpen={isOpen} />
      <div className='add-food-btn'>
        <i class='fas fa-plus-square' onClick={handleSubmit}></i>
      </div>
      <div className='food-item-input'>
        <form onSubmit={handleSubmit}>
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
      <div className='outer-container'>
        <FoodItem />
      </div>
    </div>
  );
};

// const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  addFoodItem: (foodItem) => dispatch(addFoodItem(foodItem)),
});

export default connect(null, mapDispatchToProps)(Diary);
