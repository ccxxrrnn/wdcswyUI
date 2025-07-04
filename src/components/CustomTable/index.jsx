import React, { useMemo } from 'react'
import { Table } from 'antd'
// 导入自定义hook
import useFetchTableData from '@/hooks/useFetchTableData'
const CustomTable = ({ fetchMethod, columns, requestParam, onParamChange, ...resetTableProps }) => {
	// 请求表格数据
	const { loading, tableData } = useFetchTableData(fetchMethod, requestParam, onParamChange)

	// 翻页重设参数
	const onTableChange = (page) => {
		onParamChange({ pageSize: page.pageSize, current: page.current })
	}

	const processedData = useMemo(() => {
		if (!tableData.data || !Array.isArray(tableData.data)) {
			return []
		}
		return tableData.data.map((item, index) => ({
			...item,
			uniqueKeyForTable: `${JSON.stringify(item)}-${index}`
		}))
	}, [tableData.data])

	return (
		<Table
			{...resetTableProps}
			rowKey="uniqueKeyForTable"
			onChange={onTableChange}
			loading={loading}
			dataSource={processedData}
			columns={columns}
			pagination={{
			total: tableData.total,
			showTotal: (t) =>  <span style={{ color: '#333' }}>共{t}条</span>
			}}
		/>
	)
}
export default CustomTable
