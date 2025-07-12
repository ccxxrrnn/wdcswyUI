import React, { useMemo } from 'react';
import { Input, Button, Select, Form } from 'antd';
import CustomTable from '@/components/CustomTable';
import knowledgeApi from '@/api/knowledge';
import useFetchTableData from '@/hooks/useFetchTableData';

const { Option } = Select;

const CareerList = () => {
  const [form] = Form.useForm();
  const { tableData, loading, handleSearch, handleTableChange } = useFetchTableData(knowledgeApi.career.queryPage);

  // 表格列配置
  const columns = useMemo(
    () => [
      { title: '职业名称', dataIndex: 'careerName', key: 'careerName' },
      {
        title: '是否战职',
        dataIndex: 'isWarDuty',
        key: 'isWarDuty',
      },
      {
        title: '是否二代职业',
        dataIndex: 'isTwoCareer',
        key: 'isTwoCareer',
      },
    ],
    []
  );

  // 查询
  const onFinish = (values) => {
    handleSearch(values);
  };

  // 重置
  const onReset = () => {
    form.resetFields();
    handleSearch({});
  };

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
        loading={loading}
        dataSource={tableData.records}
        pagination={{
          current: tableData.current,
          pageSize: tableData.pageSize,
          total: tableData.total,
        }}
        onChange={handleTableChange}
      />
    </>
  )
}

export default CareerList
