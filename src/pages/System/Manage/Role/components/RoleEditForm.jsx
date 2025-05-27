import React, { useEffect, useState, useCallback } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
import roleApi from '@/api/role'
import careerApi from '@/api/career'

const { Option } = Select

export default function RoleEditForm({ editType, roleId, onRefreshTable, toggleModalStatus }) {
  const [form] = Form.useForm()
  const [allCareerArr, setAllCareerArr] = useState([])

  const isDisabled = editType === 'read'

  const onCancel = useCallback(() => {
    toggleModalStatus(false)
  }, [toggleModalStatus])

  const onFinish = async (value) => {
    try {
      if (editType === 'add') {
        await roleApi.manage.add(value)
        message.success('添加用户成功')
        form.resetFields()
      } else if (editType === 'edit') {
        await roleApi.manage.update({ roleId, ...value })
        message.success('修改信息成功')
      }
      onCancel()
      onRefreshTable?.({})
    } catch (e) {
      message.error('操作失败')
    }
  }

  // 获取职业数据和当前角色数据
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取职业列表
        const { data: { data: careerData } } = await careerApi.manage.query()
        const arr = careerData.map(item => ({
          value: String(item.careerId),
          label: item.careerName
        }))
        setAllCareerArr(arr)

        // 获取当前角色数据（编辑/只读时）
        if ((editType === 'edit' || editType === 'read') && roleId) {
          const { data: { data: roleData } } = await roleApi.manage.queryById(roleId)
          form.setFieldsValue({
            ...roleData,
            sex: String(roleData.sex),
            isTwo: roleData.isTwo === 'true' ? '1' : '0',
            isBrith: roleData.isBrith === 'true' ? '1' : '0',
            careerId: String(roleData.careerId),
            star: String(roleData.star)
          })
        } else {
          form.resetFields()
        }
      } catch (e) {
        setAllCareerArr([])
      }
    }
    fetchData()
    // eslint-disable-next-line
  }, [editType, roleId, form])

  return (
    <Form
      form={form}
      layout="vertical"
      name="userInfoForm"
      onFinish={onFinish}
      disabled={isDisabled}
    >
      <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '必填' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="sex" label="性别" rules={[{ required: true, message: '必填' }]}>
        <Radio.Group>
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="careerId" label="职业" hasFeedback rules={[{ required: true, message: '请选择你的职业!' }]}>
        <Select
          placeholder="请选择你的职业"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allCareerArr.map(item => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="city" label="城市" hasFeedback rules={[{ required: true, message: '请选择一个城市!' }]}>
        <Select placeholder="请选择一个城市">
          <Option value="金融中心">金融中心</Option>
          <Option value="战斗中心">战斗中心</Option>
          <Option value="休闲中心">休闲中心</Option>
          <Option value="未来中心">未来中心</Option>
        </Select>
      </Form.Item>
      <Form.Item name="isTwo" label="二代" rules={[{ required: true, message: '必填' }]}>
        <Radio.Group>
          <Radio value="0">否</Radio>
          <Radio value="1">是</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="isBrith" label="结婚" rules={[{ required: true, message: '必填' }]}>
        <Radio.Group>
          <Radio value="0">否</Radio>
          <Radio value="1">是</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="star" label="星级" hasFeedback rules={[{ required: true, message: '请选择一个星级!' }]}>
        <Select placeholder="请选择一个星级">
          <Option value="5">S</Option>
          <Option value="4">A</Option>
          <Option value="3">B</Option>
          <Option value="2">C</Option>
          <Option value="1">D</Option>
        </Select>
      </Form.Item>
      {editType !== 'read' && (
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 32 }}>
            确认
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}