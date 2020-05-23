import React, { useEffect, useState } from 'react';
import FoodItem from './../food-item/food-item.component';
import './meal.styles.scss';
import { connect } from 'react-redux';
import { toggleSearchModal } from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const Meal = ({
  meal,
  toggleSearchModal,
  searchModal,
  entries,
  createFoodReference,
  currentUser,
}) => {
  const [totalFats, setTotalFats] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalNetCarbs, setTotalNetCarbs] = useState(0);
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
      setTotalNetCarbs(entries[meal].totals.k);
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

  let carbType = 'carbs';
  let totalCarbsOrNetCarbsValue;

  if (currentUser !== null) {
    if (currentUser.carbSettings === 'net') {
      carbType = 'net carbs';
      totalCarbsOrNetCarbsValue = totalNetCarbs;
    } else {
      carbType = 'carbs';
      totalCarbsOrNetCarbsValue = totalCarbs;
    }
  }

  return (
    <div>
      <div className='meal-h-c'>
        <span className='t'>
          {meal}
          <span className='add-btn' onClick={handleClick}>
            <i className='fas fa-plus-square'></i>
          </span>
        </span>
      </div>
      {entryPlaceholder[meal]['foods'].map((food) => renderFoodItems(food))}
      <div className='totals-r'>
        <div className='total-l'>totals</div>
        <div className='totals-c'>
          <div className='size c'></div>
          <div className='fats c'>
            {totalFats}g<div className='macro-l'>fats</div>
          </div>
          <div className='carbs c'>
            {totalCarbsOrNetCarbsValue}g
            <div className='macro-l'>{carbType}</div>
          </div>
          <div className='protein c'>
            {totalProtein}g<div className='macro-l'>protein</div>
          </div>
          <div className='calories c'>
            {totalCalories}
            <div className='macro-l'>calories</div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Meal);
