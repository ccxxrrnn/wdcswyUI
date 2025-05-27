import React, { useState, useMemo, useCallback } from 'react'
import CustomTable from '@/components/CustomTable'
import careerApi from '@/api/career'

const Career = () => {
  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })

  // 表格列配置
  const columns = useMemo(() => [
    { key: 'careerId', hidden: true },
    { title: '职业名称', dataIndex: 'careerName', key: 'careerName' },
    { title: '是否战职', dataIndex: 'isWarDuty', key: 'isWarDuty' },
    { title: '是否二代职业', dataIndex: 'isTwoCareer', key: 'isTwoCareer' }
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
      rowKey="careerId"
      bordered
      fetchMethod={careerApi.manage.queryPage}
      requestParam={requestParam}
      onParamChange={onParamChange}
    />
  )
}

export default Career