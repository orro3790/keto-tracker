import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  createFoodItem,
  changeModalStatus,
} from '../../redux/create-food-item/create-food-item.actions.js';
import './create-food-item.styles.scss';

const CreateFood = ({ createFoodItem, changeModalStatus, modalStatus }) => {
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [grams, setGrams] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calories, setCalories] = useState(0);

  const handleFoodName = (e) => {
    setFoodName(e.target.value);
  };

  const handleFoodDescription = (e) => {
    setFoodDescription(e.target.value);
  };

  const handleGrams = (e) => {
    setGrams(e.target.value);
  };

  const handleFats = (e) => {
    setFats(e.target.value);
  };

  const handleCarbs = (e) => {
    setCarbs(e.target.value);
  };

  const handleProtein = (e) => {
    setProtein(e.target.value);
  };

  const handleCalories = (e) => {
    setCalories(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFoodItem = {
      name: foodName,
      description: foodDescription,
      grams: grams,
      fats: fats,
      carbs: carbs,
      protein: protein,
      calories: calories,
    };
    createFoodItem(newFoodItem);
    console.log('submitted!');
  };

  const handleClose = () => {
    setFoodName('');
    setFoodDescription('');
    setGrams(0);
    setFats(0);
    setCarbs(0);
    setProtein(0);
    setCalories(0);

    if (modalStatus === 'closed') {
      changeModalStatus('open');
    } else {
      changeModalStatus('closed');
    }
  };

  return (
    <div>
      <form className='modal'>
        <div className='modal-outer-box'>
          <div className='modal-inner-box'>
            <span className='reset-fields-btn'>
              {/* <i className='fas fa-eraser' onClick={handleReset}></i> */}
              <i className='fas fa-times-circle' onClick={handleClose}></i>
            </span>
            <div className='title-section'>
              <input
                className='food-name-input'
                name='food-name-input'
                type='text'
                value={foodName}
                onChange={handleFoodName}
                placeholder='Add a name...'
                maxLength='35'
              />
            </div>
            <div className='description-section'>
              <textarea
                className='description-area'
                placeholder='Add a description...'
                value={foodDescription}
                onChange={handleFoodDescription}
                maxLength='200'
              ></textarea>
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              <input
                className={'macro-input'}
                name='grams'
                type='text'
                value={grams}
                onChange={handleGrams}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Fats</span>
              <input
                className={'macro-input'}
                name='fats'
                type='text'
                value={fats}
                onChange={handleFats}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Carbs</span>
              <input
                className={'macro-input'}
                name='carbs'
                type='text'
                value={carbs}
                onChange={handleCarbs}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Protein</span>
              <input
                className={'macro-input'}
                name='protein'
                type='text'
                value={protein}
                onChange={handleProtein}
                placeholder='0'
              />
              <span className='macro-unit'>(g)</span>
              <span className='macro-label'>Calories</span>
              <input
                className={'macro-input'}
                name='calories'
                type='text'
                value={calories}
                onChange={handleCalories}
                placeholder='0'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <div className='next-btn' type='submit' onClick={handleSubmit}>
            <div className='next-btn-text'>
              Add to Diary
              <i className='fas fa-plus'></i>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  createdFoods: state.createdFoods.createdFoods,
  modalStatus: state.createdFoods.modalStatus,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodItem: (newFoodItem) => dispatch(createFoodItem(newFoodItem)),
  changeModalStatus: (status) => dispatch(changeModalStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
