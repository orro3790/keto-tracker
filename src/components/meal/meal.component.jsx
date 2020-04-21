import React from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';

const Meal = ({ meal }) => {
  return (
    <div>
      <h3>{meal}</h3>
      <FoodItem />
    </div>
  );
};

export default Meal;
