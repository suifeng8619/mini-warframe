// 商店和解锁系统配置
import { WARFRAMES } from './warframes.js'
import { WEAPONS } from './weapons.js'

// 商店物品配置
export const SHOP_ITEMS = {
  // ========== 战甲 ==========
  warframes: {
    excalibur: {
      id: 'excalibur',
      type: 'warframe',
      displayName: '圣剑',
      description: '平衡型战甲，适合新手',
      price: 0, // 免费初始战甲
      unlocked: true,
      purchaseCurrency: 'credits'
    },
    volt: {
      id: 'volt',
      type: 'warframe',
      displayName: '电击',
      description: '电系战甲，高速度高爆发',
      price: 5000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 2 }
    },
    mag: {
      id: 'mag',
      type: 'warframe',
      displayName: '磁力',
      description: '磁力控制，擅长控场和护盾',
      price: 5000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 2 }
    },
    rhino: {
      id: 'rhino',
      type: 'warframe',
      displayName: '犀牛',
      description: '重装坦克，高护甲高生存',
      price: 8000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 3 }
    },
    loki: {
      id: 'loki',
      type: 'warframe',
      displayName: '洛基',
      description: '潜行刺客，擅长欺骗和控制',
      price: 10000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 4 }
    },
    nova: {
      id: 'nova',
      type: 'warframe',
      displayName: '诺瓦',
      description: '反物质专家，高爆发AOE',
      price: 12000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 5 }
    },
    trinity: {
      id: 'trinity',
      type: 'warframe',
      displayName: '圣女',
      description: '治疗辅助，能量和生命恢复',
      price: 10000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 4 }
    },
    ash: {
      id: 'ash',
      type: 'warframe',
      displayName: '灰烬',
      description: '忍者刺客，高单体爆发',
      price: 15000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 6 }
    }
  },

  // ========== 武器 ==========
  weapons: {
    braton: {
      id: 'braton',
      type: 'weapon',
      displayName: '布莱顿',
      description: '可靠的全自动步枪',
      price: 0, // 免费初始武器
      unlocked: true,
      purchaseCurrency: 'credits'
    },
    boltor: {
      id: 'boltor',
      type: 'weapon',
      displayName: '螺钉步枪',
      description: '发射高速螺钉的穿刺步枪',
      price: 3000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 2 }
    },
    lex: {
      id: 'lex',
      type: 'weapon',
      displayName: '雷克斯',
      description: '高伤害精准手枪',
      price: 2500,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 1 }
    },
    grakata: {
      id: 'grakata',
      type: 'weapon',
      displayName: '葛拉卡达',
      description: '疯狂的高射速步枪',
      price: 4000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 3 }
    },
    hek: {
      id: 'hek',
      type: 'weapon',
      displayName: '海克',
      description: '高伤害霰弹枪',
      price: 5000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 4 }
    },
    soma: {
      id: 'soma',
      type: 'weapon',
      displayName: '索玛',
      description: '高暴击率全自动步枪',
      price: 8000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 5 }
    },
    tigris: {
      id: 'tigris',
      type: 'weapon',
      displayName: '猛虎',
      description: '双管霰弹枪，单发高伤',
      price: 7000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 4 }
    },
    aklex: {
      id: 'aklex',
      type: 'weapon',
      displayName: '双持雷克斯',
      description: '双持版雷克斯，火力翻倍',
      price: 6000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 3 }
    },
    dread: {
      id: 'dread',
      type: 'weapon',
      displayName: '恐惧',
      description: '高暴击弓箭，需蓄力',
      price: 10000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 5 }
    },
    amprex: {
      id: 'amprex',
      type: 'weapon',
      displayName: '安培克斯',
      description: '电击光束枪，可连锁',
      price: 12000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 6 }
    },
    kohm: {
      id: 'kohm',
      type: 'weapon',
      displayName: '寇恩',
      description: '全自动霰弹枪，弹丸递增',
      price: 9000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 5 }
    },
    atomos: {
      id: 'atomos',
      type: 'weapon',
      displayName: '原子矿融炮',
      description: '热能光束手枪，可连锁',
      price: 8000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 4 }
    },
    opticor: {
      id: 'opticor',
      type: 'weapon',
      displayName: '奥堤克光子枪',
      description: '蓄力激光炮，超高伤害',
      price: 15000,
      unlocked: false,
      purchaseCurrency: 'credits',
      unlockCondition: { type: 'mastery', level: 7 }
    }
  },

  // ========== MOD卡包 ==========
  modPacks: {
    starter_pack: {
      id: 'starter_pack',
      type: 'mod_pack',
      displayName: '新手MOD包',
      description: '包含基础强化MOD',
      price: 2000,
      purchaseCurrency: 'credits',
      contents: ['mod_serration', 'mod_vitality', 'mod_redirection'],
      guaranteed: true
    },
    rifle_pack: {
      id: 'rifle_pack',
      type: 'mod_pack',
      displayName: '步枪MOD包',
      description: '步枪强化MOD',
      price: 3000,
      purchaseCurrency: 'credits',
      possibleContents: ['mod_serration', 'mod_split_chamber', 'mod_point_strike', 'mod_vital_sense'],
      dropCount: 2
    },
    warframe_pack: {
      id: 'warframe_pack',
      type: 'mod_pack',
      displayName: '战甲MOD包',
      description: '战甲强化MOD',
      price: 4000,
      purchaseCurrency: 'credits',
      possibleContents: ['mod_vitality', 'mod_redirection', 'mod_intensify', 'mod_continuity', 'mod_streamline'],
      dropCount: 2
    },
    rare_pack: {
      id: 'rare_pack',
      type: 'mod_pack',
      displayName: '稀有MOD包',
      description: '有几率获得稀有MOD',
      price: 8000,
      purchaseCurrency: 'credits',
      possibleContents: ['mod_split_chamber', 'mod_barrel_diffusion', 'mod_blind_rage', 'mod_narrow_minded'],
      dropCount: 1,
      rareChance: 0.3
    }
  },

  // ========== 消耗品 ==========
  consumables: {
    health_restore: {
      id: 'health_restore',
      type: 'consumable',
      displayName: '生命恢复剂',
      description: '立即恢复50%生命值',
      price: 500,
      purchaseCurrency: 'credits',
      stackable: true,
      maxStack: 10,
      effect: { type: 'heal', percent: 0.5 }
    },
    energy_restore: {
      id: 'energy_restore',
      type: 'consumable',
      displayName: '能量恢复剂',
      description: '立即恢复50%能量',
      price: 500,
      purchaseCurrency: 'credits',
      stackable: true,
      maxStack: 10,
      effect: { type: 'energy', percent: 0.5 }
    },
    ammo_restore: {
      id: 'ammo_restore',
      type: 'consumable',
      displayName: '弹药恢复剂',
      description: '填满所有弹药',
      price: 300,
      purchaseCurrency: 'credits',
      stackable: true,
      maxStack: 20,
      effect: { type: 'ammo', full: true }
    },
    affinity_booster: {
      id: 'affinity_booster',
      type: 'consumable',
      displayName: '经验加成',
      description: '30分钟内经验获取翻倍',
      price: 2000,
      purchaseCurrency: 'credits',
      stackable: false,
      duration: 1800000, // 30分钟
      effect: { type: 'xp_boost', multiplier: 2.0 }
    },
    credit_booster: {
      id: 'credit_booster',
      type: 'consumable',
      displayName: '金币加成',
      description: '30分钟内金币获取翻倍',
      price: 2000,
      purchaseCurrency: 'credits',
      stackable: false,
      duration: 1800000,
      effect: { type: 'credit_boost', multiplier: 2.0 }
    }
  }
}

