import React, { useEffect } from 'react';
import './food-diary.styles.scss';
import CreateFood from '../create-food-item/create-food-item';
import Meal from './../meal/meal.component';
import DateSelector from '../date-selector/date-selector.component';
import SearchFoodModal from './../search-food-modal/search-food-modal.component';
import TotalsChart from '../totals-chart/totals-chart.component';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { updateFoodDatabase } from '../../redux/food-diary/food-diary.actions';
import { connect } from 'react-redux';
import {
  firestore,
  convertCollectionSnapshotToMap,
} from './../../firebase/firebase.utils';

const Diary = ({ updateFoodDatabase, searchModal }) => {
  // conditionally render the CreateFood modal
  // let createFoodModal;
  // if (createFoodModalStatus === 'visible') {
  //   createFoodModal = <CreateFood />;
  // } else {
  //   createFoodModal = null;
  // }

  // define confirmation modal that renders after submit
  // let confirmationModal;
  // const messages = {
  //   success: 'Successfully added!',
  //   error:
  //     'That food already exists in your database. Provide a different name.',
  // };

  // if (toggleConfirmation === 'opened-success') {
  //   confirmationModal = <ConfirmationModal successMessage={messages.success} />;
  // } else if (toggleConfirmation === 'opened-error') {
  //   confirmationModal = <ConfirmationModal errorMessage={messages.error} />;
  // }

  // conditionally render the CreateFood modal
  let searchFoodModal;
  if (searchModal.status === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  } else {
    searchFoodModal = null;
  }

  useEffect(() => {
    // grab the food database collection from firestore
    const collectionRef = firestore.collection('foods');

    // onSnapshot listens for a snapshot ==> convert function maps through the docs in the collection snapshot, pulls the data from the snapshot and returns the transformed object , then add it to redux store through updateFoodDatabase dispatch
    collectionRef.onSnapshot(async (snapshot) => {
      const transformedCollection = convertCollectionSnapshotToMap(snapshot);
      updateFoodDatabase(transformedCollection);
    });
  }, [updateFoodDatabase]);

  return (
    <div className='diary-container'>
      {/* {createFoodModal}
      {confirmationModal} */}
      {searchFoodModal}
      <div className='diary-outer-container'>
        <DateSelector />
      </div>
      <div className='diary-outer-container'>
        <div className='left-container'></div>
        <div className='right-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Breakfast'} />
            </div>
            <TotalsChart meal={'Breakfast'} />
          </div>
        </div>
      </div>
      <div className='diary-outer-container'>
        <div className='left-container'></div>
        <div className='right-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Lunch'} />
            </div>
            <TotalsChart meal={'Lunch'} />
          </div>
        </div>
      </div>
      <div className='diary-outer-container'>
        <div className='left-container'></div>
        <div className='right-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Dinner'} />
            </div>
            <TotalsChart meal={'Dinner'} />
          </div>
        </div>
      </div>
      <div className='diary-outer-container'>
        <div className='left-container'></div>
        <div className='right-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Snacks'} />
            </div>
            <TotalsChart meal={'Snacks'} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  createFoodModalStatus: state.createFoodItem.modalStatus,
  toggleConfirmation: state.createFoodItem.toggleConfirmation,
  searchModal: state.meal.searchModal,
  foodReference: state.searchItemSuggestion.foodReference,
});

const mapDispatchToProps = (dispatch) => ({
  CreateFood: (newFoodItem) => dispatch(CreateFood(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
  updateFoodDatabase: (transformedCollection) =>
    dispatch(updateFoodDatabase(transformedCollection)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
