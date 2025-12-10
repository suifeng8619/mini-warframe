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
