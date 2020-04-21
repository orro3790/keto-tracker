import React, { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import './search.styles.scss';
import { connect } from 'react-redux';

const Search = ({ foodDatabase }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const myFunc = (item) => {
    if (item.name.includes(searchInput) && searchInput !== '') {
      return (
        <li className='search-result-li' key={item.name}>
          {item.name}
        </li>
      );
    }
  };

  return (
    <div>
      <div className='food-item-input'>
        <form>
          <FormInput
            name='search-input'
            type='text'
            onChange={handleChange}
            value={searchInput}
            label='Add a food item'
            required
          />
        </form>
      </div>
      <div className='wrapper'>
        <ul className='search-results-list'>
          {foodDatabase.map((item) => myFunc(item))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  foodDatabase: state.foodDiary.foods,
});

export default connect(mapStateToProps)(Search);
