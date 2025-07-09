import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
import toolsApi from '@/api/tools'
import useSystemDict from '@/hooks/useSystemDict'

const { Option } = Select

export default function BrthRoleForm({ data, birthToggleModalStatus, careerList = [] }) {
  const [form] = Form.useForm()
  const [submitCount, setSubmitCount] = useState(0)

  // 使用自定义Hook获取字典数据
  const cityOptions = useSystemDict('city')
  const starOptions = useSystemDict('star')

  // 表单事件回调
  const onCancel = useCallback(() => {
    birthToggleModalStatus(false)
  }, [birthToggleModalStatus])

  const onFinish = useCallback(async (value) => {
    if (submitCount >= 2) {
      onCancel()
      message.warning('已达到提交上限，无法再次提交')
      setSubmitCount(0) // 重置提交计数
      return
    }
    try {
      const params = {
        ...value,
        roleAId: data.birthAId,
        roleBId: data.birthBId,
        isTwo: true,
        isBrith: true
      }
      await toolsApi.twoBirth.add(params)
      message.success('添加生育成功')
      setSubmitCount(count => count + 1)
    } catch (e) {
      message.error('操作失败')
    }
  }, [data, submitCount , onCancel])

  useEffect(() => {
    form.resetFields()
    setSubmitCount(0)
    if (data && starOptions.length > 0) {
      const indexA = starOptions.findIndex(opt => opt.label === data.birthAStar);
      const indexB = starOptions.findIndex(opt => opt.label === data.birthBStar);

      const minIndex = Math.max(indexA, indexB);
      let defaultIndex = minIndex - 1;

      if (indexA === 0 && indexB === 0) {
        defaultIndex = 0;
      }

      if (defaultIndex >= starOptions.length) {
        defaultIndex = starOptions.length - 1;
      }

      const defaultValue = starOptions[defaultIndex].value;
      form.setFieldsValue({ star: defaultValue });
    }
  }, [data, starOptions, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="birthRoleForm"
      onFinish={onFinish}
    >
      <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '必填' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="sex" label="性别" rules={[{ required: true, message: '必填' }]}>
        <Radio.Group>
          <Radio value="1">男</Radio>
          <Radio value="0">女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="careerId"
        label="职业"
        hasFeedback
        initialValue={data.birthCareerId}
        rules={[{ required: true, message: '请选择你的职业!' }]}
      >
        <Select
          placeholder="请选择你的职业"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {careerList.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="city" label="城市" hasFeedback rules={[{ required: true, message: '请选择一个城市!' }]}>
        <Select
          placeholder="请选择一个城市"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {cityOptions.map(item => (<Option key={item.value} value={item.value}>{item.label}</Option>))}
        </Select>
      </Form.Item>
      <Form.Item name="star" label="星级" hasFeedback rules={[{ required: true, message: '请选择一个星级!' }]}>
        <Select
          placeholder="请选择一个星级"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {starOptions.map(item => (<Option key={item.value} value={item.value}>{item.label}</Option>))}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button onClick={onCancel}>取消</Button>
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginLeft: 32 }}
          disabled={submitCount >= 2}
        >
          确认{submitCount > 0 ? `（已提交${submitCount}次）` : ''}
        </Button>
      </Form.Item>
    </Form>
  )
}
