// 敌人数据配置
export const ENEMIES = {
  // ========== Grineer 敌人 ==========
  lancer: {
    id: 'lancer',
    name: 'Grineer Lancer',
    displayName: 'Grineer枪兵',
    faction: 'grineer',
    type: 'infantry',
    baseStats: {
      health: 100,
      armor: 100,
      damage: 15,
      speed: 80,
      attackRange: 400,
      attackRate: 1500, // 攻击间隔ms
      detectionRange: 500,
      xpReward: 50
    },
    behavior: 'ranged', // ranged, melee, charger
    color: 0xcc4444
  },

  butcher: {
    id: 'butcher',
    name: 'Grineer Butcher',
    displayName: 'Grineer屠夫',
    faction: 'grineer',
    type: 'melee',
    baseStats: {
      health: 80,
      armor: 50,
      damage: 35,
      speed: 120,
      attackRange: 50,
      attackRate: 800,
      detectionRange: 400,
      xpReward: 40
    },
    behavior: 'melee',
    color: 0xaa3333
  },

  heavy_gunner: {
    id: 'heavy_gunner',
    name: 'Grineer Heavy Gunner',
    displayName: 'Grineer重型枪手',
    faction: 'grineer',
    type: 'heavy',
    baseStats: {
      health: 400,
      armor: 300,
      damage: 25,
      speed: 50,
      attackRange: 500,
      attackRate: 200, // 高射速
      detectionRange: 600,
      xpReward: 150
    },
    behavior: 'ranged',
    color: 0x882222
  },

  // ========== Corpus 敌人 ==========
  crewman: {
    id: 'crewman',
    name: 'Corpus Crewman',
    displayName: 'Corpus船员',
    faction: 'corpus',
    type: 'infantry',
    baseStats: {
      health: 60,
      shield: 100,
      armor: 0,
      damage: 20,
      speed: 90,
      attackRange: 450,
      attackRate: 1200,
      detectionRange: 500,
      xpReward: 55
    },
    behavior: 'ranged',
    color: 0x4488cc
  },

  moa: {
    id: 'moa',
    name: 'Corpus MOA',
    displayName: 'Corpus MOA',
    faction: 'corpus',
    type: 'robotic',
    baseStats: {
      health: 100,
      shield: 50,
      armor: 25,
      damage: 18,
      speed: 100,
      attackRange: 350,
      attackRate: 1000,
      detectionRange: 450,
      xpReward: 60
    },
    behavior: 'ranged',
    color: 0x66aadd
  },

  // ========== Infested 敌人 ==========
  charger: {
    id: 'charger',
    name: 'Infested Charger',
    displayName: '感染冲锋者',
    faction: 'infested',
    type: 'melee',
    baseStats: {
      health: 120,
      armor: 25,
      damage: 40,
      speed: 150,
      attackRange: 40,
      attackRate: 600,
      detectionRange: 350,
      xpReward: 35
    },
    behavior: 'charger', // 特殊行为：冲向玩家
    color: 0x66aa44
  },

  runner: {
    id: 'runner',
    name: 'Infested Runner',
    displayName: '感染奔跑者',
    faction: 'infested',
    type: 'melee',
    baseStats: {
      health: 60,
      armor: 0,
      damage: 25,
      speed: 200,
      attackRange: 30,
      attackRate: 500,
      detectionRange: 300,
      xpReward: 25
    },
    behavior: 'charger',
    color: 0x88cc66
  },

  ancient: {
    id: 'ancient',
    name: 'Infested Ancient',
    displayName: '远古感染者',
    faction: 'infested',
    type: 'heavy',
    baseStats: {
      health: 600,
      armor: 50,
      damage: 80,
      speed: 60,
      attackRange: 80,
      attackRate: 1500,
      detectionRange: 400,
      xpReward: 200
    },
    behavior: 'melee',
    auraEffect: { // 给附近友方加buff
      range: 150,
      damageReduction: 0.3
    },
    color: 0x448822
  },

  // ========== 新增Grineer敌人 ==========
  scorpion: {
    id: 'scorpion',
    name: 'Grineer Scorpion',
    displayName: 'Grineer蝎子',
    faction: 'grineer',
    type: 'special',
    baseStats: {
      health: 150,
      armor: 100,
      damage: 30,
      speed: 100,
      attackRange: 250,
      attackRate: 2000,
      detectionRange: 400,
      xpReward: 80
    },
    behavior: 'grappler', // 特殊行为：发射钩爪拉玩家
    grappleRange: 250,
    pullForce: 400,
    color: 0xdd5555
  },

  bombard: {
    id: 'bombard',
    name: 'Grineer Bombard',
    displayName: 'Grineer轰炸兵',
    faction: 'grineer',
    type: 'heavy',
    baseStats: {
      health: 500,
      armor: 400,
      damage: 100,
      speed: 40,
      attackRange: 600,
      attackRate: 3000,
      detectionRange: 700,
      xpReward: 200
    },
    behavior: 'ranged',
    projectileType: 'rocket', // 发射火箭弹
    explosionRadius: 80,
    color: 0x772222
  },

  napalm: {
    id: 'napalm',
    name: 'Grineer Napalm',
    displayName: 'Grineer燃烧兵',
    faction: 'grineer',
    type: 'heavy',
    baseStats: {
      health: 450,
      armor: 350,
      damage: 60,
      speed: 45,
      attackRange: 400,
      attackRate: 2500,
      detectionRange: 550,
      xpReward: 180
    },
    behavior: 'ranged',
    projectileType: 'fireball',
    burnDamage: 20,
    burnDuration: 3000,
    color: 0xff5500
  },

  // ========== 新增Corpus敌人 ==========
  tech: {
    id: 'tech',
    name: 'Corpus Tech',
    displayName: 'Corpus技师',
    faction: 'corpus',
    type: 'special',
    baseStats: {
      health: 80,
      shield: 150,
      armor: 0,
      damage: 25,
      speed: 70,
      attackRange: 400,
      attackRate: 1500,
      detectionRange: 500,
      xpReward: 100
    },
    behavior: 'summoner', // 召唤MOA
    summonCooldown: 8000,
    maxSummons: 2,
    color: 0x3366aa
  },

  osprey: {
    id: 'osprey',
    name: 'Corpus Osprey',
    displayName: 'Corpus鱼鹰无人机',
    faction: 'corpus',
    type: 'drone',
    baseStats: {
      health: 50,
      shield: 80,
      armor: 0,
      damage: 15,
      speed: 130,
      attackRange: 300,
      attackRate: 1000,
      detectionRange: 400,
      xpReward: 45
    },
    behavior: 'flying', // 飞行单位
    hoverHeight: 100,
    color: 0x88bbee
  },

  nullifier: {
    id: 'nullifier',
    name: 'Corpus Nullifier',
    displayName: 'Corpus空能使',
    faction: 'corpus',
    type: 'special',
    baseStats: {
      health: 100,
      shield: 200,
      armor: 0,
      damage: 20,
      speed: 60,
      attackRange: 400,
      attackRate: 1500,
      detectionRange: 500,
      xpReward: 150
    },
    behavior: 'ranged',
    bubbleHealth: 500, // 护盾气泡血量
    bubbleRadius: 100,
    nullifyAbilities: true, // 在气泡内无法使用技能
    color: 0x2255aa
  },

  // ========== 新增Infested敌人 ==========
  leaper: {
    id: 'leaper',
    name: 'Infested Leaper',
    displayName: '感染跳跃者',
    faction: 'infested',
    type: 'melee',
    baseStats: {
      health: 80,
      armor: 15,
      damage: 45,
      speed: 140,
      attackRange: 40,
      attackRate: 700,
      detectionRange: 350,
      xpReward: 40
    },
    behavior: 'leaper', // 跳跃攻击
    leapRange: 200,
    leapDamageMultiplier: 1.5,
    color: 0x99dd77
  },

  toxic_ancient: {
    id: 'toxic_ancient',
    name: 'Toxic Ancient',
    displayName: '毒素远古',
    faction: 'infested',
    type: 'heavy',
    baseStats: {
      health: 550,
      armor: 40,
      damage: 70,
      speed: 55,
      attackRange: 100,
      attackRate: 1800,
      detectionRange: 400,
      xpReward: 220
    },
    behavior: 'melee',
    toxicAura: {
      range: 120,
      damagePerSecond: 15
    },
    color: 0x33aa22
  },

  brood_mother: {
    id: 'brood_mother',
    name: 'Infested Brood Mother',
    displayName: '感染育母',
    faction: 'infested',
    type: 'special',
    baseStats: {
      health: 400,
      armor: 30,
      damage: 50,
      speed: 50,
      attackRange: 60,
      attackRate: 1500,
      detectionRange: 350,
      xpReward: 180
    },
    behavior: 'summoner',
    summonCooldown: 5000,
    summonType: 'runner',
    maxSummons: 4,
    color: 0x557733
  }
}

