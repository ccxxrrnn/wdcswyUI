import { useState, useMemo, useRef, useCallback } from 'react';
import { Space, Divider, Button } from 'antd';
import toolsApi from '@/api/tools';
import RoleEditForm from '@/pages/System/Manage/Role/components/RoleEditForm';
import CustomModal from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import BirthRoleForm from './components/BrthRoleForm';
import SearchBar from '@/components/SearchBar';
import careerDict from '@/hooks/CareerDict';
import useSystemDict from '@/hooks/useSystemDict';
import useFetchTableData from '@/hooks/useFetchTableData';

const TwoCareer = () => {
  // 生育职业字典
  const careerDicts = careerDict();

  // 城市和星级选项
  const cityOptions = useSystemDict('city');
  const starOptions = useSystemDict('star');

  // 使用新的hook
  const { tableData, loading, handleSearch, handleTableChange } = useFetchTableData(toolsApi.twoBirth.query);

  // 搜索栏表单项
  const formItemList = useMemo(() => [
    {
      formItemProps: { name: 'birthCareerId', label: '生育职业：' },
      valueCompProps: {
        type: 'select',
        selectvalues: careerDicts,
        showSearch: true,
        filterOption: (input, option) =>
          (option.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  ], [careerDicts])

  // 弹窗、表单等逻辑
  const [roleId, setRoleId] = useState();
  const [formMode, setFormMode] = useState('add');
  const [initialData, setInitialData] = useState(null);
  const [birthRecord, setBirthRecord] = useState();
  const userModalRef = useRef()
  const birthModalRef = useRef()
  const toggleModalStatus = useCallback((status) => {
    userModalRef.current?.toggleShowStatus(status)
  }, [])
  const birthToggleModalStatus = useCallback((status) => {
    birthModalRef.current?.toggleShowStatus(status)
  }, [])
  const addRow = useCallback((record) => {
    setBirthRecord(record)
    birthToggleModalStatus(true)
  }, [birthToggleModalStatus])

  // 角色列生成函数
  const createRoleColumn = useCallback((title, dataIndex, idKey, starKey, roleType) => ({
    title,
    dataIndex,
    key: dataIndex,
    render: (text, record) => {
      const id = record[idKey];
      const star = record[starKey];
      const isEmpty = id === 0 || id === '' || id === 'null' || id === null || id === undefined || id === '0';
      const displayText = star ? `${text}（${star}）` : text;
      return (
        <button
          type="button"
          style={{
            border: 'none',
            background: 'none',
            color: isEmpty ? '#ff4d4f' : '#1890ff',
            fontWeight: isEmpty ? 'bold' : 'normal',
            cursor: 'pointer',
            padding: 0
          }}
          onClick={() => {
            if (isEmpty) {
              setFormMode('add');
              setRoleId(null);
              // 根据职业名称反查职业ID
              const careerName = roleType === 'A' ? record.birthACareerName : record.birthBCareerName;
              const career = careerDicts.find(c => c.label === careerName);
              const careerId = career ? career.value : undefined;
              // 根据 roleType 预设表单值
              const prefillData = {
                roleName: roleType === 'A' ? record.birthARoleName : record.birthBRoleName,
                careerId: careerId,
                star: roleType === 'A' ? starOptions.find(opt => String(opt.label) === String(record.birthAStar))?.value : starOptions.find(opt => String(opt.label) === String(record.birthBStar))?.value,
                sex: roleType === 'A' ? '0' : '1', // 假设 A 是女性, B 是男性
              };
              setInitialData(prefillData);
            } else {
              setFormMode('edit');
              setRoleId(id);
              setInitialData(null);
            }
            toggleModalStatus(true);
          }}
        >
          {displayText}
          {isEmpty && ' (未设置)'}
        </button>
      );
    }
  }), [toggleModalStatus, careerDicts, starOptions])

  const columns = useMemo(() => [
    { title: '职业A', dataIndex: 'birthACareerName', key: 'birthACareerName' },
    createRoleColumn('角色A', 'birthARoleName', 'birthAId', 'birthAStar', 'A'),
    { title: '职业B', dataIndex: 'birthBCareerName', key: 'birthBCareerName' },
    createRoleColumn('角色B', 'birthBRoleName', 'birthBId', 'birthBStar', 'B'),
    { title: '生育职业', dataIndex: 'birthCareerName', key: 'birthCareerName' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => addRow(record)}>生育</Button>
        </Space>
      ),
    },
  ], [addRow, createRoleColumn])

  // 弹窗配置数组
  const modals = [
    {
      title: '角色',
      ref: userModalRef,
      content: (
        <RoleEditForm
          mode={formMode}
          roleId={roleId}
          initialData={initialData}
          cityOptions={cityOptions}
          starOptions={starOptions}
          careerOptions={careerDicts}
          onSuccess={() => {
            toggleModalStatus(false);
            handleSearch({}); // 触发表格数据刷新
          }}
          onCancel={() => toggleModalStatus(false)}
        />
      )
    },
    {
      title: '生育',
      ref: birthModalRef,
      content: (
        <BirthRoleForm
          data={birthRecord}
          birthToggleModalStatus={birthToggleModalStatus}
          careerList={birthRecord ? careerDicts.filter(item => item.label === birthRecord.birthACareerName || item.label === birthRecord.birthBCareerName || item.label === birthRecord.birthCareerName) : careerDicts}
        />
      )
    }
  ]

  return (
    <>
      <h1>二代职业</h1>
      <h3>只考虑了A适性，总和33达成999、王子是32，S+5、A+4</h3>
      <h3>二者职业等级应该为一致达成最优解，不一致将筛选</h3>
      <Divider />
      <SearchBar formItemList={formItemList} getSearchParams={handleSearch} />
      <CustomTable
        columns={columns}
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
      {modals.map(({ title, ref, content }) => (
        <CustomModal title={title} ref={ref} key={title}>
          {content}
        </CustomModal>
      ))}
    </>
  )
}

export default TwoCareer
