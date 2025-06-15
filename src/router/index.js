import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Layout = lazy(() => import('@/Layout'))
const Birth = lazy(() => import('@/pages/System/Manage/Birth'))
const Career = lazy(() => import('@/pages/System/Manage/Career'))
const Role = lazy(() => import('@/pages/System/Manage/Role'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const System = lazy(() => import('@/pages/System'))
const TwoCareer = lazy(() => import('@/pages/System/Tools/TwoCareer'))
const CareerStore = lazy(() => import('@/pages/System/Manage/Career/Store'))

const constantRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={'/system'} replace /> },
      { path: '/system/role', element: <Role /> },
      { path: '/system/career', element: <Career /> },
      { path: '/system/career/show', element: <Career /> },
      { path: '/system/career/store', element: <CareerStore /> },
      { path: '/system/birth', element: <Birth /> },
      { path: '/system', element: <System /> },
      { path: '/tools', element: <System /> },
      { path: '/tools/twoCareer', element: <TwoCareer /> }
    ]
  },
  { path: '*', element: <NotFound /> }
]
export default constantRoutes
