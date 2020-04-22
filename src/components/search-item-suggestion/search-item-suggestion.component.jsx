import React from 'react';
import './search-item-suggestion.styles.scss';
import { connect } from 'react-redux';
import {
  AddFoodItemToDiary,
  ToggleSuggestionWindow,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const SearchItemSuggestion = ({
  food,
  AddFoodItemToDiary,
  ToggleSuggestionWindow,
}) => {
  const handleClick = () => {
    AddFoodItemToDiary(food);
    ToggleSuggestionWindow('hidden');
  };

  return (
    <div className='search-item-container'>
      <div className='search-item-add-btn'>
        <i className='fas fa-plus-square' onClick={handleClick}></i>
      </div>
      <div className='search-item-name'>{food.name}</div>
      <div className='search-item-macros'>macros per 100g</div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  AddFoodItemToDiary: (foodItem) => dispatch(AddFoodItemToDiary(foodItem)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(null, mapDispatchToProps)(SearchItemSuggestion);
