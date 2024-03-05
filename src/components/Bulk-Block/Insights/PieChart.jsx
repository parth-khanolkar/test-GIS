'use client'

import React from 'react'
import Chart from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

const PieChart = ({chartData}) => {
    const valuesArray = Object.values(chartData)


  return (
    <>
        <Doughnut
            data={{
                labels: ['Small Cap', 'Mid Cap', 'Large Cap'],
                datasets: [
                  {
                    label: '',
                    data: valuesArray,
                    backgroundColor: [
                        'rgba(224, 224, 224, 1)',
                        'rgba(20, 59, 100, 1)',
                        'rgba(189, 34, 48, 1)',
                    ],
                    borderColor: [
                        'rgba(224, 224, 224, 1)',
                        'rgba(20, 59, 100, 1)',
                        'rgba(189, 34, 48, 1)',
                    ],
                    borderWidth: 1,
                    rotation: 90,
                  },
                ],
              }
            }

            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right', 
                        labels:{
                            font:{
                                size: 12, 
                            }, 
                            boxWidth: 8,
                        }
                    },
                    },
            }}
        />
    </>
  )
}

export default PieChart
