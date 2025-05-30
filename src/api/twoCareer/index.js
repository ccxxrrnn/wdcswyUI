import request from '@/utils/request'

const twoCareerApi = {
	manage: {
		query:queryTwoCareerData,
    add: addTwoCareer
	},
}
export default twoCareerApi

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