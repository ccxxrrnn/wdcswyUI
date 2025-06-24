import React, { useState, useCallback, useMemo, useEffect } from 'react'
import CustomTable from '@/components/CustomTable'
import knowledgeApi from '@/api/knowledge'
import SearchBar from '@/components/SearchBar'

const Career = () => {
  // 生育职业字典
  const [careerList, setCareerList] = useState([])
  useEffect(() => {
    knowledgeApi.career.query().then(res => {
      setCareerList(res.data?.data || [])
    })
  }, [])

  // 搜索栏表单项
  const formItemList = [
    {
      formItemProps: { name: 'birthCareerId', label: '生育职业' },
      valueCompProps: {
        type: 'select',
        selectvalues: careerList.map(item => ({
          value: item.careerId,
          label: item.careerName
        })),
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
    { title: '职业A', dataIndex: 'birthACareerName', key: 'birthACareerName' },
    { title: '职业B', dataIndex: 'birthBCareerName', key: 'birthBCareerName' },
    { title: '生育职业', dataIndex: 'birthCareerName', key: 'birthCareerName' },
    { title: '适性', dataIndex: 'suitabilityStr', key: 'suitabilityStr' }
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