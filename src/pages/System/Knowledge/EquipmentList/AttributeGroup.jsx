import { memo } from 'react';
import DynamicIcon from '@/components/DynamicIcon';

/**
 * 属性组组件：展示一组属性（如基础、战斗、经营）
 * 使用 React.memo 避免不必要的重渲染
 */
const AttributeGroup = memo(({ group }) => {
  return (
    <div className="attribute-row">
      <div className="attribute-content">
        <div className="attribute-items-container">
          <span className="attribute-label">{group.label}</span>
          {group.items.map((attr, idx) => (
            <div key={idx} className="attribute-item">
              <DynamicIcon iconKey={attr.key} /> {attr.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default AttributeGroup;