import React from 'react';
import './modal.styles.scss';

class Modal extends React.Component {
  render() {
    return this.props.isOpen ? (
      <div>
        <form className='modal'>
          <div className='modal-outer-box'>
            <div className='modal-inner-box'>
              <div className='modal-title'>
                <input
                  className='food-name-input'
                  name='food-name'
                  type='text'
                  placeholder='Add food item...'
                />
              </div>
              <div className='modal-body'>
                <span className='macro-label'>Grams</span>
                <input
                  className='macro-input'
                  name='grams'
                  type='text'
                  placeholder='0g'
                />
                <span className='macro-label'>Fats</span>
                <input
                  className='macro-input'
                  name='fats'
                  type='text'
                  placeholder='0g'
                />
                <span className='macro-label'>Net Carbs</span>
                <input
                  className='macro-input'
                  name='net carbs'
                  type='text'
                  placeholder='0g'
                />
                <span className='macro-label'>Protein</span>
                <input
                  className='macro-input'
                  name='protein'
                  type='text'
                  placeholder='0g'
                />
                <span className='macro-label'>Calories</span>
                <input
                  className='macro-input'
                  name='calories'
                  type='text'
                  placeholder='0 cal'
                />
              </div>
            </div>
            <div className='next-btn'>
              <div className='next-btn-text'>Add to Diary</div>
            </div>
          </div>
        </form>
      </div>
    ) : null;
  }
}
export default Modal;
