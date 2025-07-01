import { createSlice } from '@reduxjs/toolkit'

// 只管理权限相关内容，不存储路由表
const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    permissionRoutes: []
  },
  reducers: {
    setPermissionRoutes(state, action) {
      state.permissionRoutes = action.payload.routes
    }
  }
})

export const { setPermissionRoutes } = permissionSlice.actions

export default permissionSlice.reducer
