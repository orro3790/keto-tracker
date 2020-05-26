import React from 'react';
import './fav-item.styles.scss';
import { connect } from 'react-redux';
import { createFoodReference } from '../../redux/search-item/search-item.actions.js';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';
import { toggleViewFavsModal } from '../../redux/view-favs/view-favs.actions.js';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { createStructuredSelector } from 'reselect';

const FavItem = ({
  food,
  createFoodReference,
  index,
  modal,
  toggleSearchModal,
  toggleViewFavsModal,
}) => {
  const handleClick = () => {
    createFoodReference(food);
    // close the favorites modal
    toggleViewFavsModal({
      status: 'hidden',
    });
    // toggle search modal to view the details and stage it to add to meal
    const copy = Object.assign({}, modal);
    copy.status = 'visible';
    toggleSearchModal(copy);
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

const mapStateToProps = createStructuredSelector({
  modal: selectModal,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleViewFavsModal: (status) => dispatch(toggleViewFavsModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FavItem);
