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

  const truncate = (string) => {
    if (string !== '') {
      if (string.length > 50) {
        return `${string.slice(0, 50)}...`;
      } else {
        return `${string}`;
      }
    }
  };

  return (
    <div className='item-c' onClick={handleClick}>
      <i className='fas fa-plus-square add-btn'></i>

      <span className='name'>{food.n}</span>
      <div></div>
      <div className='desc'>{truncate(food.b)}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.searchModal.searchModal,
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
