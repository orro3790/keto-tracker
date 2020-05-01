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
  suggestionWindow,
}) => {
  const handleClick = () => {
    ToggleAddFoodToDiaryModal(food);
    ToggleSuggestionWindow(!suggestionWindow);
  };

  const truncate = (string) => {
    if (string !== '') {
      return `(${string.slice(0, 24)}...)`;
    }
  };

  return (
    <div className='search-item-container' onClick={handleClick}>
      <div className='search-item-add-btn'>
        <i className='fas fa-plus-square'></i>
      </div>
      <div className='search-item-name'>{food.name}</div>
      {/* <div>{truncate(food.description)}</div> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
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
