import React, { useEffect } from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const Meal = ({
  meal,
  toggleSearchModal,
  searchModal,
  entries,
  dates,
  createFoodReference,
}) => {
  const handleClick = () => {
    if (searchModal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: false,
      });
      createFoodReference('');
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: meal,
      });
    }
  };

  // if entries obj in localStorage, use it for rendering, else use the entries object in state
  let entriesObj;
  entriesObj = JSON.parse(localStorage.getItem('entries'));
  if (entriesObj === undefined || entriesObj === null) {
    entriesObj = entries;
  }

  // indexing starts at 0, therefore tart from -1 so the first item is assigned a listId of 0
  let keygen = -1;
  const renderFoodItems = (food) => {
    keygen++;
    return <FoodItem key={keygen} listId={keygen} food={food} meal={meal} />;
  };

  const subtotalFats = entriesObj[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.fats);
    },
    0
  );

  const subtotalCarbs = entriesObj[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.carbs);
    },
    0
  );

  const subtotalProtein = entriesObj[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.protein);
    },
    0
  );

  const subtotalCalories = entriesObj[dates.currentDate][meal]['foods'].reduce(
    (accumulator, food) => {
      return (accumulator += food.calories);
    },
    0
  );

  const copy = Object.assign({}, entriesObj);

  copy[dates.currentDate][meal]['totals']['fats'] = subtotalFats;
  copy[dates.currentDate][meal]['totals']['carbs'] = subtotalCarbs;
  copy[dates.currentDate][meal]['totals']['protein'] = subtotalProtein;
  copy[dates.currentDate][meal]['totals']['calories'] = subtotalCalories;

  localStorage.setItem('entries', JSON.stringify(copy));

  useEffect(() => {
    // remove from localStorage and replace it with the new one
    localStorage.removeItem('entries');
    localStorage.setItem('entries', JSON.stringify(copy));
  }, [copy]);

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
            {entriesObj[dates.currentDate][meal]['totals']['fats'].toFixed(1)}
            <div className='macro-label'>fats</div>
          </div>
          <div className='total-carbs'>
            {entriesObj[dates.currentDate][meal]['totals']['carbs'].toFixed(1)}
            <div className='macro-label'>carbs</div>
          </div>
          <div className='total-protein'>
            {entriesObj[dates.currentDate][meal]['totals']['protein'].toFixed(
              1
            )}
            <div className='macro-label'>protein</div>
          </div>
          <div className='total-calories'>
            {subtotalCalories.toFixed(1)}
            <div className='macro-label'>calories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  entries: state.dateSelector.entries,
  dates: state.dateSelector.dates,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
