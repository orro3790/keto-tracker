import React, { useState } from 'react';
import './food-item.styles.scss';
import { connect } from 'react-redux';

const FoodItem = () => {
  const FIELDS = {
    name: 'avocado',
    description: 'Kirkland 6pc',
    fats: '10',
    carbs: '1.8',
    protein: '1.3',
    calories: '120',
  };
  const [fields] = useState(FIELDS);

  return (
    <div className='meal-outer-container'>
      <div className='macro-row'>
        <div className='food-item-name'>{fields.name}</div>
        <div>{fields.fats}</div>
        <div>{fields.carbs}</div>
        <div>{fields.protein}</div>
        <div>{fields.calories}</div>
        <div className='food-item-description'>{fields.description}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // foodDatabase: state.foodDiary.foods,
});

export default connect(mapStateToProps)(FoodItem);
