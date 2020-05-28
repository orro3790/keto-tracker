import React from 'react';
import './search-item.styles.scss';
import { connect } from 'react-redux';
import {
  createFoodReference,
  toggleSuggestionWindow,
} from '../../redux/search-item/search-item.actions.js';

const SearchItem = ({
  food,
  createFoodReference,
  toggleSuggestionWindow,
  suggestionWindow,
  index,
}) => {
  const handleClick = () => {
    createFoodReference(food);
    toggleSuggestionWindow(!suggestionWindow);
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
    <div
      className={`item-c ${index % 2 ? 'liOdd' : 'liEven'}`}
      onClick={handleClick}
    >
      <i className='fas fa-plus-square add-btn'></i>

      <span className='name'>{food.n}</span>
      <div></div>
      <div className='desc'>{truncate(food.b)}</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  suggestionWindow: state.searchItem.suggestionWindow,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSuggestionWindow: (status) => dispatch(toggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);