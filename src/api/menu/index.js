// 导入axios实例
import request from '@/utils/request'

const menuApi = {
	data: {
		query:queryMenuList
	},
}
export default menuApi

function queryMenuList() {
  return request({
    url: 'wdcswy/menu/list',
    method: 'get'
  })
  }