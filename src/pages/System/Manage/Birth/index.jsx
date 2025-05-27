import React, { useState, useCallback, useMemo } from 'react'
import CustomTable from '@/components/CustomTable'
import birthApi from '@/api/birth'

const Career = () => {
  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })

  // 表格列配置
  const columns = useMemo(() => [
    { key: 'birthId', hidden: true },
    { title: '职业A', dataIndex: 'birthACareerName', key: 'birthACareerName' },
    { title: '职业B', dataIndex: 'birthBCareerName', key: 'birthBCareerName' },
    { title: '生育职业', dataIndex: 'birthCareerName', key: 'birthCareerName' },
    { title: '适性', dataIndex: 'suitabilityStr', key: 'suitabilityStr' }
  ], [])

  // 表格事件
  const onParamChange = useCallback((searchParams) => {
    setRequestParam(prev => {
      if (!Object.keys(searchParams).length) {
        return { ...prev }
      }
      return { ...prev, ...searchParams }
    })
  }, [])

  return (
    <CustomTable
      columns={columns}
      rowKey="birthId"
      bordered
      fetchMethod={birthApi.manage.queryPage}
      requestParam={requestParam}
      onParamChange={onParamChange}
    />
  )
}

export default Career