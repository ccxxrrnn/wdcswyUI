import { useCallback, useState } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
import twoCareerApi from '@/api/twoCareer'

const { Option } = Select

export default function BrthRoleForm({ data, birthToggleModalStatus }) {
  const [form] = Form.useForm()
  const [submitCount, setSubmitCount] = useState(0)

  const CareerArr = [
    { value: data.birthCareerId, label: data.birthCareerName },
    { value: data.birthAId, label: data.birthACareerName },
    { value: data.birthBId, label: data.birthBCareerName }
  ]

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
      await twoCareerApi.manage.add(value)
      message.success('添加生育成功')
      form.resetFields()
      setSubmitCount(count => count + 1)
    } catch (e) {
      message.error('操作失败')
    }
  }

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
        initialValue={CareerArr[0]?.value}
        rules={[{ required: true, message: '请选择你的职业!' }]}
      >
        <Select
          placeholder="请选择你的职业"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {CareerArr.map((item, idx) => (
            <Option key={item.value ?? idx} value={item.value}>
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
      <Form.Item name="star" label="星级" hasFeedback rules={[{ required: true, message: '请选择一个星级!' }]}>
        <Select placeholder="请选择一个星级">
          <Option value="5">S</Option>
          <Option value="4">A</Option>
          <Option value="3">B</Option>
          <Option value="2">C</Option>
          <Option value="1">D</Option>
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
