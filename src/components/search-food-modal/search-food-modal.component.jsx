import React from 'react';
import './search-food-modal.styles.scss';
import { connect } from 'react-redux';
import Search from './../search/search.component';
import { toggleSearchModal } from './../../redux/meal/meal.actions.js';
import { ToggleSuggestionWindow } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const SearchFoodModal = ({
  toggleSearchModal,
  foodItemToAdd,
  ToggleSuggestionWindow,
}) => {
  const handleClose = () => {
    toggleSearchModal({
      status: 'hidden',
      meal: 'none',
    });
  };

  return (
    <div>
      <div className='search-food-modal'>
        <span className='close-search-modal-btn'>
          <i className='fas fa-times-circle' onClick={handleClose}></i>
        </span>
        <div className='search-section'>
          <Search />
        </div>
        <div className='results-container'>
          <div className='name'>{foodItemToAdd.name}</div>
          <div className='description'>{foodItemToAdd.description}</div>

          <div className='portion-input-row'>
            <div></div>
            <div className='portion-input'>size: {foodItemToAdd.grams}g</div>
            <div></div>
          </div>
          <div className='macro-row'>
            <div className='fats'>
              <div className='fats value'>{foodItemToAdd.fats}g</div>
              <div className='label'>fats</div>
            </div>
            <div className='carbs'>
              <div>{foodItemToAdd.carbs}g</div>
              <div className='label'>carbs</div>
            </div>
            <div className='protein'>
              <div>{foodItemToAdd.protein}g</div>
              <div className='label'>protein</div>
            </div>
          </div>
          <div className='graph-area'></div>
          {/* 
          <div>{foodItemToAdd.calories}</div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodItemToAdd: state.searchItemSuggestion.foodItemToAdd,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  ToggleSuggestionWindow: (status) => dispatch(ToggleSuggestionWindow(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFoodModal);
