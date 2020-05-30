import React from 'react';
import './edit-item.styles.scss';
import { connect } from 'react-redux';
import { createFoodReference } from '../../redux/search-item/search-item.actions.js';
import { toggleSearchModal } from '../../redux/meal/meal.actions.js';
import { selectModal } from '../../redux/search-food-modal/search-food-modal.selectors';
import { createStructuredSelector } from 'reselect';
import { MdAddBox } from 'react-icons/md';

const EditItem = ({
  food,
  createFoodReference,
  index,
  searchModal,
  toggleSearchModal,
}) => {
  const handleClick = (e) => {
    createFoodReference(food);
    const copy = Object.assign({}, searchModal);
    copy.status = 'visible';
    toggleSearchModal(copy);
  };

  const truncate = (string) => {
    if (string !== '') {
      if (string.length > 50) {
        return `${string.slice(0, 50)}...`;
      } else {
        return `${string}`;
      }
    }
  };

  return (
    <div
      className={`item-c ${index % 2 ? 'liOdd' : 'liEven'}`}
      onClick={handleClick}
    >
      <MdAddBox className='add-btn' />
      <span className='name'>{food.n}</span>
      <div></div>
      <div className='desc'>{truncate(food.b)}</div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  searchModal: selectModal,
});

const mapDispatchToProps = (dispatch) => ({
  createFoodReference: (food) => dispatch(createFoodReference(food)),
  toggleSearchModal: (status) => dispatch(toggleSearchModal(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
