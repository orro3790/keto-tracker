import React from 'react';
import './fav-item.styles.scss';
import { connect } from 'react-redux';
import { createFoodReference } from '../../redux/search-item/search-item.actions.js';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';

const FavItem = ({ food, createFoodReference }) => {
  const handleClick = () => {
    createFoodReference(food);
    // toggle search modal next, to view the details
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

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
});

export default connect(null, mapDispatchToProps)(FavItem);
