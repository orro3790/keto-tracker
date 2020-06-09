import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import './totals-chart.styles.scss';

const TotalsChart = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [targetGoal, setTargetGoal] = useState('e');

  useEffect(() => {
    // Don't actually calculate the data, use mock data for now to reduce reads during development

    let chartComponents = {
      data: [],
      dates: [],
      goal: [],
    };

    if (targetGoal === 'w') {
      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          chartComponents.data.push(data[month][date].water.t);
          chartComponents.dates.push(date);
          chartComponents.goal.push(data[month][date].goals.water.snapshot.w);
        });
      });
    } else {
      Object.keys(data).forEach((month) => {
        Object.keys(data[month]).forEach((date) => {
          chartComponents.data.push(data[month][date].dailyMacros[targetGoal]);
          chartComponents.dates.push(date);
          chartComponents.goal.push(
            data[month][date].goals.diet.snapshot[targetGoal]
          );
        });
      });
    }

    if (chartComponents.dates !== {}) {
      // convert unix dates into human readable labels
      let labels = [];
      chartComponents.dates.forEach((date) => {
        let label = new Date(date * 1000);
        labels.push(label.toLocaleDateString());
      });

      const chart = () => {
        let color = '#fff';
        switch (targetGoal) {
          case 'p':
            color = '#53a3ff';
            break;
          case 'f':
            color = '#ffa053';
            break;
          case 'c':
            color = '#ff5387';
            break;
          case 'e':
            color = '#fff';
            break;
          case 'w':
            color = '#53f9ff';
            break;
          default:
            break;
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Goal',
              data: chartComponents.goal,
              borderWidth: 2,
              borderDash: [2, 2],
              borderColor: '#1eb980',
              backgroundColor: '#1eb980',
              fill: false,
              tension: 0,
              type: 'line',
            },
            {
              label: 'total',
              data: chartComponents.data,
              backgroundColor: color,
              categoryPercentage: 1.0,
              barPercentage: 0.33,
            },
          ],
        });
      };

      chart();
    }
  }, [data, targetGoal]);

  let title;
  switch (targetGoal) {
    case 'e':
      title = 'Total Calories Consumed';
      break;
    case 'p':
      title = 'Total Protein Consumed';
      break;
    case 'c':
      title = 'Total Carbs Consumed';
      break;
    case 'f':
      title = 'Total Fats Consumed';
      break;
    case 'w':
      title = 'Total Water Consumed';
      break;
    default:
      break;
  }

  const toggleTarget = (e) => {
    switch (e.target.innerText) {
      case 'Total Calories Consumed':
        setTargetGoal('e');
        break;
      case 'Total Fats Consumed':
        setTargetGoal('f');
        break;
      case 'Total Carbs Consumed':
        setTargetGoal('c');
        break;
      case 'Total Protein Consumed':
        setTargetGoal('p');
        break;
      case 'Total Water Consumed':
        setTargetGoal('w');
        break;
      default:
        break;
    }
  };

  // chart options config
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className='totals-bar-chart-c'>
      <div className='chart-t-c'>
        <div className='left-col'></div>
        <div className='center-col'>
          <Tippy
            interactive={true}
            content={
              <div className='opt-c'>
                <div className='opt liOdd' onClick={toggleTarget}>
                  Total Fats Consumed
                </div>
                <div className='opt' onClick={toggleTarget}>
                  Total Carbs Consumed
                </div>
                <div className='opt liOdd' onClick={toggleTarget}>
                  Total Protein Consumed
                </div>
                <div className='opt' onClick={toggleTarget}>
                  Total Calories Consumed
                </div>
                <div className='opt liOdd' onClick={toggleTarget}>
                  Total Water Consumed
                </div>
              </div>
            }
          >
            <div>
              <span>{title}</span>
              <span className='dropdown-arrow'>
                <MdArrowDropDown />
              </span>
            </div>
          </Tippy>
        </div>
        <div className='right-col'>Full History</div>
      </div>
      <div className='chart-c'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TotalsChart);
