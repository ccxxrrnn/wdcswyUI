import React, { useState } from 'react';

/**
 * 动态图标组件：自动加载指定图标，加载失败时切换为默认图标
 * @param {string} iconKey - 图标名称（如 'hp', 'mp'）
 * @param {string} [defaultIcon='/default-attribute.png'] - 默认图标路径
 */
const DynamicIcon = ({ iconKey, defaultIcon = '/default-attribute.png' }) => {
  const [iconSrc, setIconSrc] = useState(() => {
    try {
      const path = require(`@/assets/images/attributes/${iconKey}.png`);
      return path;
    } catch (e) {
      return defaultIcon;
    }
  });

  return (
    <img
      src={iconSrc}
      alt={iconKey}
      width="16"
      height="16"
      onError={() => setIconSrc(defaultIcon)}
    />
  );
};

export default DynamicIcon;