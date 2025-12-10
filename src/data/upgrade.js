// 装备升级/强化系统配置

// ========== MOD升级系统 ==========
// MOD升级所需Endo
export const MOD_UPGRADE_COSTS = {
  common: {
    // 每级所需Endo
    perRank: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    creditMultiplier: 1
  },
  uncommon: {
    perRank: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
    creditMultiplier: 2
  },
  rare: {
    perRank: [40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
    creditMultiplier: 4
  },
  legendary: {
    perRank: [80, 160, 240, 320, 400, 480, 560, 640, 720, 800],
    creditMultiplier: 8
  }
}

// 计算MOD升级到指定等级所需的总Endo
export function calculateModUpgradeCost(modRarity, currentRank, targetRank) {
  const costs = MOD_UPGRADE_COSTS[modRarity]
  if (!costs) return { endo: 0, credits: 0 }

  let totalEndo = 0
  for (let i = currentRank; i < targetRank; i++) {
    totalEndo += costs.perRank[i] || costs.perRank[costs.perRank.length - 1]
  }

  return {
    endo: totalEndo,
    credits: totalEndo * costs.creditMultiplier * 10
  }
}

// 升级MOD
export function upgradeMod(modId, currentRank, targetRank, modRarity, playerData) {
  const cost = calculateModUpgradeCost(modRarity, currentRank, targetRank)

  if ((playerData.inventory?.endo || 0) < cost.endo) {
    return { success: false, reason: 'Endo不足' }
  }
  if ((playerData.inventory?.credits || 0) < cost.credits) {
    return { success: false, reason: '星币不足' }
  }

  const newInventory = { ...playerData.inventory }
  newInventory.endo -= cost.endo
  newInventory.credits -= cost.credits

  return {
    success: true,
    inventory: newInventory,
    newRank: targetRank
  }
}

// ========== Forma极性系统 ==========
export const POLARITIES = {
  madurai: {
    id: 'madurai',
    name: 'Madurai',
    displayName: '锐利',
    symbol: 'V',
    color: 0xff4444,
    description: '伤害类MOD'
  },
  vazarin: {
    id: 'vazarin',
    name: 'Vazarin',
    displayName: '守护',
    symbol: 'D',
    color: 0x4488ff,
    description: '防御类MOD'
  },
  naramon: {
    id: 'naramon',
    name: 'Naramon',
    displayName: '洞悉',
    symbol: '-',
    color: 0x44ff44,
    description: '技能类MOD'
  },
  zenurik: {
    id: 'zenurik',
    name: 'Zenurik',
    displayName: '智慧',
    symbol: '=',
    color: 0xffff44,
    description: '能量类MOD'
  },
  penjaga: {
    id: 'penjaga',
    name: 'Penjaga',
    displayName: '守卫',
    symbol: 'Y',
    color: 0xff44ff,
    description: '守护者MOD'
  },
  unairu: {
    id: 'unairu',
    name: 'Unairu',
    displayName: '坚韧',
    symbol: 'R',
    color: 0xaa8844,
    description: '护甲类MOD'
  },
  umbra: {
    id: 'umbra',
    name: 'Umbra',
    displayName: '暗影',
    symbol: 'W',
    color: 0x222222,
    description: 'Umbra专用MOD'
  }
}

// 使用Forma改变极性
export function applyForma(equipmentId, slotIndex, newPolarity, playerData) {
  // 检查Forma数量
  if ((playerData.inventory?.forma || 0) < 1) {
    return { success: false, reason: 'Forma不足' }
  }

  // 装备需要重置等级
  const newInventory = { ...playerData.inventory }
  newInventory.forma -= 1

  return {
    success: true,
    inventory: newInventory,
    polarityChange: {
      equipmentId,
      slotIndex,
      polarity: newPolarity
    },
    resetLevel: true // 装备等级重置为0
  }
}

// ========== Orokin Reactor/Catalyst系统 ==========
export function applyReactor(warframeId, playerData) {
  if ((playerData.inventory?.reactor || 0) < 1) {
    return { success: false, reason: 'Orokin反应堆不足' }
  }

  // 检查是否已安装
  const warframeData = playerData.warframeUpgrades?.[warframeId] || {}
  if (warframeData.hasReactor) {
    return { success: false, reason: '已安装反应堆' }
  }

  const newInventory = { ...playerData.inventory }
  newInventory.reactor -= 1

  return {
    success: true,
    inventory: newInventory,
    upgrade: {
      warframeId,
      hasReactor: true,
      modCapacity: 60 // 从30提升到60
    }
  }
}

export function applyCatalyst(weaponId, playerData) {
  if ((playerData.inventory?.catalyst || 0) < 1) {
    return { success: false, reason: 'Orokin催化剂不足' }
  }

  const weaponData = playerData.weaponUpgrades?.[weaponId] || {}
  if (weaponData.hasCatalyst) {
    return { success: false, reason: '已安装催化剂' }
  }

  const newInventory = { ...playerData.inventory }
  newInventory.catalyst -= 1

  return {
    success: true,
    inventory: newInventory,
    upgrade: {
      weaponId,
      hasCatalyst: true,
      modCapacity: 60
    }
  }
}

// ========== 装备等级系统 ==========
export const EQUIPMENT_LEVEL = {
  maxLevel: 30,
  xpPerLevel: [
    0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
    10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
    20000, 22000, 24000, 26000, 28000, 30000, 32000, 34000, 36000, 40000
  ],
  modCapacityPerLevel: 1 // 每级增加1点MOD容量
}

// 计算装备等级
export function calculateEquipmentLevel(xp) {
  let level = 0
  let totalXpRequired = 0

  for (let i = 0; i < EQUIPMENT_LEVEL.maxLevel; i++) {
    totalXpRequired += EQUIPMENT_LEVEL.xpPerLevel[i]
    if (xp >= totalXpRequired) {
      level = i + 1
    } else {
      break
    }
  }

  const currentLevelXp = level > 0 ?
    xp - EQUIPMENT_LEVEL.xpPerLevel.slice(0, level).reduce((a, b) => a + b, 0) :
    xp
  const nextLevelXp = EQUIPMENT_LEVEL.xpPerLevel[level] || 0

  return {
    level,
    currentXp: currentLevelXp,
    nextLevelXp,
    progress: nextLevelXp > 0 ? currentLevelXp / nextLevelXp : 1,
    modCapacity: level + (level === 30 ? 0 : 0)
  }
}

// 增加装备经验
export function addEquipmentXp(currentXp, addedXp) {
  const newXp = currentXp + addedXp
  const maxXp = EQUIPMENT_LEVEL.xpPerLevel.reduce((a, b) => a + b, 0)
  return Math.min(newXp, maxXp)
}

// ========== 段位经验系统 ==========
export const MASTERY_XP_SOURCES = {
  warframe: 200,      // 每级战甲给200段位经验
  weapon: 100,        // 每级武器给100段位经验
  companion: 100,     // 每级守护者给100经验
  archwing: 200,      // 每级空战装备给200经验
  mission: {          // 首次通关任务
    easy: 50,
    medium: 100,
    hard: 200,
    nightmare: 500
  }
}

// 计算升级装备获得的段位经验
export function calculateMasteryXp(type, oldLevel, newLevel) {
  const xpPerLevel = MASTERY_XP_SOURCES[type] || 0
  return (newLevel - oldLevel) * xpPerLevel
}

// ========== Exilus适配器系统 ==========
export function applyExilusAdapter(warframeId, playerData) {
  if ((playerData.inventory?.exilus_adapter || 0) < 1) {
    return { success: false, reason: 'Exilus适配器不足' }
  }

  const warframeData = playerData.warframeUpgrades?.[warframeId] || {}
  if (warframeData.hasExilus) {
    return { success: false, reason: '已解锁Exilus槽位' }
  }

  const newInventory = { ...playerData.inventory }
  newInventory.exilus_adapter -= 1

  return {
    success: true,
    inventory: newInventory,
    upgrade: {
      warframeId,
      hasExilus: true
    }
  }
}

// ========== 武器配置系统 ==========
export const WEAPON_CONFIG_SLOTS = 3 // 每把武器3个配置槽

export function createWeaponConfig(weaponId, configIndex, configData) {
  return {
    weaponId,
    configIndex,
    name: configData.name || `配置 ${configIndex + 1}`,
    mods: configData.mods || [],
    polarities: configData.polarities || []
  }
}

// ========== MOD分解系统 ==========
export const MOD_DISSOLVE_VALUES = {
  common: { baseEndo: 5, perRank: 5 },
  uncommon: { baseEndo: 10, perRank: 10 },
  rare: { baseEndo: 20, perRank: 25 },
  legendary: { baseEndo: 50, perRank: 50 }
}

export function calculateDissolveValue(modRarity, modRank) {
  const values = MOD_DISSOLVE_VALUES[modRarity]
  if (!values) return 0
  return values.baseEndo + values.perRank * modRank
}

export function dissolveMods(modsToDissolve, playerData) {
  let totalEndo = 0

  modsToDissolve.forEach(mod => {
    totalEndo += calculateDissolveValue(mod.rarity, mod.rank || 0)
  })

  const newInventory = { ...playerData.inventory }
  newInventory.endo = (newInventory.endo || 0) + totalEndo

  return {
    success: true,
    endoGained: totalEndo,
    inventory: newInventory
  }
}

// ========== 套装效果系统 ==========
export const SET_MODS = {
  vigilante: {
    id: 'vigilante',
    name: 'Vigilante',
    displayName: '义警',
    mods: ['vigilante_armaments', 'vigilante_offense', 'vigilante_supplies', 'vigilante_pursuit'],
    setBonus: {
      2: { critUpgradeChance: 0.05 },
      3: { critUpgradeChance: 0.15 },
      4: { critUpgradeChance: 0.25 }
    }
  },
  gladiator: {
    id: 'gladiator',
    name: 'Gladiator',
    displayName: '角斗士',
    mods: ['gladiator_might', 'gladiator_rush', 'gladiator_aegis', 'gladiator_resolve'],
    setBonus: {
      2: { meleeCritChance: 0.1 },
      3: { meleeCritChance: 0.2 },
      4: { meleeCritChance: 0.35 }
    }
  },
  augur: {
    id: 'augur',
    name: 'Augur',
    displayName: '占卜者',
    mods: ['augur_message', 'augur_reach', 'augur_accord', 'augur_secrets'],
    setBonus: {
      2: { energyToShield: 0.2 },
      3: { energyToShield: 0.4 },
      4: { energyToShield: 0.6 }
    }
  }
}

// 计算套装效果
export function calculateSetBonus(equippedMods) {
  const bonuses = {}

  for (const [setId, setData] of Object.entries(SET_MODS)) {
    const equippedCount = equippedMods.filter(mod =>
      setData.mods.includes(mod.id)
    ).length

    for (const [count, bonus] of Object.entries(setData.setBonus)) {
      if (equippedCount >= parseInt(count)) {
        for (const [stat, value] of Object.entries(bonus)) {
          bonuses[stat] = (bonuses[stat] || 0) + value
        }
      }
    }
  }

  return bonuses
}
