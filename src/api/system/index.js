import request from '@/utils/request'

const systemApi = {
	data: {
		query:querySystemData
	},
}
export default systemApi

function querySystemData() {
  return request({
    url: 'wdcswy/system/querySystemData',
    method: 'get'
  })
  }