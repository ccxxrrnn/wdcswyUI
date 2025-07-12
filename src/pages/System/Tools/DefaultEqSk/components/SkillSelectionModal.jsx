import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Spin, List, Pagination, message, Row, Col, Divider, Button, Tag } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import knowledgeApi from '@/api/knowledge';

const { Search } = Input;

const SkillSelectionModal = ({
  open,
  onCancel,
  onSelect,
  selectedSkills,
  setSelectedSkills,
}) => {
  const [skillSearchLoading, setSkillSearchLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillPagination, setSkillPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  const fetchSkills = useCallback((params) => {
    setSkillSearchLoading(true);
    knowledgeApi.skill.queryPage(params)
      .then(res => {
        const { data, total } = res.data;
        setSkills(data || []);
        setSkillPagination(prev => ({ ...prev, total: total || 0 }));
      })
      .catch(() => message.error('搜索技能失败'))
      .finally(() => setSkillSearchLoading(false));
  }, []);

  useEffect(() => {
    if (open) {
      // Reset pagination and fetch first page when modal opens
      const newPagination = { current: 1, pageSize: 10, total: 0 };
      setSkillPagination(newPagination);
      setSkillSearchTerm(''); // Clear search term
      fetchSkills({ name: '', current: newPagination.current, pageSize: newPagination.pageSize });
    }
  }, [open, fetchSkills]);

  const handleAddSkillToList = (skill) => {
    if (selectedSkills.find(s => s.id === skill.id)) {
      message.warning('该技能已被添加');
      return;
    }
    setSelectedSkills([...selectedSkills, skill]);
  };

  const handleRemoveSkillFromList = (skillId) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  const handleMoveSkill = (index, direction) => {
    const newSkills = [...selectedSkills];
    const item = newSkills[index];
    newSkills.splice(index, 1);
    newSkills.splice(index + direction, 0, item);
    setSelectedSkills(newSkills);
  };

  const handleSearch = (value) => {
    setSkillSearchTerm(value);
    const newPagination = { ...skillPagination, current: 1 };
    setSkillPagination(newPagination);
    fetchSkills({ name: value, current: newPagination.current, pageSize: newPagination.pageSize });
  };

  const handlePageChange = (page, pageSize) => {
    const newPagination = { ...skillPagination, current: page, pageSize };
    setSkillPagination(newPagination);
    fetchSkills({ name: skillSearchTerm, current: page, pageSize });
  };

  return (
    <Modal
      title="选择技能"
      open={open}
      onCancel={onCancel}
      onOk={onSelect}
      width={800}
      destroyOnClose // Destroy content on close to reset state
    >
      <Row gutter={16}>
        <Col span={12}>
          <Divider>已选技能 ({selectedSkills.length})</Divider>
          <List
            bordered
            dataSource={selectedSkills}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => handleMoveSkill(index, -1)} key="up" />,
                  <Button icon={<ArrowDownOutlined />} size="small" disabled={index === selectedSkills.length - 1} onClick={() => handleMoveSkill(index, 1)} key="down" />,
                  <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleRemoveSkillFromList(item.id)} key="delete" />,
                ]}
              >
                {item.name}
              </List.Item>
            )}
            locale={{ emptyText: '从右侧列表选择技能' }}
            style={{ maxHeight: 400, overflowY: 'auto' }}
          />
        </Col>
        <Col span={12}>
          <Divider>可选技能</Divider>
          <Search
            placeholder="按名称搜索技能"
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
            allowClear
          />
          <Spin spinning={skillSearchLoading}>
            <List
              bordered
              dataSource={skills}
              renderItem={item => (
                <List.Item
                  onClick={() => handleAddSkillToList(item)}
                  style={{ cursor: 'pointer' }}
                  extra={selectedSkills.find(s => s.id === item.id) ? <Tag color="green">已添加</Tag> : null}
                >
                  {item.name}
                </List.Item>
              )}
              style={{ maxHeight: 350, overflowY: 'auto' }}
            />
            <Pagination
              style={{ marginTop: 16, textAlign: 'right' }}
              current={skillPagination.current}
              pageSize={skillPagination.pageSize}
              total={skillPagination.total}
              size="small"
              onChange={handlePageChange}
            />
          </Spin>
        </Col>
      </Row>
    </Modal>
  );
};

export default SkillSelectionModal;
