import React from 'react';
import './diary.styles.scss';
import Meal from '../../components/meal/meal.component';
import DateSelector from '../../components/date-selector/date-selector.component';
import SearchFoodModal from '../../components/search-food-modal/search-food-modal.component';
import TotalsChart from '../../components/totals-chart/totals-chart.component';
import DailyChart from '../../components/daily-hud/daily-hud.component';
import Rail from '../../components/rail/rail.component';
import CreateFood from '../../components/create-food/create-food';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions.js';
import { connect } from 'react-redux';

const Diary = ({ searchModal, createFoodModalStatus }) => {
  let searchFoodModal;
  if (searchModal.status === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  } else {
    searchFoodModal = null;
  }

  let createFoodModal;
  if (createFoodModalStatus.status === 'visible') {
    createFoodModal = <CreateFood />;
  }

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>
      <div className='page-body-c'>
        {searchFoodModal}
        <DateSelector />
        <DailyChart />
        {createFoodModal}
        <div className='c'>
          <div>
            <Meal meal={'Breakfast'} />
          </div>
          <TotalsChart meal={'Breakfast'} />
        </div>
        <div className='c'>
          <div>
            <Meal meal={'Lunch'} />
          </div>
          <TotalsChart meal={'Lunch'} />
        </div>
        <div className='c'>
          <div>
            <Meal meal={'Dinner'} />
          </div>
          <TotalsChart meal={'Dinner'} />
        </div>
        <div className='c'>
          <div>
            <Meal meal={'Snacks'} />
          </div>
          <TotalsChart meal={'Snacks'} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchModal: state.searchModal.searchModal,
  createFoodModalStatus: state.createFood.createFoodModal,
  foodReference: state.searchItemSuggestion.foodReference,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
