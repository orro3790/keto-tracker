import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserId } from '../../redux/user/user.selectors';
import { selectMetricsData } from '../../redux/metrics/metrics.selectors';
import './goal-hit-chart.styles.scss';

const GoalHitChart = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [targetGoal, setTargetGoal] = useState('e');

  useEffect(() => {
    let goalCount = {
      hit: 0,
      miss: 0,
    };

    if (targetGoal === 'w') {
      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          if (data[month][date].goals.water.hit[targetGoal] === true) {
            goalCount.hit += 1;
          } else {
            goalCount.miss += 1;
          }
        });
      });
    } else {
      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          if (data[month][date].goals.diet.hit[targetGoal] === true) {
            goalCount.hit += 1;
          } else {
            goalCount.miss += 1;
          }
        });
      });
    }

    const chart = () => {
      setChartData({
        labels: ['Goal Hit', 'Goal Missed'],
        datasets: [
          {
            label: 'macro ratios',
            data: [goalCount.hit, goalCount.miss],
            backgroundColor: ['rgba(255,160,83,1)', 'rgba(255,83,135,1)'],
            borderWidth: 2.5,
            borderColor: '#222222',
          },
        ],
      });
    };

    chart();
  }, [data, targetGoal]);

  const toggleTarget = (e) => {
    switch (e.target.innerText) {
      case 'Calories':
        setTargetGoal('e');
        break;
      case 'Fats':
        setTargetGoal('f');
        break;
      case 'Carbs':
        setTargetGoal('c');
        break;
      case 'Protein':
        setTargetGoal('p');
        break;
      case 'Water':
        setTargetGoal('w');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div>
        <Pie data={chartData} />
        <div className='opt' onClick={toggleTarget}>
          Calories
        </div>
        <div className='opt' onClick={toggleTarget}>
          Fats
        </div>
        <div className='opt' onClick={toggleTarget}>
          Carbs
        </div>
        <div className='opt' onClick={toggleTarget}>
          Protein
        </div>
        <div className='opt' onClick={toggleTarget}>
          Water
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GoalHitChart);
