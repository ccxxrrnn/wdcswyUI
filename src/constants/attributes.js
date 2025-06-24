/**
 * 属性组常量：用于装备属性展示
 * 包含基础、战斗、经营三类属性
 */
export const attributeGroups = [
  {
    label: '基础',
    items: [
      { key: 'hp', label: '生命 (HP)' },
      { key: 'mp', label: '魔力 (MP)' },
      { key: 'pe', label: '体力 (PE)' },
    ]
  },
  {
    label: '战斗',
    items: [
      { key: 'atk', label: '攻击 (ATK)' },
      { key: 'def', label: '防御 (DEF)' },
      { key: 'aspd', label: '攻速 (ASPD)' },
      { key: 'luk', label: '幸运 (LUK)' },
    ]
  },
  {
    label: '经营',
    items: [
      { key: 'wis', label: '智慧 (WIS)' },
      { key: 'dex', label: '灵巧 (DEX)' },
      { key: 'dac', label: '采集 (DAC)' },
      { key: 'move', label: '搬运 (MOVE)' },
      { key: 'ins', label: '洞察 (INS)' },
    ]
  }
];