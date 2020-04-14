import React from 'react';
import './food-item.styles.scss';
import { connect } from 'react-redux';

const FoodItem = () => {
  return (
    <div className='outer-container'>
      <div className='food-row'>
        <div>food title</div>
        <div>fats</div>
        <div>carbs</div>
        <div>protein</div>
        <div>calories</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodItem: state.foodItem.foodItems,
});

export default connect(mapStateToProps)(FoodItem);
