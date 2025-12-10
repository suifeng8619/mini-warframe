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
      return { lancer: 40, butcher: 30, crewman: 20, charger: 10 }
    } else if (waveNumber <= 6) {
      return { lancer: 25, butcher: 20, crewman: 20, moa: 15, charger: 15, runner: 5 }
    } else if (waveNumber <= 10) {
      return { lancer: 15, butcher: 15, heavy_gunner: 15, crewman: 15, moa: 15, charger: 15, runner: 10 }
    } else {
      return { lancer: 10, butcher: 10, heavy_gunner: 15, crewman: 10, moa: 15, charger: 15, runner: 15, ancient: 10 }
    }
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
