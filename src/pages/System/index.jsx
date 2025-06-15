import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import systemApi from '@/api/system'
 import Chart from '@/components/Chart'

const System = () => {
  // 表单数据
  const [systemData, setSystemData] = useState(null)
  const [cards, setCards] = useState([])

  

  useEffect(() => {
    if (!systemData) {
      const fetchData = async () => {
        const { data: { data } } = await systemApi.data.query()
        setSystemData(data)
        setCards(data?.cards || [])
      }
      fetchData()
    } else {
      // 如果数据已存在，直接设置 cards
      setCards(systemData.cards || [])
    }
  }, [systemData])

  // 渲染前判断数据是否存在
  if (!systemData || !systemData.cityCareerTypeNums || !cards.length) {
    return <div>加载中...</div>
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Card title="角色分布联动图"  variant="borderless" style={{ width: '100%' }}>
          <Chart id='container' data={systemData.cityCareerTypeNums} />
        </Card>
      </div>
      <Row gutter={16}>
        {cards.map(item => (
          <Col span={6} key={item.title}>
            <Card title={item.title} variant="borderless">
              <Statistic valueStyle={{ color: '#3f8600' }} value={item.content} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default System