import React from 'react';
import './add-food-to-diary.styles.scss';

import { connect } from 'react-redux';
import {
  ToggleSuggestionWindow,
  ToggleAddFoodToDiaryModal,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { createDailyMealsObj } from '../../redux/food-diary/food-diary.actions';
import { toggleSearchModal } from '../../redux/meal/meal.actions';

const AddFoodToDiary = ({
  foodItemToAdd,
  ToggleAddFoodToDiaryModal,
  ToggleSuggestionWindow,
  toggleSearchModal,
  mealsObj,
  searchModal,
}) => {
  const INITIAL_STATE = {
    name: 'default name',
    description: 'default description',
    grams: 0,
    fats: 0,
    carbs: 0,
    protein: 0,
    calories: 0,
  };

  const handleClose = () => {
    ToggleAddFoodToDiaryModal(INITIAL_STATE);
    ToggleSuggestionWindow('ready to be viewed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ToggleSuggestionWindow('ready to be viewed');
    ToggleAddFoodToDiaryModal(INITIAL_STATE);
    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });

    let currentDate = new Date();

    const [date, month, year] = [
      currentDate.getUTCDate(),
      currentDate.getUTCMonth(),
      currentDate.getUTCFullYear(),
    ];

    currentDate = `${month}-${date}-${year}`;

    mealsObj[currentDate][searchModal.meal].push(foodItemToAdd);

    createDailyMealsObj(mealsObj);
  };

  return (
    <div>
      <form className='modal'>
        <div className='modal-outer-box'>
          <div className='modal-inner-box'>
            <span className='close-modal-btn'>
              <i className='fas fa-times-circle' onClick={handleClose}></i>
            </span>
            <div className='title-section'>
              <input
                className='food-name-input'
                name='name'
                type='text'
                value={foodItemToAdd.name}
                readOnly
              />
            </div>
            <div className='description-section'>
              <textarea
                className='description-area'
                name='description'
                value={foodItemToAdd.description}
                readOnly
              ></textarea>
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              <input
                className={'macro-input'}
                name='grams'
                type='number'
                value={foodItemToAdd.grams}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='number'
                value={foodItemToAdd.fats}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='number'
                value={foodItemToAdd.carbs}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='number'
                value={foodItemToAdd.protein}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='number'
                value={foodItemToAdd.calories}
                readOnly
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <button
            className='submit-btn'
            // disabled={!isSubmittable}
            type='submit'
            onClick={handleSubmit}
          >
            <div className='submit-btn-text'>
              Add to Diary
              <i className='fas fa-plus'></i>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodItemToAdd: state.searchItemSuggestion.foodItemToAdd,
  searchModal: state.meal.searchModal,
  mealsObj: state.foodDiary.meals,
});

const mapDispatchToProps = (dispatch) => ({
  ToggleAddFoodToDiaryModal: (food) =>
    dispatch(ToggleAddFoodToDiaryModal(food)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  createDailyMealsObj: (mealsObj) => dispatch(createDailyMealsObj(mealsObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFoodToDiary);
