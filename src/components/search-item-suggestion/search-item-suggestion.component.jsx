import React from 'react';
import './search-item-suggestion.styles.scss';
import { connect } from 'react-redux';
import {
  ToggleAddFoodToDiaryModal,
  ToggleSuggestionWindow,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';

const SearchItemSuggestion = ({
  food,
  ToggleAddFoodToDiaryModal,
  ToggleSuggestionWindow,
}) => {
  const handleClick = () => {
    ToggleAddFoodToDiaryModal(food);
    ToggleSuggestionWindow('hide window');
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

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
});

const mapDispatchToProps = (dispatch) => ({
  ToggleAddFoodToDiaryModal: (food) =>
    dispatch(ToggleAddFoodToDiaryModal(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchItemSuggestion);
