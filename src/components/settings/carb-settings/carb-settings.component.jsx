import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateCarbSettings } from '../../../firebase/firebase.utils';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../../redux/user/user.selectors';
import { toggleAlertModal } from '../../../redux/alert-modal/alert-modal.actions';
import { GiWheat } from 'react-icons/gi';
import { cloneDeep } from 'lodash';
import './carb-settings.styles.scss';

const CarbSettings = ({ currentUser, toggleAlertModal }) => {
  const [toggle, setToggle] = useState(currentUser.c);

  const OPTIONS = {
    t: 'total',
    n: 'net',
  };

  const toggleTotal = () => {
    setToggle('t');
  };

  const toggleNet = () => {
    setToggle('n');
  };

  const handleAlert = () => {
    toggleAlertModal({
      title: 'SETTINGS SAVED!',
      msg: `Your carb settings have been changed to ${OPTIONS[toggle]}.`,
      img: 'update',
      status: 'visible',
      sticky: false,
    });
  };

  const saveCarbSettings = () => {
    // only push update if there's a change between state and user settings in firebase
    if (currentUser.c !== toggle) {
      let userCopy = cloneDeep(currentUser);

      // if user changed to net carbs => move total carb goal to net carb goal ==> set old goal to null, or vice versa
      if (toggle === 'n') {
        userCopy.d.k = userCopy.d.c;
        userCopy.d.c = null;
      } else {
        userCopy.d.c = userCopy.d.k;
        userCopy.d.k = null;
      }

      userCopy.c = toggle;

      updateCarbSettings(userCopy.id, userCopy.d, toggle);
    }

    handleAlert();
  };

  const getStyle = (option) => {
    if (option === OPTIONS[toggle]) {
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
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CarbSettings);
