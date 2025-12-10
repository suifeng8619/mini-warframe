// 武器数据配置
export const WEAPONS = {
  braton: {
    id: 'braton',
    name: 'Braton',
    displayName: '布莱顿',
    type: 'rifle',
    description: '可靠的全自动步枪',
    baseStats: {
      damage: 20,
      fireRate: 8.75,  // 每秒发射次数
      magazineSize: 45,
      reloadTime: 2000, // 毫秒
      accuracy: 0.9,
      critChance: 0.12,
      critMultiplier: 1.6,
      projectileSpeed: 1200
    },
    color: 0x88ccff
  },

  boltor: {
    id: 'boltor',
    name: 'Boltor',
    displayName: '螺钉步枪',
    type: 'rifle',
    description: '发射高速螺钉的穿刺步枪',
    baseStats: {
      damage: 25,
      fireRate: 6.67,
      magazineSize: 60,
      reloadTime: 2500,
      accuracy: 0.95,
      critChance: 0.10,
      critMultiplier: 1.8,
      projectileSpeed: 1000,
      punchThrough: 1 // 可穿透敌人数量
    },
    color: 0xffaa44
  },

  lex: {
    id: 'lex',
    name: 'Lex',
    displayName: '雷克斯',
    type: 'pistol',
    description: '高伤害精准手枪',
    baseStats: {
      damage: 130,
      fireRate: 1.08,
      magazineSize: 6,
      reloadTime: 2300,
      accuracy: 0.98,
      critChance: 0.20,
      critMultiplier: 2.0,
      projectileSpeed: 1500
    },
    color: 0xcccccc
  },

  grakata: {
    id: 'grakata',
    name: 'Grakata',
    displayName: '葛拉卡达',
    type: 'rifle',
    description: '疯狂的高射速步枪',
    baseStats: {
      damage: 11,
      fireRate: 20,
      magazineSize: 60,
      reloadTime: 2200,
      accuracy: 0.7,
      critChance: 0.25,
      critMultiplier: 2.0,
      projectileSpeed: 1100
    },
    color: 0xff4444
  },

  hek: {
    id: 'hek',
    name: 'Hek',
    displayName: '海克',
    type: 'shotgun',
    description: '高伤害霰弹枪',
    baseStats: {
      damage: 50,  // 每颗弹丸
      pellets: 7,  // 弹丸数量
      fireRate: 2.17,
      magazineSize: 4,
      reloadTime: 2000,
      accuracy: 0.6,
      critChance: 0.10,
      critMultiplier: 2.0,
      projectileSpeed: 800,
      spread: 0.3  // 散布角度
    },
    color: 0x66ff66
  },

  // ========== 新增武器 ==========
  soma: {
    id: 'soma',
    name: 'Soma',
    displayName: '索玛',
    type: 'rifle',
    description: '高暴击率全自动步枪',
    baseStats: {
      damage: 12,
      fireRate: 15,
      magazineSize: 100,
      reloadTime: 3000,
      accuracy: 0.95,
      critChance: 0.30,
      critMultiplier: 3.0,
      projectileSpeed: 1200
    },
    color: 0xffffff
  },

  tigris: {
    id: 'tigris',
    name: 'Tigris',
    displayName: '猛虎',
    type: 'shotgun',
    description: '双管霰弹枪，单发高伤',
    baseStats: {
      damage: 150,
      pellets: 5,
      fireRate: 2.0,
      magazineSize: 2,
      reloadTime: 1800,
      accuracy: 0.4,
      critChance: 0.10,
      critMultiplier: 2.0,
      projectileSpeed: 700,
      spread: 0.4
    },
    color: 0x8844aa
  },

  aklex: {
    id: 'aklex',
    name: 'Aklex',
    displayName: '双持雷克斯',
    type: 'pistol',
    description: '双持版雷克斯，火力翻倍',
    baseStats: {
      damage: 110,
      fireRate: 2.67,
      magazineSize: 12,
      reloadTime: 3000,
      accuracy: 0.93,
      critChance: 0.20,
      critMultiplier: 2.0,
      projectileSpeed: 1400
    },
    color: 0xdddddd
  },

  dread: {
    id: 'dread',
    name: 'Dread',
    displayName: '恐惧',
    type: 'bow',
    description: '高暴击弓箭，需蓄力',
    baseStats: {
      damage: 200,
      fireRate: 1.0,
      magazineSize: 1,
      reloadTime: 600,
      accuracy: 1.0,
      critChance: 0.50,
      critMultiplier: 2.0,
      projectileSpeed: 600,
      chargeTime: 500,
      punchThrough: 3
    },
    color: 0x220000
  },

  amprex: {
    id: 'amprex',
    name: 'Amprex',
    displayName: '安培克斯',
    type: 'rifle',
    description: '电击光束枪，可连锁',
    baseStats: {
      damage: 22,
      fireRate: 12,
      magazineSize: 100,
      reloadTime: 2700,
      accuracy: 0.8,
      critChance: 0.32,
      critMultiplier: 2.2,
      projectileSpeed: 2000,
      chainCount: 3,
      chainRange: 100
    },
    color: 0x00ffff
  },

  kohm: {
    id: 'kohm',
    name: 'Kohm',
    displayName: '寇恩',
    type: 'shotgun',
    description: '全自动霰弹枪，弹丸递增',
    baseStats: {
      damage: 30,
      pellets: 12,
      fireRate: 3.67,
      magazineSize: 245,
      reloadTime: 2000,
      accuracy: 0.5,
      critChance: 0.11,
      critMultiplier: 2.3,
      projectileSpeed: 800,
      spread: 0.5,
      spoolUp: true // 射速随射击递增
    },
    color: 0xff6644
  },

  atomos: {
    id: 'atomos',
    name: 'Atomos',
    displayName: '原子矿融炮',
    type: 'pistol',
    description: '热能光束手枪，可连锁',
    baseStats: {
      damage: 50,
      fireRate: 8,
      magazineSize: 70,
      reloadTime: 2000,
      accuracy: 1.0,
      critChance: 0.15,
      critMultiplier: 1.7,
      projectileSpeed: 1500,
      chainCount: 3,
      chainRange: 80
    },
    color: 0xff4400
  },

  opticor: {
    id: 'opticor',
    name: 'Opticor',
    displayName: '奥堤克光子枪',
    type: 'rifle',
    description: '蓄力激光炮，超高伤害',
    baseStats: {
      damage: 1000,
      fireRate: 0.5,
      magazineSize: 5,
      reloadTime: 2500,
      accuracy: 1.0,
      critChance: 0.20,
      critMultiplier: 2.5,
      projectileSpeed: 3000,
      chargeTime: 2000,
      punchThrough: 5,
      aoeRadius: 50
    },
    color: 0x00ff00
  }
}

