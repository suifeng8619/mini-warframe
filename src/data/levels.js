// 关卡/地图数据配置
export const LEVELS = {
  // ========== 地球 - 新手区域 ==========
  earth_forest: {
    id: 'earth_forest',
    name: 'Earth Forest',
    displayName: '地球森林',
    planet: 'earth',
    description: 'Grineer占领的地球森林地区',
    faction: 'grineer',
    difficulty: 1,
    recommendedLevel: '1-5',
    unlockCondition: null, // 默认解锁
    rewards: {
      credits: 1000,
      xpMultiplier: 1.0,
      possibleDrops: ['mod_serration', 'mod_vitality']
    },
    environment: {
      backgroundColor: 0x1a2a1a,
      platformColor: 0x3a5a3a,
      ambientColor: 0x88aa88,
      hasWeather: true,
      weatherType: 'rain'
    },
    layout: {
      width: 2400,
      height: 800,
      platforms: [
        { x: 0, y: 750, width: 2400, height: 50 },      // 地面
        { x: 200, y: 600, width: 200, height: 20 },
        { x: 500, y: 500, width: 150, height: 20 },
        { x: 800, y: 550, width: 180, height: 20 },
        { x: 1100, y: 450, width: 200, height: 20 },
        { x: 1400, y: 550, width: 150, height: 20 },
        { x: 1700, y: 480, width: 180, height: 20 },
        { x: 2000, y: 600, width: 200, height: 20 }
      ],
      spawnPoints: [
        { x: 100, y: 700 }
      ],
      enemySpawnZones: [
        { x: 600, y: 700, width: 400 },
        { x: 1200, y: 700, width: 400 },
        { x: 1800, y: 700, width: 400 }
      ]
    },
    waves: {
      maxWaves: 10,
      bossWave: null
    }
  },

  earth_outpost: {
    id: 'earth_outpost',
    name: 'Earth Outpost',
    displayName: '地球前哨站',
    planet: 'earth',
    description: 'Grineer军事前哨站',
    faction: 'grineer',
    difficulty: 2,
    recommendedLevel: '5-10',
    unlockCondition: { type: 'level_complete', levelId: 'earth_forest' },
    rewards: {
      credits: 2000,
      xpMultiplier: 1.2,
      possibleDrops: ['mod_serration', 'mod_hornet_strike', 'mod_vitality']
    },
    environment: {
      backgroundColor: 0x1a1a2a,
      platformColor: 0x4a4a5a,
      ambientColor: 0xaa8888
    },
    layout: {
      width: 2800,
      height: 900,
      platforms: [
        { x: 0, y: 850, width: 2800, height: 50 },
        { x: 150, y: 700, width: 250, height: 20 },
        { x: 450, y: 550, width: 200, height: 20 },
        { x: 700, y: 650, width: 180, height: 20 },
        { x: 950, y: 500, width: 250, height: 20 },
        { x: 1250, y: 600, width: 200, height: 20 },
        { x: 1500, y: 450, width: 180, height: 20 },
        { x: 1750, y: 550, width: 220, height: 20 },
        { x: 2050, y: 650, width: 200, height: 20 },
        { x: 2350, y: 500, width: 250, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 800 }],
      enemySpawnZones: [
        { x: 500, y: 800, width: 500 },
        { x: 1200, y: 800, width: 500 },
        { x: 1900, y: 800, width: 500 }
      ]
    },
    waves: {
      maxWaves: 15,
      bossWave: 5,
      bossId: 'captain_vor'
    }
  },

  // ========== 金星 - Corpus领地 ==========
  venus_outpost: {
    id: 'venus_outpost',
    name: 'Venus Outpost',
    displayName: '金星前哨',
    planet: 'venus',
    description: 'Corpus商业前哨站',
    faction: 'corpus',
    difficulty: 2,
    recommendedLevel: '5-10',
    unlockCondition: { type: 'level_complete', levelId: 'earth_forest' },
    rewards: {
      credits: 2500,
      xpMultiplier: 1.3,
      possibleDrops: ['mod_point_strike', 'mod_redirection']
    },
    environment: {
      backgroundColor: 0x1a2a3a,
      platformColor: 0x5577aa,
      ambientColor: 0x88aacc,
      hasSnow: true
    },
    layout: {
      width: 2600,
      height: 850,
      platforms: [
        { x: 0, y: 800, width: 2600, height: 50 },
        { x: 200, y: 650, width: 200, height: 20 },
        { x: 500, y: 550, width: 180, height: 20 },
        { x: 800, y: 480, width: 200, height: 20 },
        { x: 1100, y: 550, width: 150, height: 20 },
        { x: 1350, y: 450, width: 200, height: 20 },
        { x: 1600, y: 550, width: 180, height: 20 },
        { x: 1900, y: 480, width: 220, height: 20 },
        { x: 2200, y: 600, width: 200, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 750 }],
      enemySpawnZones: [
        { x: 600, y: 750, width: 500 },
        { x: 1300, y: 750, width: 500 },
        { x: 2000, y: 750, width: 400 }
      ]
    },
    waves: {
      maxWaves: 15,
      bossWave: null
    }
  },

  venus_factory: {
    id: 'venus_factory',
    name: 'Corpus Factory',
    displayName: 'Corpus工厂',
    planet: 'venus',
    description: 'Corpus机器人生产工厂',
    faction: 'corpus',
    difficulty: 3,
    recommendedLevel: '10-15',
    unlockCondition: { type: 'level_complete', levelId: 'venus_outpost' },
    rewards: {
      credits: 4000,
      xpMultiplier: 1.5,
      possibleDrops: ['mod_split_chamber', 'mod_barrel_diffusion']
    },
    environment: {
      backgroundColor: 0x0a1a2a,
      platformColor: 0x3355aa,
      ambientColor: 0x6688bb
    },
    layout: {
      width: 3000,
      height: 950,
      platforms: [
        { x: 0, y: 900, width: 3000, height: 50 },
        // 多层平台设计
        { x: 150, y: 750, width: 200, height: 20 },
        { x: 400, y: 600, width: 180, height: 20 },
        { x: 650, y: 750, width: 200, height: 20 },
        { x: 900, y: 500, width: 250, height: 20 },
        { x: 1200, y: 650, width: 180, height: 20 },
        { x: 1450, y: 500, width: 200, height: 20 },
        { x: 1700, y: 350, width: 250, height: 20 }, // 高平台
        { x: 1950, y: 500, width: 200, height: 20 },
        { x: 2200, y: 650, width: 180, height: 20 },
        { x: 2450, y: 500, width: 200, height: 20 },
        { x: 2700, y: 700, width: 200, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 850 }],
      enemySpawnZones: [
        { x: 500, y: 850, width: 600 },
        { x: 1300, y: 850, width: 600 },
        { x: 2100, y: 850, width: 600 }
      ]
    },
    waves: {
      maxWaves: 20,
      bossWave: 10,
      bossId: 'jackal'
    }
  },

  // ========== 火星 - 混合区域 ==========
  mars_settlement: {
    id: 'mars_settlement',
    name: 'Mars Settlement',
    displayName: '火星定居点',
    planet: 'mars',
    description: 'Grineer和Corpus争夺的殖民地',
    faction: 'mixed', // 混合敌人
    difficulty: 3,
    recommendedLevel: '10-15',
    unlockCondition: { type: 'level_complete', levelId: 'earth_outpost' },
    rewards: {
      credits: 3500,
      xpMultiplier: 1.4,
      possibleDrops: ['mod_continuity', 'mod_streamline']
    },
    environment: {
      backgroundColor: 0x2a1a1a,
      platformColor: 0x8a5a4a,
      ambientColor: 0xcc8866,
      hasDust: true
    },
    layout: {
      width: 2800,
      height: 900,
      platforms: [
        { x: 0, y: 850, width: 2800, height: 50 },
        { x: 200, y: 700, width: 220, height: 20 },
        { x: 500, y: 580, width: 180, height: 20 },
        { x: 750, y: 700, width: 200, height: 20 },
        { x: 1000, y: 500, width: 250, height: 20 },
        { x: 1300, y: 620, width: 180, height: 20 },
        { x: 1550, y: 480, width: 220, height: 20 },
        { x: 1850, y: 600, width: 200, height: 20 },
        { x: 2150, y: 500, width: 180, height: 20 },
        { x: 2400, y: 650, width: 250, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 800 }],
      enemySpawnZones: [
        { x: 500, y: 800, width: 500 },
        { x: 1200, y: 800, width: 500 },
        { x: 1900, y: 800, width: 500 }
      ]
    },
    waves: {
      maxWaves: 20,
      bossWave: null
    }
  },

  // ========== 谷神星 - Infested区域 ==========
  ceres_shipyard: {
    id: 'ceres_shipyard',
    name: 'Ceres Shipyard',
    displayName: '谷神星船坞',
    planet: 'ceres',
    description: '被Infested入侵的Grineer船坞',
    faction: 'infested',
    difficulty: 4,
    recommendedLevel: '15-20',
    unlockCondition: { type: 'level_complete', levelId: 'mars_settlement' },
    rewards: {
      credits: 5000,
      xpMultiplier: 1.6,
      possibleDrops: ['mod_intensify', 'mod_stretch']
    },
    environment: {
      backgroundColor: 0x1a2a1a,
      platformColor: 0x445533,
      ambientColor: 0x66aa44,
      hasSpores: true
    },
    layout: {
      width: 3200,
      height: 1000,
      platforms: [
        { x: 0, y: 950, width: 3200, height: 50 },
        { x: 200, y: 800, width: 200, height: 20 },
        { x: 500, y: 680, width: 180, height: 20 },
        { x: 750, y: 550, width: 220, height: 20 },
        { x: 1050, y: 700, width: 200, height: 20 },
        { x: 1300, y: 500, width: 250, height: 20 },
        { x: 1600, y: 650, width: 180, height: 20 },
        { x: 1850, y: 480, width: 220, height: 20 },
        { x: 2150, y: 600, width: 200, height: 20 },
        { x: 2450, y: 500, width: 180, height: 20 },
        { x: 2700, y: 700, width: 250, height: 20 },
        { x: 2950, y: 550, width: 200, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 900 }],
      enemySpawnZones: [
        { x: 500, y: 900, width: 600 },
        { x: 1400, y: 900, width: 600 },
        { x: 2300, y: 900, width: 600 }
      ]
    },
    waves: {
      maxWaves: 25,
      bossWave: 15,
      bossId: 'phorid'
    }
  },

  // ========== 虚空 - 终极挑战 ==========
  void_tower: {
    id: 'void_tower',
    name: 'Void Tower',
    displayName: '虚空塔',
    planet: 'void',
    description: '古老的Orokin遗迹，所有势力争夺之地',
    faction: 'mixed',
    difficulty: 5,
    recommendedLevel: '20+',
    unlockCondition: { type: 'level_complete', levelId: 'ceres_shipyard' },
    rewards: {
      credits: 8000,
      xpMultiplier: 2.0,
      possibleDrops: ['mod_serration', 'mod_split_chamber', 'mod_intensify', 'mod_blind_rage']
    },
    environment: {
      backgroundColor: 0x0a0a1a,
      platformColor: 0x8888aa,
      ambientColor: 0xddddff,
      hasVoidEffect: true
    },
    layout: {
      width: 3500,
      height: 1100,
      platforms: [
        { x: 0, y: 1050, width: 3500, height: 50 },
        // 复杂的塔内布局
        { x: 200, y: 900, width: 200, height: 20 },
        { x: 500, y: 750, width: 180, height: 20 },
        { x: 750, y: 600, width: 200, height: 20 },
        { x: 1000, y: 850, width: 220, height: 20 },
        { x: 1250, y: 500, width: 250, height: 20 },
        { x: 1550, y: 700, width: 180, height: 20 },
        { x: 1800, y: 550, width: 200, height: 20 },
        { x: 2050, y: 400, width: 220, height: 20 }, // 高平台
        { x: 2300, y: 600, width: 200, height: 20 },
        { x: 2550, y: 750, width: 180, height: 20 },
        { x: 2800, y: 550, width: 220, height: 20 },
        { x: 3100, y: 700, width: 200, height: 20 }
      ],
      spawnPoints: [{ x: 100, y: 1000 }],
      enemySpawnZones: [
        { x: 500, y: 1000, width: 700 },
        { x: 1500, y: 1000, width: 700 },
        { x: 2500, y: 1000, width: 700 }
      ]
    },
    waves: {
      maxWaves: 30,
      bossWave: [10, 20, 30], // 多个Boss波次
      bossRotation: ['captain_vor', 'jackal', 'phorid']
    }
  }
}

