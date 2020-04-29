import React, { useEffect } from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { createEntry } from '../../redux/food-diary/food-diary.actions';

const Meal = ({
  meal,
  toggleSearchModal,
  searchModal,
  entries,
  createEntry,
}) => {
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

  const subtotalFats = entries[currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.fats);
    },
    0
  );

  const subtotalCarbs = entries[currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.carbs);
    },
    0
  );

  const subtotalProtein = entries[currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.protein);
    },
    0
  );

  const subtotalCalories = entries[currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.calories);
    },
    0
  );

  const copy = Object.assign({}, entries);

  copy[currentDate][meal]['totals']['fats'] = subtotalFats;
  copy[currentDate][meal]['totals']['carbs'] = subtotalCarbs;
  copy[currentDate][meal]['totals']['protein'] = subtotalProtein;
  copy[currentDate][meal]['totals']['calories'] = subtotalCalories;

  // add totals to the entry obj
  useEffect(
    () => {
      createEntry(copy);
    },
    [subtotalCalories],
    copy
  );

  return (
    <div>
      <div className='meal-header-container'>
        <span className='meal-title'>
          {meal}
          <span className='add-food-to-meal-btn' onClick={handleClick}>
            <i className='fas fa-plus-square'></i>
          </span>
        </span>
      </div>
      {entries[currentDate][meal]['foods'].map((food) => renderFoodItems(food))}
      <div className='totals-row'>
        <div className='total-label'>totals</div>
        <div className='totals-container'>
          <div className='total-fats'>
            {entries[currentDate][meal]['totals']['fats']}
          </div>
          <div className='total-carbs'>
            {entries[currentDate][meal]['totals']['carbs']}
          </div>
          <div className='total-protein'>
            {entries[currentDate][meal]['totals']['protein']}
          </div>
          <div className='total-calories'>{subtotalCalories}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  entries: state.foodDiary.entries,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createEntry: (entry) => dispatch(createEntry(entry)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
