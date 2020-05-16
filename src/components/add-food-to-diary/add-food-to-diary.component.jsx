import React from 'react';
import './add-food-to-diary.styles.scss';

import { connect } from 'react-redux';
import {
  ToggleSuggestionWindow,
  createFoodReference,
} from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';
import { setEntry } from '../../redux/diary/diary.actions';
import { toggleSearchModal } from '../../redux/meal/meal.actions';

const AddFoodToDiary = ({
  foodReference,
  createFoodReference,
  ToggleSuggestionWindow,
  toggleSearchModal,
  entries,
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
    createFoodReference(INITIAL_STATE);
    ToggleSuggestionWindow('ready to be viewed');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ToggleSuggestionWindow('ready to be viewed');
    createFoodReference(INITIAL_STATE);
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

    entries[currentDate][searchModal.meal]['foods'].push(foodReference);

    setEntry(entries);
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
                value={foodReference.name}
                readOnly
              />
            </div>
            <div className='description-section'>
              <textarea
                className='description-area'
                name='description'
                value={foodReference.description}
                readOnly
              ></textarea>
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              <input
                className={'macro-input'}
                name='grams'
                type='number'
                value={foodReference.grams}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='number'
                value={foodReference.fats}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='number'
                value={foodReference.carbs}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='number'
                value={foodReference.protein}
                readOnly
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='number'
                value={foodReference.calories}
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
  foodReference: state.searchItemSuggestion.foodReference,
  searchModal: state.meal.searchModal,
  entries: state.foodDiary.entries,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  setEntry: (entries) => dispatch(setEntry(entries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFoodToDiary);
