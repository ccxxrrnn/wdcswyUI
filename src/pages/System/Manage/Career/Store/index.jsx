import React, { useState, useEffect } from 'react'
import { Card, List, InputNumber, Button, message } from 'antd'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import manageApi from '@/api/manage'

const levelOrder = ['S', 'A', 'B', 'C', 'D']
const cardColors = {
  S: '#f5222d',
  A: '#faad14',
  B: '#52c41a',
  C: '#1890ff',
  D: '#2f54eb'
}

export default function SummonableRolesByLevel() {
  const [data, setData] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
  })
  const [editing, setEditing] = useState({ level: null, itemIndex: null })
  const [editValue, setEditValue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 获取数据
  useEffect(() => {
    setLoading(true)
    manageApi.career.store.query().then(res => {
      setData(res.data.data)
      setLoading(false)
    })
  }, [])

  // 开始编辑
  const startEdit = (level, itemIndex, value) => {
    setEditing({ level, itemIndex })
    setEditValue(value)
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditing({ level: null, itemIndex: null })
    setEditValue(null)
  }

  // 保存编辑
  const saveEdit = async () => {
    const { level, itemIndex } = editing
    const old = data[level][itemIndex]
    if (editValue === '' || editValue == null || isNaN(editValue) || editValue < 0) {
      message.error('请输入有效数量')
      return
    }
    setSaving(true)
    try {
      const payload = {
        id: old.id,
        careerId: old.careerId,
        star: level,
        number: editValue
      }
      await manageApi.career.store.add(payload)
      message.success('保存成功')

     const response = await manageApi.career.store.query(); // 假设 list() 接口用于获取当前 Store 数据

      // 前端本地同步更新
      setData(response.data.data)
      setEditing({ level: null, itemIndex: null })
      setEditValue(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2>各级别职业数量</h2>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          minWidth: 0
        }}
      >
        {levelOrder.map(level => (
          <Card
            key={level}
            title={level}
            bordered
            size="small"
            style={{ flex: 1 }}
            styles={{ body: { padding: 8 } }}
            loading={loading}
          >
            <List
              size="small"
              dataSource={data[level]}
              locale={{ emptyText: '暂无数据' }}
              renderItem={(item, index) => {
                const isEditing = editing.level === level && editing.itemIndex === index
                // 判断是否高亮
                const highlight = Number(item.number) > 0
                return (
                  <List.Item style={{ justifyContent: 'center', border: 'none', padding: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        background: highlight ? cardColors[level] + '22' : undefined,
                        borderRadius: 8,
                        padding: '6px 12px',
                        margin: '6px 0'
                      }}
                    >
                      <span style={{ minWidth: 60, color: highlight ? cardColors[level] : undefined, fontWeight: 500 }}>
                        {item.careerName}：
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isEditing ? (
                          <>
                            <InputNumber
                              min={0}
                              value={editValue}
                              onChange={setEditValue}
                              style={{ width: 80, marginRight: 8, color: cardColors[level] }}
                              autoFocus
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CheckOutlined />}
                              onClick={saveEdit}
                              loading={saving}
                              style={{ color: '#52c41a' }}
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={cancelEdit}
                              disabled={saving}
                              style={{ color: '#ff4d4f' }}
                            />
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                width: 40,
                                textAlign: 'right',
                                marginRight: 8,
                                color: highlight ? cardColors[level] : undefined,
                                fontWeight: 600
                              }}
                            >
                              {item.number}
                            </span>
                            <Button
                              size="small"
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => startEdit(level, index, item.number)}
                              style={{ color: cardColors[level] }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )
              }}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
