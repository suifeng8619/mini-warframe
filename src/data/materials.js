// 材料/资源数据配置
export const MATERIALS = {
  // ========== 通用材料 ==========
  credits: {
    id: 'credits',
    name: 'Credits',
    displayName: '星币',
    description: '通用货币',
    type: 'currency',
    rarity: 'common',
    maxStack: 999999999,
    icon: 'credit_icon',
    color: 0xffcc00
  },

  endo: {
    id: 'endo',
    name: 'Endo',
    displayName: '内融核心',
    description: '用于升级MOD',
    type: 'currency',
    rarity: 'common',
    maxStack: 999999,
    icon: 'endo_icon',
    color: 0x88ccff
  },

  // ========== 基础资源 ==========
  ferrite: {
    id: 'ferrite',
    name: 'Ferrite',
    displayName: '铁氧体',
    description: '常见的金属矿石，广泛用于制造',
    type: 'resource',
    rarity: 'common',
    maxStack: 99999,
    dropLocations: ['earth', 'mercury', 'void'],
    color: 0x888888
  },

  nano_spores: {
    id: 'nano_spores',
    name: 'Nano Spores',
    displayName: '纳米孢子',
    description: 'Infested生物的有机物质',
    type: 'resource',
    rarity: 'common',
    maxStack: 99999,
    dropLocations: ['saturn', 'neptune', 'eris', 'ceres'],
    color: 0x66aa44
  },

  alloy_plate: {
    id: 'alloy_plate',
    name: 'Alloy Plate',
    displayName: '合金板',
    description: '强化合金，用于装甲制造',
    type: 'resource',
    rarity: 'common',
    maxStack: 99999,
    dropLocations: ['venus', 'jupiter', 'sedna', 'pluto'],
    color: 0xaaaacc
  },

  salvage: {
    id: 'salvage',
    name: 'Salvage',
    displayName: '回收金属',
    description: '从废弃设备回收的金属',
    type: 'resource',
    rarity: 'common',
    maxStack: 99999,
    dropLocations: ['mars', 'jupiter', 'sedna'],
    color: 0x665544
  },

  polymer_bundle: {
    id: 'polymer_bundle',
    name: 'Polymer Bundle',
    displayName: '聚合物束',
    description: '高分子聚合物材料',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 50000,
    dropLocations: ['venus', 'uranus', 'mercury'],
    color: 0x44aaff
  },

  plastids: {
    id: 'plastids',
    name: 'Plastids',
    displayName: '塑钢',
    description: '有机塑料合成物',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 50000,
    dropLocations: ['saturn', 'uranus', 'pluto', 'eris'],
    color: 0x448844
  },

  circuits: {
    id: 'circuits',
    name: 'Circuits',
    displayName: '电路',
    description: '电子元件和芯片',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 50000,
    dropLocations: ['venus', 'ceres'],
    color: 0xffaa00
  },

  rubedo: {
    id: 'rubedo',
    name: 'Rubedo',
    displayName: '红化结晶',
    description: '红色晶体矿物',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 50000,
    dropLocations: ['earth', 'europa', 'sedna', 'void'],
    color: 0xff4444
  },

  // ========== 稀有资源 ==========
  morphics: {
    id: 'morphics',
    name: 'Morphics',
    displayName: '变形塑基',
    description: '可塑性极强的稀有材料',
    type: 'resource',
    rarity: 'rare',
    maxStack: 1000,
    dropLocations: ['mercury', 'mars', 'europa'],
    dropChance: 0.03,
    color: 0x8844aa
  },

  neurodes: {
    id: 'neurodes',
    name: 'Neurodes',
    displayName: '神经元',
    description: '神经系统核心组件',
    type: 'resource',
    rarity: 'rare',
    maxStack: 1000,
    dropLocations: ['earth', 'eris', 'lua'],
    dropChance: 0.02,
    color: 0x44ff88
  },

  gallium: {
    id: 'gallium',
    name: 'Gallium',
    displayName: '镓',
    description: '稀有金属元素',
    type: 'resource',
    rarity: 'rare',
    maxStack: 1000,
    dropLocations: ['mars', 'uranus'],
    dropChance: 0.03,
    color: 0xcccccc
  },

  control_module: {
    id: 'control_module',
    name: 'Control Module',
    displayName: '控制模块',
    description: 'Corpus科技核心组件',
    type: 'resource',
    rarity: 'rare',
    maxStack: 1000,
    dropLocations: ['europa', 'neptune', 'void'],
    dropChance: 0.025,
    color: 0x4488ff
  },

  neural_sensors: {
    id: 'neural_sensors',
    name: 'Neural Sensors',
    displayName: '神经传感器',
    description: '高级感应设备',
    type: 'resource',
    rarity: 'rare',
    maxStack: 500,
    dropLocations: ['jupiter', 'lua'],
    dropChance: 0.02,
    color: 0xff88ff
  },

  orokin_cell: {
    id: 'orokin_cell',
    name: 'Orokin Cell',
    displayName: 'Orokin电池',
    description: '古老文明的能量核心',
    type: 'resource',
    rarity: 'rare',
    maxStack: 500,
    dropLocations: ['saturn', 'ceres', 'void'],
    dropChance: 0.015,
    color: 0xffdd88
  },

  argon_crystal: {
    id: 'argon_crystal',
    name: 'Argon Crystal',
    displayName: '氩结晶',
    description: '虚空特有结晶，会随时间衰变',
    type: 'resource',
    rarity: 'rare',
    maxStack: 100,
    dropLocations: ['void'],
    dropChance: 0.02,
    decayTime: 86400000, // 24小时后消失
    color: 0xaaffff
  },

  tellurium: {
    id: 'tellurium',
    name: 'Tellurium',
    displayName: '碲',
    description: '深海特有稀有矿物',
    type: 'resource',
    rarity: 'rare',
    maxStack: 500,
    dropLocations: ['uranus'],
    dropChance: 0.01,
    color: 0x44dddd
  },

  // ========== 部件蓝图 ==========
  nitain_extract: {
    id: 'nitain_extract',
    name: 'Nitain Extract',
    displayName: '硝酸精华',
    description: '稀有化学物质，用于高级制造',
    type: 'resource',
    rarity: 'legendary',
    maxStack: 100,
    source: 'nightwave', // 特殊获取途径
    color: 0xffff00
  },

  forma: {
    id: 'forma',
    name: 'Forma',
    displayName: 'Forma',
    description: '可以改变装备极性插槽',
    type: 'component',
    rarity: 'rare',
    maxStack: 50,
    dropLocations: ['void'],
    dropChance: 0.05,
    color: 0xffcc44
  },

  reactor: {
    id: 'reactor',
    name: 'Orokin Reactor',
    displayName: 'Orokin反应堆',
    description: '使战甲MOD容量翻倍',
    type: 'component',
    rarity: 'legendary',
    maxStack: 20,
    source: 'special',
    color: 0x4488ff
  },

  catalyst: {
    id: 'catalyst',
    name: 'Orokin Catalyst',
    displayName: 'Orokin催化剂',
    description: '使武器MOD容量翻倍',
    type: 'component',
    rarity: 'legendary',
    maxStack: 20,
    source: 'special',
    color: 0xffcc00
  },

  // ========== 敌人掉落材料 ==========
  grineer_key: {
    id: 'grineer_key',
    name: 'Grineer Cipher',
    displayName: 'Grineer密钥',
    description: 'Grineer加密钥匙，用于解锁特殊任务',
    type: 'key',
    rarity: 'uncommon',
    maxStack: 50,
    dropFrom: ['grineer'],
    color: 0xcc4444
  },

  corpus_key: {
    id: 'corpus_key',
    name: 'Corpus Cipher',
    displayName: 'Corpus密钥',
    description: 'Corpus加密钥匙，用于解锁特殊任务',
    type: 'key',
    rarity: 'uncommon',
    maxStack: 50,
    dropFrom: ['corpus'],
    color: 0x4488cc
  },

  mutagen_sample: {
    id: 'mutagen_sample',
    name: 'Mutagen Sample',
    displayName: '突变原样本',
    description: 'Infested基因样本',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 10000,
    dropFrom: ['infested'],
    color: 0x66aa44
  },

  // ========== 采集节点资源 ==========
  cryotic: {
    id: 'cryotic',
    name: 'Cryotic',
    displayName: '低温聚合物',
    description: '从挖掘任务获得的冷冻材料',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 99999,
    source: 'excavation',
    color: 0x88ddff
  },

  oxium: {
    id: 'oxium',
    name: 'Oxium',
    displayName: '氧化物',
    description: 'Corpus无人机携带的轻质合金',
    type: 'resource',
    rarity: 'uncommon',
    maxStack: 50000,
    dropFrom: ['osprey'],
    color: 0xddddff
  },

  kuva: {
    id: 'kuva',
    name: 'Kuva',
    displayName: '赤毒',
    description: 'Grineer皇后的血液，用于强化武器',
    type: 'resource',
    rarity: 'rare',
    maxStack: 999999,
    source: 'kuva_mission',
    color: 0xff2200
  }
}

