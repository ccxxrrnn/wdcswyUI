import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Space, Button, Popconfirm, Card, message } from 'antd';
import manageApi from '@/api/manage';
import CustomTable from '@/components/CustomTable';
import RoleEditForm from './components/RoleEditForm';
import CustomModal from '@/components/CustomModal';
import SearchBar from '@/components/SearchBar';
import careerDict from '@/hooks/CareerDict';
import useSystemDict from '@/hooks/useSystemDict';
import useFetchTableData from '@/hooks/useFetchTableData';

const Role = () => {
  // 状态字典
  const careerDicts = careerDict()

  /** 表单参数 */
  const userModalRef = useRef()
  const [editType, setEditType] = useState()
  const [roleId, setRoleId] = useState()
  const toggleModalStatus = useCallback((status) => {
    userModalRef.current.toggleShowStatus(status);
    // 关闭弹窗时重置ID，确保下次打开时能重新加载
    if (!status) {
      setRoleId(undefined);
    }
  }, [])

  const createRoleNameColumn = useCallback((title, dataIndex) => ({
    title,
    dataIndex,
    key: dataIndex,
    render: (text, record) => (
      <button
        type="button"
        style={{
          border: 'none',
          background: 'none',
          color: '#1890ff',
          cursor: 'pointer',
          padding: 0
        }}
        onClick={() => {
          setEditType('edit')
          setRoleId(record.roleId)
          toggleModalStatus(true)
        }}
      >
        {text}
      </button>
    ),
  }), [toggleModalStatus]);

  const columns = useMemo(() => [
    { key: 'roleId', hidden: true },
    createRoleNameColumn('角色名称', 'roleName'),
    { title: '性别', dataIndex: 'sex', key: 'sex' },
    { title: '职业', dataIndex: 'careerName', key: 'careerName', },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '是否二代', dataIndex: 'isTwo', key: 'isTwo' },
    { title: '是否结婚', dataIndex: 'isBrith', key: 'isBrith' },
    { title: '星级', dataIndex: 'star', key: 'star' }
  ], [createRoleNameColumn]);

  const cityOptions = useSystemDict('city')
  const starOptions = useSystemDict('star')

  const formItemList = useMemo(() => [
    { formItemProps: { name: 'roleName', label: '角色名' }, valueCompProps: {} },
    {
      formItemProps: { name: 'careerId', label: '职业' },
      valueCompProps: {
        type: 'select',
        selectvalues: careerDicts,
        showSearch: true,
        filterOption: (input, option) =>
          (option.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    },
    {
      formItemProps: { name: 'city', label: '城市' },
      valueCompProps: {
        type: 'select',
        selectvalues: cityOptions,
        showSearch: true,
        filterOption: (input, option) =>
          (option.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  ], [careerDicts, cityOptions]);

  const { tableData, loading, handleSearch, handleTableChange } = useFetchTableData(manageApi.role.query);

  /** 表格参数 */
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };


  // 新增
  const addRow = () => {
    setEditType('add')
    setRoleId('')
    toggleModalStatus(true)
  }

  // 删除
  const deleteRow = async (roleIds) => {
    try {
      console.log('删除角色ID:', roleIds);
      await manageApi.role.del(roleIds);
      message.success('删除成功');
      setSelectedRowKeys([]);
      // 触发表格刷新
      handleSearch({});
    } catch (e) {
      message.error(e);
    }
  };

  return (
    <>
      <SearchBar formItemList={formItemList} getSearchParams={handleSearch} />
      <Card>
        <Space>
          <Button onClick={addRow}>新增</Button>
          {selectedRowKeys && selectedRowKeys.length > 0 && (
            <Popconfirm title="删除用户" description="确定要删除吗？" onConfirm={() => deleteRow(selectedRowKeys)}>
              <Button danger>批量删除</Button>
            </Popconfirm>
          )}
        </Space>
      </Card>
      <CustomTable
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        rowKey="roleId"
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
      <CustomModal title="角色" ref={userModalRef}>
        <RoleEditForm
          key={roleId || 'add'}
          mode={editType}
          roleId={roleId}
          cityOptions={cityOptions}
          starOptions={starOptions}
          careerOptions={careerDicts}
          onSuccess={() => {
            toggleModalStatus(false);
            handleSearch({});
          }}
          onCancel={() => toggleModalStatus(false)}
        />
      </CustomModal>
    </>
  )
}

export default Role
