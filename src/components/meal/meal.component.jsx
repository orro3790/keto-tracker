import React from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';

const Meal = ({ meal }) => {
  const handleClick = () => {
    console.log(meal);
  };

  return (
    <div>
      <div className='meal-header-container'>
        <span className='meal-title'>{meal}</span>
        <span className='add-food-to-meal-btn'>
          <i className='fas fa-plus-square' onClick={handleClick}></i>
        </span>
      </div>
      <FoodItem />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(null, mapDispatchToProps)(Meal);
