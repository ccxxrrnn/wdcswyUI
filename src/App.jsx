import React,{ Suspense } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import {  useSelector } from 'react-redux'
// 导入loading组件
import Loading from '@/components/Loading'



export default function App(){
	
	
	const routes = useSelector((state) => state.permission.routes)
	
	// 利用hook转换路由表
	const element = useRoutes(routes)
	
	return (
	<>
	  <Suspense fallback={<Loading />}>{routes && element}</Suspense>
	</>
	)
	
}