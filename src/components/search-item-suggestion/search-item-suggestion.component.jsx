import React from 'react';
import './search-item-suggestion.styles.scss';
import { connect } from 'react-redux';
import {
  createFoodReference,
  ToggleSuggestionWindow,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';

const SearchItemSuggestion = ({
  food,
  createFoodReference,
  ToggleSuggestionWindow,
  suggestionWindow,
}) => {
  const handleClick = () => {
    createFoodReference(food);
    ToggleSuggestionWindow(!suggestionWindow);
  };

  // const truncate = (string) => {
  //   if (string !== '') {
  //     return `(${string.slice(0, 24)}...)`;
  //   }
  // };

  return (
    <div className='search-item-container' onClick={handleClick}>
      <i className='fas fa-plus-square search-item-add-btn'></i>

      <span className='search-item-name'>{food.description}</span>
      {/* <div>{truncate(food.description)}</div> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.meal.searchModal,
  suggestionWindow: state.searchItemSuggestion.suggestionWindow,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchItemSuggestion);
