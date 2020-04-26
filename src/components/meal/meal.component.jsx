import React from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';

const Meal = ({ meal, toggleSearchModal, searchModal, mealsObj }) => {
  let currentDate = new Date();

  const [date, month, year] = [
    currentDate.getUTCDate(),
    currentDate.getUTCMonth(),
    currentDate.getUTCFullYear(),
  ];

  currentDate = `${month}-${date}-${year}`;

  const handleClick = () => {
    if (searchModal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: meal,
      });
    }
  };

  let keygen = 0;
  const renderFoodItems = (food) => {
    keygen++;
    return <FoodItem key={keygen} food={food} />;
  };

  const totalFats = mealsObj[currentDate][meal].reduce((accumulator, food) => {
    return (accumulator += food.fats);
  }, 0);

  const totalCarbs = mealsObj[currentDate][meal].reduce((accumulator, food) => {
    return (accumulator += food.carbs);
  }, 0);

  const totalProtein = mealsObj[currentDate][meal].reduce(
    (accumulator, food) => {
      return (accumulator += food.protein);
    },
    0
  );

  const totalCalories = mealsObj[currentDate][meal].reduce(
    (accumulator, food) => {
      return (accumulator += food.calories);
    },
    0
  );

  return (
    <div>
      <div className='meal-header-container'>
        <span className='meal-title'>{meal}</span>
        <span className='add-food-to-meal-btn'>
          <i className='fas fa-plus-square' onClick={handleClick}></i>
        </span>
      </div>
      {mealsObj[currentDate][meal].map((food) => renderFoodItems(food))}
      <div className='totals-row'>
        <div></div>
        <div>{totalFats}</div>
        <div>{totalCarbs}</div>
        <div>{totalProtein}</div>
        <div>{totalCalories}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  mealsObj: state.foodDiary.meals,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
