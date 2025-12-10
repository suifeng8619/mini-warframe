// MOD数据配置
export const MODS = {
  // ========== 战甲MOD ==========
  // 生存类
  vitality: {
    id: 'vitality',
    name: 'Vitality',
    displayName: '活力',
    description: '提升生命值上限',
    target: 'warframe',
    rarity: 'common',
    maxRank: 10,
    baseCost: 2,
    effects: { maxHealth: 0.4 }, // 每级+40%
    isMultiplier: true,
    getEffect: (rank) => ({ maxHealth: 1 + (0.4 * rank) })
  },

  redirection: {
    id: 'redirection',
    name: 'Redirection',
    displayName: '重定向',
    description: '提升护盾上限',
    target: 'warframe',
    rarity: 'common',
    maxRank: 10,
    baseCost: 2,
    effects: { maxShield: 0.4 },
    isMultiplier: true,
    getEffect: (rank) => ({ maxShield: 1 + (0.4 * rank) })
  },

  steel_fiber: {
    id: 'steel_fiber',
    name: 'Steel Fiber',
    displayName: '钢铁纤维',
    description: '提升护甲值',
    target: 'warframe',
    rarity: 'uncommon',
    maxRank: 10,
    baseCost: 4,
    effects: { armor: 0.1 },
    isMultiplier: true,
    getEffect: (rank) => ({ armor: 1 + (0.1 * rank) })
  },

  // 能量类
  flow: {
    id: 'flow',
    name: 'Flow',
    displayName: '流动',
    description: '提升能量上限',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 10,
    baseCost: 4,
    effects: { maxEnergy: 0.3 },
    isMultiplier: true,
    getEffect: (rank) => ({ maxEnergy: 1 + (0.3 * rank) })
  },

  streamline: {
    id: 'streamline',
    name: 'Streamline',
    displayName: '效率简化',
    description: '减少技能能量消耗',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 4,
    effects: { energyEfficiency: 0.05 },
    isMultiplier: false,
    getEffect: (rank) => ({ energyEfficiency: 0.05 * rank })
  },

  // 移动类
  rush: {
    id: 'rush',
    name: 'Rush',
    displayName: '冲刺',
    description: '提升移动速度',
    target: 'warframe',
    rarity: 'common',
    maxRank: 10,
    baseCost: 2,
    effects: { speed: 0.03 },
    isMultiplier: true,
    getEffect: (rank) => ({ speed: 1 + (0.03 * rank) })
  },

  // ========== 武器MOD ==========
  // 伤害类
  serration: {
    id: 'serration',
    name: 'Serration',
    displayName: '膛线',
    description: '提升步枪基础伤害',
    target: 'weapon',
    weaponType: 'rifle',
    rarity: 'common',
    maxRank: 10,
    baseCost: 4,
    effects: { damage: 0.15 },
    isMultiplier: true,
    getEffect: (rank) => ({ damage: 1 + (0.15 * rank) })
  },

  hornet_strike: {
    id: 'hornet_strike',
    name: 'Hornet Strike',
    displayName: '黄蜂蛰刺',
    description: '提升手枪基础伤害',
    target: 'weapon',
    weaponType: 'pistol',
    rarity: 'common',
    maxRank: 10,
    baseCost: 4,
    effects: { damage: 0.2 },
    isMultiplier: true,
    getEffect: (rank) => ({ damage: 1 + (0.2 * rank) })
  },

  point_blank: {
    id: 'point_blank',
    name: 'Point Blank',
    displayName: '近距离',
    description: '提升霰弹枪基础伤害',
    target: 'weapon',
    weaponType: 'shotgun',
    rarity: 'common',
    maxRank: 5,
    baseCost: 4,
    effects: { damage: 0.15 },
    isMultiplier: true,
    getEffect: (rank) => ({ damage: 1 + (0.15 * rank) })
  },

  // 暴击类
  point_strike: {
    id: 'point_strike',
    name: 'Point Strike',
    displayName: '致命一击',
    description: '提升暴击率',
    target: 'weapon',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 4,
    effects: { critChance: 0.25 },
    isMultiplier: true,
    getEffect: (rank) => ({ critChance: 1 + (0.25 * rank) })
  },

  vital_sense: {
    id: 'vital_sense',
    name: 'Vital Sense',
    displayName: '致命要害',
    description: '提升暴击伤害',
    target: 'weapon',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 4,
    effects: { critMultiplier: 0.2 },
    isMultiplier: true,
    getEffect: (rank) => ({ critMultiplier: 1 + (0.2 * rank) })
  },

  // 射速/弹药类
  speed_trigger: {
    id: 'speed_trigger',
    name: 'Speed Trigger',
    displayName: '高速扳机',
    description: '提升射速',
    target: 'weapon',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 4,
    effects: { fireRate: 0.1 },
    isMultiplier: true,
    getEffect: (rank) => ({ fireRate: 1 + (0.1 * rank) })
  },

  fast_hands: {
    id: 'fast_hands',
    name: 'Fast Hands',
    displayName: '快手',
    description: '减少换弹时间',
    target: 'weapon',
    rarity: 'common',
    maxRank: 5,
    baseCost: 2,
    effects: { reloadTime: -0.05 },
    isMultiplier: true,
    getEffect: (rank) => ({ reloadTime: 1 - (0.05 * rank) })
  },

  magazine_warp: {
    id: 'magazine_warp',
    name: 'Magazine Warp',
    displayName: '弹匣扭曲',
    description: '提升弹匣容量',
    target: 'weapon',
    rarity: 'common',
    maxRank: 5,
    baseCost: 2,
    effects: { magazineSize: 0.05 },
    isMultiplier: true,
    getEffect: (rank) => ({ magazineSize: 1 + (0.05 * rank) })
  }
}

// MOD稀有度颜色
export const RARITY_COLORS = {
  common: 0xc4a000,
  uncommon: 0x4488cc,
  rare: 0xcc8844,
  legendary: 0xcccccc
}

// 获取玩家拥有的MOD列表
export function getPlayerMods() {
  return window.GAME_STATE?.mods || []
}

// 计算MOD总容量消耗
export function calculateModCapacity(mods) {
  return mods.reduce((total, mod) => {
    const modData = MODS[mod.id]
    return total + (modData ? modData.baseCost + mod.rank : 0)
  }, 0)
}
