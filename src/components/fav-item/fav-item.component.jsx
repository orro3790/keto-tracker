import React, { useState } from 'react';
import './fav-item.styles.scss';
import { connect } from 'react-redux';
import { createFoodReference } from '../../redux/search-item/search-item.actions.js';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';
import { toggleViewFavsModal } from '../../redux/favs-modal/favs-modal.actions.js';
import { addFavoriteFood } from '../../firebase/firebase.utils';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';

const FavItem = ({
  food,
  createFoodReference,
  index,
  modal,
  toggleSearchModal,
  toggleViewFavsModal,
  userId,
}) => {
  const [iconClass, setIconClass] = useState('fas fa-bookmark add-btn');

  const handleClick = (e) => {
    if (!e.target.className.includes('del-btn')) {
      createFoodReference(food);
      // close the favorites modal
      toggleViewFavsModal({
        status: 'hidden',
      });
      // toggle search modal to view the details and stage it to add to meal
      const copy = Object.assign({}, modal);
      copy.status = 'visible';
      toggleSearchModal(copy);
    } else {
      //remove the food from favorites
      addFavoriteFood(userId, food);
    }
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

  const handleMouseOver = () => {
    setIconClass('fas fa-minus-circle del-btn');
  };

  const handleMouseOut = () => {
    setIconClass('fas fa-bookmark add-btn');
  };

  return (
    <div
      className={`item-c ${index % 2 ? 'liOdd' : 'liEven'}`}
      onClick={handleClick}
    >
      <i
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className={iconClass}
      ></i>

      <span className='name'>{food.n}</span>
      <div></div>
      <div className='desc'>{truncate(food.b)}</div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  modal: selectModal,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleViewFavsModal: (status) => dispatch(toggleViewFavsModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FavItem);
