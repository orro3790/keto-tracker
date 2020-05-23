import React from 'react';
import { connect } from 'react-redux';
import './food-item.styles.scss';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { createStructuredSelector } from 'reselect';
import { selectCarbSettings } from '../../redux/user/user.selectors';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';

const FoodItem = ({
  food,
  toggleSearchModal,
  searchModal,
  listId,
  meal,
  createFoodReference,
  currentUser,
}) => {
  const handleClick = (e) => {
    if (!e.target.className.includes('fav-btn')) {
      if (searchModal.status === 'hidden') {
        toggleSearchModal({
          status: 'visible',
          meal: meal,
          editMode: true,
          foodToEdit: food,
          listId: listId,
        });
      } else {
        toggleSearchModal({
          status: 'hidden',
          meal: meal,
          listId: listId,
        });
      }
      createFoodReference(food);
    }
  };

  let carbValue = 0;

  if (currentUser !== null) {
    if (currentUser.carbSettings === 'net') {
      carbValue = food.k;
    } else {
      carbValue = food.c;
    }
  }

  return (
    <div className='food-c' onClick={handleClick}>
      <div className='macro-r'>
        <div className='name-desc-c'>
          <div className='name'>{food.n}</div>
          <div className='desc'>{food.b}</div>
        </div>
        <div className='macro-c'>
          <div className='size total-c'>
            {food.size}
            {food.u}
          </div>
          <div className='fats total-c'>{food.f}</div>
          <div className='carbs total-c'>{carbValue}</div>
          <div className='protein total-c'>{food.p}</div>
          <div className='calories total-c'>{food.e}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  searchModal: selectModal,
  foodReference: selectFoodReference,
  carbSettings: selectCarbSettings,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodItem);
