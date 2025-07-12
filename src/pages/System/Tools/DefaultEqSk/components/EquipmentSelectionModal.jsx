import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Spin, List, Avatar, Pagination, message } from 'antd';
import knowledgeApi from '@/api/knowledge';

const { Search } = Input;

const EquipmentSelectionModal = ({
  open,
  onCancel,
  onSelect,
  currentEqSlot,
  equipmentSlotMap,
}) => {
  const [eqSearchLoading, setEqSearchLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [eqPagination, setEqPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [eqSearchTerm, setEqSearchTerm] = useState('');

  const fetchEquipments = useCallback((params) => {
    setEqSearchLoading(true);
    knowledgeApi.Equipment.queryPage(params)
      .then(res => {
        const { data, total } = res.data;
        setEquipments(data || []);
        setEqPagination(prev => ({ ...prev, total }));
      })
      .catch(() => message.error('搜索装备失败'))
      .finally(() => setEqSearchLoading(false));
  }, []);

  useEffect(() => {
    if (open && currentEqSlot) {
      const body = equipmentSlotMap[currentEqSlot];
      if (body) {
        // Reset pagination and fetch first page when modal opens
        const newPagination = { current: 1, pageSize: 10, total: 0 };
        setEqPagination(newPagination);
        setEqSearchTerm(''); // Clear search term
        fetchEquipments({ name: '', body, current: newPagination.current, pageSize: newPagination.pageSize });
      } else {
        message.warning('装备部位类型未找到，请检查字典配置');
      }
    }
  }, [open, currentEqSlot, equipmentSlotMap, fetchEquipments]);

  const handleSearch = (value) => {
    setEqSearchTerm(value);
    const body = equipmentSlotMap[currentEqSlot];
    if (body) {
      const newPagination = { ...eqPagination, current: 1 };
      setEqPagination(newPagination);
      fetchEquipments({ name: value, body, current: newPagination.current, pageSize: newPagination.pageSize });
    }
  };

  const handlePageChange = (page, pageSize) => {
    const newPagination = { ...eqPagination, current: page, pageSize };
    setEqPagination(newPagination);
    const body = equipmentSlotMap[currentEqSlot];
    fetchEquipments({ name: eqSearchTerm, body, current: page, pageSize });
  };

  return (
    <Modal
      title={`选择${currentEqSlot}装备`}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose // Destroy content on close to reset state
    >
      <Search
        placeholder="按名称搜索装备"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
        loading={eqSearchLoading}
        allowClear
      />
      <Spin spinning={eqSearchLoading}>
        <List
          itemLayout="horizontal"
          dataSource={equipments}
          renderItem={item => (
            <List.Item onClick={() => onSelect(item)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar src={item.rawUrl} />}
                title={`${item.level}/${item.name}`}
              />
            </List.Item>
          )}
        />
        <Pagination
          style={{ marginTop: 16, textAlign: 'right' }}
          current={eqPagination.current}
          pageSize={eqPagination.pageSize}
          total={eqPagination.total}
          onChange={handlePageChange}
        />
      </Spin>
    </Modal>
  );
};

export default EquipmentSelectionModal;
