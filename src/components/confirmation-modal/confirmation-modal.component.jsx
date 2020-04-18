import React from 'react';
import { connect } from 'react-redux';

import { toggleConfirmation } from '../../redux/create-food-item/create-food-item.actions.js';

import './confirmation-modal.styles.scss';

const ConfirmationModal = ({ messageType, toggleConfirmation }) => {
  let message;
  let classStyle;

  if (messageType === 'success') {
    message = 'Successfully added!';
    classStyle = 'far fa-check-circle success';
  } else {
    message =
      'That food already exists in your database. Provide a different name.';
    classStyle = 'fas fa-exclamation-circle error';
  }

  const handleClose = () => {
    // control the confirmation modal window
    toggleConfirmation('closed');
  };

  return (
    <div className='confirmation-modal'>
      <div className='confirmation-modal-outer-box'>
        <div className='confirmation-modal-header-section'>
          <span className='close-modal-btn'>
            <i className='fas fa-times-circle' onClick={handleClose}></i>
          </span>
          <h3>
            <i className={classStyle}></i>
          </h3>
        </div>
        <div className='confirmation-modal-message-section'>{message}</div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  toggleConfirmation: (status) => dispatch(toggleConfirmation(status)),
});

export default connect(null, mapDispatchToProps)(ConfirmationModal);
