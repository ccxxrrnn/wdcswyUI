import React, { useState, useMemo, useCallback } from 'react'
import { Input, Button, Select, Form } from 'antd'
import CustomTable from '@/components/CustomTable'
import knowledgeApi from '@/api/knowledge'


const { Option } = Select

const CareerList = () => {
  // 搜索参数
  const [form] = Form.useForm()
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1,
    careerName: '',
    isWarDuty: undefined,
    isTwoCareer: undefined
  })

  // 表格列配置
  const columns = useMemo(() => [
    { key: 'careerId', hidden: true },
    { title: '职业名称', dataIndex: 'careerName', key: 'careerName' },
    { 
      title: '是否战职', 
      dataIndex: 'isWarDuty', 
      key: 'isWarDuty',
      render: (text) => text  ? '是' : '否'
    },
    { 
      title: '是否二代职业', 
      dataIndex: 'isTwoCareer', 
      key: 'isTwoCareer',
      render: (text) => text ? '是' : '否'
    }
  ], [])

  // 查询
  const onFinish = useCallback((values) => {
    setRequestParam(prev => ({
      ...prev,
      current: 1,
      ...values
    }))
  }, [])

  // 重置
  const onReset = useCallback(() => {
    form.resetFields()
    setRequestParam(prev => ({
      ...prev,
      current: 1,
      careerName: '',
      isWarDuty: undefined,
      isTwoCareer: undefined
    }))
  }, [form])

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
    <>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: 16, background: '#fff', padding: 24, borderRadius: 8 }}
      >
        <Form.Item label="职业名称" name="careerName">
          <Input placeholder="请输入职业名称" allowClear style={{ width: 180 }} />
        </Form.Item>
        <Form.Item label="是否战职" name="isWarDuty">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        </Form.Item>
        <Form.Item label="是否二代职业" name="isTwoCareer">
          <Select placeholder="请选择" allowClear style={{ width: 120 }}>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onReset}>重置</Button>
        </Form.Item>
      </Form>
      <CustomTable
        columns={columns}
        rowKey="careerId"
        bordered
        fetchMethod={knowledgeApi.career.queryPage}
        requestParam={requestParam}
        onParamChange={onParamChange}
      />
    </>
  )
}

export default CareerList 