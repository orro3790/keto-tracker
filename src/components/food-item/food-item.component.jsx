import React from 'react';
import { connect } from 'react-redux';
import './food-item.styles.scss';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const FoodItem = ({
  food,
  toggleSearchModal,
  searchModal,
  listId,
  meal,
  createFoodReference,
  currentUser,
}) => {
  const handleClick = () => {
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
    <div className='food-outer-container' onClick={handleClick}>
      <div className='macro-row'>
        <div className='name-description-container'>
          <div className='food-name'>{food.n}</div>
          <div className='food-item-description'>{food.b}</div>
        </div>
        <div className='macro-container'>
          <div className='size'>
            {food.size}
            {food.u}
          </div>
          <div className='fats'>{food.f}</div>
          <div className='carbs'>{carbValue}</div>
          <div className='protein'>{food.p}</div>
          <div className='calories'>{food.e}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.searchModal.searchModal,
  foodReference: state.searchItemSuggestion.foodReference,
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodItem);
