import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import { connect } from 'react-redux';
import { toggleCreateFoodModal } from '../../redux/create-food/create-food.actions.js';
import { toggleAlertModal } from '../../redux/alert-modal/alert-modal.actions';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { createFood } from '../../firebase/firebase.utils.js';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { selectMeal } from '../../redux/search-modal/search-modal.selectors';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import { MdCheck } from 'react-icons/md';
import './create-food.styles.scss';

const CreateFood = ({
  toggleCreateFoodModal,
  userId,
  toggleAlertModal,
  meal,
  toggleSearchModal,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [size, setSize] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [protein, setProtein] = useState('');
  const [unit, setUnit] = useState('g');

  const handleBack = () => {
    toggleCreateFoodModal({
      status: 'hidden',
    });
    toggleSearchModal({
      status: 'visible',
      meal: meal,
      editMode: {
        enabled: false,
        food: '',
        index: '',
      },
    });
  };

  const handleChange = (e) => {
    // allow 0-9, 0-4 digits before decimal, optionally includes one decimal point /w 1 digit after decimal
    const rule1 = /^(\d{0,1}|[1-9]\d{0,3})(\.\d{1,1})?$/;

    // allow 0-9, 0-2 digits before decimal, optionally includes one decimal point /w 2 digits after decimal
    const rule2 = /^(\d{0,1}|[1-9]\d{0,2})(\.\d{1,2})?$/;

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

    if (fieldsFilled === true) {
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
        b: description.toUpperCase(),
        c: cPer,
        d: dPer,
        e: ePer,
        f: fPer,
        g: '',
        i: '',
        k: kPer,
        n: name.toUpperCase(),
        p: pPer,
        u: unit,
      };
      createFood(userId, newFood);
      handleClose();
      toggleAlertModal({
        title: 'SUCCESS!',
        msg: `${newFood.n} has been added to custom foods list! You can now add it to your diary.`,
        img: '',
        status: 'visible',
        callback: '',
        sticky: false,
      });
    }
  };

  const handleClose = () => {
    toggleCreateFoodModal({
      status: 'hidden',
    });
  };

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

  let gramsStyle = 'g opt on';
  let mlStyle = 'ml opt';

  switch (unit) {
    case 'g':
      gramsStyle = 'g opt on';
      break;
    case 'ml':
      mlStyle = 'ml opt on';
      gramsStyle = 'g opt';
      break;
    default:
      break;
  }

  const toggleUnit = (e) => {
    if (e.target.className.includes('g')) {
      setUnit('g');
    } else if (e.target.className.includes('ml')) {
      setUnit('ml');
    }
  };

  const getBtnStyle = () => {
    if (fieldsFilled === true) {
      return 'submit-btn on';
    } else {
      return 'submit-btn';
    }
  };

  const getIconStyle = () => {
    if (fieldsFilled === true) {
      return 'fas fa-check add-i on';
    } else {
      return 'fas fa-check add-i';
    }
  };

  return (
    <div>
      <form>
        <div className='submit-template-m'>
          <div className='btn-c'>
            <div></div>
            <div className='back-btn' onClick={handleBack}>
              <FaArrowLeft className='fas fa-arrow-left' />
            </div>
            <div className='close-btn' onClick={handleClose}>
              <FaTimes className='fas fa-times' />
            </div>
          </div>
          <div className='create-m-info-c'>
            <div className='t-s'>
              <FormInput
                id='name'
                name='name'
                type='text'
                onChange={handleChange}
                value={name}
                maxLength='70'
                label='Give your food a name ...'
                required
              />
            </div>
            <div className='desc-s'>
              <FormInput
                id='description'
                name='description'
                textArea
                onChange={handleChange}
                value={description}
                maxLength='100'
                label='Give your food a description ...'
                required
              />
            </div>
            <div className='macro-s'>
              <span className='macro-l'>Size</span>
              <FormInput
                className='macro-in'
                name='size'
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

              <span className='macro-l fats'>Fats</span>
              <FormInput
                className='macro-in'
                name='fats'
                type='number'
                value={fats}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-l carbs'>Carbs</span>
              <FormInput
                className='macro-in'
                name='carbs'
                type='number'
                value={carbs}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-l protein'>Protein</span>
              <FormInput
                className='macro-in'
                name='protein'
                type='number'
                value={protein}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-l'>Fiber</span>
              <FormInput
                className='macro-in'
                name='fiber'
                type='number'
                value={fiber}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'>g</span>
              <span className='macro-l'>Calories</span>
              <FormInput
                className='macro-in'
                name='calories'
                type='number'
                value={calories}
                onChange={handleChange}
                placeholder='0'
              />
              <span className='macro-unit'></span>
            </div>
          </div>
          <div className='submit-r'>
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
  userId: selectCurrentUserId,
  meal: selectMeal,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCreateFoodModal: (status) => dispatch(toggleCreateFoodModal(status)),
  toggleAlertModal: (status) => dispatch(toggleAlertModal(status)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);
