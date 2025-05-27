import { Spin } from 'antd'
import '@/components/Loading'
export default function Loading(props) {
  let { loadingText = '数据加载中...' } = props

  return (
    <div className="Loading">
      <Spin size="large" />
      <h3 className="loadingText">{loadingText}</h3>
    </div>
  )
}
