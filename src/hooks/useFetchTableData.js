import { useState, useEffect, useCallback } from 'react';

const useFetchTableData = (fetchMethod, initialParams = {}) => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({
    records: [],
    total: 0,
    current: initialParams.current || 1,
    pageSize: initialParams.pageSize || 10,
  });
  const [params, setParams] = useState({
    current: initialParams.current || 1,
    pageSize: initialParams.pageSize || 10,
    ...initialParams,
  });

  const fetchTableData = useCallback(async (fetchParams) => {
    setLoading(true);
    try {
      const response = await fetchMethod(fetchParams);
      // 假设接口返回的数据结构是 { data: { records: [], total: 0, current: 1, size: 10 } }
      // 或者直接是 { records: [], total: 0, current: 1, size: 10 }
      // 根据你的API实际返回结构调整
      const responseData = response.data;
      setTableData({
        records: responseData.data || [],
        total: responseData.total || 0,
        current: responseData.page || fetchParams.current,
        pageSize: fetchParams.pageSize,
      });
    } catch (error) {
      console.error("Failed to fetch table data:", error);
      // 在出错时设置一个默认的安全状态
      setTableData({ records: [], total: 0, current: 1, pageSize: 10 });
    } finally {
      setLoading(false);
    }
  }, [fetchMethod]);

  useEffect(() => {
    fetchTableData(params);
  }, [params, fetchTableData]);

  const handleSearch = (newParams) => {
    setParams(prevParams => ({
      ...prevParams,
      ...newParams,
      current: 1, // 搜索时通常回到第一页
    }));
  };

  const handleTableChange = (pagination) => {
    setParams(prevParams => ({
      ...prevParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  return { loading, tableData, handleSearch, handleTableChange };
};

export default useFetchTableData;