// 段位等级配置
export const MASTERY_RANKS = {
  0: { name: '新手', xpRequired: 0, rewards: { credits: 0 } },
  1: { name: '学徒', xpRequired: 1000, rewards: { credits: 1000 } },
  2: { name: '初学者', xpRequired: 3000, rewards: { credits: 2000 } },
  3: { name: '战士', xpRequired: 6000, rewards: { credits: 3000 } },
  4: { name: '精锐', xpRequired: 10000, rewards: { credits: 5000 } },
  5: { name: '专家', xpRequired: 15000, rewards: { credits: 7000 } },
  6: { name: '大师', xpRequired: 22000, rewards: { credits: 10000 } },
  7: { name: '宗师', xpRequired: 30000, rewards: { credits: 15000 } },
  8: { name: '传奇', xpRequired: 40000, rewards: { credits: 20000 } },
  9: { name: '神话', xpRequired: 55000, rewards: { credits: 30000 } },
  10: { name: '至尊', xpRequired: 75000, rewards: { credits: 50000 } }
}

// 检查物品是否可购买
export function canPurchaseItem(itemId, category, playerData) {
  const item = SHOP_ITEMS[category]?.[itemId]
  if (!item) return { canPurchase: false, reason: '物品不存在' }

  // 检查是否已拥有
  if (item.type === 'warframe' && playerData.ownedWarframes?.includes(itemId)) {
    return { canPurchase: false, reason: '已拥有此战甲' }
  }
  if (item.type === 'weapon' && playerData.ownedWeapons?.includes(itemId)) {
    return { canPurchase: false, reason: '已拥有此武器' }
  }

  // 检查解锁条件
  if (item.unlockCondition) {
    const { type, level } = item.unlockCondition
    if (type === 'mastery' && (playerData.masteryRank || 0) < level) {
      return { canPurchase: false, reason: `需要段位 ${level}` }
    }
  }

  // 检查货币
  const currency = item.purchaseCurrency
  const playerCurrency = playerData[currency] || 0
  if (playerCurrency < item.price) {
    return { canPurchase: false, reason: `${currency === 'credits' ? '金币' : '白金'}不足` }
  }

  return { canPurchase: true }
}

