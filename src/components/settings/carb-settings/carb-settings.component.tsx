import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { updateCarbSettings } from '../../../firebase/firebase.utils';
import {
  selectCurrentUserId,
  selectCarbSettings,
} from '../../../redux/user/user.selectors';
import { toggleAlertModal } from '../../../redux/alert-modal/alert-modal.actions';
import * as TAlertModal from '../../../redux/alert-modal/alert-modal.types';
import * as TUser from '../../../redux/user/user.types';
import { GiWheat } from 'react-icons/gi';
import './carb-settings.styles.scss';
import { RootState } from '../../../redux/root-reducer';
import { createStructuredSelector } from 'reselect';

type Props = PropsFromRedux;

const CarbSettings = ({ userId, carbSettings, toggleAlertModal }: Props) => {
  const [toggle, setToggle] = useState<TUser.CarbSettings>(carbSettings!);

  interface Options {
    t: 'total';
    n: 'net';
  }

  const OPTIONS: Options = {
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
    if (carbSettings !== toggle) {
      updateCarbSettings(userId, toggle);
    }

    handleAlert();
  };

  const getStyle = (option: 'total' | 'net') => {
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

  if (OPTIONS[toggle] === 'net') {
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

interface Selectors {
  userId: TUser.UserId | undefined;
  carbSettings: TUser.CarbSettings | undefined;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  userId: selectCurrentUserId,
  carbSettings: selectCarbSettings,
});

const mapDispatchToProps = (
  dispatch: Dispatch<TAlertModal.ToggleAlertModal>
) => ({
  toggleAlertModal: (status: TAlertModal.Modal) =>
    dispatch(toggleAlertModal(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CarbSettings);
