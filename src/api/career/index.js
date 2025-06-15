// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  show: {
    queryPage: listCareersPage,
	  query: listCareers
  },
  store: {
    query: listCareerStore,
    add: addCareerStore
  }
}
export default apiMap

function listCareersPage(params) {
  return request({
    url: 'wdcswy/career/list',
    method: 'get',
    params: params
  })
}

function listCareers(params) {
  return request({
    url: 'wdcswy/career/query',
    method: 'get',
    params: params
  })
}
function listCareerStore() {
  return request({
    url: '/wdcswy/careerStore/list',
    method: 'get'
  })
}
function addCareerStore(params) {
  return request({
    url: '/wdcswy/careerStore/save',
    method: 'get',
	  params: params
  })
}
