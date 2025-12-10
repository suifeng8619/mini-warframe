// 开放世界/大地图配置
import { RESOURCE_NODES, PLANET_RESOURCES } from './materials.js'

// ========== 开放世界区域 ==========
export const OPEN_WORLDS = {
  // ========== 地球平原 ==========
  plains_of_eidolon: {
    id: 'plains_of_eidolon',
    name: 'Plains of Eidolon',
    displayName: '夜灵平野',
    planet: 'earth',
    description: '广阔的草原地带，夜间会出现巨型Eidolon',
    unlockCondition: { type: 'mastery', level: 1 },

    // 地图尺寸 (像素)
    mapSize: {
      width: 8000,
      height: 4000
    },

    // 环境设置
    environment: {
      backgroundColor: 0x1a3a2a,
      groundColor: 0x4a6a3a,
      skyColor: 0x88aacc,
      hasDayNightCycle: true,
      dayLength: 300000,      // 5分钟白天
      nightLength: 300000,    // 5分钟夜晚
      weather: ['clear', 'rain', 'fog']
    },

    // 地形配置
    terrain: {
      // 地面高度变化
      heightMap: [
        { x: 0, y: 3800 },
        { x: 1000, y: 3700 },
        { x: 2000, y: 3850 },
        { x: 3000, y: 3600 },
        { x: 4000, y: 3750 },
        { x: 5000, y: 3500 },
        { x: 6000, y: 3700 },
        { x: 7000, y: 3650 },
        { x: 8000, y: 3800 }
      ],
      // 平台/岩石
      platforms: [
        { x: 500, y: 3500, width: 300, height: 40, type: 'rock' },
        { x: 1200, y: 3400, width: 250, height: 30, type: 'rock' },
        { x: 1800, y: 3300, width: 400, height: 50, type: 'cliff' },
        { x: 2500, y: 3450, width: 200, height: 35, type: 'rock' },
        { x: 3200, y: 3200, width: 350, height: 45, type: 'cliff' },
        { x: 3800, y: 3350, width: 280, height: 40, type: 'rock' },
        { x: 4500, y: 3100, width: 450, height: 60, type: 'cliff' },
        { x: 5200, y: 3400, width: 220, height: 35, type: 'rock' },
        { x: 5900, y: 3250, width: 380, height: 50, type: 'cliff' },
        { x: 6600, y: 3500, width: 260, height: 40, type: 'rock' },
        { x: 7300, y: 3350, width: 320, height: 45, type: 'rock' }
      ],
      // 水域
      waterAreas: [
        { x: 2800, y: 3700, width: 600, depth: 100 },
        { x: 5500, y: 3650, width: 400, depth: 80 }
      ],
      // 洞穴入口
      caveEntrances: [
        { x: 1500, y: 3600, width: 100, height: 150, caveName: 'cave_a' },
        { x: 4200, y: 3500, width: 120, height: 180, caveName: 'cave_b' },
        { x: 6800, y: 3550, width: 90, height: 140, caveName: 'cave_c' }
      ]
    },

    // 资源采集点
    resourceNodes: {
      // 矿石点
      oreDeposits: [
        { x: 600, y: 3700, type: 'ore_deposit', resources: ['ferrite', 'rubedo'] },
        { x: 1400, y: 3650, type: 'ore_deposit', resources: ['ferrite', 'alloy_plate'] },
        { x: 2200, y: 3800, type: 'ore_deposit', resources: ['rubedo', 'ferrite'] },
        { x: 3000, y: 3550, type: 'ore_deposit', resources: ['ferrite', 'morphics'] },
        { x: 3700, y: 3700, type: 'ore_deposit', resources: ['alloy_plate', 'rubedo'] },
        { x: 4600, y: 3600, type: 'ore_deposit', resources: ['ferrite', 'neurodes'] },
        { x: 5400, y: 3750, type: 'ore_deposit', resources: ['rubedo', 'ferrite'] },
        { x: 6200, y: 3650, type: 'ore_deposit', resources: ['ferrite', 'alloy_plate'] },
        { x: 7100, y: 3700, type: 'ore_deposit', resources: ['rubedo', 'morphics'] }
      ],
      // 植物采集点
      plantNodes: [
        { x: 400, y: 3750, type: 'organic_mass', resources: ['nano_spores', 'polymer_bundle'] },
        { x: 1100, y: 3700, type: 'organic_mass', resources: ['plastids', 'nano_spores'] },
        { x: 1900, y: 3800, type: 'organic_mass', resources: ['polymer_bundle', 'plastids'] },
        { x: 2700, y: 3650, type: 'organic_mass', resources: ['nano_spores', 'plastids'] },
        { x: 3500, y: 3750, type: 'organic_mass', resources: ['polymer_bundle', 'nano_spores'] },
        { x: 4300, y: 3700, type: 'organic_mass', resources: ['plastids', 'polymer_bundle'] },
        { x: 5100, y: 3780, type: 'organic_mass', resources: ['nano_spores', 'polymer_bundle'] },
        { x: 5800, y: 3700, type: 'organic_mass', resources: ['plastids', 'nano_spores'] },
        { x: 6500, y: 3750, type: 'organic_mass', resources: ['polymer_bundle', 'plastids'] },
        { x: 7400, y: 3700, type: 'organic_mass', resources: ['nano_spores', 'plastids'] }
      ],
      // 稀有资源点 (随机刷新)
      rareNodes: [
        { x: 2000, y: 3400, type: 'rare_container', spawnChance: 0.1 },
        { x: 4000, y: 3300, type: 'rare_container', spawnChance: 0.1 },
        { x: 6000, y: 3400, type: 'rare_container', spawnChance: 0.1 }
      ],
      // 鱼群
      fishingSpots: [
        { x: 2900, y: 3700, fishTypes: ['mortus_lungfish', 'cuthol', 'murkray'] },
        { x: 5600, y: 3650, fishTypes: ['norg', 'cuthol', 'mortus_lungfish'] }
      ]
    },

    // 据点/POI
    pointsOfInterest: {
      // Grineer营地
      grineerCamps: [
        { x: 800, y: 3700, size: 'small', enemyCount: [5, 8], loot: 'basic' },
        { x: 2400, y: 3600, size: 'medium', enemyCount: [10, 15], loot: 'standard' },
        { x: 4000, y: 3500, size: 'large', enemyCount: [15, 25], loot: 'good', hasBoss: false },
        { x: 5600, y: 3650, size: 'medium', enemyCount: [10, 15], loot: 'standard' },
        { x: 7200, y: 3600, size: 'small', enemyCount: [5, 8], loot: 'basic' }
      ],
      // 村庄/安全区
      villages: [
        { x: 100, y: 3800, name: 'cetus', displayName: '希图斯', isSafeZone: true }
      ],
      // Eidolon神殿 (夜间Boss)
      eidolonShrines: [
        { x: 4000, y: 3200, bossType: 'teralyst', nightOnly: true }
      ]
    },

    // 任务/赏金
    bounties: [
      {
        id: 'bounty_tier1',
        name: '初级赏金',
        enemyLevel: [5, 15],
        rewards: { credits: [2000, 5000], resources: ['ferrite', 'rubedo'], modChance: 0.1 }
      },
      {
        id: 'bounty_tier2',
        name: '中级赏金',
        enemyLevel: [15, 25],
        rewards: { credits: [5000, 10000], resources: ['morphics', 'neurodes'], modChance: 0.2 }
      },
      {
        id: 'bounty_tier3',
        name: '高级赏金',
        enemyLevel: [25, 40],
        rewards: { credits: [10000, 20000], resources: ['orokin_cell', 'neural_sensors'], modChance: 0.3 }
      }
    ],

    // 特有资源
    uniqueResources: ['cetus_wisp', 'eidolon_shard', 'breath_of_eidolon', 'heart_of_sentient']
  },

  // ========== 金星峡谷 ==========
  orb_vallis: {
    id: 'orb_vallis',
    name: 'Orb Vallis',
    displayName: '奥布山谷',
    planet: 'venus',
    description: '冰雪覆盖的Corpus采矿设施',
    unlockCondition: { type: 'mastery', level: 3 },

    mapSize: {
      width: 10000,
      height: 5000
    },

    environment: {
      backgroundColor: 0x1a2a3a,
      groundColor: 0x88aacc,
      skyColor: 0xaaccee,
      hasDayNightCycle: false,
      hasTemperature: true,
      coldDamageOutside: 5, // 每秒寒冷伤害
      warmZones: ['fortuna', 'caves'],
      weather: ['snowstorm', 'clear', 'blizzard']
    },

    terrain: {
      heightMap: [
        { x: 0, y: 4800 },
        { x: 1500, y: 4600 },
        { x: 3000, y: 4700 },
        { x: 4500, y: 4400 },
        { x: 6000, y: 4600 },
        { x: 7500, y: 4300 },
        { x: 9000, y: 4500 },
        { x: 10000, y: 4700 }
      ],
      platforms: [
        { x: 800, y: 4400, width: 400, height: 50, type: 'ice_cliff' },
        { x: 2000, y: 4300, width: 350, height: 45, type: 'ice_rock' },
        { x: 3200, y: 4200, width: 500, height: 60, type: 'corpus_structure' },
        { x: 4800, y: 4100, width: 450, height: 55, type: 'ice_cliff' },
        { x: 6200, y: 4250, width: 380, height: 50, type: 'corpus_structure' },
        { x: 7600, y: 4000, width: 420, height: 55, type: 'ice_cliff' },
        { x: 9200, y: 4300, width: 350, height: 45, type: 'ice_rock' }
      ],
      waterAreas: [
        { x: 1800, y: 4700, width: 800, depth: 150, frozen: true },
        { x: 5500, y: 4550, width: 600, depth: 120, frozen: false }
      ],
      caveEntrances: [
        { x: 2500, y: 4500, width: 130, height: 200, caveName: 'vallis_cave_a', isWarm: true },
        { x: 5000, y: 4400, width: 110, height: 170, caveName: 'vallis_cave_b', isWarm: true },
        { x: 7800, y: 4350, width: 140, height: 210, caveName: 'vallis_cave_c', isWarm: true }
      ]
    },

    resourceNodes: {
      oreDeposits: [
        { x: 1000, y: 4600, type: 'ore_deposit', resources: ['alloy_plate', 'polymer_bundle'] },
        { x: 2400, y: 4550, type: 'ore_deposit', resources: ['circuits', 'alloy_plate'] },
        { x: 3800, y: 4500, type: 'ore_deposit', resources: ['polymer_bundle', 'control_module'] },
        { x: 5200, y: 4450, type: 'ore_deposit', resources: ['alloy_plate', 'circuits'] },
        { x: 6600, y: 4500, type: 'ore_deposit', resources: ['polymer_bundle', 'alloy_plate'] },
        { x: 8000, y: 4400, type: 'ore_deposit', resources: ['circuits', 'control_module'] },
        { x: 9400, y: 4550, type: 'ore_deposit', resources: ['alloy_plate', 'polymer_bundle'] }
      ],
      techCaches: [
        { x: 1600, y: 4500, type: 'tech_cache', resources: ['circuits', 'control_module'] },
        { x: 3400, y: 4400, type: 'tech_cache', resources: ['neural_sensors', 'circuits'] },
        { x: 5800, y: 4350, type: 'tech_cache', resources: ['control_module', 'neural_sensors'] },
        { x: 8200, y: 4300, type: 'tech_cache', resources: ['circuits', 'control_module'] }
      ],
      rareNodes: [
        { x: 2800, y: 4200, type: 'rare_container', spawnChance: 0.12 },
        { x: 5400, y: 4100, type: 'rare_container', spawnChance: 0.12 },
        { x: 7400, y: 4150, type: 'rare_container', spawnChance: 0.12 }
      ]
    },

    pointsOfInterest: {
      corpusBases: [
        { x: 1200, y: 4550, size: 'small', enemyCount: [8, 12], loot: 'tech' },
        { x: 3000, y: 4400, size: 'large', enemyCount: [20, 30], loot: 'high_tech', hasBoss: true },
        { x: 5000, y: 4300, size: 'medium', enemyCount: [12, 18], loot: 'tech' },
        { x: 7000, y: 4250, size: 'large', enemyCount: [20, 30], loot: 'high_tech', hasBoss: true },
        { x: 9000, y: 4400, size: 'small', enemyCount: [8, 12], loot: 'tech' }
      ],
      villages: [
        { x: 150, y: 4800, name: 'fortuna', displayName: '福尔图娜', isSafeZone: true, isWarm: true }
      ],
      orbMothers: [
        { x: 4500, y: 3800, bossType: 'profit_taker', requiresHeist: true },
        { x: 8500, y: 3900, bossType: 'exploiter_orb', requiresHeist: true }
      ]
    },

    bounties: [
      {
        id: 'vallis_bounty_1',
        name: '初级悬赏',
        enemyLevel: [10, 20],
        rewards: { credits: [3000, 7000], resources: ['alloy_plate', 'circuits'], modChance: 0.15 }
      },
      {
        id: 'vallis_bounty_2',
        name: '中级悬赏',
        enemyLevel: [20, 35],
        rewards: { credits: [7000, 15000], resources: ['control_module', 'neural_sensors'], modChance: 0.25 }
      },
      {
        id: 'vallis_bounty_3',
        name: '高级悬赏',
        enemyLevel: [35, 50],
        rewards: { credits: [15000, 30000], resources: ['orokin_cell', 'tellurium'], modChance: 0.35 }
      }
    ],

    uniqueResources: ['toroids', 'debt_bonds', 'atmo_systems', 'gyromag_systems']
  },

  // ========== 火卫二荒地 ==========
  cambion_drift: {
    id: 'cambion_drift',
    name: 'Cambion Drift',
    displayName: '魔胎之境',
    planet: 'deimos',
    description: '被Infested完全侵蚀的火卫二表面',
    unlockCondition: { type: 'mastery', level: 5 },

    mapSize: {
      width: 7000,
      height: 3500
    },

    environment: {
      backgroundColor: 0x2a1a2a,
      groundColor: 0x553355,
      skyColor: 0x442244,
      hasDayNightCycle: true,
      dayLength: 400000,  // Vome (白天)
      nightLength: 400000, // Fass (夜晚)
      toxicZones: true,
      toxicDamage: 8
    },

    terrain: {
      heightMap: [
        { x: 0, y: 3300 },
        { x: 1000, y: 3100 },
        { x: 2000, y: 3250 },
        { x: 3000, y: 3000 },
        { x: 4000, y: 3150 },
        { x: 5000, y: 2900 },
        { x: 6000, y: 3100 },
        { x: 7000, y: 3200 }
      ],
      platforms: [
        { x: 600, y: 3000, width: 350, height: 50, type: 'infested_mass' },
        { x: 1500, y: 2850, width: 400, height: 55, type: 'bone_structure' },
        { x: 2400, y: 2700, width: 320, height: 45, type: 'infested_mass' },
        { x: 3300, y: 2600, width: 450, height: 60, type: 'orokin_ruin' },
        { x: 4200, y: 2750, width: 380, height: 50, type: 'bone_structure' },
        { x: 5100, y: 2550, width: 420, height: 55, type: 'infested_mass' },
        { x: 6000, y: 2700, width: 350, height: 50, type: 'orokin_ruin' }
      ],
      toxicPools: [
        { x: 1200, y: 3200, width: 400, damage: 15 },
        { x: 3600, y: 3050, width: 500, damage: 20 },
        { x: 5500, y: 3000, width: 350, damage: 15 }
      ],
      caveEntrances: [
        { x: 1800, y: 3100, width: 100, height: 160, caveName: 'drift_cave_a' },
        { x: 4000, y: 2950, width: 120, height: 180, caveName: 'drift_cave_b' },
        { x: 6200, y: 3000, width: 110, height: 170, caveName: 'drift_cave_c' }
      ]
    },

    resourceNodes: {
      infestedNodes: [
        { x: 500, y: 3250, type: 'organic_mass', resources: ['mutagen_sample', 'nano_spores'] },
        { x: 1300, y: 3150, type: 'organic_mass', resources: ['plastids', 'mutagen_sample'] },
        { x: 2100, y: 3200, type: 'organic_mass', resources: ['nano_spores', 'neurodes'] },
        { x: 2900, y: 3000, type: 'organic_mass', resources: ['mutagen_sample', 'plastids'] },
        { x: 3700, y: 3100, type: 'organic_mass', resources: ['nano_spores', 'mutagen_sample'] },
        { x: 4500, y: 2950, type: 'organic_mass', resources: ['plastids', 'neurodes'] },
        { x: 5300, y: 3050, type: 'organic_mass', resources: ['mutagen_sample', 'nano_spores'] },
        { x: 6100, y: 3100, type: 'organic_mass', resources: ['neurodes', 'plastids'] }
      ],
      crystalNodes: [
        { x: 800, y: 3100, type: 'crystal_formation', resources: ['rubedo', 'orokin_cell'] },
        { x: 2500, y: 2950, type: 'crystal_formation', resources: ['argon_crystal', 'rubedo'] },
        { x: 4200, y: 2850, type: 'crystal_formation', resources: ['orokin_cell', 'argon_crystal'] },
        { x: 5800, y: 2950, type: 'crystal_formation', resources: ['rubedo', 'orokin_cell'] }
      ],
      rareNodes: [
        { x: 1600, y: 2800, type: 'rare_container', spawnChance: 0.15 },
        { x: 3500, y: 2700, type: 'rare_container', spawnChance: 0.15 },
        { x: 5400, y: 2600, type: 'rare_container', spawnChance: 0.15 }
      ]
    },

    pointsOfInterest: {
      infestedHives: [
        { x: 700, y: 3200, size: 'small', enemyCount: [10, 15], loot: 'infested' },
        { x: 2000, y: 3050, size: 'medium', enemyCount: [18, 25], loot: 'infested' },
        { x: 3400, y: 2900, size: 'large', enemyCount: [30, 40], loot: 'infested_rare', hasBoss: true },
        { x: 4800, y: 2950, size: 'medium', enemyCount: [18, 25], loot: 'infested' },
        { x: 6300, y: 3050, size: 'small', enemyCount: [10, 15], loot: 'infested' }
      ],
      villages: [
        { x: 100, y: 3350, name: 'necralisk', displayName: '亡者殿堂', isSafeZone: true }
      ],
      wormBosses: [
        { x: 3500, y: 2500, bossType: 'vault_guardian', vaultRequired: true }
      ]
    },

    bounties: [
      {
        id: 'drift_bounty_1',
        name: '初级净化',
        enemyLevel: [15, 25],
        rewards: { credits: [4000, 9000], resources: ['mutagen_sample', 'nano_spores'], modChance: 0.15 }
      },
      {
        id: 'drift_bounty_2',
        name: '中级净化',
        enemyLevel: [25, 40],
        rewards: { credits: [9000, 18000], resources: ['neurodes', 'orokin_cell'], modChance: 0.25 }
      },
      {
        id: 'drift_bounty_3',
        name: '高级净化',
        enemyLevel: [40, 60],
        rewards: { credits: [18000, 35000], resources: ['argon_crystal', 'neural_sensors'], modChance: 0.4 }
      }
    ],

    uniqueResources: ['son_tokens', 'mother_tokens', 'grandmother_tokens', 'scintillant', 'ganglion']
  }
}

