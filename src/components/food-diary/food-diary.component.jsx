import React, { useEffect } from 'react';
import './food-diary.styles.scss';
import CreateFood from '../create-food-item/create-food-item';
import Meal from './../meal/meal.component';
import Search from './../search/search.component';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';
import AddFoodToDiary from './../add-food-to-diary/add-food-to-diary.component';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { updateFoodDatabase } from '../../redux/food-diary/food-diary.actions';
import { connect } from 'react-redux';
import {
  firestore,
  convertCollectionSnapshotToMap,
} from './../../firebase/firebase.utils';

const Diary = ({
  changeModalStatus,
  modalStatus,
  toggleConfirmation,
  updateFoodDatabase,
  foodItemToAdd,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    // toggle modal popup
    if (modalStatus === 'closed') {
      changeModalStatus('opened');
    } else {
      changeModalStatus('closed');
    }
  };

  // conditionally render the CreateFood modal
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

  let addFoodItemModal;
  if (foodItemToAdd.name !== 'default name') {
    addFoodItemModal = <AddFoodToDiary foodItemToAdd={foodItemToAdd} />;
  }

  useEffect(() => {
    // grab the food database collection from firestore
    const collectionRef = firestore.collection('foods');

    // onSnapshot listens for a snapshot ==> convert function maps through the docs in the collection snapshot, pulls the data from the snapshot and returns the transformed object , then add it to redux store through updateFoodDatabase dispatch
    collectionRef.onSnapshot(async (snapshot) => {
      const transformedCollection = convertCollectionSnapshotToMap(snapshot);
      updateFoodDatabase(transformedCollection);
    });

    return () => console.log('unmounting...');
  });

  return (
    <div className='diary-container'>
      <div className='add-food-btn'>
        <i className='fas fa-plus-square' onClick={handleClick}></i>
      </div>
      {modal}
      {confirmationModal}
      {addFoodItemModal}
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
  modalStatus: state.createFoodItem.modalStatus,
  toggleConfirmation: state.createFoodItem.toggleConfirmation,
  foodItemToAdd: state.searchItemSuggestion.foodItemToAdd,
});

const mapDispatchToProps = (dispatch) => ({
  CreateFood: (newFoodItem) => dispatch(CreateFood(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
  updateFoodDatabase: (transformedCollection) =>
    dispatch(updateFoodDatabase(transformedCollection)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
