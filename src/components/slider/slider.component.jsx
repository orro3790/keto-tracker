import React, { useState, useEffect } from 'react';
import './slider.styles.scss';

const Slider = ({ name, ...props }) => {
  const [sliderContainer, setSliderContainer] = useState('');
  const [progressBar, setProgressBar] = useState('');
  const [thumb, setThumb] = useState('');
  const [sliderContainerWidth, setSliderContainerWidth] = useState('');
  const [sliderContainerLeft, setSliderContainerLeft] = useState('');
  const [thumbIndicator, setThumbIndicator] = useState('');
  const [tooltip, setTooltip] = useState('');
  const [sliderVal, setSliderVal] = useState(0);

  let percentage = 50;
  let dragging = false;
  let translate;

  // Releasing the mouse will set dragging back to

  const setPercentage = () => {
    progressBar.style.transform = `scaleX(${percentage / 100})`;

    thumb.style.transform = `translate(-50%) translateX(${
      (percentage / 100) * sliderContainerWidth
    }px)`;
  };

  const handleDragging = () => {
    dragging = true;
    thumbIndicator.classList.add('while-dragging');
    tooltip.classList.add('while-dragging');
  };

  const handleRelease = () => {
    dragging = false;
    thumbIndicator.classList.remove('while-dragging');
    tooltip.classList.remove('while-dragging');
  };

  const handleClickSet = (e) => {
    translate = e.clientX - sliderContainerLeft;
    percentage = (translate / sliderContainerWidth) * 100;
    progressBar.style.transform = `scaleX(${percentage / 100})`;
    thumb.style.transform = `translate(-50%) translateX(${
      (percentage / 100) * sliderContainerWidth
    }px)`;

    // set percentage, set sliderVal state
    setPercentage();
    setSliderVal(parseInt(percentage));
    //pass the slider data to props --> access by parent component: <Slider sliderData={}/>
    props.sliderData(percentage);

    handleRelease();
  };

  document.addEventListener('mousemove', function (e) {
    if (dragging) {
      if (e.clientX < sliderContainerLeft) {
        percentage = 0;
      } else if (e.clientX > sliderContainerWidth + sliderContainerLeft) {
        percentage = 100;
      } else {
        translate = e.clientX - sliderContainerLeft;
      }

      // set percentage, set sliderVal state
      percentage = (translate / sliderContainerWidth) * 100;
      setPercentage();
      setSliderVal(parseInt(percentage));

      //pass the slider data to props --> access by parent component: <Slider sliderData={}/>
      props.sliderData(percentage);
    }
  });

  // release the slider on mouseup and remove while-dragging style
  document.addEventListener('mouseup', function () {
    if (dragging) {
      dragging = false;
      thumbIndicator.classList.remove('while-dragging');
      tooltip.classList.remove('while-dragging');
    }
  });

  useEffect(() => {
    setSliderContainer(document.querySelector(`.slider-container.${name}`));
    const progressBar = document.querySelector(`.progress.${name}`);
    progressBar.style = 'transform: scaleX(0)';
    setProgressBar(progressBar);
    setThumb(document.querySelector(`.thumb.${name}`));
    setSliderContainerWidth(
      document.querySelector(`.slider-container.${name}`).offsetWidth
    );
    setSliderContainerLeft(
      document.querySelector(`.slider-container.${name}`).offsetLeft
    );
    setThumbIndicator(document.querySelector(`.thumb-indicator.${name}`));
    setTooltip(document.querySelector(`.tooltip.${name}`));
  }, []);

  return (
    <div className={`slider-container ${name}`}>
      <div className={`track ${name}`} onClick={handleClickSet}>
        <div className={`progress ${name}`}></div>
        <div
          className={`thumb ${name}`}
          onMouseDown={handleDragging}
          onMouseUp={handleRelease}
        >
          <div className={`thumb-indicator ${name}`}></div>
          <div className={`tooltip ${name}`}>
            <div className='slider-value'>{sliderVal}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
