import { useState, useEffect } from 'react';
import systemApi from '@/api/system';

const useSystemDict = (type) => {
  const [dict, setDict] = useState([]);

  useEffect(() => {
    const fetchDict = async () => {
      if (!type) return;
      try {
        const res = await systemApi.constants.listByType(type);
        // 将 { key, value } 转换为 { value: key, label: value }
        const formattedDict = res.data.data.map(item => ({
          value: item.key,
          label: item.value
        }));
        setDict(formattedDict);
      } catch (error) {
        console.error(`Failed to fetch ${type} dictionary:`, error);
      }
    };

    fetchDict();
  }, [type]);

  return dict;
};

export default useSystemDict;
