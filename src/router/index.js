import { lazy } from 'react'
import {  MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom'
// 用路由懒加载优化加载性能
const Layout = lazy(() => import('@/Layout'))
//中间表格区域的默认页面
const Birth = lazy(() => import('@/pages/System/Manage/Birth'))
const Career = lazy(() => import('@/pages/System/Manage/Career'))
const Role = lazy(() => import('@/pages/System/Manage/Role'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const System = lazy(() => import('@/pages/System'))
const TwoCareer = lazy( () => import('@/pages/System/Tools/TwoCareer'))

const constantRoutes = [
  {
    path: '/',
    title: '管理模块',
	icon:<MailOutlined/>,
    hidden: false,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={'/system'} replace /> },
      // hidden:false代表要显示在侧边导航栏，其余皆不显示
	  { path: '/system/role', title: '角色管理', element: <Role />, hidden: false },
	  { path: '/system/career', title: '职业管理', element: <Career />, hidden: false },
	  { path: '/system/birth', title: '生育管理', element: <Birth />, hidden: false },
	  { path: '/system', title: '首页', element: <System />, hidden: true }
    ]
  },
  {
    path: '/tools',
    title: '工具模块',
    hidden: false,
	icon:<SettingOutlined/>,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={'/system'} replace /> },
      // // hidden:false代表要显示在侧边导航栏，其余皆不显示
  	  { path: '/tools/twoCareer', title: '二代职业', element: <TwoCareer />, hidden: false }
    ]
  },
  { path: '*', title: '404页面', element: <NotFound />  , hidden: true}
]
export default constantRoutes
