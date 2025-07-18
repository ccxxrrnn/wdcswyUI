/**
 * 内置一些工具类函数
 */

// 导入图标组件
import SvgIcon from '@/components/SvgIcon'
/**
 * 面包屑获取路由平铺对象 ,
 * @param {*} routes
 * @returns object, 例:{"/home":"首页"}
 */
export const getBreadcrumbNameMap = (routes) => {
  //首先拼接上首页
  const list = [{ path: 'home', menuPath: '/home', title: '首页' }, ...routes]
  let breadcrumbNameObj = {}
  const getItems = (list) => {
    //先遍历数组
    list.forEach((item) => {
      //遍历数组项的对象
      if (item.children && item.children.length) {
        const menuPath = item.path ? item.path : '/' + item.path
        breadcrumbNameObj[menuPath] = item.title
        getItems(item.children)
      } else {
        breadcrumbNameObj[item.path] = item.title
      }
    })
  }
  //调用一下递归函数
  getItems(list)
  //返回新数组
  return breadcrumbNameObj
}

/** 获取菜单项 */
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  }
}
/**
 * 获取侧边栏菜单项
 * @param {*} menuData 嵌套的路由数组
 * @returns
 */
export const getTreeMenu = (menuData) => {
  if (!menuData || !menuData.length) return
  const menuItems = []
  menuData.forEach((item) => {
    if (!item.hidden) {
      // 如果有子菜单
      if (item.children && item.children.length > 0) {
        menuItems.push(
          getItem(
            item.title,
            '/' + item.path,
            <SvgIcon name={item.icon ?? 'component'} width="14" height="14" color="#ccc" />,
            getTreeMenu(item.children)
          )
        )
      } else {
        if (item.path) {
          menuItems.push(
            getItem(
              item.title,
              item.path,
              <SvgIcon name={item.icon ?? 'component'} width="14" height="14" color="#ccc" />
            )
          )
        }
      }
    }
  })
  return menuItems
}