// ========== 洞穴地图 ==========
export const CAVES = {
  cave_a: {
    id: 'cave_a',
    name: '隐秘洞穴 A',
    parentWorld: 'plains_of_eidolon',
    size: { width: 1500, height: 800 },
    resources: ['rubedo', 'neurodes', 'morphics'],
    enemyTypes: ['grineer'],
    hasRareSpawn: true
  },
  cave_b: {
    id: 'cave_b',
    name: '深层矿洞 B',
    parentWorld: 'plains_of_eidolon',
    size: { width: 2000, height: 1000 },
    resources: ['ferrite', 'orokin_cell', 'neurodes'],
    enemyTypes: ['grineer'],
    hasRareSpawn: true
  },
  vallis_cave_a: {
    id: 'vallis_cave_a',
    name: '冰晶洞窟',
    parentWorld: 'orb_vallis',
    size: { width: 1800, height: 900 },
    resources: ['circuits', 'control_module', 'polymer_bundle'],
    enemyTypes: ['corpus'],
    isWarm: true
  }
}

// ========== 采集系统配置 ==========
export const GATHERING_CONFIG = {
  // 采集工具
  tools: {
    mining_laser: {
      id: 'mining_laser',
      name: '采矿镭射枪',
      displayName: '采矿镭射枪',
      type: 'mining',
      tier: 1,
      efficiency: 1.0,
      rareBonus: 0
    },
    advanced_mining_laser: {
      id: 'advanced_mining_laser',
      name: '进阶采矿镭射枪',
      displayName: '进阶采矿镭射枪',
      type: 'mining',
      tier: 2,
      efficiency: 1.5,
      rareBonus: 0.1
    },
    fishing_spear: {
      id: 'fishing_spear',
      name: '钓鱼矛',
      displayName: '钓鱼矛',
      type: 'fishing',
      tier: 1,
      catchRate: 1.0
    },
    conservation_trap: {
      id: 'conservation_trap',
      name: '保育陷阱',
      displayName: '保育陷阱',
      type: 'conservation',
      tier: 1
    }
  },

  // 采集小游戏配置
  miningMinigame: {
    perfectBonus: 2.0,    // 完美采集奖励倍率
    goodBonus: 1.5,
    normalBonus: 1.0,
    failPenalty: 0.5,
    timeLimit: 5000       // 5秒时限
  },

  // 资源节点重生时间 (毫秒)
  respawnTimes: {
    ore_deposit: 120000,      // 2分钟
    organic_mass: 90000,      // 1.5分钟
    tech_cache: 180000,       // 3分钟
    crystal_formation: 150000, // 2.5分钟
    rare_container: 600000    // 10分钟
  }
}

