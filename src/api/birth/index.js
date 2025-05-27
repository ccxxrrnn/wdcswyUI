// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  manage: {
    queryPage: listBirthsPage
  },
  tools : {
	  two : twoCareer
  }
}
export default apiMap

function listBirthsPage(params) {
  return request({
    url: 'wdcswy/birth/list',
    method: 'get',
    params: params
  })
}

function twoCareer() {
  return request({
    url: 'wdcswy/birth/twoCareer',
    method: 'get'
  })
}
