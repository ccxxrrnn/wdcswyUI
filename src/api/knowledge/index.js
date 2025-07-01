import request from '@/utils/request'

const apiMap = {
    career:{
        queryPage: listCareersPage,
	    query: listCareers
    },
    birth:{
     queryPage: listBirthsPage
    },
    skill:{

    },
    Equipment: {
        queryPage: listEquipmentsPage,
        query: listEquipments,
        type: listEquipmentType
    },
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
    url: 'wdcswy/career/searchList',
    method: 'get',
    params: params
  })
}

function listEquipmentsPage(params) {
  return request({
    url: 'wdcswy/equipment/list',
    method: 'get',
    params: params
  })
}

function listEquipments(params) {
  return request({
    url: 'wdcswy/equipment/query',
    method: 'get',
    params: params
  })
}

function listEquipmentType() {
  return request({
    url: 'wdcswy/equipment/type',
    method: 'get'
  })
}

function listBirthsPage(params) {
  return request({
    url: 'wdcswy/birth/list',
    method: 'get',
    params: params
  })
}