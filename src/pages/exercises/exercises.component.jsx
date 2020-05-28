import React from 'react';
import Rail from '../../components/rail/rail.component';
import { connect } from 'react-redux';

import './exercises.styles.scss';

const Exercises = ({ currentUser }) => {
  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div className='page-body-c'>
        <div className='t'>Exercises</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, null)(Exercises);
