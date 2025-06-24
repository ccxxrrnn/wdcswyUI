import { useCallback, useState } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
import toolsApi from '@/api/tools'

const { Option } = Select

export default function BrthRoleForm({ data, birthToggleModalStatus, careerList = [] }) {
  const [form] = Form.useForm()
  const [submitCount, setSubmitCount] = useState(0)

  const onCancel = useCallback(() => {
    birthToggleModalStatus(false)
  }, [birthToggleModalStatus])

  const onFinish = async (value) => {
    if (submitCount >= 2) {
      onCancel()
      message.warning('已达到提交上限，无法再次提交')
      return
    }
    try {
      value = {
        ...value,
        careerId: data.birthCareerId,
        roleAId: data.birthAId,
        roleBId: data.birthBId,
        isTwo: '1',
        isBrith: '1'
      }
      await toolsApi.twoBirth.add(value)
      message.success('添加生育成功')
      form.resetFields()
      setSubmitCount(count => count + 1)
    } catch (e) {
      message.error('操作失败')
    }
  }

  // 抽象城市和星级选项
  const cityOptions = ['金融中心', '战斗中心', '休闲中心', '未来中心']
  const starOptions = [
    { value: '5', label: 'S' },
    { value: '4', label: 'A' },
    { value: '3', label: 'B' },
    { value: '2', label: 'C' },
    { value: '1', label: 'D' },
  ]

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
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
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
            <Option key={item.careerId} value={item.careerId}>
              {item.careerName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="city" label="城市" hasFeedback rules={[{ required: true, message: '请选择一个城市!' }]}>
        <Select placeholder="请选择一个城市">
          {cityOptions.map(city => (<Option key={city} value={city}>{city}</Option>))}
        </Select>
      </Form.Item>
      <Form.Item name="star" label="星级" hasFeedback rules={[{ required: true, message: '请选择一个星级!' }]}>
        <Select placeholder="请选择一个星级">
          {starOptions.map(opt => (<Option key={opt.value} value={opt.value}>{opt.label}</Option>))}
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