// 获取武器的完整配置（应用MOD后）
// 注意：modsData参数是MODS对象，由调用方传入以避免循环依赖
export function getWeaponWithMods(weaponId, equippedMods, modsData = null) {
  const base = WEAPONS[weaponId]
  if (!base) return null

  const modified = JSON.parse(JSON.stringify(base))

  // 如果没有传入modsData或没有装备MOD，直接返回
  if (!modsData || !equippedMods || !Array.isArray(equippedMods)) {
    return modified
  }

  // 应用MOD效果
  equippedMods.forEach(equippedMod => {
    if (!equippedMod || !equippedMod.id) return

    // 通过id查找MOD完整数据
    const modData = modsData[equippedMod.id]
    if (!modData || modData.target !== 'weapon') return

    // 检查武器类型匹配
    if (modData.weaponType && modData.weaponType !== base.type) return

    // 使用getEffect函数计算实际效果
    const effects = modData.getEffect ? modData.getEffect(equippedMod.rank) : modData.effects

    Object.entries(effects).forEach(([stat, value]) => {
      if (modified.baseStats[stat] !== undefined) {
        if (modData.isMultiplier) {
          modified.baseStats[stat] *= value
        } else {
          modified.baseStats[stat] += value
        }
      }
    })
  })

  // 确保属性值在合理范围内
  if (modified.baseStats.damage < 1) modified.baseStats.damage = 1
  if (modified.baseStats.fireRate < 0.1) modified.baseStats.fireRate = 0.1
  if (modified.baseStats.reloadTime < 100) modified.baseStats.reloadTime = 100
  if (modified.baseStats.magazineSize < 1) modified.baseStats.magazineSize = 1
  if (modified.baseStats.critChance < 0) modified.baseStats.critChance = 0
  if (modified.baseStats.critMultiplier < 1) modified.baseStats.critMultiplier = 1

  return modified
}