// 星球配置
export const PLANETS = {
  earth: {
    id: 'earth',
    name: 'Earth',
    displayName: '地球',
    color: 0x44aa44,
    unlocked: true,
    levels: ['earth_forest', 'earth_outpost']
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    displayName: '金星',
    color: 0x88aacc,
    unlocked: false,
    unlockCondition: { type: 'level_complete', levelId: 'earth_forest' },
    levels: ['venus_outpost', 'venus_factory']
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    displayName: '火星',
    color: 0xcc6644,
    unlocked: false,
    unlockCondition: { type: 'level_complete', levelId: 'earth_outpost' },
    levels: ['mars_settlement']
  },
  ceres: {
    id: 'ceres',
    name: 'Ceres',
    displayName: '谷神星',
    color: 0x66aa44,
    unlocked: false,
    unlockCondition: { type: 'level_complete', levelId: 'mars_settlement' },
    levels: ['ceres_shipyard']
  },
  void: {
    id: 'void',
    name: 'Void',
    displayName: '虚空',
    color: 0xddddff,
    unlocked: false,
    unlockCondition: { type: 'level_complete', levelId: 'ceres_shipyard' },
    levels: ['void_tower']
  }
}

// 获取关卡数据
export function getLevelById(levelId) {
  return LEVELS[levelId] || null
}

// 获取星球的所有关卡
export function getLevelsByPlanet(planetId) {
  const planet = PLANETS[planetId]
  if (!planet) return []
  return planet.levels.map(id => LEVELS[id]).filter(Boolean)
}

// 检查关卡是否解锁
export function isLevelUnlocked(levelId, playerProgress) {
  const level = LEVELS[levelId]
  if (!level) return false
  if (!level.unlockCondition) return true

  const { type, levelId: requiredLevelId } = level.unlockCondition
  if (type === 'level_complete') {
    return playerProgress.completedLevels?.includes(requiredLevelId) || false
  }
  return false
}

// 获取关卡奖励倍率（基于难度和波次）
export function getLevelRewardMultiplier(levelId, waveNumber) {
  const level = LEVELS[levelId]
  if (!level) return 1

  const baseMultiplier = level.rewards.xpMultiplier
  const waveBonus = 1 + (waveNumber - 1) * 0.05
  return baseMultiplier * waveBonus
}
