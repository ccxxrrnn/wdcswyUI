import React, { useEffect, useState, useCallback } from 'react'
import { Form, Input, Button, message, Select, Radio } from 'antd'
import manageApi from '@/api/manage'
import knowledgeApi from '@/api/knowledge'

const { Option } = Select

const CITY_OPTIONS = [
  '金融中心',
  '战斗中心',
  '休闲中心',
  '未来中心',
  '斯巴达城'
]

export default function RoleEditForm({ editType, roleId, onRefreshTable, toggleModalStatus, data }) {
  const [form] = Form.useForm()
  const [allCareerArr, setAllCareerArr] = useState([])
  const [careerLoaded, setCareerLoaded] = useState(false)

  const isDisabled = editType === 'read'

  const onCancel = useCallback(() => {
    toggleModalStatus(false)
  }, [toggleModalStatus])

  const onFinish = useCallback(async (value) => {
    try {
      if (editType === 'add') {
        await manageApi.role.add(value)
        message.success('添加用户成功')
        form.resetFields()
      } else if (editType === 'edit') {
        await manageApi.role.update({ roleId, ...value })
        message.success('修改信息成功')
      }
      onCancel()
    } catch (e) {
      message.error('操作失败')
    }
  }, [editType, roleId, onCancel, form])

  // 提取表单赋值逻辑
  const setFormFields = useCallback((fields) => {
    form.setFieldsValue({
      roleName: fields.roleName,
      sex: fields.sex,
      careerId: fields.careerId,
      city: fields.city,
      isTwo: fields.isTwo,
      isBrith: fields.isBrith,
      star: fields.star
    })
  }, [form])

  // 加载职业列表
  useEffect(() => {
    async function fetchCareer() {
      try {
        const { data: { data} } = await knowledgeApi.career.query()
        const arr = data.map(item => ({
          value: String(item.careerId),
          label: item.careerName
        }))
        setAllCareerArr(arr)
      } catch (e) {
        setAllCareerArr([])
      } finally {
        setCareerLoaded(true)
      }
    }
    fetchCareer()
  }, [])

  // 加载表单数据
  useEffect(() => {
    if (!careerLoaded) return
    if ((editType === 'edit' || editType === 'read') && roleId) {
      manageApi.role.queryById(roleId).then(res => {
        const roleData = res.data.data
        setFormFields({
          roleName: roleData.roleName,
          sex: String(roleData.sex),
          careerId: roleData.careerId != null ? String(roleData.careerId) : undefined,
          city: roleData.city || undefined,
          isTwo: roleData.isTwo === 'true' ? '1' : '0',
          isBrith: roleData.isBrith === 'true' ? '1' : '0',
          star: String(roleData.star)
        })
      }).catch(() => {
        form.resetFields()
      })
    } else if (data) {
      if (data.roleType === 'A') {
        setFormFields({
          roleName: data.birthARoleName,
          sex: '0',
          careerId: data.birthCareerAId != null ? String(data.birthCareerAId) : undefined,
          city: undefined,
          isTwo: '0',
          isBrith: '0',
          star: data.birthAStar
        })
      } else if (data.roleType === 'B') {
        setFormFields({
          roleName: data.birthBRoleName,
          sex: '1',
          careerId: data.birthCareerBId != null ? String(data.birthCareerBId) : undefined,
          city: undefined,
          isTwo: '0',
          isBrith: '0',
          star: data.birthBStar
        })
      }
    } else {
      form.resetFields()
    }
  }, [editType, roleId, form, data, careerLoaded, setFormFields])

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
          allowClear
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allCareerArr.map((item, idx) => (
            <Option key={item.value ?? idx} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="city" label="城市" hasFeedback rules={[{ required: true, message: '请选择一个城市!' }]}>
        <Select placeholder="请选择一个城市" allowClear>
          {CITY_OPTIONS.map(city => (
            <Option key={city} value={city}>{city}</Option>
          ))}
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