import React from 'react';
import { Table } from 'antd';

const CustomTable = ({
  loading,
  dataSource,
  columns,
  pagination,
  onChange,
  ...restTableProps
}) => {
  return (
    <Table
      {...restTableProps}
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={{
        ...pagination,
        showTotal: (total) => <span style={{ color: '#333' }}>共{total}条</span>,
      }}
      onChange={onChange}
    />
  );
};

export default CustomTable;