// ========== BOSS配置 ==========
export const BOSSES = {
  captain_vor: {
    id: 'captain_vor',
    name: 'Captain Vor',
    displayName: 'Vor上尉',
    faction: 'grineer',
    description: 'Grineer舰队指挥官，持有Orokin科技',
    baseStats: {
      health: 3000,
      armor: 500,
      damage: 80,
      speed: 70,
      attackRange: 500,
      attackRate: 1000,
      detectionRange: 800,
      xpReward: 2000
    },
    phases: [
      { healthThreshold: 1.0, behavior: 'ranged', attackPattern: 'normal' },
      { healthThreshold: 0.6, behavior: 'teleport', attackPattern: 'burst' },
      { healthThreshold: 0.3, behavior: 'berserk', attackPattern: 'rapid' }
    ],
    abilities: [
      { id: 'vor_beam', damage: 150, cooldown: 5000, type: 'beam', range: 400 },
      { id: 'vor_teleport', cooldown: 8000, type: 'teleport' },
      { id: 'vor_shield', duration: 3000, cooldown: 15000, type: 'shield' }
    ],
    color: 0xffcc00
  },

  jackal: {
    id: 'jackal',
    name: 'Jackal',
    displayName: '豺狼',
    faction: 'corpus',
    description: 'Corpus重型作战机甲',
    baseStats: {
      health: 4000,
      shield: 1000,
      armor: 300,
      damage: 60,
      speed: 50,
      attackRange: 600,
      attackRate: 500,
      detectionRange: 900,
      xpReward: 2500
    },
    phases: [
      { healthThreshold: 1.0, behavior: 'artillery', legVulnerable: true },
      { healthThreshold: 0.5, behavior: 'stunned', duration: 5000 },
      { healthThreshold: 0.5, behavior: 'enraged', attackSpeedMultiplier: 1.5 }
    ],
    abilities: [
      { id: 'jackal_stomp', damage: 200, cooldown: 8000, type: 'aoe', radius: 150 },
      { id: 'jackal_missiles', damage: 80, cooldown: 6000, type: 'missile', count: 4 },
      { id: 'jackal_laser', damage: 50, cooldown: 3000, type: 'sweep', angle: 120 }
    ],
    weakPoints: ['front_left_leg', 'front_right_leg', 'back_left_leg', 'back_right_leg'],
    color: 0x4488ff
  },

  phorid: {
    id: 'phorid',
    name: 'Phorid',
    displayName: '恐惧之源',
    faction: 'infested',
    description: '巨型感染体，入侵舰船的首领',
    baseStats: {
      health: 3500,
      armor: 200,
      damage: 120,
      speed: 80,
      attackRange: 150,
      attackRate: 1200,
      detectionRange: 700,
      xpReward: 2200
    },
    phases: [
      { healthThreshold: 1.0, behavior: 'aggressive', spawnRate: 'low' },
      { healthThreshold: 0.7, behavior: 'defensive', spawnRate: 'medium' },
      { healthThreshold: 0.4, behavior: 'frenzy', spawnRate: 'high' }
    ],
    abilities: [
      { id: 'phorid_scream', damage: 0, cooldown: 10000, type: 'fear', duration: 3000, range: 300 },
      { id: 'phorid_swipe', damage: 180, cooldown: 2000, type: 'melee', arc: 90 },
      { id: 'phorid_spawn', cooldown: 12000, type: 'summon', summonType: 'charger', count: 3 }
    ],
    color: 0x66dd44
  }
}

