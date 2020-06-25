import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../redux/root-reducer';
import { createFoodReference } from '../../redux/search-item/search-item.actions';
import { toggleSearchModal } from '../../redux/search-modal/search-modal.actions';
import { selectModal } from '../../redux/search-modal/search-modal.selectors';
import * as TSearchModal from '../../redux/search-modal/search-modal.types';
import * as TSearchItem from '../../redux/search-item/search-item.types';
import { createStructuredSelector } from 'reselect';
import { MdAddBox } from 'react-icons/md';
import './edit-item.styles.scss';

type PropsFromParent = {
  food: TSearchItem.Food;
  index: number;
};
type Props = PropsFromRedux & PropsFromParent;

const EditItem = ({
  food,
  createFoodReference,
  index,
  searchModal,
  toggleSearchModal,
}: Props) => {
  const handleClick = () => {
    createFoodReference(food);
    const copy = Object.assign({}, searchModal);
    copy.status = 'visible';
    toggleSearchModal(copy);
  };

  const truncate = (string: string) => {
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

interface Selectors {
  searchModal: TSearchModal.Modal;
}

const mapStateToProps = createStructuredSelector<RootState, Selectors>({
  searchModal: selectModal,
});

type Actions = TSearchModal.ToggleSearchModal | TSearchItem.CreateFoodReference;

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => ({
  createFoodReference: (food: TSearchItem.Food) =>
    dispatch(createFoodReference(food)),
  toggleSearchModal: (status: TSearchModal.Modal) =>
    dispatch(toggleSearchModal(status)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EditItem);
