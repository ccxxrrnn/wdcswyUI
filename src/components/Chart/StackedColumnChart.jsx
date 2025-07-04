import React, { useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';

const StackedColumnChart = ({ id, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!Array.isArray(data) || data.length === 0) return;

    const chart = new Column(id, {
      data,
      xField: 'city',
      yField: 'value',
      seriesField: 'type',
      isStack: true,
      label: {
        position: 'middle',
        content: (item) => item.value,
        style: {
          fill: '#fff',
        },
      },
      legend: {
        position: 'top-left',
      },
    });

    chart.render();
    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [id, data]);

  return <div id={id} style={{ width: '100%', height: '400px' }}></div>;
};

export default StackedColumnChart;