// 购买物品
export function purchaseItem(itemId, category, playerData) {
  const check = canPurchaseItem(itemId, category, playerData)
  if (!check.canPurchase) {
    return { success: false, reason: check.reason }
  }

  const item = SHOP_ITEMS[category][itemId]
  const newPlayerData = { ...playerData }

  // 扣除货币
  newPlayerData[item.purchaseCurrency] -= item.price

  // 添加物品
  if (item.type === 'warframe') {
    newPlayerData.ownedWarframes = [...(newPlayerData.ownedWarframes || []), itemId]
  } else if (item.type === 'weapon') {
    newPlayerData.ownedWeapons = [...(newPlayerData.ownedWeapons || []), itemId]
  } else if (item.type === 'mod_pack') {
    // 处理MOD包
    const mods = openModPack(item)
    newPlayerData.ownedMods = [...(newPlayerData.ownedMods || []), ...mods]
  } else if (item.type === 'consumable') {
    // 处理消耗品
    const inventory = newPlayerData.consumables || {}
    inventory[itemId] = (inventory[itemId] || 0) + 1
    newPlayerData.consumables = inventory
  }

  return { success: true, playerData: newPlayerData }
}

// 打开MOD包
function openModPack(packItem) {
  const mods = []

  if (packItem.guaranteed && packItem.contents) {
    // 保证获得的内容
    return packItem.contents
  }

  if (packItem.possibleContents && packItem.dropCount) {
    // 随机获得
    const available = [...packItem.possibleContents]
    for (let i = 0; i < packItem.dropCount && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length)
      mods.push(available.splice(index, 1)[0])
    }
  }

  return mods
}

// 获取段位信息
export function getMasteryRankInfo(xp) {
  let currentRank = 0
  let nextRankXp = MASTERY_RANKS[1].xpRequired

  for (let rank = 10; rank >= 0; rank--) {
    if (xp >= MASTERY_RANKS[rank].xpRequired) {
      currentRank = rank
      nextRankXp = rank < 10 ? MASTERY_RANKS[rank + 1].xpRequired : Infinity
      break
    }
  }

  return {
    rank: currentRank,
    name: MASTERY_RANKS[currentRank].name,
    currentXp: xp,
    nextRankXp: nextRankXp,
    progress: nextRankXp === Infinity ? 1 : (xp - MASTERY_RANKS[currentRank].xpRequired) / (nextRankXp - MASTERY_RANKS[currentRank].xpRequired)
  }
}

// 获取商店物品列表
export function getShopItemsByCategory(category) {
  return Object.values(SHOP_ITEMS[category] || {})
}

// 检查是否有新解锁的物品
export function getNewlyUnlockedItems(previousMasteryRank, currentMasteryRank) {
  const newItems = []

  for (const [category, items] of Object.entries(SHOP_ITEMS)) {
    for (const item of Object.values(items)) {
      if (item.unlockCondition?.type === 'mastery') {
        const reqLevel = item.unlockCondition.level
        if (reqLevel > previousMasteryRank && reqLevel <= currentMasteryRank) {
          newItems.push({ ...item, category })
        }
      }
    }
  }

  return newItems
}
