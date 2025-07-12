// 导入axios实例
import request from '@/utils/request'

const apiMap = {
  twoBirth: {
		query:queryTwoCareerData,
    add: addTwoCareer
  },
  defaultEqSk: {
    getConfigs: getConfigs,
    saveConfig: saveConfig,
    deleteConfig: deleteConfig,
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

// 获取配置列表
function getConfigs(type) {
  return request({
    url: '/wdcswy/defaultConfigs/query',
    method: 'get',
    params: { type },
  });
}

// 新增或更新配置
function saveConfig(data) {
  return request({
    url: '/wdcswy/defaultConfigs/save',
    method: 'post',
    data,
  });
}

// 删除配置
function deleteConfig(id) {
  return request({
    url: `/wdcswy/defaultConfigs/delete`,
    method: 'get',
    params: { id }, // 传入id参数
  });
}
