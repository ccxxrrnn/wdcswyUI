// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  manage: {
    queryPage: listCareersPage,
	query: listCareers
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
