import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import systemApi from '@/api/system';
import Chart from '@/components/Chart';
import StackedColumnChart from '@/components/Chart/StackedColumnChart';

const System = () => {
  const [systemData, setSystemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { data },
      } = await systemApi.data.query();
      setSystemData(data);
    };
    fetchData();
  }, []);

  if (!systemData) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {systemData.cityCareerTypeNums && (
        <Card title="角色分布联动图" variant="borderless" style={{ width: '100%' }}>
          <Chart data={systemData.cityCareerTypeNums} />
        </Card>
      )}
      {systemData.cityCareerNums && (
        <Card title="各城市职业数量分布" variant="borderless" style={{ width: '100%' }}>
          <StackedColumnChart id="stacked-column-chart" data={systemData.cityCareerNums} />
        </Card>
      )}
    </div>
  );
};

export default System;
