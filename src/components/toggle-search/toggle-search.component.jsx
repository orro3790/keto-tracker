import React from 'react';
import './toggle-search.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { toggleSearchModal } from './../../redux/search-food-modal/search-food-modal.actions';
import {
  createFoodReference,
  toggleSuggestionWindow,
} from './../../redux/search-item/search-item.actions.js';
import { selectSuggestionWindow } from '../../redux/search-item/search-item.selectors';

const ToggleSearchModal = ({
  meal,
  modal,
  toggleSearchModal,
  toggleSuggestionWindow,
  createFoodReference,
  suggestionWindow,
}) => {
  const handleClick = () => {
    // make sure suggestion window is hidden and there is no foodReference still in state, then open modal
    if (suggestionWindow === true) {
      toggleSuggestionWindow(false);
    }
    createFoodReference('');

    if (modal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: false,
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: meal,
        editMode: false,
      });
    }
  };

  return (
    <div>
      <span className='add-btn' onClick={handleClick}>
        <i className='fas fa-plus-square'></i>
      </span>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  modal: selectModal,
  suggestionWindow: selectSuggestionWindow,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleSuggestionWindow: (status) => dispatch(toggleSuggestionWindow(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleSearchModal);
