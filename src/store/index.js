import { configureStore } from '@reduxjs/toolkit'
import permissionSlice from '@/store/reducers/permissionSlice.js'

// 创建store对象
const store = configureStore({
  reducer: {
    permission: permissionSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      //关闭redux序列化检测
      serializableCheck: false
    })
})

export default store
