import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectMetricsData } from '../../../redux/metrics/metrics.selectors';
import { selectWaterSettings } from '../../../redux/user/user.selectors';
import { MdArrowDropDown } from 'react-icons/md';
import { BsQuestionSquareFill } from 'react-icons/bs';
import Tippy from '@tippyjs/react';
import './totals-chart.styles.scss';

const TotalsChart = ({ data, waterSettings }) => {
  const [chartData, setChartData] = useState({});
  const [targetGoal, setTargetGoal] = useState('e');
  // Define the keys and their corresponding titles
  const OPTIONS = {
    f: 'Total Fats (g)',
    c: 'Total Carbs (g)',
    d: 'Total Fibre (g)',
    k: 'Total Net Carbs (g)',
    p: 'Total Protein (g)',
    e: 'Total Calories (g)',
    w: `Total Water (${waterSettings.u})`,
  };

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
          // convert units if necessary
          switch (waterSettings.u) {
            case 'mL':
              chartComponents.data.push(data[month][date].water.t);
              chartComponents.goal.push(
                data[month][date].goals.water.snapshot.w
              );
              break;
            case 'cups':
              chartComponents.data.push(
                parseFloat((data[month][date].water.t / 250).toFixed(2))
              );
              chartComponents.goal.push(
                parseFloat(
                  (data[month][date].goals.water.snapshot.w / 250).toFixed(2)
                )
              );
              break;
            case 'oz':
              chartComponents.data.push(
                parseFloat((data[month][date].water.t / 29.5735).toFixed(2))
              );
              chartComponents.goal.push(
                parseFloat(
                  (data[month][date].goals.water.snapshot.w / 29.5735).toFixed(
                    2
                  )
                )
              );

              break;
            default:
              break;
          }

          chartComponents.dates.push(date);
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
      // Convert unix dates into human readable labels
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
          case 'd':
            color = '#b453ff';
            break;
          case 'k':
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
  }, [data, targetGoal, waterSettings.u]);

  const toggleTarget = (e) => {
    switch (e.target.innerText) {
      case OPTIONS.e:
        setTargetGoal('e');
        break;
      case OPTIONS.f:
        setTargetGoal('f');
        break;
      case OPTIONS.c:
        setTargetGoal('c');
        break;
      case OPTIONS.d:
        setTargetGoal('d');
        break;
      case OPTIONS.k:
        setTargetGoal('k');
        break;
      case OPTIONS.p:
        setTargetGoal('p');
        break;
      case OPTIONS.w:
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
    scales: {
      yAxes: [
        {
          gridLines: {
            color: 'rgba(126, 126, 126, 0.3)',
          },
          ticks: {
            padding: 10,
            fontColor: '#fff',
            beginAtZero: true,
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

  const renderTitles = () => {
    // pull the keys from the OPTIONS obj to an array to allow indexing
    let keys = Object.keys(OPTIONS);

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
        <li key={OPTIONS[key]} className={styling} onClick={toggleTarget}>
          {OPTIONS[key]}
        </li>
      );
    });

    return array;
  };

  return (
    <div className='outer-chart-c'>
      <div className='header-c-1'>
        <div className='left-col'>
          <Tippy
            content={
              <div className='chart-desc-tooltip'>
                This chart displays total calories, macronutrients, and water
                consumption over the selected time range.
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
          <Tippy
            interactive={true}
            content={<ul className='opt-c'>{renderTitles()}</ul>}
          >
            <div>
              <span className='chart-t clickable'>{OPTIONS[targetGoal]}</span>
              <span className='dropdown-arrow clickable'>
                <MdArrowDropDown />
              </span>
            </div>
          </Tippy>
        </div>
        <div className='right-col'></div>
      </div>
      <div className='chart-c'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  data: selectMetricsData,
  waterSettings: selectWaterSettings,
});

export default connect(mapStateToProps, null)(TotalsChart);
