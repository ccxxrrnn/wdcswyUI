import { useState, useEffect } from 'react'
import careerApi from '@/api/career'
// 自定义Hook，用于获取字典数据
const CareerDict = () => {
  const [allCareerArr, setAllCareerArr] = useState([])

  useEffect(() => {
	  const fetchAllRole = async () => {
	  	const {data : {data}} = await careerApi.manage.query()
	  	const filterArr = data.map((item) => ({ value: item.careerId, label: item.careerName }))
	  	setAllCareerArr(filterArr)
	  }

    fetchAllRole()
  }, [])
  return allCareerArr
}
export default CareerDict
