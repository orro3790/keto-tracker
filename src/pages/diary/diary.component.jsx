import React from 'react';
import Meal from '../../components/meal/meal.component';
import DateSelector from '../../components/date-selector/date-selector.component';
import SearchFoodModal from '../../components/search-food-modal/search-food-modal.component';
import CustomFoodsModal from '../../components/custom-foods-modal/custom-foods-modal-component';
import FavsModal from '../../components/favs-modal/favs-modal-component';
import WaterModal from '../../components/water-modal/water-modal.component';
import CreateFood from '../../components/create-food/create-food';
import TotalsChart from '../../components/totals-chart/totals-chart.component';
import DailyChart from '../../components/daily-hud/daily-hud.component';
import Rail from '../../components/rail/rail.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCreateFoodModalStatus } from '../../redux/create-food/create-food.selectors';
import { selectFoodReference } from '../../redux/search-item/search-item.selectors';
import { selectSearchModalStatus } from '../../redux/search-modal/search-modal.selectors';
import { selectFavModalStatus } from '../../redux/favs-modal/favs-modal.selectors';
import { selectCustomFoodsModalStatus } from '../../redux/custom-foods-modal/custom-foods-modal.selectors';
import { selectWaterModalStatus } from '../../redux/water-modal/water-modal.selectors';
import './diary.styles.scss';
import 'tippy.js/animations/scale.css';

const Diary = ({
  searchModalStatus,
  createFoodModalStatus,
  viewFavsModalStatus,
  customFoodsModalStatus,
  waterModalStatus,
}) => {
  let searchFoodModal,
    createFoodModal,
    viewFavsModal,
    customFoodsModal,
    waterModal;
  if (searchModalStatus === 'visible') {
    searchFoodModal = <SearchFoodModal />;
  }
  if (createFoodModalStatus === 'visible') {
    createFoodModal = <CreateFood />;
  }
  if (viewFavsModalStatus === 'visible') {
    viewFavsModal = <FavsModal />;
  }
  if (customFoodsModalStatus === 'visible') {
    customFoodsModal = <CustomFoodsModal />;
  }
  if (waterModalStatus === 'visible') {
    waterModal = <WaterModal />;
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
        {waterModal}
        <DateSelector />
        <DailyChart />
        <div className='meal-c'>
          <div>
            <Meal meal={'b'} />
          </div>
          <TotalsChart meal={'b'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'l'} />
          </div>
          <TotalsChart meal={'l'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'d'} />
          </div>
          <TotalsChart meal={'d'} />
        </div>
        <div className='meal-c'>
          <div>
            <Meal meal={'s'} />
          </div>
          <TotalsChart meal={'s'} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  searchModalStatus: selectSearchModalStatus,
  createFoodModalStatus: selectCreateFoodModalStatus,
  foodReference: selectFoodReference,
  viewFavsModalStatus: selectFavModalStatus,
  customFoodsModalStatus: selectCustomFoodsModalStatus,
  waterModalStatus: selectWaterModalStatus,
});

export default connect(mapStateToProps, null)(Diary);
