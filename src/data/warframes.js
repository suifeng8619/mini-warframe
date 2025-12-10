// 战甲数据配置
export const WARFRAMES = {
  excalibur: {
    id: 'excalibur',
    name: 'Excalibur',
    displayName: '圣剑',
    description: '平衡型战甲，适合新手',
    baseStats: {
      health: 300,
      maxHealth: 300,
      shield: 150,
      maxShield: 150,
      energy: 100,
      maxEnergy: 100,
      armor: 225,
      speed: 1.0,
      jumpForce: 450
    },
    abilities: [
      {
        id: 'slash_dash',
        name: '斩切冲刺',
        description: '向前冲刺并斩击路径上的敌人',
        energyCost: 25,
        cooldown: 2000,
        damage: 150,
        range: 300
      },
      {
        id: 'radial_blind',
        name: '致盲光辉',
        description: '释放闪光致盲周围敌人',
        energyCost: 50,
        cooldown: 8000,
        duration: 5000,
        range: 200
      },
      {
        id: 'exalted_blade',
        name: '显赫刀剑',
        description: '召唤能量剑，大幅提升近战伤害',
        energyCost: 25,
        cooldown: 0,
        drainPerSecond: 5,
        damageMultiplier: 2.5,
        isToggle: true
      }
    ],
    color: 0x4488ff
  },

  volt: {
    id: 'volt',
    name: 'Volt',
    displayName: '电击',
    description: '电系战甲，高速度高爆发',
    baseStats: {
      health: 200,
      maxHealth: 200,
      shield: 200,
      maxShield: 200,
      energy: 150,
      maxEnergy: 150,
      armor: 100,
      speed: 1.2,
      jumpForce: 480
    },
    abilities: [
      {
        id: 'shock',
        name: '电击',
        description: '发射电弧攻击敌人，可连锁',
        energyCost: 25,
        cooldown: 1500,
        damage: 120,
        chainCount: 3,
        chainRange: 150
      },
      {
        id: 'speed',
        name: '极速',
        description: '大幅提升移动和攻击速度',
        energyCost: 50,
        cooldown: 10000,
        duration: 8000,
        speedMultiplier: 1.8
      },
      {
        id: 'discharge',
        name: '放电',
        description: '释放范围电击，持续伤害敌人',
        energyCost: 75,
        cooldown: 15000,
        damage: 80,
        tickRate: 500,
        duration: 5000,
        range: 250
      }
    ],
    color: 0xffff44
  },

  mag: {
    id: 'mag',
    name: 'Mag',
    displayName: '磁力',
    description: '磁力控制，擅长控场和护盾',
    baseStats: {
      health: 225,
      maxHealth: 225,
      shield: 225,
      maxShield: 225,
      energy: 125,
      maxEnergy: 125,
      armor: 75,
      speed: 1.0,
      jumpForce: 450
    },
    abilities: [
      {
        id: 'pull',
        name: '牵引',
        description: '将敌人拉向自己并造成伤害',
        energyCost: 25,
        cooldown: 2000,
        damage: 100,
        range: 350,
        pullForce: 400
      },
      {
        id: 'magnetize',
        name: '磁化',
        description: '创建磁场吸引子弹并放大伤害',
        energyCost: 50,
        cooldown: 8000,
        duration: 6000,
        damageMultiplier: 1.5,
        range: 80
      },
      {
        id: 'crush',
        name: '粉碎',
        description: '磁力压缩范围内所有敌人',
        energyCost: 75,
        cooldown: 12000,
        damage: 300,
        range: 200,
        stunDuration: 2000
      }
    ],
    color: 0xff44ff
  }
}

// 获取战甲的完整配置（应用MOD后）
// 注意：modsData参数是MODS对象，由调用方传入以避免循环依赖
export function getWarframeWithMods(warframeId, equippedMods, modsData = null) {
  const base = WARFRAMES[warframeId]
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
    if (!modData || modData.target !== 'warframe') return

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
  if (modified.baseStats.maxHealth < 1) modified.baseStats.maxHealth = 1
  if (modified.baseStats.maxShield < 0) modified.baseStats.maxShield = 0
  if (modified.baseStats.maxEnergy < 1) modified.baseStats.maxEnergy = 1
  if (modified.baseStats.armor < 0) modified.baseStats.armor = 0
  if (modified.baseStats.speed < 0.1) modified.baseStats.speed = 0.1
  if (modified.baseStats.energyEfficiency > 0.9) modified.baseStats.energyEfficiency = 0.9 // 最多90%效率

  // 同步maxHealth/maxShield/maxEnergy 与 health/shield/energy
  // 确保两个版本的属性名都有正确的值
  if (modified.baseStats.maxHealth) {
    modified.baseStats.health = modified.baseStats.maxHealth
  }
  if (modified.baseStats.maxShield) {
    modified.baseStats.shield = modified.baseStats.maxShield
  }
  if (modified.baseStats.maxEnergy) {
    modified.baseStats.energy = modified.baseStats.maxEnergy
  }

  return modified
}
