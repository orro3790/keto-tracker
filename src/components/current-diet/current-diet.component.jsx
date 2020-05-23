import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectDietSettings,
  selectCarbSettings,
} from '../../redux/user/user.selectors';
import './current-diet.styles.scss';

const CurrentDiet = ({ dietSettings, carbSettings }) => {
  // load 0 as default values if currentUser.diet data hasn't been loaded into state yet
  let fats = 0;
  let protein = 0;
  let carbs = 0;
  let calories = 0;

  fats = dietSettings.fats;
  protein = dietSettings.protein;
  carbs = dietSettings.carbs;
  calories = dietSettings.calories;

  let carbType = 'carbs';

  if (carbSettings === 'net') {
    carbType = 'net carbs';
  }

  return (
    <div>
      <div className='t'>Current Diet</div>
      <div className='st'>
        <div className='daily-intake'>DAILY INTAKE</div>
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
  dietSettings: selectDietSettings,
});

export default connect(mapStateToProps, null)(CurrentDiet);
