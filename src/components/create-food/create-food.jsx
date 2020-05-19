import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import { connect } from 'react-redux';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions.js';
import './create-food.styles.scss';
import { createCreateFoodDocument } from '../../firebase/firebase.utils.js';
import ConfirmationModal from './../confirmation-modal/confirmation-modal.component';

const CreateFood = ({ toggleCreateFoodModal, currentUser }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [size, setSize] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [protein, setProtein] = useState('');
  const [unit, setUnit] = useState('');

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
      case 'size':
        if (e.target.value.match(rule1)) setSize(e.target.value);
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
      case 'fiber':
        if (e.target.value.match(rule2)) setFiber(e.target.value);
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
    // all macros in the database must be based off 100g/ml portions
    const ePer = parseFloat(((calories / size) * 100).toPrecision(4));
    const cPer = parseFloat(((carbs / size) * 100).toPrecision(4));
    const fPer = parseFloat(((fats / size) * 100).toPrecision(4));
    const pPer = parseFloat(((protein / size) * 100).toPrecision(4));
    const dPer = parseFloat(((fiber / size) * 100).toPrecision(4));
    const kPer = cPer - dPer;

    // implement ability to add by label:
    // const g = ...
    // const i = ...

    const newFood = {
      b: description,
      c: cPer,
      d: dPer,
      e: ePer,
      f: fPer,
      g: '',
      i: '',
      k: kPer,
      n: name,
      p: pPer,
      u: unit,
    };
    createCreateFoodDocument(currentUser, newFood);
    handleClose();
    // dispatch toggleGlobalMessage next
  };

  const handleClose = () => {
    toggleCreateFoodModal({
      status: 'hidden',
    });
  };

  let isSubmittable = false;

  // check that all fields are filled
  let fieldsFilled = false;

  if (
    name !== '' &&
    description !== '' &&
    size !== '' &&
    fats !== '' &&
    carbs !== '' &&
    fiber !== '' &&
    protein !== '' &&
    calories !== ''
  ) {
    fieldsFilled = true;
  }

  if (fieldsFilled === true) {
    isSubmittable = true;
  }

  const enabledCheck = () => {
    if (fieldsFilled === true) {
      return 'enabled';
    } else {
      return null;
    }
  };

  let gramsStyle = 'g enabled';
  let mlStyle = 'ml';

  switch (unit) {
    case 'g':
      gramsStyle = 'g enabled';
      break;
    case 'ml':
      mlStyle = 'ml enabled';
      gramsStyle = 'g';
      break;
    default:
      break;
  }

  const toggleUnit = (e) => {
    console.log(e.target.className);
    switch (e.target.className) {
      case 'g':
        setUnit('g');
        break;
      case 'ml':
        setUnit('ml');
        break;
      default:
        break;
    }
  };

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
                label='Give your food a name'
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
                maxLength='100'
                label='Give your food a description'
                required
              />
            </div>
            <div className='macro-section'>
              <span className='macro-label'>Size</span>
              <FormInput
                className='macro-input'
                name='size'
                inputType='input'
                type='number'
                value={size}
                onChange={handleChange}
                placeholder='0'
              />

              <div className=' macro-unit toggle'>
                <div className={gramsStyle} onClick={toggleUnit}>
                  g
                </div>
                <div className='separator'>/</div>
                <div className={mlStyle} onClick={toggleUnit}>
                  ml
                </div>
              </div>

              <span className='macro-label fats'>Fats</span>
              <FormInput
                className='macro-input'
                name='fats'
                inputType='input'
                type='number'
                value={fats}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-label carbs'>Carbs</span>
              <FormInput
                className='macro-input'
                name='carbs'
                inputType='input'
                type='number'
                value={carbs}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-label protein'>Protein</span>
              <FormInput
                className='macro-input'
                name='protein'
                inputType='input'
                type='number'
                value={protein}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-label'>Fiber</span>
              <FormInput
                className='macro-input'
                name='fiber'
                inputType='input'
                type='number'
                value={fiber}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-label'>Calories</span>
              <FormInput
                className='macro-input'
                name='calories'
                inputType='input'
                type='number'
                value={calories}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <div
            className={`submit-btn ${enabledCheck()}`}
            disabled={!isSubmittable}
            type='submit'
            onClick={handleSubmit}
          >
            <div className={`submit-btn-text ${enabledCheck()}`}>
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
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
