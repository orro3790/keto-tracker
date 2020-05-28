import React, { useState } from 'react';
import './edit-item.styles.scss';
import { connect } from 'react-redux';
import { createFoodReference } from '../../redux/search-item/search-item.actions.js';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import { toggleFavFood, deleteFood } from '../../firebase/firebase.utils';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';

const EditItem = ({
  food,
  createFoodReference,
  index,
  searchModal,
  toggleSearchModal,
  userId,
  type,
  toggleAlertModal,
}) => {
  const [iconClass, setIconClass] = useState('fas fa-plus-square add-btn');

  const handleClick = (e) => {
    switch (type) {
      case 'fav':
        if (!e.target.className.includes('del-btn')) {
          createFoodReference(food);
          const copy = Object.assign({}, searchModal);
          copy.status = 'visible';
          toggleSearchModal(copy);
        } else {
          //remove the food from favorites
          toggleFavFood(userId, food);
          toggleAlertModal({
            title: 'SUCCESS!',
            msg: `${food.n} has been removed from favorites.`,
            img: '',
            status: 'visible',
            callback: '',
          });
        }
        break;
      case 'user-foods':
        if (!e.target.className.includes('del-btn')) {
          createFoodReference(food);
          // toggle search modal to view the details and stage it to add to meal
          const copy = Object.assign({}, searchModal);
          copy.status = 'visible';
          toggleSearchModal(copy);
        } else {
          //remove the food from favorites
          deleteFood(userId, food);
          toggleAlertModal({
            title: 'SUCCESS!',
            msg: `${food.n} has been removed from your custom foods list.`,
            img: '',
            status: 'visible',
            callback: '',
          });
        }
        break;
      default:
        break;
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
    setIconClass('fas fa-plus-square add-btn');
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
  searchModal: selectModal,
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
