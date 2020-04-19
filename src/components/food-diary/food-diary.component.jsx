import React, { useState } from 'react';
import './food-diary.styles.scss';
import FormInput from './../form-input/form-input.component';
import CreateFood from '../create-food-item/create-food-item';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { connect } from 'react-redux';

export const Diary = ({
  changeModalStatus,
  modalStatus,
  toggleConfirmation,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    // toggle modal popup
    if (modalStatus === 'closed') {
      changeModalStatus('opened');
    } else {
      changeModalStatus('closed');
    }
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  // conditionally render the modal based on modal status
  let modal;
  if (modalStatus === 'opened') {
    modal = <CreateFood />;
  } else {
    modal = null;
  }

  // define confirmation modal that renders after submit
  let confirmationModal;
  const messages = {
    success: 'Successfully added!',
    error:
      'That food already exists in your database. Provide a different name.',
  };

  if (toggleConfirmation === 'opened-success') {
    confirmationModal = <ConfirmationModal successMessage={messages.error} />;
  } else if (toggleConfirmation === 'opened-error') {
    confirmationModal = <ConfirmationModal errorMessage={messages.error} />;
  }

  return (
    <div className='diary-container'>
      <div className='add-food-btn'>
        <i className='fas fa-plus-square' onClick={handleClick}></i>
      </div>
      {modal}
      {confirmationModal}
      <div className='food-item-input'>
        <form>
          <FormInput
            name='search-input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label='Add a food item'
            required
          />
        </form>
      </div>
      <div className='outer-container'></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modalStatus: state.createdFoods.modalStatus,
  toggleConfirmation: state.createdFoods.toggleConfirmation,
});

const mapDispatchToProps = (dispatch) => ({
  CreateFood: (newFoodItem) => dispatch(CreateFood(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
