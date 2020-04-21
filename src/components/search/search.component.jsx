import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import './search.styles.scss';

import FOOD_DATA from './fake-data';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    console.log(searchInput);
  });

  return (
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
  );
};

export default Search;
