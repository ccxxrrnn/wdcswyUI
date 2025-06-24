// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  twoBirth: {
		query:queryTwoCareerData,
    add: addTwoCareer
  }
}
export default apiMap


function queryTwoCareerData(params) {
  return request({
    url: 'wdcswy/twoCareer/list',
    method: 'get',
    params: params
  })
}

function addTwoCareer(params) {
  return request({
    url: 'wdcswy/twoCareer/save',
    method: 'get',
    params: params
  })
}