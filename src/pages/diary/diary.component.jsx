import React from 'react';
import Meal from '../../components/meal/meal.component';
import DateSelector from '../../components/date-selector/date-selector.component';
import SearchFoodModal from '../../components/search-food-modal/search-food-modal.component';
import TotalsChart from '../../components/totals-chart/totals-chart.component';
import DailyChart from '../../components/daily-hud/daily-hud.component';
import Rail from '../../components/rail/rail.component';
import CreateFood from '../../components/create-food/create-food';
import ViewFavs from '../../components/favs-modal/favs-modal-component';
import CustomFoodsModal from '../../components/custom-foods-modal/custom-foods-modal-component';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions.js';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCreateFoodModalStatus } from '../../redux/create-food/create-food.selectors';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { selectViewFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import './diary.styles.scss';

const Diary = ({
  searchModal,
  createFoodModalStatus,
  viewFavsModalStatus,
  customFoodsModalStatus,
}) => {
  let searchFoodModal, createFoodModal, viewFavsModal, customFoodsModal;
  if (searchModal.status === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  }
  if (createFoodModalStatus === 'visible') {
    createFoodModal = <CreateFood />;
  }
  if (viewFavsModalStatus === 'visible') {
    viewFavsModal = <ViewFavs />;
  }
  if (customFoodsModalStatus === 'visible') {
    customFoodsModal = <CustomFoodsModal />;
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
        {customFoodsModal}
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
  customFoodsModalStatus: selectCustomFoodsModalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
