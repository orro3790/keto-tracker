import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user.actions';
import { updateCarbSettings } from '../../firebase/firebase.utils';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { GiWheat } from 'react-icons/gi';
import './carb-settings.styles.scss';

const CarbSettings = ({ currentUser, setCurrentUser, toggleAlertModal }) => {
  const [toggle, setToggle] = useState(null);

  useEffect(() => {
    switch (currentUser.carbSettings) {
      case 'n':
        setToggle('net');
        break;
      case 't':
        setToggle('total');
        break;
      default:
        break;
    }
  }, [currentUser]);

  const toggleTotal = () => {
    setToggle('total');
  };

  const toggleNet = () => {
    setToggle('net');
  };

  const handleAlert = () => {
    toggleAlertModal({
      title: 'SETTINGS SAVED!',
      msg: `Your carb settings have been changed to ${toggle}.`,
      img: 'update',
      status: 'visible',
      sticky: false,
    });
  };

  const saveCarbSettings = () => {
    let setting;
    if (toggle === 'total') {
      setting = 't';
    } else {
      setting = 'n';
    }

    if (currentUser.carbSettings !== setting) {
      // only push update if there's a change between state and user settings in firebase
      updateCarbSettings(currentUser.id, setting);
      const userCopy = Object.assign({}, currentUser);
      userCopy.carbSettings = setting;
      setCurrentUser(userCopy);
    }

    handleAlert();
  };

  const getStyle = (className) => {
    if (className === toggle) {
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

  if (toggle === 'net') {
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

  return (
    <div>
      <div className='set-h-c'>
        <GiWheat className='set-i carb-i' />
        <div className='t'>Carb Settings</div>
      </div>
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
        <button className={'save-btn'} type='submit' onClick={saveCarbSettings}>
          Save
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CarbSettings);
