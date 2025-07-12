import React, { useEffect, useState, useMemo } from 'react'
import { Layout, Menu, theme, Breadcrumb } from 'antd'
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom'
import menuApi from '@/api/menu'
import logo from '../assets/images/logo.jpg'
import './Layout.scss'
import * as Icons from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout

function sortMenu(items) {
  return [...items].sort((a, b) => (a.menuOrder ?? 0) - (b.menuOrder ?? 0))
}

function renderMenu(items) {
  if (!Array.isArray(items)) return []
  return sortMenu(items)
    .filter(item => String(item.menuHidden) === '0')
    .map(item => {
      const IconComp = Icons[item.menuIcon] || null
      if (item.children && item.children.length) {
        return {
          key: item.menuRoute,
          icon: IconComp ? <IconComp /> : null,
          label: item.menuName,
          children: renderMenu(item.children)
        }
      }
      return {
        key: item.menuRoute,
        icon: IconComp ? <IconComp /> : null,
        label: item.menuName
      }
    })
}

// 递归生成 { 路径: 中文名 } 映射
function getBreadcrumbMapFromMenu(menuList, map = {}) {
  menuList.forEach(item => {
    if (item.menuRoute && item.menuName) {
      map[item.menuRoute] = item.menuName
    }
    if (item.children && item.children.length) {
      getBreadcrumbMapFromMenu(item.children, map)
    }
  })
  return map
}

const LayoutApp = () => {
  const { pathname } = useLocation()
  const pathSnippets = pathname.split('/').filter(Boolean)
  const [collapsed, setCollapsed] = useState(false)
  const [subMenuKeys, setSubMenuKeys] = useState(pathSnippets.slice(0, -1).map(item => '/' + item))
  const [menuData, setMenuData] = useState([])
  const [breadcrumbMap, setBreadcrumbMap] = useState({})
  const navigate = useNavigate()
  const menuItems = useMemo(() => renderMenu(menuData), [menuData])
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  useEffect(() => {
    menuApi.data.query().then(res => {
      setMenuData(res.data.data)
      setBreadcrumbMap(getBreadcrumbMapFromMenu(res.data.data))
    })
  }, [])

  // 菜单点击
  const handleMenuClick = (e) => {
    navigate(e.key)
  }

  // 菜单展开收缩
  const handleMenuOpen = (openKeys) => {
    setSubMenuKeys(openKeys)
  }

  // 面包屑数据
  const breadcrumbItems = useMemo(() => {
    const items = [
      { key: '/', title: <Link to="/">首页</Link> }
    ]
    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      items.push({
        key: url,
        title: breadcrumbMap[url] || url
      })
    })
    return items
  }, [pathSnippets, breadcrumbMap])


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
