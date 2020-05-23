import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user.actions';
import { updateCarbSettings } from '../../firebase/firebase.utils';
import ConfirmationModal from '../confirmation-modal/confirmation-modal.component';
import './carb-settings.styles.scss';

const CarbSettings = ({ currentUser, setCurrentUser }) => {
  const [confirmationMsg, setConfirmationMsg] = useState(null);
  const [modalStatus, setModalStatus] = useState('hidden');
  const [toggle, setToggle] = useState(null);

  useEffect(() => {
    if (currentUser !== null) {
      setToggle(currentUser.carbSettings);
    }
  }, [currentUser]);

  const handleClose = () => {
    setModalStatus('hidden');
  };

  const toggleTotal = () => {
    setToggle('total');
  };

  const toggleNet = () => {
    setToggle('net');
  };

  const saveCarbSettings = () => {
    if (currentUser !== null) {
      if (currentUser.carbSettings !== toggle) {
        // only push update if there's a change between state and user settings in firebase
        updateCarbSettings(currentUser.id, toggle);
        const userCopy = Object.assign({}, currentUser);
        userCopy.carbSettings = toggle;
        setCurrentUser(userCopy);
      }
    }
    setConfirmationMsg({
      success: `Carb settings changed to "${toggle}".`,
    });
    setModalStatus('visible');
  };

  const getStyle = (className) => {
    if (currentUser !== null && className === toggle) {
      return 'on';
    } else {
      return 'off';
    }
  };

  let carbDescription = (
    <div className='total-list'>
      <div>Total carbs includes fiber.</div>
      <div>Foods will display total carbs by default.</div>
      <div>
        All carbs will count towards the daily carb limit defined in your diet.
      </div>
    </div>
  );

  if (currentUser && toggle === 'net') {
    carbDescription = (
      <div className='net-list'>
        <div>Net carbs is the sum of total carbs minus fiber.</div>
        <div>Foods will display net carbs by default.</div>
        <div>
          Only net carbs will count towards the daily carb limit defined in your
          diet.
        </div>
      </div>
    );
  }

  let confirmationModal;

  if (modalStatus === 'visible') {
    confirmationModal = (
      <ConfirmationModal
        messageObj={confirmationMsg}
        handleClose={handleClose}
        onConfirm={handleClose}
      />
    );
  } else {
    confirmationModal = null;
  }

  return (
    <div>
      {confirmationModal}
      <div className='t'>Carb Settings</div>
      <div className='carb-set-c'>
        <div className='toggle'>
          <div
            className={`${getStyle('total')} total opt`}
            onClick={toggleTotal}
          >
            TOTAL CARBS
          </div>
          <div className='separator'></div>
          <div className={`${getStyle('net')} net opt`} onClick={toggleNet}>
            NET CARBS
          </div>
        </div>
        <div className='desc-c'>{carbDescription}</div>
        <button className='save-btn' type='submit' onClick={saveCarbSettings}>
          Save
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CarbSettings);
