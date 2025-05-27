import React, { useState, useMemo } from 'react'
import { Layout, Menu, theme, Breadcrumb } from 'antd'
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom'
import { getBreadcrumbNameMap, getTreeMenu } from '@/utils/common'
import constantRoutes from '@/router'
import logo from '../asset/images/logo.jpg'
import './Layout.scss'

const { Header, Content, Footer, Sider } = Layout

const LayoutApp = () => {
  const { pathname } = useLocation()
  const pathSnippets = pathname.split('/').filter(Boolean)
  const [collapsed, setCollapsed] = useState(false)
  const [subMenuKeys, setSubMenuKeys] = useState(pathSnippets.slice(0, -1).map(item => '/' + item))
  const navigate = useNavigate()
  const menuItems = useMemo(() => getTreeMenu(constantRoutes), [])
  const breadcrumbNameMap = useMemo(() => getBreadcrumbNameMap(constantRoutes), [])
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 菜单点击
  const handleMenuClick = (e) => {
    navigate(e.key)
  }

  // 菜单展开收缩
  const handleMenuOpen = (openKeys) => {
    setSubMenuKeys(openKeys)
  }

  // 面包屑数据
  const breadcrumbItems = useMemo(() =>
    pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      return {
        key: url,
        title: breadcrumbNameMap[url],
        path: url
      }
    }), [pathSnippets, breadcrumbNameMap]
  )

  // 面包屑渲染
  const itemRender = (route, params, routes) =>
    routes.indexOf(route) === routes.length - 1
      ? <span>{route.title}</span>
      : <Link to={route.path}>{route.title}</Link>

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div>
          <div className="demo-logo-vertical">
            <img className="layout-logo" src={logo} alt="logo" />
            王都创世物语
          </div>
          <Menu
            theme="dark"
            onClick={handleMenuClick}
            selectedKeys={[pathname]}
            openKeys={subMenuKeys}
            onOpenChange={handleMenuOpen}
            mode="inline"
            items={menuItems}
          />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <div className="header-breadcrumb">
            <Breadcrumb
              items={breadcrumbItems}
              itemRender={itemRender}
              style={{ margin: '16px 0' }}
            />
          </div>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}

export default LayoutApp