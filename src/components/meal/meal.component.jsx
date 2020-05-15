import React, { useEffect, useState } from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import {
  toggleSearchModal,
  updateTotals,
} from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { setEntry } from '../../redux/date-selector/date-selector.actions';

const Meal = ({
  meal,
  toggleSearchModal,
  searchModal,
  entries,
  createFoodReference,
  currentUser,
  updateTotals,
}) => {
  const [totalFats, setTotalFats] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

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

  // handles the displaying of totals in the UI, but searchModal handles the calculations
  useEffect(() => {
    if (entries !== '') {
      setTotalFats(entries[meal].totals.f);
      setTotalCarbs(entries[meal].totals.c);
      setTotalProtein(entries[meal].totals.p);
      setTotalCalories(entries[meal].totals.e);
    }
  }, [entries, meal]);

  // indexing starts at 0, therefore tart from -1 so the first item is assigned a listId of 0
  let keygen = -1;
  const renderFoodItems = (food) => {
    keygen++;
    return <FoodItem key={keygen} listId={keygen} food={food} meal={meal} />;
  };

  let entryPlaceholder = {
    [meal]: {
      foods: [],
    },
  };

  if (entries !== '') {
    entryPlaceholder = entries;
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
      {entryPlaceholder[meal]['foods'].map((food) => renderFoodItems(food))}
      <div className='totals-row'>
        <div className='total-label'>totals</div>
        <div className='totals-container'>
          <div className='total-size'></div>
          <div className='total-fats'>
            {totalFats}g<div className='macro-label'>fats</div>
          </div>
          <div className='total-carbs'>
            {totalCarbs}g<div className='macro-label'>carbs</div>
          </div>
          <div className='total-protein'>
            {totalProtein}g<div className='macro-label'>protein</div>
          </div>
          <div className='total-calories'>
            {totalCalories}
            <div className='macro-label'>calories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.searchModal.searchModal,
  entries: state.dateSelector.entries,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  setEntry: (entries) => dispatch(setEntry(entries)),
  updateTotals: (status) => dispatch(updateTotals(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
