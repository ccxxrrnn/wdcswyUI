import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Segmented, Row, Col, Spin, Empty, Input, Pagination, Descriptions } from 'antd';
import './EquipmentList.css';
import DynamicIcon from '@/components/DynamicIcon';
import knowledgeApi from '@/api/knowledge';
import systemApi from '@/api/system';


// 默认图标兜底
const defaultIcon = '/default-attribute.png';

const EquipmentList = () => {
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [selectedType, setSelectedType] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [failedImages, setFailedImages] = useState({}); // 新增状态用于记录加载失败的图片

  const [attributeGroups, setAttributeGroups] = useState([]);

  const fetchData = useCallback(async (current = 1, pageSize = 10) => {
    // 将分页参数规范化逻辑内联，并移除对 pagination 状态的依赖
    const safeCurrent = Math.max(1, Number(current) || 1);
    const safePageSize = Math.max(10, Number(pageSize) || 10);
    
    setLoading(true);
    try {
      const response = await knowledgeApi.Equipment.queryPage({
        current: safeCurrent,
        pageSize: safePageSize,
        type: selectedType === '全部' ? '' : selectedType,
        name: searchTerm,
      });
      
     // 添加完整的容错逻辑
      if (!response || !response.data) {
        setEquipmentList([]);
        setTotal(0);
        setPagination({ current: safeCurrent, pageSize: safePageSize });
        return;
      }
      
      const result = response.data;

      const normalizedData = (result.data || []).map(item => ({
        ...item,
        price: item.pirce,
      }));

      // ✅ 强制替换整个列表，而不是追加
      setEquipmentList(normalizedData);
      setTotal(result.total || 0);
      // 使用函数式更新，避免对 pagination 的直接依赖
      setPagination(prev => {
        if (safeCurrent !== prev.current || safePageSize !== prev.pageSize) {
          return { current: safeCurrent, pageSize: safePageSize };
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to fetch equipment data:', error);
      setEquipmentList([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedType, searchTerm]);

  // 初始加载或当筛选条件变化时加载数据
  useEffect(() => {
    fetchData(1);
  }, [selectedType, searchTerm, fetchData]);

  // 自动从装备数据中提取所有 type 类型
  useEffect(() => {
    (async () => {
      try {
        const response = (await knowledgeApi.Equipment.type()).data;
        if (response && response.data) {
          const types = response.data;
          setTypeList(['全部', ...types]);
        } else {
          setTypeList(['全部']);
        }
      } catch (error) {
        console.error('获取装备类型失败:', error);
        setTypeList(['全部']);
      }
    })();
        (async () => {
      try {
        const response = (await systemApi.constants.queryAttributeGroups()).data;
        if (response && response.data) {
          const datas = response.data;
          setAttributeGroups(datas);
        } else {
          setAttributeGroups([]);
        }
      } catch (error) {
        console.error('获取属性组失败:', error);
          setAttributeGroups([]);
      }
    })();
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // 筛选逻辑：如果 selectedType 为 '全部'，展示所有；否则按 type 筛选
  const filteredByType = useMemo(() => {
    if (selectedType === '全部') return equipmentList;
    return equipmentList.filter(item => item.type === selectedType);
  }, [equipmentList, selectedType]);

  // 搜索过滤
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return filteredByType;
    const lowerCaseTerm = searchTerm.toLowerCase();
    return filteredByType.filter(item =>
      item.name.toLowerCase().includes(lowerCaseTerm)
    );
  }, [filteredByType, searchTerm]);

  // 分页处理 - 使用更精确的依赖数组
   const paginatedList = useMemo(() => {
    return filteredList;
  }, [filteredList]);


  const handlePageChange = useCallback((current, pageSize) => {
    fetchData(current, pageSize);
  }, [fetchData]);

  const handleSearch = useCallback((name) => {
    setSearchTerm(name);
    fetchData(1);
  }, [fetchData]);

  return (
    <div style={{ padding: 24 }}>
      <Segmented
        options={typeList}
        value={selectedType}
        onChange={setSelectedType}
        className="equipment-segmented"
      />
      <Input.Search
        placeholder="搜索装备名称"
        onSearch={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
      />
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        当前共 {total} 个装备
      </div>
      <div className="equipment-spin-container" key={`equipment-list-${pagination.current}`}>
        <Spin spinning={!!loading}>
          <div className="equipment-empty-container">
            {paginatedList.length === 0 && !loading && <Empty description="暂无装备" />}
          </div>
          {paginatedList.map(item => (
            <Row key={item.id} style={{ margin: 0, alignItems: 'center' }} className="equipment-row">
              {/* 左侧：图片+装备名称 */}
              <Col span={24}>
                <Card hoverable className="attribute-card">
                  <Descriptions
                    size="small"
                    labelStyle={{ fontSize: '15px', fontWeight: 'normal', width: '80px' }}
                    contentStyle={{ fontSize: '15px' }}
                    bordered
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <img
                            alt={item.name}
                            src={failedImages[item.id] ? defaultIcon : (item.rawUrl || defaultIcon)}
                            className="equipment-image-max"
                            onError={() => {
                              setFailedImages(prev => ({ ...prev, [item.id]: true }));
                            }}
                            loading="lazy"
                          />
                          {item.name}
                        </>
                      }
                      span={3}
                    >
                      <Descriptions size="small" column={1} labelStyle={{ fontSize: '15px', fontWeight: 'normal', width: '100px' }} contentStyle={{ fontSize: '15px', width: '100px' }}>
                        <Descriptions.Item label="品质">{item.level}</Descriptions.Item>

                        {/* 循环渲染所有属性组 */}
                        {attributeGroups.map((group, groupIndex) => (
                          <Descriptions.Item key={groupIndex} label={group.label}>
                            {group.items.map((attr, idx) => {
                              const value = item[attr.key] ?? 0; // 使用 null 合并运算符避免 NaN
                              return (
                                <React.Fragment key={idx}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', marginRight: 8 }}>
                                    <DynamicIcon iconKey={attr.key} /> {attr.value}: {value}
                                  </span>
                                </React.Fragment>
                              );
                            }).filter(Boolean)}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          ))}
        </Spin>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ marginTop: 16, textAlign: 'right' }}
        />
      </div>
    </div>
  );
};

export default EquipmentList;
