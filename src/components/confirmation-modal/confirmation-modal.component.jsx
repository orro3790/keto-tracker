import React from 'react';
import { connect } from 'react-redux';
import './confirmation-modal.styles.scss';

const ConfirmationModal = ({ messageObj, handleClose }) => {
  let classStyle;

  let message;

  if (messageObj.success) {
    classStyle = 'far fa-check-circle success';
    message = messageObj.success;
  } else if (messageObj.error) {
    classStyle = 'fas fa-exclamation-triangle error';
    message = messageObj.error;
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
});

export default connect(mapStateToProps)(ConfirmationModal);
