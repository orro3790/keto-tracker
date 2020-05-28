import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectAlertModal } from '../../redux/alert-modal/alert-modal.selectors';
import { ReactComponent as Bell } from '../../assets/bell.svg';
import { ReactComponent as Email } from '../../assets/email.svg';

import './alert-modal.styles.scss';

const AlertModal = ({ currentUser, alertModal, enabled }) => {
  let img;

  switch (alertModal.img) {
    case 'email':
      img = <Email className='alert-img' />;
      break;

    default:
      break;
  }
  return (
    <div className={`alert-c ${enabled}`}>
      <div className='alert-t'>
        {alertModal.title}
        <div>
          <Bell className='bell-i' />
        </div>
      </div>
      <div className='alert-msg'>{alertModal.msg}</div>
      <div className='alert-img-c'>{img}</div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  currentUser: selectCurrentUser,
  alertModal: selectAlertModal,
});

export default connect(mapStateToProps, null)(AlertModal);
