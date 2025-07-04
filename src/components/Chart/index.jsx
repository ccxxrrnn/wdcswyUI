import React, { useEffect } from 'react';
import { Column, Pie } from '@antv/g2plot';
import { each, groupBy } from '@antv/util';

const Chart = ({ data }) => {
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) return;

    const pieData = ((originData) => {
      const groupData = groupBy(originData, 'type');
      const result = [];
      each(groupData, (values, k) => {
        result.push({ type: k, value: values.reduce((a, b) => a + b.value, 0) });
      });
      return result;
    })(data);

    const pie = new Pie('container1', {
      data: pieData,
      colorField: 'type',
      angleField: 'value',
      label: { type: 'inner' },
      tooltip: false,
      state: {
        active: { style: { lineWidth: 0 } },
      },
      interactions: [
        {
          type: 'element-highlight',
          cfg: {
            showEnable: [{ trigger: 'element:mouseenter', action: 'cursor:pointer' }],
            end: [
              { trigger: 'element:mouseleave', action: 'cursor:default' },
              { trigger: 'element:mouseleave', action: 'element-highlight:reset' },
            ],
          },
        },
      ],
    });

    const column = new Column('container2', {
      data,
      xField: 'city',
      yField: 'value',
      seriesField: 'type',
      isGroup: true,
      legend: false,
      columnStyle: { radius: [4, 4, 0, 0] },
    });

    pie.render();
    column.render();

    pie.on('element:mouseover', (evt) => {
      const eventData = evt.data;
      if (eventData?.data) {
        const type = eventData.data.type;
        column.setState('selected', (datum) => datum.type === type);
        column.setState('selected', (datum) => datum.type !== type, false);
      }
    });
    pie.on('element:mouseleave', () => {
      column.setState('selected', () => true, false);
    });
    pie.on('element:click', (evt) => {
      const eventData = evt.data;
      if (eventData?.data) {
        const type = eventData.data.type;
        pie.chart.changeData(pieData.filter((datum) => datum.type === type));
        column.chart.changeData(data.filter((datum) => datum.type === type));
      }
    });
    pie.on('element:dblclick', () => {
      pie.chart.changeData(pieData);
      column.chart.changeData(data);
    });

    // 销毁图表，防止内存泄漏
    return () => {
      pie.destroy();
      column.destroy();
    };
  }, [data]);

  return (
    <div id="container">
      <div id="container1" style={{ width: '50%', height: '400px', float: 'left' }}></div>
      <div id="container2" style={{ width: '50%', height: '400px', float: 'left' }}></div>
    </div>
  );
};

export default Chart;
