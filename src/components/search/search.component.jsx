import React, { useState, useEffect } from 'react';
import FormInput from '../form-input/form-input.component';
import './search.styles.scss';

import DATA from './fake-data';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {});

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
          {DATA.foods.map((item) => myFunc(item))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
