// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  role: {
    add: addRole,
    update: addRole,
    del: delRole,
    query: listRoles,
    queryById: getRoleById
  },
  career : {
	  store: { 
      query: listCareerStore,
      add: addCareerStore
	  },
    match: {
      save: saveCareerMatch,
    }
  },
  birth: {

  }
}
export default apiMap

//role相关接口

function listRoles(params) {
  return request({
    url: 'wdcswy/role/list',
    method: 'get',
    params: params
  })
}

function addRole(params) {
	return request({
	  url: 'wdcswy/role/save',
	  method: 'get',
	  params: params
	})
}

function getRoleById(id) {
	return request({
	  url: 'wdcswy/role/queryById?id=' + id,
	  method: 'get'
	})
}

function delRole(ids) {
  return request({
    url: 'wdcswy/role/delRoles',
    method: 'post',
    data: ids
  })
}

//career相关接口
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

function saveCareerMatch(params) {
  return request({
    url: '/wdcswy/birth/save',
    method: 'post',
    params: params
  })
}
