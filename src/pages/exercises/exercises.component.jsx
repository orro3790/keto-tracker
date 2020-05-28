import React from 'react';
import Rail from '../../components/rail/rail.component';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { connect } from 'react-redux';
import './exercises.styles.scss';

const Exercises = ({ toggleAlertModal }) => {
  const handleClick = () => {
    toggleAlertModal({
      title: 'CONFIRM EMAIL',
      msg:
        "You're almost there! Check your email for a verification link, then you can start tracking!",
      img: 'email',
      status: 'visible',
      sticky: false,
    });
  };

  return (
    <div>
      <div className='rail-body-separator'>
        <div>
          <Rail />
        </div>
        <div className='page-body-c'>
          <div className='t'>Exercises</div>
          <div onClick={handleClick}>Click me</div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  //add a confirmation modal
});

export default connect(null, mapDispatchToProps)(Exercises);
