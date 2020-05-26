import React from 'react';
import Meal from '../../components/meal/meal.component';
import DateSelector from '../../components/date-selector/date-selector.component';
import SearchFoodModal from '../../components/search-food-modal/search-food-modal.component';
import TotalsChart from '../../components/totals-chart/totals-chart.component';
import DailyChart from '../../components/daily-hud/daily-hud.component';
import Rail from '../../components/rail/rail.component';
import CreateFood from '../../components/create-food/create-food';
import ViewFavs from '../../components/favs-modal/favs-modal-component';
import Alert from '../../components/alert/alert.component';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions.js';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCreateFoodModalStatus } from '../../redux/create-food/create-food.selectors';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectViewFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import './diary.styles.scss';

const Diary = ({ searchModal, createFoodModalStatus, viewFavsModalStatus }) => {
  let searchFoodModal, createFoodModal, viewFavsModal;
  if (searchModal.status === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  }
  if (createFoodModalStatus === 'visible') {
    createFoodModal = <CreateFood />;
  }
  if (viewFavsModalStatus === 'visible') {
    viewFavsModal = <ViewFavs />;
  }

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>
      <div className='page-body-c'>
        {searchFoodModal}
        {createFoodModal}
        {viewFavsModal}
        <DateSelector />
        <DailyChart />
        <div className='meal-c'>
          <div>
            <Meal meal={'Breakfast'} />
          </div>
          <TotalsChart meal={'Breakfast'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'Lunch'} />
          </div>
          <TotalsChart meal={'Lunch'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'Dinner'} />
          </div>
          <TotalsChart meal={'Dinner'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'Snacks'} />
          </div>
          <TotalsChart meal={'Snacks'} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  searchModal: selectModal,
  createFoodModalStatus: selectCreateFoodModalStatus,
  foodReference: selectFoodReference,
  viewFavsModalStatus: selectViewFavModalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
