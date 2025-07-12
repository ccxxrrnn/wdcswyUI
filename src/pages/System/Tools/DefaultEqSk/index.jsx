import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Collapse, Row, Col, Button, Modal, List, Card, Segmented, Input, message, Spin, Empty, Popconfirm
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import toolsApi from '@/api/tools';
import useSystemDict from '@/hooks/useSystemDict';
import EquipmentSelectionModal from './components/EquipmentSelectionModal';
import SkillSelectionModal from './components/SkillSelectionModal';
import './DefaultEqSk.css';

const defaultEqSkApi = toolsApi.defaultEqSk;

// Helper function to format config data for the API
const formatConfigForApi = (config) => {
    const formattedConfig = {
        name: config.name,
        type: config.type,
        head: config.equipments?.head?.id || null,
        body: config.equipments?.body?.id || null,
        hand: config.equipments?.hand?.id || null,
        jewelry: config.equipments?.jewelry?.id || null,
        shield: config.equipments?.shield?.id || null,
        skills: config.skills?.map(skill => skill.id).join(',') || null,
    };
    // Only include id if it exists (for updates)
    if (config.id) {
        formattedConfig.id = config.id;
    }
    return formattedConfig;
};

const DefaultEqSk = () => {
    const equipmentSlotOptions = useSystemDict('defaultConfigsEqBody');
    const configTypeOptions = useSystemDict('defaultConfigsEqType');

    const equipmentSlotMap = useMemo(() => {
        return equipmentSlotOptions.reduce((acc, { value, label }) => {
            acc[label] = value;
            return acc;
        }, {});
    }, [equipmentSlotOptions]);

    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    
    const [isEqModalVisible, setIsEqModalVisible] = useState(false);
    const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    
    const [newConfigName, setNewConfigName] = useState('');
    const [editingConfig, setEditingConfig] = useState(null);
    const [currentConfig, setCurrentConfig] = useState(null);
    const [currentEqSlot, setCurrentEqSlot] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]); // This state is still needed for SkillSelectionModal

    const fetchConfigs = useCallback(() => {
        setLoading(true);
        defaultEqSkApi.getConfigs(activeTab)
            .then(res => {
                setConfigs(res.data.data || []);
            })
            .catch(() => message.error('获取配置列表失败'))
            .finally(() => setLoading(false));
    }, [activeTab]);

    useEffect(() => {
        if (activeTab) {
            fetchConfigs();
        }
    }, [activeTab, fetchConfigs]);

    useEffect(() => {
        if (configTypeOptions.length > 0 && !activeTab) {
            setActiveTab(configTypeOptions[0].value); // Set initial active tab to the first option's value (ID)
        }
    }, [configTypeOptions, activeTab]);

    const handleAddNewConfig = () => {
        if (!newConfigName.trim()) {
            message.warning('请输入配置名称');
            return;
        }
        const newConfig = {
            name: newConfigName,
            type: activeTab,
            equipments: { head: null, body: null, hand: null, jewelry: null, shield: null },
            skills: [],
        };
        defaultEqSkApi.saveConfig(formatConfigForApi(newConfig)).then(() => {
            message.success('新增成功');
            fetchConfigs();
            setIsAddModalVisible(false);
            setNewConfigName('');
        }).catch(() => message.error('新增失败'));
    };

    const handleDeleteConfig = (id, event) => {
        event.stopPropagation(); // 阻止Collapse展开/收起
        defaultEqSkApi.deleteConfig(id).then(() => {
            message.success('删除成功');
            fetchConfigs();
        }).catch(() => message.error('删除失败'));
    };

    const handleSelectEquipment = (config, slot) => {
        setCurrentConfig(config);
        setCurrentEqSlot(slot);
        setIsEqModalVisible(true);
    };

    const handleAddSkill = (config) => {
        setCurrentConfig(config);
        setSelectedSkills(config.skills || []); // Initialize selectedSkills from config
        setIsSkillModalVisible(true);
    };

    const onSelectEquipment = (equipment) => {
        const slotKey = equipmentSlotMap[currentEqSlot];
        if (!slotKey) {
            message.error('无效的装备槽位');
            return;
        }
        const updatedConfig = {
            ...currentConfig,
            equipments: {
                ...(currentConfig.equipments || {}),
                [slotKey]: equipment,
            },
        };
        defaultEqSkApi.saveConfig(formatConfigForApi(updatedConfig)).then(() => {
            message.success('装备更新成功');
            fetchConfigs();
            setIsEqModalVisible(false);
        }).catch(() => message.error('装备更新失败'));
    };

    const onSelectSkills = () => {
        const updatedConfig = {
            ...currentConfig,
            skills: selectedSkills,
        };
        defaultEqSkApi.saveConfig(formatConfigForApi(updatedConfig)).then(() => {
            message.success('技能更新成功');
            fetchConfigs();
            setIsSkillModalVisible(false);
        }).catch(() => message.error('技能更新失败'));
    };

    const handleOpenEditModal = (config, event) => {
        event.stopPropagation();
        setEditingConfig(config);
        setIsEditModalVisible(true);
    };

    const handleUpdateConfigName = () => {
        if (!editingConfig || !editingConfig.name.trim()) {
            message.warning('配置名称不能为空');
            return;
        }
        defaultEqSkApi.saveConfig(formatConfigForApi(editingConfig)).then(() => {
            message.success('名称更新成功');
            fetchConfigs();
            setIsEditModalVisible(false);
            setEditingConfig(null);
        }).catch(() => message.error('名称更新失败'));
    };


    const renderPanelHeader = (config) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {config.name}
            <div>
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => handleOpenEditModal(config, e)}
                    style={{ marginRight: 8 }}
                />
                <Popconfirm
                    title="确定删除这个配置吗？"
                    onConfirm={(e) => handleDeleteConfig(config.id, e)}
                    onCancel={(e) => e.stopPropagation()}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Popconfirm>
            </div>
        </div>
    );

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Segmented
                    options={configTypeOptions} // Directly pass the options array
                    value={activeTab}
                    onChange={setActiveTab} // onChange directly provides the value (ID)
                />
                <Button type="primary" onClick={() => setIsAddModalVisible(true)} disabled={!activeTab}>新增配置</Button>
            </div>
            <Spin spinning={loading}>
                {configs.length > 0 ? (
                    <Collapse
                        accordion
                        items={configs.map(config => ({
                            key: config.id,
                            label: renderPanelHeader(config),
                            children: (
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Card title="装备">
                                            <div className="equipment-grid">
                                                {equipmentSlotOptions.map(({ value: slotValue, label: slotLabel }) => {
                                                    const eq = config.equipments?.[slotValue];
                                                    return (
                                                        <div key={slotValue} className="equipment-slot" onClick={() => handleSelectEquipment(config, slotLabel)}>
                                                            {eq ? (
                                                                <>
                                                                    <img src={eq.rawUrl} alt={eq.name} title={`${eq.level}/${eq.name}`} />
                                                                    <div className="equipment-name" title={`${eq.level}/${eq.name}`}>{`${eq.level}/${eq.name}`}</div>
                                                                </>
                                                            ) : (
                                                                <div className="empty-slot">{slotLabel}</div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card title="技能" extra={<Button onClick={() => handleAddSkill(config)}>添加</Button>}>
                                            <List
                                                size="small"
                                                bordered
                                                dataSource={config.skills || []}
                                                renderItem={item => <List.Item>{item.name}</List.Item>}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            ),
                        }))}
                    />
                ) : (
                    <Empty description="暂无配置，快去新增一个吧！" />
                )}
            </Spin>

            <EquipmentSelectionModal
                open={isEqModalVisible}
                onCancel={() => setIsEqModalVisible(false)}
                onSelect={onSelectEquipment}
                currentEqSlot={currentEqSlot}
                equipmentSlotMap={equipmentSlotMap}
            />

            <SkillSelectionModal
                open={isSkillModalVisible}
                onCancel={() => setIsSkillModalVisible(false)}
                onSelect={onSelectSkills}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
            />

            <Modal
                title="新增配置"
                open={isAddModalVisible}
                onOk={handleAddNewConfig}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    setNewConfigName('');
                }}
            >
                <Input
                    placeholder="请输入新配置的名称"
                    value={newConfigName}
                    onChange={e => setNewConfigName(e.target.value)}
                    onPressEnter={handleAddNewConfig}
                />
            </Modal>

            <Modal
                title="修改配置名称"
                open={isEditModalVisible}
                onOk={handleUpdateConfigName}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingConfig(null);
                }}
                destroyOnClose
            >
                <Input
                    placeholder="请输入新的配置名称"
                    value={editingConfig?.name || ''}
                    onChange={e => setEditingConfig({ ...editingConfig, name: e.target.value })}
                    onPressEnter={handleUpdateConfigName}
                />
            </Modal>
        </div>
    );
};

export default DefaultEqSk;
