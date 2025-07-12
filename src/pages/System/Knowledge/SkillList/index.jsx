import React from 'react';
import { Table } from 'antd';
import SearchBar from '@/components/SearchBar';
import useFetchTableData from '@/hooks/useFetchTableData';
import knowledgeApi from '@/api/knowledge';

const SkillList = () => {
  const { tableData, loading, handleSearch, handleTableChange } = useFetchTableData(knowledgeApi.skill.queryPage);

  const columns = [
    {
      title: '技能名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '技能价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '效果',
      dataIndex: 'effect',
      key: 'effect',
    },
    {
      title: '技能获得条件',
      dataIndex: 'skillCondition',
      key: 'skillCondition',
    },
    {
      title: '技能备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  const searchItems = [
    {
      formItemProps: {
        name: 'name',
        label: '技能名称',
      },
      valueCompProps: {
        type: 'input',
      },
    },
  ];

  return (
    <div>
      <SearchBar formItemList={searchItems} getSearchParams={handleSearch} />
      <Table
        columns={columns}
        dataSource={tableData.records}
        loading={loading}
        rowKey="id"
        pagination={{
          current: tableData.current,
          pageSize: tableData.pageSize,
          total: tableData.total,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SkillList;
