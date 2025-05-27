import React, { useEffect , useState } from 'react'
import { Card, Col, Row , Statistic  } from 'antd';
import systemApi from '@/api/system'
import { PieDraw , ColumnDraw } from '@/utils/chart'


const System = ()=>{
	// 表单数据
	const [systemData, setsystemData] = useState([])
	const [cards, setcards] = useState([])
	 useEffect(() => {
		 if(!systemData.careerNumTop10){
			const systemDataAsny =async () => {
				const {data : {data}} = await systemApi.data.query()
				setsystemData(data)
				setcards(data.cards)
			}
			systemDataAsny()
		 }else{
			 const careerNumTop10Plot = ColumnDraw('careerNumTop10Container' , systemData.careerNumTop10 , '角色城市分布');
			 careerNumTop10Plot.render()
			 const roleCityNumsPlot = PieDraw('roleCityNumsContainer' , systemData.roleCityNums , '');
			 roleCityNumsPlot.render()
		 }
	  }, [systemData])
	return(
		<>
			<div   style={{display: 'flex' }}  >
			<Card title="角色城市分布饼图" bordered={false} style={{width:'50%'}}>
				<div id ='roleCityNumsContainer'   />
			</Card>
			<Card title="角色职业数量排名TOP10" bordered={false} style={{width:'50%'}}>
				<div id ='careerNumTop10Container' />
			</Card>
			</div>
		  <Row gutter={16} style={{}}>
			{
		cards.map(item => (
			<Col span={8}>
			  <Card title={item.title} bordered={false}>
			        <Statistic  valueStyle={{ color: '#3f8600' }} value={item.content} />
			  </Card>
			</Col>
			))
		}
		  </Row>
		</>
	)
}

export default System