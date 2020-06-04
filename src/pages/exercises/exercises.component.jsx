import React from 'react';
import Rail from '../../components/rail/rail.component';
import { connect } from 'react-redux';

const Exercises = () => {
  return (
    <div>
      <div className='rail-body-separator'>
        <div>
          <Rail />
        </div>
        <div className='page-body-c'>
          <div className='t'>Exercises</div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  //add a confirmation modal
});

export default connect(null, mapDispatchToProps)(Exercises);
