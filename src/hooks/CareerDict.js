import { useState, useEffect } from 'react'
import knowledgeApi from '@/api/knowledge'
// 自定义Hook，用于获取字典数据
const useCareerDict = () => {
  const [allCareerArr, setAllCareerArr] = useState([])

  useEffect(() => {
	  const fetchAllRole = async () => {
	  	const {data : {data}} = await knowledgeApi.career.query()
	  	const filterArr = data.map((item) => ({ label: item.careerName, value: item.careerId }))
	  	setAllCareerArr(filterArr)
	  }

    fetchAllRole()
  }, [])
  return allCareerArr
}
export default useCareerDict
