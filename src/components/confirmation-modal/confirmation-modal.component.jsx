import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import './confirmation-modal.styles.scss';

const ConfirmationModal = ({ messageObj, handleClose, onConfirm }) => {
  let classStyle;

  let message;

  if (messageObj.success) {
    classStyle = 'far fa-check-circle success';
    message = messageObj.success;
  } else if (messageObj.error) {
    classStyle = 'fas fa-exclamation-triangle error';
    message = messageObj.error;
  } else if (messageObj.question) {
    classStyle = 'far fa-question-circle question';
    message = messageObj.question;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // onConfirm is used when the confirmation model prompts the user with a question that needs confirmation to execute
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className='confirmation-modal'>
      <div className='confirm-m-c'>
        <div className='header-s'>
          <span className='close-m-btn' onClick={handleClose}>
            <i className='fas fa-times-circle'></i>
          </span>
          <h3>
            <i className={classStyle}></i>
          </h3>
        </div>
        <div className='message-s'>{message}</div>
        <div className='submit-s'>
          <div className='submit-r'>
            <div></div>
            <div className='submit-btn on' onClick={handleSubmit}>
              <i className='fas fa-check add-i on'></i>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(ConfirmationModal);