// 波次配置
export const WAVE_CONFIG = {
  baseEnemyCount: 5,
  enemyCountPerWave: 3,
  maxEnemiesOnScreen: 20,
  spawnInterval: 2000, // ms
  waveBreakTime: 5000, // ms

  // 每波敌人类型权重
  getEnemyWeights: (waveNumber) => {
    if (waveNumber <= 3) {
      // 简单波次：基础单位
      return { lancer: 40, butcher: 30, crewman: 20, charger: 10 }
    } else if (waveNumber <= 6) {
      // 中等波次：引入更多单位
      return { lancer: 20, butcher: 15, crewman: 15, moa: 15, charger: 15, runner: 10, osprey: 10 }
    } else if (waveNumber <= 10) {
      // 困难波次：重型和特殊单位
      return {
        lancer: 10, butcher: 10, heavy_gunner: 12, crewman: 10, moa: 12,
        charger: 12, runner: 10, scorpion: 8, osprey: 8, leaper: 8
      }
    } else if (waveNumber <= 15) {
      // 精英波次：更多精英单位
      return {
        lancer: 8, butcher: 8, heavy_gunner: 10, crewman: 8, moa: 10,
        charger: 10, runner: 8, scorpion: 8, bombard: 6, tech: 6,
        osprey: 6, leaper: 6, ancient: 6
      }
    } else {
      // 终极波次：所有单位类型
      return {
        lancer: 5, butcher: 5, heavy_gunner: 8, bombard: 6, napalm: 6, scorpion: 6,
        crewman: 5, moa: 8, tech: 5, osprey: 6, nullifier: 5,
        charger: 6, runner: 6, leaper: 6, ancient: 6, toxic_ancient: 5, brood_mother: 6
      }
    }
  },

  // Boss波次配置
  getBossWave: (waveNumber) => {
    if (waveNumber === 5) return 'captain_vor'
    if (waveNumber === 10) return 'jackal'
    if (waveNumber === 15) return 'phorid'
    if (waveNumber % 10 === 0 && waveNumber > 15) {
      // 每10波随机一个Boss
      const bosses = ['captain_vor', 'jackal', 'phorid']
      return bosses[Math.floor(Math.random() * bosses.length)]
    }
    return null
  },

  // 敌人等级缩放
  getLevelMultiplier: (waveNumber) => {
    return 1 + (waveNumber - 1) * 0.15
  }
}

// 根据权重随机选择敌人类型
export function getRandomEnemyType(waveNumber) {
  const weights = WAVE_CONFIG.getEnemyWeights(waveNumber)
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (const [enemyType, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return enemyType
    }
  }

  return 'lancer' // fallback
}
