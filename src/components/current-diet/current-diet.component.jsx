import React from 'react';
import { connect } from 'react-redux';
import './current-diet.styles.scss';

const CurrentDiet = ({ currentUser }) => {
  // load 0 as default values if currentUser.diet data hasn't been loaded into state yet
  let fats = 0;
  let protein = 0;
  let carbs = 0;
  let calories = 0;

  if (currentUser !== null) {
    fats = currentUser.diet.fats;
    protein = currentUser.diet.protein;
    carbs = currentUser.diet.carbs;
    calories = currentUser.diet.calories;
  }

  let carbType = 'carbs';

  if (currentUser && currentUser.carbSettings === 'net') {
    carbType = 'net carbs';
  }

  return (
    <div>
      <div className='title'>Current Diet</div>
      <div className='subtitle'>
        <div className='daily-intake'>DAILY INTAKE</div>
      </div>
      <div className='current-diet-description-box'>
        <div className='daily-fats macro-container'>
          {fats}g<div className='label'>fats</div>
        </div>
        <div className='daily-carbs macro-container'>
          {carbs}g<div className='label'>{carbType}</div>
        </div>
        <div className='daily-protein macro-container'>
          {protein}g<div className='label'>protein</div>
        </div>
        <div className='daily-calories macro-container'>
          {calories}
          <div className='label'>calories</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, null)(CurrentDiet);
