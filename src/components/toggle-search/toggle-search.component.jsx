import React from 'react';
import './toggle-search.styles.scss';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { toggleSearchModal } from './../../redux/search-food-modal/search-food-modal.actions';
import { createFoodReference } from './../../redux/search-item-suggestion/search-item-suggestion.actions.js';

const ToggleSearchModal = ({ meal, searchModal, toggleSearchModal }) => {
  const handleClick = () => {
    if (searchModal.status === 'hidden') {
      toggleSearchModal({
        status: 'visible',
        meal: meal,
        editMode: false,
      });
      createFoodReference('');
    } else {
      toggleSearchModal({
        status: 'hidden',
        meal: meal,
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
});

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleSearchModal);
