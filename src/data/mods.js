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
  },

  // ========== 新增战甲MOD ==========
  // 技能强化类
  intensify: {
    id: 'intensify',
    name: 'Intensify',
    displayName: '强化',
    description: '提升技能强度',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 6,
    effects: { abilityStrength: 0.06 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityStrength: 0.06 * rank })
  },

  continuity: {
    id: 'continuity',
    name: 'Continuity',
    displayName: '持续',
    description: '提升技能持续时间',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 6,
    effects: { abilityDuration: 0.05 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityDuration: 0.05 * rank })
  },

  stretch: {
    id: 'stretch',
    name: 'Stretch',
    displayName: '延伸',
    description: '提升技能范围',
    target: 'warframe',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 4,
    effects: { abilityRange: 0.09 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityRange: 0.09 * rank })
  },

  // 高级技能MOD
  blind_rage: {
    id: 'blind_rage',
    name: 'Blind Rage',
    displayName: '盲怒',
    description: '大幅提升技能强度，但增加能量消耗',
    target: 'warframe',
    rarity: 'legendary',
    maxRank: 10,
    baseCost: 8,
    effects: { abilityStrength: 0.09, energyEfficiency: -0.05 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityStrength: 0.09 * rank, energyEfficiency: -0.05 * rank })
  },

  narrow_minded: {
    id: 'narrow_minded',
    name: 'Narrow Minded',
    displayName: '心胸狭隘',
    description: '大幅提升技能持续时间，但减少范围',
    target: 'warframe',
    rarity: 'legendary',
    maxRank: 10,
    baseCost: 8,
    effects: { abilityDuration: 0.09, abilityRange: -0.033 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityDuration: 0.09 * rank, abilityRange: -0.033 * rank })
  },

  overextended: {
    id: 'overextended',
    name: 'Overextended',
    displayName: '过度延伸',
    description: '大幅提升技能范围，但降低强度',
    target: 'warframe',
    rarity: 'legendary',
    maxRank: 10,
    baseCost: 8,
    effects: { abilityRange: 0.09, abilityStrength: -0.06 },
    isMultiplier: false,
    getEffect: (rank) => ({ abilityRange: 0.09 * rank, abilityStrength: -0.06 * rank })
  },

  fleeting_expertise: {
    id: 'fleeting_expertise',
    name: 'Fleeting Expertise',
    displayName: '瞬时专精',
    description: '大幅减少能量消耗，但缩短持续时间',
    target: 'warframe',
    rarity: 'legendary',
    maxRank: 10,
    baseCost: 8,
    effects: { energyEfficiency: 0.05, abilityDuration: -0.05 },
    isMultiplier: false,
    getEffect: (rank) => ({ energyEfficiency: 0.05 * rank, abilityDuration: -0.05 * rank })
  },

  // 生存增强
  vigor: {
    id: 'vigor',
    name: 'Vigor',
    displayName: '精力',
    description: '同时提升生命和护盾',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 10,
    baseCost: 6,
    effects: { maxHealth: 0.2, maxShield: 0.2 },
    isMultiplier: true,
    getEffect: (rank) => ({ maxHealth: 1 + (0.2 * rank), maxShield: 1 + (0.2 * rank) })
  },

  quick_thinking: {
    id: 'quick_thinking',
    name: 'Quick Thinking',
    displayName: '快速思考',
    description: '受致命伤害时消耗能量抵挡',
    target: 'warframe',
    rarity: 'rare',
    maxRank: 10,
    baseCost: 6,
    effects: { energyToHealth: 0.24 },
    isMultiplier: false,
    getEffect: (rank) => ({ energyToHealth: 0.24 * rank })
  },

  // 跳跃增强
  jump_height: {
    id: 'jump_height',
    name: 'Maglev',
    displayName: '磁悬浮',
    description: '提升跳跃高度',
    target: 'warframe',
    rarity: 'common',
    maxRank: 5,
    baseCost: 2,
    effects: { jumpForce: 0.1 },
    isMultiplier: true,
    getEffect: (rank) => ({ jumpForce: 1 + (0.1 * rank) })
  },

  // ========== 新增武器MOD ==========
  // 多重射击
  split_chamber: {
    id: 'split_chamber',
    name: 'Split Chamber',
    displayName: '分裂膛室',
    description: '步枪有几率发射额外子弹',
    target: 'weapon',
    weaponType: 'rifle',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 10,
    effects: { multishot: 0.15 },
    isMultiplier: false,
    getEffect: (rank) => ({ multishot: 0.15 * rank })
  },

  barrel_diffusion: {
    id: 'barrel_diffusion',
    name: 'Barrel Diffusion',
    displayName: '弹头扩散',
    description: '手枪有几率发射额外子弹',
    target: 'weapon',
    weaponType: 'pistol',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 10,
    effects: { multishot: 0.12 },
    isMultiplier: false,
    getEffect: (rank) => ({ multishot: 0.12 * rank })
  },

  hells_chamber: {
    id: 'hells_chamber',
    name: "Hell's Chamber",
    displayName: '地狱膛室',
    description: '霰弹枪有几率发射额外弹丸',
    target: 'weapon',
    weaponType: 'shotgun',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 10,
    effects: { multishot: 0.12 },
    isMultiplier: false,
    getEffect: (rank) => ({ multishot: 0.12 * rank })
  },

  // 暴击强化
  bladed_rounds: {
    id: 'bladed_rounds',
    name: 'Bladed Rounds',
    displayName: '刀锋弹药',
    description: '击杀后短暂提升暴击伤害',
    target: 'weapon',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 6,
    effects: { critOnKill: 0.12 },
    isMultiplier: false,
    getEffect: (rank) => ({ critOnKill: 0.12 * rank })
  },

  argon_scope: {
    id: 'argon_scope',
    name: 'Argon Scope',
    displayName: '氩气瞄具',
    description: '爆头后短暂提升暴击率',
    target: 'weapon',
    rarity: 'legendary',
    maxRank: 5,
    baseCost: 8,
    effects: { headshotCrit: 0.225 },
    isMultiplier: false,
    getEffect: (rank) => ({ headshotCrit: 0.225 * rank })
  },

  // 穿透强化
  metal_auger: {
    id: 'metal_auger',
    name: 'Metal Auger',
    displayName: '金属钻头',
    description: '步枪子弹可穿透敌人',
    target: 'weapon',
    weaponType: 'rifle',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 6,
    effects: { punchThrough: 0.4 },
    isMultiplier: false,
    getEffect: (rank) => ({ punchThrough: 0.4 * rank })
  },

  seeking_fury: {
    id: 'seeking_fury',
    name: 'Seeking Fury',
    displayName: '追寻怒火',
    description: '霰弹枪获得穿透和更快换弹',
    target: 'weapon',
    weaponType: 'shotgun',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 6,
    effects: { punchThrough: 0.3, reloadTime: -0.03 },
    isMultiplier: false,
    getEffect: (rank) => ({ punchThrough: 0.3 * rank, reloadTime: 1 - (0.03 * rank) })
  },

  // 特殊效果
  shred: {
    id: 'shred',
    name: 'Shred',
    displayName: '撕裂',
    description: '同时提升射速和穿透',
    target: 'weapon',
    rarity: 'rare',
    maxRank: 5,
    baseCost: 8,
    effects: { fireRate: 0.06, punchThrough: 0.24 },
    isMultiplier: false,
    getEffect: (rank) => ({ fireRate: 1 + (0.06 * rank), punchThrough: 0.24 * rank })
  },

  vigilante_armaments: {
    id: 'vigilante_armaments',
    name: 'Vigilante Armaments',
    displayName: '义警军备',
    description: '提升多重射击并有暴击升级几率',
    target: 'weapon',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 6,
    effects: { multishot: 0.1, critUpgrade: 0.05 },
    isMultiplier: false,
    getEffect: (rank) => ({ multishot: 0.1 * rank, critUpgrade: 0.05 * rank })
  },

  // 弓箭专用
  serration_bow: {
    id: 'serration_bow',
    name: 'Serration (Bow)',
    displayName: '膛线(弓)',
    description: '提升弓箭基础伤害',
    target: 'weapon',
    weaponType: 'bow',
    rarity: 'common',
    maxRank: 10,
    baseCost: 4,
    effects: { damage: 0.15 },
    isMultiplier: true,
    getEffect: (rank) => ({ damage: 1 + (0.15 * rank) })
  },

  speed_arrow: {
    id: 'speed_arrow',
    name: 'Speed Trigger (Bow)',
    displayName: '加速箭',
    description: '提升弓箭射速',
    target: 'weapon',
    weaponType: 'bow',
    rarity: 'uncommon',
    maxRank: 5,
    baseCost: 4,
    effects: { fireRate: 0.1 },
    isMultiplier: true,
    getEffect: (rank) => ({ fireRate: 1 + (0.1 * rank) })
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
