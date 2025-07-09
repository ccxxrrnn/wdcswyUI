import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Spin } from 'antd';
import useRoleForm from '@/hooks/useRoleForm';

const { Option } = Select

export default function RoleEditForm({
  mode = 'add',
  roleId,
  initialData,
  cityOptions = [],
  starOptions = [],
  careerOptions = [],
  onSuccess,
  onCancel
}) {
  const [form] = Form.useForm();
  const {
    loading,
    initialValues,
    saveRole
  } = useRoleForm({ mode, roleId, initialData, starOptions });

  // 当 initialValues 加载或变化时，填充表单
  useEffect(() => {
    console.log('RoleEditForm: Received initialValues:', initialValues);

    if (Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form, cityOptions, starOptions, careerOptions]); // Added options to deps for logging

  const handleFinish = async (values) => {
    console.log('RoleEditForm: Form submitted with values:', values);
    const success = await saveRole(values);
    if (success) {
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        name="roleEditForm"
        onFinish={handleFinish}
        initialValues={{ sex: '0', isTwo: '0', isBrith: '0' }} // 设置默认值
      >
        <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '必填' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sex" label="性别" rules={[{ required: true, message: '必填' }]}>
          <Radio.Group>
            <Radio value="0">女</Radio>
            <Radio value="1">男</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item  hasFeedback name="careerId" label="职业" rules={[{ required: true, message: '请选择你的职业!' }]}>
        <Select
          placeholder="请选择你的职业"
          showSearch
          filterOption={(input, option) =>
            (option?.children ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {careerOptions.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
        </Form.Item>
        <Form.Item name="city" label="城市" rules={[{ required: true, message: '请选择一个城市!' }]}>
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
        <Form.Item name="star" label="星级" rules={[{ required: true, message: '请选择一个星级!' }]}>
          <Select
            placeholder="请选择一个星级"
            allowClear
            options={starOptions}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 8 }} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>取消</Button>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