// 材料掉落配置 - 按星球
export const PLANET_RESOURCES = {
  earth: {
    common: ['ferrite', 'rubedo'],
    rare: ['neurodes']
  },
  venus: {
    common: ['alloy_plate', 'polymer_bundle', 'circuits'],
    rare: []
  },
  mercury: {
    common: ['ferrite', 'polymer_bundle'],
    rare: ['morphics']
  },
  mars: {
    common: ['salvage'],
    rare: ['morphics', 'gallium']
  },
  jupiter: {
    common: ['alloy_plate', 'salvage'],
    rare: ['neural_sensors']
  },
  saturn: {
    common: ['nano_spores', 'plastids'],
    rare: ['orokin_cell']
  },
  uranus: {
    common: ['polymer_bundle', 'plastids'],
    rare: ['gallium', 'tellurium']
  },
  neptune: {
    common: ['nano_spores'],
    rare: ['control_module']
  },
  pluto: {
    common: ['alloy_plate', 'plastids'],
    rare: []
  },
  ceres: {
    common: ['nano_spores', 'circuits'],
    rare: ['orokin_cell']
  },
  europa: {
    common: ['rubedo'],
    rare: ['morphics', 'control_module']
  },
  eris: {
    common: ['nano_spores', 'plastids'],
    rare: ['neurodes']
  },
  sedna: {
    common: ['alloy_plate', 'salvage', 'rubedo'],
    rare: []
  },
  void: {
    common: ['ferrite', 'rubedo'],
    rare: ['argon_crystal', 'control_module']
  },
  lua: {
    common: [],
    rare: ['neurodes', 'neural_sensors']
  }
}

