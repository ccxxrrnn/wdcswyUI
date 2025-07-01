import React, { useState, useCallback, useMemo } from 'react'
import CustomTable from '@/components/CustomTable'
import knowledgeApi from '@/api/knowledge'
import SearchBar from '@/components/SearchBar'
import careerDict from '@/hooks/CareerDict'
const Career = () => {
  // 生育职业字典
  const careerDicts = careerDict()

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
          (option.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  ]

  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })

  // 搜索栏回调
  const onParamChange = useCallback((searchParams) => {
    setRequestParam(prev => {
      if (!Object.keys(searchParams).length) {
        return { pageSize: 10, current: 1 , birthCareerId: undefined}
      }
      return { ...prev, ...searchParams }
    })
  }, [])

  // 表格列配置
  const columns = useMemo(() => [
    { key: 'birthId', hidden: true },
    { title: '职业A', dataIndex: 'birthACareer', key: 'birthACareer' },
    { title: '职业B', dataIndex: 'birthBCareer', key: 'birthBCareer' },
    { title: '生育职业', dataIndex: 'birthCareer', key: 'birthCareer' },
    { title: '适性', dataIndex: 'suitability', key: 'suitability' }
  ], [])

  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <CustomTable
        columns={columns}
        rowKey="birthId"
        bordered
        fetchMethod={knowledgeApi.birth.queryPage}
        requestParam={requestParam}
        onParamChange={onParamChange}
      />
    </>
  )
}

export default Career