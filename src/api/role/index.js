// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  // 角色管理
  manage: {
    add: addRole,
    update: addRole,
    del: delRole,
    query: listRoles,
    queryById: getRoleById
  }
}
export default apiMap

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