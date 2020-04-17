import React from 'react';

import './confirmation-modal.styles.scss';

const ConfirmationModal = () => {
  return (
    <div className='confirmation-modal'>
      <div className='confirmation-modal-outer-box'>
        <div className='confirmation-modal-header-section'>
          <h3>
            <i className='far fa-check-circle'></i>
          </h3>
        </div>
        <div className='confirmation-modal-message-section'>
          Successfully Added!
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
