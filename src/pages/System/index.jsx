import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import systemApi from '@/api/system'
import { PieDraw, ColumnDraw } from '@/utils/chart'

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
      if (systemData.careerNumTop10) {
        const careerNumTop10Plot = ColumnDraw('careerNumTop10Container', systemData.careerNumTop10, '角色城市分布')
        careerNumTop10Plot.render()
      }
      if (systemData.roleCityNums) {
        const roleCityNumsPlot = PieDraw('roleCityNumsContainer', systemData.roleCityNums, '')
        roleCityNumsPlot.render()
      }
    }
  }, [systemData])

  // 渲染前判断数据是否存在
  if (!systemData || !systemData.careerNumTop10 || !cards.length) {
    return <div>加载中...</div>
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Card title="角色城市分布饼图"  variant="borderless" style={{ width: '50%' }}>
          <div id='roleCityNumsContainer' />
        </Card>
        <Card title="角色职业数量排名TOP10" variant="borderless" style={{ width: '50%' }}>
          <div id='careerNumTop10Container' />
        </Card>
      </div>
      <Row gutter={16}>
        {cards.map(item => (
          <Col span={8} key={item.title}>
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