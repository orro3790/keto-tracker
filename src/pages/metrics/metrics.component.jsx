import React, { useEffect } from 'react';
import Rail from '../../components/rail/rail.component';
import TotalsChart from '../../components/metrics/totals-chart/totals-chart.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../redux/metrics/metrics.selectors';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { setMetricsData } from '../../redux/metrics/metrics.actions';
import { getMetricsData } from '../../firebase/firebase.utils';
import './metrics.styles.scss';

const Metrics = ({ userId, data, setMetricsData }) => {
  useEffect(() => {
    const initializeData = async () => {
      const masterData = await getMetricsData(userId);

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
        <div className='dashboard-c'>
          <div className='top-r'>
            <TotalsChart />
          </div>
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
  userId: selectCurrentUserId,
});

const mapDispatchToProps = (dispatch) => ({
  setMetricsData: (data) => dispatch(setMetricsData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
