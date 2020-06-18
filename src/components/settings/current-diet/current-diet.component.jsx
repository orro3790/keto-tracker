import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCarbSettings,
} from '../../../redux/user/user.selectors';
import { FaChartPie } from 'react-icons/fa';
import './current-diet.styles.scss';

const CurrentDiet = ({ diet, carbSettings }) => {
  // load 0 as default values if currentUser.d data hasn't been loaded into state yet
  let fats = 0;
  let protein = 0;
  let carbs = 0;
  let calories = 0;

  fats = diet.f;
  protein = diet.p;
  calories = diet.e;
  carbs = diet.c;

  let carbType = 'carbs';

  if (carbSettings === 'n') {
    carbType = 'net carbs';
    carbs = diet.k;
  }

  return (
    <div>
      <div className='set-h-c'>
        <FaChartPie className='set-i current-i' />
        <div className='t'>Current Diet</div>
      </div>

      <div className='current-diet-c'>
        <div className='fats macro-c'>
          {fats}g<div className='l'>fats</div>
        </div>
        <div className='carbs macro-c'>
          {carbs}g<div className='l'>{carbType}</div>
        </div>
        <div className='protein macro-c'>
          {protein}g<div className='l'>protein</div>
        </div>
        <div className='macro-c'>
          {calories}
          <div className='l'>calories</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  carbSettings: selectCarbSettings,
  diet: selectDietSettings,
});

export default connect(mapStateToProps, null)(CurrentDiet);
