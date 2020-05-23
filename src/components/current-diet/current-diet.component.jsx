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

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, null)(CurrentDiet);
