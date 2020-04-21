import React from 'react';
import './food-diary.styles.scss';
import CreateFood from '../create-food-item/create-food-item';
import Meal from './../meal/meal.component';
import Search from './../search/search.component';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { connect } from 'react-redux';

const Diary = ({ changeModalStatus, modalStatus, toggleConfirmation }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // toggle modal popup
    if (modalStatus === 'closed') {
      changeModalStatus('opened');
    } else {
      changeModalStatus('closed');
    }
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
    confirmationModal = <ConfirmationModal successMessage={messages.success} />;
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
      <Search />
      <div className='diary-outer-container'>
        <div className='diary-inner-container'>
          <div className='header-row'>
            <div className='header-name-col'></div>
            <div className='header-fats-col'>Fats</div>
            <div className='header-carbs-col'>Carbs</div>
            <div className='header-protein-col'>Protein</div>
            <div className='header-calories-col'>Calories</div>
          </div>
          <div className='breakfast-section'>
            <Meal meal={'Breakfast'} />
          </div>
          <div className='lunch-section'>
            <Meal meal={'Lunch'} />
          </div>
          <div className='dinner-section'>
            <Meal meal={'Dinner'} />
          </div>
          <div className='snacks-section'>
            <Meal meal={'Snacks'} />
          </div>
          <div className='totals-row'>
            <div className='header-name-col'></div>
            <div className='header-fats-col'>10</div>
            <div className='header-carbs-col'>1.8</div>
            <div className='header-protein-col'>1.3</div>
            <div className='header-calories-col'>120</div>
          </div>
        </div>
      </div>
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
