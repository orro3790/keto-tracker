import React from 'react';
import './food-diary.styles.scss';
import Meal from './../meal/meal.component';
import DateSelector from '../date-selector/date-selector.component';
import SearchFoodModal from './../search-food-modal/search-food-modal.component';
import TotalsChart from '../totals-chart/totals-chart.component';
import DailyChart from '../daily-hud/daily-hud.component';
import Rail from '../rail/rail.component';
import { changeModalStatus } from '../../redux/create-food-item/create-food-item.actions.js';
import { connect } from 'react-redux';

const Diary = ({ searchModal }) => {
  let searchFoodModal;
  if (searchModal.status === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  } else {
    searchFoodModal = null;
  }

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>
      <div className='diary-body'>
        {searchFoodModal}
        <div className='diary-outer-container'>
          <DateSelector />
          <DailyChart />
        </div>
        <div className='diary-outer-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Breakfast'} />
            </div>
            <TotalsChart meal={'Breakfast'} />
          </div>
        </div>
        <div className='diary-outer-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Lunch'} />
            </div>
            <TotalsChart meal={'Lunch'} />
          </div>
        </div>
        <div className='diary-outer-container'>
          <div className='diary-inner-container'>
            <div className='breakfast-section'>
              <Meal meal={'Dinner'} />
            </div>
            <TotalsChart meal={'Dinner'} />
          </div>
        </div>
        <div className='diary-outer-container'>
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
  searchModal: state.searchModal.searchModal,
  foodReference: state.searchItemSuggestion.foodReference,
});

const mapDispatchToProps = (dispatch) => ({
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
