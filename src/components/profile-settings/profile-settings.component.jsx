import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import FormInput from '../../components/form-input/form-input.component';
import { updateDietMacros } from '../../firebase/firebase.utils';
import { setUserMacros } from '../../redux/user/user.actions';
import Slider from '../../components/slider/slider.component';
import './profile-settings.styles.scss';

const ProfileSettings = ({ currentUser, setUserMacros }) => {
  const [fatLimit, setFatLimit] = useState('');
  const [carbLimit, setCarbLimit] = useState('');
  const [proteinLimit, setProteinLimit] = useState('');
  const [calorieLimit, setCalorieLimit] = useState('');
  const [calorieSlider, setCalorieSlider] = useState('');

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'diet-fats':
        setFatLimit(e.target.value);
        break;
      case 'diet-carbs':
        setCarbLimit(e.target.value);
        break;
      case 'diet-protein':
        setProteinLimit(e.target.value);
        break;
      case 'diet-calories':
        setCalorieLimit(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log([fatLimit, carbLimit, proteinLimit, calorieLimit]);
    // console.log(currentUser.id);
    const macros = {
      fats: parseInt(fatLimit),
      carbs: parseInt(carbLimit),
      protein: parseInt(proteinLimit),
      calories: parseInt(calorieLimit),
      calorieSlider: calorieSlider,
    };
    // updateDietMacros(currentUser.id, macros);
    // setUserMacros(macros);
    console.log(macros);
  };

  return (
    <div>
      <form className='diet-input' onSubmit={handleSubmit}>
        <FormInput
          name='diet-fats'
          type='number'
          placeholder='fats (g)'
          value={fatLimit}
          onChange={handleChange}
        />
        <FormInput
          name='diet-carbs'
          type='number'
          placeholder='carbs (g)'
          value={carbLimit}
          onChange={handleChange}
        />
        <FormInput
          name='diet-protein'
          type='number'
          placeholder='protein (g)'
          value={proteinLimit}
          onChange={handleChange}
        />
        <FormInput
          name='diet-calories'
          type='number'
          placeholder='calories'
          value={calorieLimit}
          onChange={handleChange}
        />
        <button className='save-changes-btn' type='submit'>
          Save
        </button>
        <Slider name='calories-slider' sliderData={setCalorieSlider} />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setUserMacros: (macros) => dispatch(setUserMacros(macros)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
