import React from 'react';
import { connect } from 'react-redux';

import { toggleConfirmation } from '../../redux/confirmation-modal/confirmation-modal.actions';

import './confirmation-modal.styles.scss';

const ConfirmationModal = ({ messageObj, toggleConfirmation, modalStatus }) => {
  let classStyle;

  let message;

  if (messageObj.success) {
    classStyle = 'far fa-check-circle success';
    message = messageObj.success;
  } else if (messageObj.error) {
    classStyle = 'fas fa-exclamation-triangle error';
    message = messageObj.error;
  }

  const handleClose = () => {
    // control the confirmation modal window
    toggleConfirmation('closed');
  };

  if (modalStatus === 'closed') {
    handleClose();
    console.log('closed');
  }

  return (
    <div className='confirmation-modal'>
      <div className='confirmation-modal-outer-box'>
        <div className='confirmation-modal-header-section'>
          <span className='close-modal-btn' onClick={handleClose}>
            <i className='fas fa-times-circle'></i>
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

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  modalStatus: state.confirmationModal.modalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  toggleConfirmation: (status) => dispatch(toggleConfirmation(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal);
