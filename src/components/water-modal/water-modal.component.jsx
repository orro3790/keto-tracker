import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { RiWaterFlashLine } from 'react-icons/ri';
import { MdCheck } from 'react-icons/md';
import { selectWaterSettings } from '../../redux/user/user.selectors';
import { selectWater } from '../../redux/date-selector/date-selector.selectors';
import { selectMeal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { toggleSearchModal } from '../../redux/search-food-modal/search-food-modal.actions';
import { toggleWaterModal } from '../../redux/water-modal/water-modal.actions';

import './water-modal.styles.scss';

const WaterModal = ({
  waterSettings,
  createFoodReference,
  toggleSearchModal,
  toggleWaterModal,
  meal,
}) => {
  const [input, setInput] = useState('');

  const handleClose = () => {
    toggleWaterModal({
      status: 'hidden',
    });
  };

  const handleBack = () => {
    toggleWaterModal({
      status: 'hidden',
    });
    createFoodReference('');
    toggleSearchModal({
      status: 'visible',
      meal: meal,
      editMode: false,
      foodToEdit: '',
      listId: '',
    });
  };

  const handleSubmit = () => {
    console.log('submitted');
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const getBtnStyle = () => {
    if (input !== '') {
      return 'submit-btn on';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (input !== '') {
      return 'fas fa-check add-i on';
    } else {
      return 'fas fa-check add-i';
    }
  };

  return (
    <div>
      <form>
        <div className='template-m'>
          <div className='btn-c'>
            <div></div>
            <div className='back-btn' onClick={handleBack}>
              <FaArrowLeft className='fas fa-arrow-left' />
            </div>
            <div className='close-btn' onClick={handleClose}>
              <FaTimes className='fas fa-times' />
            </div>
          </div>
          <div className='inner-c'>
            <div className='energy-i'>
              <RiWaterFlashLine />
            </div>
            <div className='desc'>
              Your goal is to consume
              <span className='goal'>
                {waterSettings.g} {waterSettings.u}
              </span>{' '}
              per day.
            </div>
            <div className='water-s'>
              <span className='water-l'>Size</span>
              <FormInput
                className='water-in'
                name='size'
                inputType='input'
                type='number'
                value={input}
                onChange={handleChange}
                placeholder='0'
              />
              <div className='water-unit'>
                <div>{waterSettings.u}</div>
              </div>
            </div>
          </div>
          <div className='water-submit-r'>
            <div className={getBtnStyle()} onClick={handleSubmit}>
              <MdCheck className={getIconStyle()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  waterSettings: selectWaterSettings,
  meal: selectMeal,
  // water: selectWater,
});

const mapDispatchToProps = (dispatch) => ({
  // toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
  toggleWaterModal: (status) => dispatch(toggleWaterModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterModal);
