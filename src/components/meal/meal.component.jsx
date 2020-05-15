import React, { useEffect, useState } from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import { toggleSearchModal } from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { setEntry } from '../../redux/date-selector/date-selector.actions';

const Meal = ({
  meal,
  toggleSearchModal,
  searchModal,
  entries,
  createFoodReference,
  currentUser,
}) => {
  const [totalFats, setTotalFats] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState([]);
  const [totalProtein, setTotalProtein] = useState([]);
  const [totalCalories, setTotalCalories] = useState([]);
  const [totalFiber, setTotalFiber] = useState([]);

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

  // handles the rendering of totals in the UI
  useEffect(() => {
    if (entries !== '' && currentUser !== null) {
      // total fats in meal
      const fats = entries[meal]['foods'].reduce((accumulator, food) => {
        return (accumulator += food.f);
      }, 0);
      setTotalFats(parseFloat(fats.toFixed(1)));

      // total carbs in meal
      const carbs = entries[meal]['foods'].reduce((accumulator, food) => {
        return (accumulator += food.c);
      }, 0);
      setTotalCarbs(parseFloat(carbs.toFixed(1)));

      // total protein in meal
      const protein = entries[meal]['foods'].reduce((accumulator, food) => {
        return (accumulator += food.p);
      }, 0);
      setTotalProtein(parseFloat(protein.toFixed(1)));

      // total calories in meal
      const calories = entries[meal]['foods'].reduce((accumulator, food) => {
        return (accumulator += food.e);
      }, 0);
      setTotalCalories(parseFloat(calories.toFixed(1)));

      // total fiber in meal
      const fiber = entries[meal]['foods'].reduce((accumulator, food) => {
        return (accumulator += food.d);
      }, 0);
      setTotalFiber(parseFloat(fiber.toFixed(1)));

      const copy = Object.assign({}, entries);

      copy[meal]['totals']['f'] = fats;
      copy[meal]['totals']['c'] = carbs;
      copy[meal]['totals']['p'] = protein;
      copy[meal]['totals']['e'] = calories;
      copy[meal]['totals']['d'] = fiber;

      setEntry(copy);
    }
  }, [entries, meal, currentUser]);

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
          {/* {meal} */}
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
            {totalFats}
            <div className='macro-label'>fats</div>
          </div>
          <div className='total-carbs'>
            {totalCarbs}
            <div className='macro-label'>carbs</div>
          </div>
          <div className='total-protein'>
            {totalProtein}
            <div className='macro-label'>protein</div>
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
  update: state.searchModal.updateTotals,
  entries: state.dateSelector.entries,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  setEntry: (entries) => dispatch(setEntry(entries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
