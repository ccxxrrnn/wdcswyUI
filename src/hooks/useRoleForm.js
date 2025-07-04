import { useState, useEffect } from 'react';
import manageApi from '@/api/manage';
import { message } from 'antd';

const useRoleForm = ({ mode, roleId, initialData, starOptions }) => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const fetchRoleData = async () => {
      // 如果提供了 initialData，则优先使用
      if (initialData) {
        setInitialValues(initialData);
        return;
      }
      // 在编辑模式下根据 roleId 获取角色详情
      if (mode === 'edit' && roleId) {
        setLoading(true);
        try {
          const roleRes = await manageApi.role.queryById(roleId);
          const roleData = roleRes.data.data;


          const newInitialValues = {
            roleName: roleData.roleName,
            sex: String(roleData.sex),
            careerId: roleData.careerId != null ? roleData.careerId : undefined,
            city: roleData.city != null ? String(roleData.city) : undefined,
            isTwo: roleData.isTwo === true ? '1' : '0',
            isBrith: roleData.isBrith === true ? '1' : '0',
            star: roleData.star != null ? String(roleData.star) : undefined // 使用查找到的ID，如果未找到则为 undefined
          };
          console.log('useRoleForm: Fetched roleData:', roleData);
          console.log('useRoleForm: Setting initialValues:', newInitialValues);
          setInitialValues(newInitialValues);
        } catch (error) {
          message.error('加载角色数据失败');
          console.error('Failed to fetch role data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // 新增模式下清空
        setInitialValues({});
      }
    };

    fetchRoleData();
  }, [mode, roleId, initialData, starOptions]);

  const saveRole = async (formValues) => {
    try {
      if (mode === 'add') {
        await manageApi.role.add(formValues);
        message.success('添加角色成功');
      } else if (mode === 'edit') {
        await manageApi.role.update({ roleId, ...formValues });
        message.success('修改信息成功');
      }
      return true; // 表示成功
    } catch (e) {
      message.error('操作失败');
      console.error('Failed to save role:', e);
      return false; // 表示失败
    }
  };

  return {
    loading,
    initialValues,
    saveRole
  };
};

export default useRoleForm;
