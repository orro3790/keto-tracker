import React from 'react';
import './food-item.styles.scss';
import { connect } from 'react-redux';

const FoodItem = ({ food }) => {
  return (
    <div className='meal-outer-container'>
      <div className='macro-row'>
        <div className='food-item-name'>{food.name}</div>
        <div>{food.fats}</div>
        <div>{food.carbs}</div>
        <div>{food.protein}</div>
        <div>{food.calories}</div>
        <div className='food-item-description'>{food.description}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // foodDatabase: state.foodDiary.foods,
});

export default connect(mapStateToProps)(FoodItem);
