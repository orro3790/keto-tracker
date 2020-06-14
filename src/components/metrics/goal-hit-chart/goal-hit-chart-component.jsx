import React, { useState, useEffect } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-stacked100';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { selectCarbSettings } from '../../../redux/user/user.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import { BsQuestionSquareFill } from 'react-icons/bs';
import Tippy from '@tippyjs/react';
import './goal-hit-chart.styles.scss';

const GoalHitChart = ({ data, carbSettings }) => {
  const [chartData, setChartData] = useState({});
  const [threshold, setThreshold] = useState({ value: 0.05, label: '5%' });

  let thresholds = {
    '0.01': '1%',
    '0.05': '5%',
    '0.1': '10%',
    '0.15': '15%',
    '0.2': '20%',
  };

  const toggleThreshold = (e) => {
    switch (e.target.innerText) {
      case '1%':
        setThreshold({
          value: 0.01,
          label: '1%',
        });
        break;
      case '5%':
        setThreshold({
          value: 0.05,
          label: '5%',
        });
        break;
      case '10%':
        setThreshold({
          value: 0.1,
          label: '10%',
        });
        break;
      case '15%':
        setThreshold({
          value: 0.15,
          label: '15%',
        });
        break;
      case '20%':
        setThreshold({
          value: 0.2,
          label: '20%',
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let goalCount = {
      f: {
        hit: 0,
        miss: 0,
      },
      c: {
        hit: 0,
        miss: 0,
      },
      p: {
        hit: 0,
        miss: 0,
      },
      e: {
        hit: 0,
        miss: 0,
      },
      w: {
        hit: 0,
        miss: 0,
      },
    };

    let range = {
      floor: 1 - threshold.value,
      ceil: 1 + threshold.value,
    };

    Object.keys(data).forEach((month) => {
      Object.keys(data[month]).forEach((date) => {
        Object.keys(goalCount).forEach((goal) => {
          if (goal === 'w') {
            let performance = data[month][date].goals.water.precision[goal];
            if (performance <= range.ceil && performance >= range.floor) {
              goalCount[goal].hit++;
            } else {
              goalCount[goal].miss++;
            }
          } else {
            let performance = data[month][date].goals.diet.precision[goal];
            if (performance <= range.ceil && performance >= range.floor) {
              goalCount[goal].hit++;
            } else {
              goalCount[goal].miss++;
            }
          }
        });
      });
    });

    const chartPerformance = () => {
      let labels;

      if (carbSettings === 'n') {
        labels = ['Fats', 'Net Carbs', 'Protein', 'Calories', 'Water'];
      } else {
        labels = ['Fats', 'Carbs', 'Protein', 'Calories', 'Water'];
      }

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Goal Hit',
            data: [
              goalCount.f.hit,
              goalCount.c.hit,
              goalCount.p.hit,
              goalCount.e.hit,
              goalCount.w.hit,
            ],
            backgroundColor: [
              '#ffa053',
              '#ff5387',
              '#53a3ff',
              '#fff',
              '#53f9ff',
            ],
            categoryPercentage: 1.0,
            barPercentage: 0.33,
          },
          {
            label: 'Goal Missed',
            data: [
              goalCount.f.miss,
              goalCount.c.miss,
              goalCount.p.miss,
              goalCount.e.miss,
              goalCount.w.miss,
            ],
            categoryPercentage: 1.0,
            barPercentage: 0.33,
            backgroundColor: '#222222',
          },
        ],
      });
    };

    chartPerformance();
  }, [data, threshold, carbSettings]);

  // chart options config
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      stacked100: {
        enable: true,
      },
    },
    legend: {
      display: false,
    },
    animation: {
      duration: 1000,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            padding: 10,
            fontColor: '#fff',
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: 'rgba(126, 126, 126, 0.3)',
            drawBorder: false,
          },
          ticks: {
            padding: 5,
            fontColor: '#fff',
          },
        },
      ],
    },
  };

  const renderThresholds = () => {
    // pull the keys from the thresholds obj to an array to allow indexing
    let keys = Object.keys(thresholds);

    // remove the value currently being viewed, from the list of options to render

    keys.forEach((key) => {
      if (key === JSON.stringify(threshold.value)) {
        let position = keys.indexOf(key);
        keys.splice(position, 1);
      }
    });

    // assemble the option rows and tag each option as either even or odd for styling purposes
    let array = [];

    keys.forEach((key) => {
      let styling;
      if (keys.indexOf(key) % 2 === 0) {
        styling = 'opt liEven';
      } else {
        styling = 'opt liOdd';
      }
      array.push(
        <li key={thresholds[key]} className={styling} onClick={toggleThreshold}>
          {thresholds[key]}
        </li>
      );
    });

    return array;
  };

  return (
    <div className='outer-chart-c'>
      <div className='header-c-3'>
        <div className='left-col'>
          <Tippy
            content={
              <div className='chart-desc-tooltip'>
                This chart displays the % of days that you hit your goals, as
                defined by your diet settings on each day.
                <br />
                <br />
                Accuracy refers to the range of error between your daily totals
                and your diet goals.
              </div>
            }
            animation={'scale'}
          >
            <div>
              <BsQuestionSquareFill className='question-i' />
            </div>
          </Tippy>
        </div>
        <div className='center-col'>
          <div className='chart-t'>% Of Days Goal Hit</div>
        </div>
        <div className='right-col'>
          <Tippy
            interactive={true}
            content={<ul className='opt-c'>{renderThresholds()}</ul>}
          >
            <div>
              <span className='clickable chart-t'>
                Accuracy {threshold.label}
              </span>
              <span className='dropdown-arrow clickable'>
                <MdArrowDropDown />
              </span>
            </div>
          </Tippy>
        </div>
      </div>
      <div className='chart-c'>
        <HorizontalBar data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
  carbSettings: selectCarbSettings,
});

export default connect(mapStateToProps, null)(GoalHitChart);