// 敌人掉落材料
export const ENEMY_DROPS = {
  grineer: {
    materials: ['ferrite', 'alloy_plate', 'grineer_key'],
    creditRange: [50, 200]
  },
  corpus: {
    materials: ['alloy_plate', 'circuits', 'polymer_bundle', 'corpus_key'],
    creditRange: [80, 250]
  },
  infested: {
    materials: ['nano_spores', 'plastids', 'mutagen_sample'],
    creditRange: [30, 150]
  },
  orokin: {
    materials: ['rubedo', 'control_module', 'orokin_cell'],
    creditRange: [100, 400]
  }
}

// 采集节点类型
export const RESOURCE_NODES = {
  ore_deposit: {
    id: 'ore_deposit',
    name: 'Ore Deposit',
    displayName: '矿石矿脉',
    harvestTime: 2000,
    yields: ['ferrite', 'alloy_plate', 'rubedo'],
    yieldRange: [50, 200],
    respawnTime: 60000
  },
  organic_mass: {
    id: 'organic_mass',
    name: 'Organic Mass',
    displayName: '有机质团',
    harvestTime: 1500,
    yields: ['nano_spores', 'plastids', 'polymer_bundle'],
    yieldRange: [30, 150],
    respawnTime: 45000
  },
  tech_cache: {
    id: 'tech_cache',
    name: 'Tech Cache',
    displayName: '科技缓存',
    harvestTime: 3000,
    yields: ['circuits', 'control_module'],
    yieldRange: [10, 50],
    respawnTime: 90000
  },
  crystal_formation: {
    id: 'crystal_formation',
    name: 'Crystal Formation',
    displayName: '晶体构造',
    harvestTime: 2500,
    yields: ['rubedo', 'argon_crystal'],
    yieldRange: [5, 30],
    respawnTime: 120000
  },
  rare_container: {
    id: 'rare_container',
    name: 'Rare Container',
    displayName: '稀有容器',
    harvestTime: 4000,
    yields: ['morphics', 'neurodes', 'gallium', 'neural_sensors', 'orokin_cell'],
    yieldRange: [1, 3],
    respawnTime: 300000,
    spawnChance: 0.1
  }
}

// 获取随机材料掉落
export function getRandomDrop(planetId, enemyFaction, waveNumber = 1) {
  const drops = []
  const planetResources = PLANET_RESOURCES[planetId] || PLANET_RESOURCES.earth
  const enemyDrops = ENEMY_DROPS[enemyFaction] || ENEMY_DROPS.grineer

  // 通用资源掉落
  if (planetResources.common.length > 0 && Math.random() < 0.4) {
    const material = planetResources.common[Math.floor(Math.random() * planetResources.common.length)]
    const amount = Math.floor((10 + Math.random() * 30) * (1 + waveNumber * 0.1))
    drops.push({ id: material, amount })
  }

  // 稀有资源掉落
  if (planetResources.rare.length > 0 && Math.random() < 0.05 * waveNumber) {
    const material = planetResources.rare[Math.floor(Math.random() * planetResources.rare.length)]
    drops.push({ id: material, amount: 1 })
  }

  // 敌人特有掉落
  if (Math.random() < 0.3) {
    const material = enemyDrops.materials[Math.floor(Math.random() * enemyDrops.materials.length)]
    const amount = Math.floor((5 + Math.random() * 20) * (1 + waveNumber * 0.05))
    drops.push({ id: material, amount })
  }

  // 星币
  const [minCredit, maxCredit] = enemyDrops.creditRange
  const credits = Math.floor((minCredit + Math.random() * (maxCredit - minCredit)) * (1 + waveNumber * 0.15))
  drops.push({ id: 'credits', amount: credits })

  // Endo掉落
  if (Math.random() < 0.2) {
    drops.push({ id: 'endo', amount: Math.floor(15 + Math.random() * 50) })
  }

  return drops
}

// 获取材料数据
export function getMaterial(materialId) {
  return MATERIALS[materialId] || null
}

// 检查材料是否足够
export function hasMaterials(required, inventory) {
  for (const [materialId, amount] of Object.entries(required)) {
    if ((inventory[materialId] || 0) < amount) {
      return false
    }
  }
  return true
}

// 消耗材料
export function consumeMaterials(required, inventory) {
  const newInventory = { ...inventory }
  for (const [materialId, amount] of Object.entries(required)) {
    newInventory[materialId] = (newInventory[materialId] || 0) - amount
    if (newInventory[materialId] < 0) {
      return null // 不够
    }
  }
  return newInventory
}
