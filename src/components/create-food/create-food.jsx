import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import { connect } from 'react-redux';
import {
  createFoodItem,
  toggleCreateFoodModal,
} from '../../redux/create-food/create-food.actions.js';
import './create-food.styles.scss';
import { createCreateFoodDocument } from '../../firebase/firebase.utils.js';

const CreateFood = ({
  createFoodItem,
  toggleCreateFoodModal,
  modalStatus,
  currentUser,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');

  const handleChange = (e) => {
    // allow empty string or values 0-9, 0-5 digits, optionally including one decimal point /w 1 digit after decimal
    const rule1 = /^\d{0,5}(\.\d{1})?$/;

    // allow empty string or values 0-9, 0-3 digits, optionally including one decimal point /w 1 digit after decimal
    const rule2 = /^\d{0,3}(\.\d{1})?$/;

    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'description':
        setDescription(e.target.value);
        break;
      case 'calories':
        if (e.target.value.match(rule1)) setCalories(e.target.value);
        break;
      case 'fats':
        if (e.target.value.match(rule2)) setFats(e.target.value);
        break;
      case 'carbs':
        if (e.target.value.match(rule2)) setCarbs(e.target.value);
        break;
      case 'protein':
        if (e.target.value.match(rule2)) setProtein(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
  };

  const handleClose = () => {
    toggleCreateFoodModal({
      status: 'hidden',
    });
  };

  let isSubmittable = false;

  // const pushToFirebase = async () => {
  //   const results = await createCreateFoodDocument(currentUser);
  // };

  return (
    <div>
      <form className='modal'>
        <div className='modal-outer-box'>
          <div className='modal-inner-box'>
            <span className='close-search-modal-btn'>
              <i className='fas fa-times' onClick={handleClose}></i>
            </span>
            <div className='title-section'>
              <FormInput
                id='name'
                name='name'
                inputType='input'
                type='text'
                onChange={handleChange}
                value={name}
                maxLength='70'
                label={'Give your food a name'}
                required
              />
            </div>
            <div className='description-section'>
              <FormInput
                id='description'
                name='description'
                inputType='textarea'
                onChange={handleChange}
                value={description}
                maxLength='70'
                label={'Give your food a description'}
                required
              />
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              {/* <input
                className={'macro-input'}
                name='grams'
                type='number'
                value={fields.grams.value}
                onChange={handleChange}
                placeholder='0'
              /> */}
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='number'
                value={fats}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='number'
                value={carbs}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='number'
                value={protein}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='number'
                value={calories}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <div
            className='submit-btn'
            disabled={!isSubmittable}
            type='submit'
            onClick={handleSubmit}
          >
            <div className='submit-btn-text'>
              Add to Database
              <i className='fas fa-plus'></i>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // createdFoods is only used here to check the state after adding an item. It's not really necessary
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodItem: (newFoodItem) => dispatch(createFoodItem(newFoodItem)),
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
