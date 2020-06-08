import React, { useEffect } from 'react';
import Rail from '../../components/rail/rail.component';
// import GoalHitChart from '../../components/goal-hit-chart/goal-hit-chart-component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../redux/metrics/metrics.selectors';
import { setMetricsData } from '../../redux/metrics/metrics.actions';
import { getMetricsData } from '../../firebase/firebase.utils';
import './metrics.styles.scss';

const Metrics = ({ userId, data, setMetricsData }) => {
  useEffect(() => {
    const initializeData = async () => {
      const masterData = await getMetricsData(userId);

      console.log(masterData);

      setMetricsData(masterData);
    };

    // If data is not already in state, fetch it and set it.
    if (userId && data === '') {
      initializeData();
    }
  }, [setMetricsData, data, userId]);

  return (
    <div className='rail-body-separator'>
      <div>
        <Rail />
      </div>

      <div className='page-body-c'>
        {/* <div className='chart-c'><GoalHitChart /></div> */}
        <div className='dashboard-c'>
          <div className='top-r'>Top r</div>
          <div className='bottom-r'>
            <div className='bottom-left-c'></div>
            <div className='bottom-right-c'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
});

const mapDispatchToProps = (dispatch) => ({
  setMetricsData: (data) => dispatch(setMetricsData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
