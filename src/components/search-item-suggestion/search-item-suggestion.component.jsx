import React from 'react';
import './search-item-suggestion.styles.scss';
import { connect } from 'react-redux';
import {
  AddFoodItemToDiary,
  CloseSuggestionWindow,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const SearchItemSuggestion = ({
  food,
  AddFoodItemToDiary,
  CloseSuggestionWindow,
}) => {
  const handleClick = () => {
    AddFoodItemToDiary(food);
    // dispatch empty values back to the search input to close the sugg window and reset
    CloseSuggestionWindow('closed');
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
  CloseSuggestionWindow: (status) => dispatch(CloseSuggestionWindow(status)),
});

export default connect(null, mapDispatchToProps)(SearchItemSuggestion);
