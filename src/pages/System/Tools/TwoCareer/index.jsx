import { useState, useMemo, useRef, useCallback } from 'react'
import { Space, Divider, Button } from 'antd' // Card 已移除
import toolsApi from '@/api/tools'
import RoleEditForm from '@/pages/System/Manage/Role/components/RoleEditForm'
import CustomModal from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable'
import BirthRoleForm from './components/BrthRoleForm'
import SearchBar from '@/components/SearchBar'
import careerDict from '@/hooks/CareerDict'

const TwoCareer = () => {
  // 生育职业字典
  const careerDicts = careerDict()

  // 搜索栏表单项
  const formItemList = [
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
  ]

  // 表格请求参数
  const [requestParam, setRequestParam] = useState({
    pageSize: 10,
    current: 1
  })

  // 搜索栏回调，只更新参数，不请求数据
  const onParamChange = (searchParams) => {
    if (!Object.keys(searchParams).length) {
      setRequestParam({
        pageSize: 10,
        current: 1,
        birthCareerId: undefined
      })
    } else {
      setRequestParam(prev => ({
        ...prev,
        ...searchParams
      }))
    }
  }

  // 弹窗、表单等逻辑
  const [roleId, setRoleId] = useState()
  const [data, setData] = useState()
  const [currentRecord, setCurrentRecord] = useState()
  const userModalRef = useRef()
  const birthModalRef = useRef()
  const toggleModalStatus = useCallback((status) => {
    userModalRef.current?.toggleShowStatus(status)
  }, [])
  const birthToggleModalStatus = useCallback((status) => {
    birthModalRef.current?.toggleShowStatus(status)
  }, [])
  const addRow = useCallback((record) => {
    setData(record)
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
            setRoleId(id)
            setCurrentRecord({ ...record, roleType })
            toggleModalStatus(true)
          }}
        >
          {displayText}
          {isEmpty && ' (未设置)'}
        </button>
      );
    }
  }), [toggleModalStatus])

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
          toggleModalStatus={toggleModalStatus}
          editType='edit'
          roleId={roleId}
          data={currentRecord}
        />
      )
    },
    {
      title: '生育',
      ref: birthModalRef,
      content: (
        <BirthRoleForm
          data={data}
          birthToggleModalStatus={birthToggleModalStatus}
          careerList={data ? careerDicts.filter(item => item.value === data.birthACareerName || item.value === data.birthBCareerName || item.value === data.birthCareerName) : careerDicts}
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
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <CustomTable
        columns={columns}
        rowKey={(record) =>
          `${record.birthACareerName}-${record.birthAId}-${record.birthBCareerName}-${record.birthBId}`
        }
        bordered
        fetchMethod={toolsApi.twoBirth.query}
        requestParam={requestParam}
        onParamChange={onParamChange}
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
