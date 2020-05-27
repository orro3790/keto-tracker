import React from 'react';
import './toggle-search.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import { selectCreateFoodModalStatus } from '../../redux/create-food/create-food.selectors';
import { selectFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { toggleSearchModal } from './../../redux/search-food-modal/search-food-modal.actions';
import { toggleCustomFoodsModal } from '../../redux/custom-foods-modal/custom-foods-modal.actions';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions';
import { toggleFavsModal } from '../../redux/favs-modal/favs-modal.actions';
import {
  createFoodReference,
  toggleSuggestionWindow,
} from './../../redux/search-item/search-item.actions.js';
import { selectSuggestionWindow } from '../../redux/search-item/search-item.selectors';

const ToggleSearchModal = ({
  meal,
  searchModal,
  createFoodModalStatus,
  customFoodsModalStatus,
  favModalStatus,
  toggleCreateFoodModal,
  toggleCustomFoodsModal,
  toggleSearchModal,
  toggleFavsModal,
  toggleSuggestionWindow,
  createFoodReference,
  suggestionWindow,
}) => {
  const handleClick = () => {
    // reset suggestionWindow and there is no foodReference still in state, then open modal
    if (suggestionWindow === true) {
      toggleSuggestionWindow(false);
    }

    // if any other modals are open, close them
    if (createFoodModalStatus === 'visible') {
      toggleCreateFoodModal({
        status: 'hidden',
      });
    }

    if (customFoodsModalStatus === 'visible') {
      toggleCustomFoodsModal({
        status: 'hidden',
      });
    }

    if (favModalStatus === 'visible') {
      toggleFavsModal({
        status: 'hidden',
      });
    }

    createFoodReference('');

    // only open the search modal if the other modals are hidden, preventing opening it behind other modals
    if (
      searchModal.status === 'hidden' &&
      createFoodModalStatus === 'hidden' &&
      customFoodsModalStatus === 'hidden' &&
      favModalStatus === 'hidden'
    ) {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: false,
        foodToEdit: '',
        listId: '',
      });
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: 'none',
        editMode: false,
        foodToEdit: '',
        listId: '',
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
  searchModal: selectModal,
  suggestionWindow: selectSuggestionWindow,
  customFoodsModalStatus: selectCustomFoodsModalStatus,
  createFoodModalStatus: selectCreateFoodModalStatus,
  favModalStatus: selectFavModalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleSuggestionWindow: (status) => dispatch(toggleSuggestionWindow(status)),
  toggleCustomFoodsModal: (status) => dispatch(toggleCustomFoodsModal(status)),
  toggleFavsModal: (status) => dispatch(toggleFavsModal(status)),
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleSearchModal);
