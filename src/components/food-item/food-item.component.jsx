import React from 'react';
import './food-item.styles.scss';

const FoodItem = ({ food }) => {
  return (
    <div className='meal-outer-container'>
      <div className='macro-row'>
        <div className='name-description-container'>
          <div className='food-name'>{food.name}</div>
          <div className='food-item-description'>{food.description}</div>
        </div>
        <div className='macro-container'>
          <div className='macro'>{food.fats}</div>
          <div className='macro'>{food.carbs}</div>
          <div className='macro'>{food.protein}</div>
          <div className='macro'>{food.calories}</div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
