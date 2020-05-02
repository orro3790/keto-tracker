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
  dates,
}) => {
  const handleClick = () => {
    if (searchModal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: false,
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: meal,
      });
    }
  };

  // indexing starts at 0, therefore tart from -1 so the first item is assigned a listId of 0
  let keygen = -1;
  const renderFoodItems = (food) => {
    keygen++;
    return <FoodItem key={keygen} listId={keygen} food={food} meal={meal} />;
  };

  const subtotalFats = entries[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.fats);
    },
    0
  );

  const subtotalCarbs = entries[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.carbs);
    },
    0
  );

  const subtotalProtein = entries[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.protein);
    },
    0
  );

  const subtotalCalories = entries[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.calories);
    },
    0
  );

  const copy = Object.assign({}, entries);

  copy[dates.currentDate][meal]['totals']['fats'] = subtotalFats;
  copy[dates.currentDate][meal]['totals']['carbs'] = subtotalCarbs;
  copy[dates.currentDate][meal]['totals']['protein'] = subtotalProtein;
  copy[dates.currentDate][meal]['totals']['calories'] = subtotalCalories;

  // add totals to the entry obj
  useEffect(() => {
    createEntry(copy);
  }, [subtotalCalories]);

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj !== undefined) {
  } else {
    entriesObj = entries;
    console.log('undefined');
  }

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
      {entriesObj[dates.currentDate][meal]['foods'].map((food) =>
        renderFoodItems(food)
      )}
      <div className='totals-row'>
        <div className='total-label'>totals</div>
        <div className='totals-container'>
          <div className='total-size'></div>
          <div className='total-fats'>
            {entries[dates.currentDate][meal]['totals']['fats'].toFixed(1)}
          </div>
          <div className='total-carbs'>
            {entries[dates.currentDate][meal]['totals']['carbs'].toFixed(1)}
          </div>
          <div className='total-protein'>
            {entries[dates.currentDate][meal]['totals']['protein'].toFixed(1)}
          </div>
          <div className='total-calories'>{subtotalCalories.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  entries: state.foodDiary.entries,
  dates: state.foodDiary.dates,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createEntry: (entry) => dispatch(createEntry(entry)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
