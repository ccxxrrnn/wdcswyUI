import request from '@/utils/request'

const systemApi = {
	data: {
		query:querySystemData
	},
  constants: {
    listByType:listByType,
    queryAttributeGroups:queryAttributeGroups
  },
}
export default systemApi

function querySystemData() {
  return request({
    url: 'wdcswy/system/querySystemData',
    method: 'get'
  })
  }
  function listByType(type) {
    return request({
      url: 'wdcswy/constant/listByType',
      method: 'get',
      params: {
        type: type
      }
    })
  }

  function queryAttributeGroups() {
    return request({
      url: 'wdcswy/constant/queryAttributeGroups',
      method: 'get'
    })
  }