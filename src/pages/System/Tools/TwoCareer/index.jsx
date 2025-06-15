import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Space, Divider, Button } from 'antd' // Card 已移除
import twoCareerApi from '@/api/twoCareer'
import RoleEditForm from '@/pages/System/Manage/Role/components/RoleEditForm'
import CustomModal from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable'
import BirthRoleForm from './components/BrthRoleForm'
import SearchBar from '@/components/SearchBar'
import careerApi from '@/api/career'

const TwoCareer = () => {
  // 生育职业字典
  const [careerList, setCareerList] = useState([])
  useEffect(() => {
    careerApi.show.query().then(res => {
      setCareerList(res.data?.data || [])
    })
  }, [])

  // 搜索栏表单项
  const formItemList = [
    {
      formItemProps: { name: 'birthCareerId', label: '生育职业：' },
      valueCompProps: {
        type: 'select',
        selectvalues: careerList.map(item => ({
          value: item.careerId,
          label: item.careerName
        })),
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

  const columns = useMemo(() => [
    { title: '父亲职业', dataIndex: 'birthACareerName', key: 'birthACareerName' },
    {
      title: '父亲角色',
      dataIndex: 'birthARoleName',
      key: 'birthARoleName',
      render: (text, record) => (
        <button
          type="button"
          style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', padding: 0 }}
          onClick={() => {
            setRoleId(record.birthAId)
            toggleModalStatus(true)
          }}
        >
          {text}
        </button>
      ),
    },
    { title: '母亲职业', dataIndex: 'birthBCareerName', key: 'birthBCareerName' },
    {
      title: '母亲角色',
      dataIndex: 'birthBRoleName',
      key: 'birthBRoleName',
      render: (text, record) => (
        <button
          type="button"
          style={{ border: 'none', background: 'none', color: '#1890ff', cursor: 'pointer', padding: 0 }}
          onClick={() => {
            setRoleId(record.birthBId)
            toggleModalStatus(true)
          }}
        >
          {text}
        </button>
      ),
    },
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
  ], [addRow, toggleModalStatus])

  return (
    <>
      <h1>二代职业</h1>
      <h3>只考虑了A适性，总和33达成999、王子是32，S+5、A+4</h3>
      <h3>二者职业等级应该为一致达成最优解，不一致将筛选</h3>
      <Divider />
      <SearchBar formItemList={formItemList} getSearchParams={onParamChange} />
      <CustomTable
        columns={columns}
        rowKey="roleId"
        bordered
        fetchMethod={twoCareerApi.manage.query}
        requestParam={requestParam}
        onParamChange={onParamChange}
      />
      <CustomModal title="角色" ref={userModalRef}>
        <RoleEditForm
          toggleModalStatus={toggleModalStatus}
          editType='edit'
          roleId={roleId}
        />
      </CustomModal>
      <CustomModal title="生育" ref={birthModalRef}>
        <BirthRoleForm
          data={data}
          birthToggleModalStatus={birthToggleModalStatus}
        />
      </CustomModal>
    </>
  )
}

export default TwoCareer