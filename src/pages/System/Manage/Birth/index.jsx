import React, { useMemo } from 'react';
import CustomTable from '@/components/CustomTable';
import knowledgeApi from '@/api/knowledge';
import SearchBar from '@/components/SearchBar';
import careerDict from '@/hooks/CareerDict';
import useFetchTableData from '@/hooks/useFetchTableData'; // 引入新的hook

const BirthList = () => {
  // 生育职业字典
  const careerDicts = careerDict();

  // 使用新的hook
  const { tableData, loading, handleSearch, handleTableChange } = useFetchTableData(knowledgeApi.birth.queryPage);

  // 搜索栏表单项
  const formItemList = [
    {
      formItemProps: { name: 'birthCareerId', label: '生育职业' },
      valueCompProps: {
        type: 'select',
        selectvalues: careerDicts,
        allowClear: true,
        showSearch: true,
        filterOption: (input, option) =>
          (option.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0,
      },
    },
  ];

  // 表格列配置
  const columns = useMemo(
    () => [
      { title: '职业A', dataIndex: 'birthACareer', key: 'birthACareer' },
      { title: '职业B', dataIndex: 'birthBCareer', key: 'birthBCareer' },
      { title: '生育职业', dataIndex: 'birthCareer', key: 'birthCareer' },
      { title: '适性', dataIndex: 'suitability', key: 'suitability' },
    ],
    []
  );

  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={handleSearch} />
      <CustomTable
        columns={columns}
        rowKey="birthId"
        bordered
        loading={loading}
        dataSource={tableData.records}
        pagination={{
          current: tableData.current,
          pageSize: tableData.pageSize,
          total: tableData.total,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default BirthList;