// ========== 开放世界事件 ==========
export const WORLD_EVENTS = {
  eidolon_hunt: {
    id: 'eidolon_hunt',
    name: 'Eidolon狩猎',
    world: 'plains_of_eidolon',
    timeRestriction: 'night',
    bossSequence: ['teralyst', 'gantulyst', 'hydrolyst'],
    rewards: {
      arcanes: ['arcane_energize', 'arcane_guardian', 'arcane_grace'],
      resources: ['eidolon_shard', 'brilliant_eidolon_shard', 'radiant_eidolon_shard']
    }
  },
  thermia_fractures: {
    id: 'thermia_fractures',
    name: '热能裂缝',
    world: 'orb_vallis',
    periodic: true,
    duration: 604800000, // 一周
    rewards: {
      special: ['opticor_vandal_parts'],
      resources: ['diluted_thermia']
    }
  },
  plague_star: {
    id: 'plague_star',
    name: '瘟疫之星',
    world: 'plains_of_eidolon',
    periodic: true,
    duration: 604800000,
    rewards: {
      special: ['plague_weapons', 'plague_zaw_parts'],
      resources: ['infested_catalyst', 'eidolon_phylaxis']
    }
  }
}

// 获取开放世界数据
export function getOpenWorld(worldId) {
  return OPEN_WORLDS[worldId] || null
}

// 获取当前时间段 (日/夜)
export function getWorldTimePhase(worldId, currentTime) {
  const world = OPEN_WORLDS[worldId]
  if (!world?.environment.hasDayNightCycle) return 'day'

  const cycleLength = world.environment.dayLength + world.environment.nightLength
  const timeInCycle = currentTime % cycleLength

  return timeInCycle < world.environment.dayLength ? 'day' : 'night'
}

// 获取资源节点
export function getResourceNodesInRange(worldId, x, y, range) {
  const world = OPEN_WORLDS[worldId]
  if (!world) return []

  const nodes = []
  const allNodes = [
    ...(world.resourceNodes.oreDeposits || []),
    ...(world.resourceNodes.plantNodes || []),
    ...(world.resourceNodes.infestedNodes || []),
    ...(world.resourceNodes.techCaches || []),
    ...(world.resourceNodes.crystalNodes || []),
    ...(world.resourceNodes.rareNodes || [])
  ]

  allNodes.forEach(node => {
    const dist = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
    if (dist <= range) {
      nodes.push({ ...node, distance: dist })
    }
  })

  return nodes.sort((a, b) => a.distance - b.distance)
}
