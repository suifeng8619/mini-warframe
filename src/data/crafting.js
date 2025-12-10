// 合成/打造系统配置
import { WARFRAMES } from './warframes.js'
import { WEAPONS } from './weapons.js'
import { MATERIALS } from './materials.js'

// ========== 战甲蓝图 ==========
export const WARFRAME_BLUEPRINTS = {
  excalibur: {
    id: 'excalibur',
    displayName: '圣剑',
    blueprintCost: 0, // 免费
    buildTime: 0, // 立即完成
    components: {
      chassis: {
        name: '机体',
        materials: {},
        buildTime: 0
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {},
        buildTime: 0
      },
      systems: {
        name: '系统',
        materials: {},
        buildTime: 0
      }
    },
    finalMaterials: {},
    unlocked: true
  },

  volt: {
    id: 'volt',
    displayName: '电击',
    blueprintCost: 15000,
    buildTime: 259200000, // 72小时
    components: {
      chassis: {
        name: '机体',
        materials: {
          ferrite: 1000,
          rubedo: 300,
          morphics: 1,
          credits: 15000
        },
        buildTime: 43200000 // 12小时
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          alloy_plate: 150,
          neural_sensors: 1,
          polymer_bundle: 150,
          rubedo: 500,
          credits: 15000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          ferrite: 500,
          control_module: 1,
          morphics: 1,
          salvage: 500,
          credits: 15000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 1,
      credits: 25000
    },
    dropLocation: 'dojo_tenno_lab'
  },

  mag: {
    id: 'mag',
    displayName: '磁力',
    blueprintCost: 15000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          ferrite: 1000,
          polymer_bundle: 300,
          morphics: 1,
          credits: 15000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          alloy_plate: 150,
          neural_sensors: 1,
          rubedo: 500,
          credits: 15000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 500,
          control_module: 1,
          circuits: 150,
          credits: 15000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 1,
      credits: 25000
    },
    dropLocation: 'boss_sergeant'
  },

  rhino: {
    id: 'rhino',
    displayName: '犀牛',
    blueprintCost: 25000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          ferrite: 1500,
          rubedo: 500,
          morphics: 2,
          plastids: 400,
          credits: 25000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          alloy_plate: 300,
          neural_sensors: 2,
          polymer_bundle: 300,
          credits: 25000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 800,
          control_module: 2,
          morphics: 1,
          circuits: 200,
          credits: 25000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 2,
      credits: 35000
    },
    dropLocation: 'boss_jackal'
  },

  loki: {
    id: 'loki',
    displayName: '洛基',
    blueprintCost: 35000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          ferrite: 1000,
          nano_spores: 1000,
          neurodes: 1,
          credits: 15000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          rubedo: 500,
          neural_sensors: 1,
          polymer_bundle: 200,
          credits: 15000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 600,
          control_module: 1,
          morphics: 2,
          credits: 15000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 1,
      credits: 30000
    },
    dropLocation: 'boss_hyena_pack'
  },

  nova: {
    id: 'nova',
    displayName: '诺瓦',
    blueprintCost: 35000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          alloy_plate: 1500,
          nano_spores: 1500,
          gallium: 2,
          credits: 25000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          rubedo: 800,
          neural_sensors: 2,
          plastids: 500,
          credits: 25000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 1000,
          control_module: 2,
          morphics: 2,
          credits: 25000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 2,
      credits: 40000
    },
    dropLocation: 'boss_raptors'
  },

  trinity: {
    id: 'trinity',
    displayName: '圣女',
    blueprintCost: 25000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          ferrite: 1200,
          polymer_bundle: 500,
          morphics: 1,
          credits: 20000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          alloy_plate: 250,
          neural_sensors: 1,
          rubedo: 600,
          credits: 20000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 700,
          control_module: 1,
          circuits: 250,
          credits: 20000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 1,
      credits: 30000
    },
    dropLocation: 'boss_vor_kril'
  },

  ash: {
    id: 'ash',
    displayName: '灰烬',
    blueprintCost: 40000,
    buildTime: 259200000,
    components: {
      chassis: {
        name: '机体',
        materials: {
          nano_spores: 2000,
          rubedo: 600,
          neurodes: 2,
          credits: 30000
        },
        buildTime: 43200000
      },
      neuroptics: {
        name: '头部神经光元',
        materials: {
          alloy_plate: 400,
          neural_sensors: 2,
          polymer_bundle: 400,
          credits: 30000
        },
        buildTime: 43200000
      },
      systems: {
        name: '系统',
        materials: {
          salvage: 1200,
          control_module: 2,
          gallium: 2,
          credits: 30000
        },
        buildTime: 43200000
      }
    },
    finalMaterials: {
      orokin_cell: 2,
      credits: 45000
    },
    dropLocation: 'manic'
  }
}

// ========== 武器蓝图 ==========
export const WEAPON_BLUEPRINTS = {
  braton: {
    id: 'braton',
    displayName: '布莱顿',
    type: 'primary',
    blueprintCost: 0,
    buildTime: 0,
    materials: {},
    unlocked: true
  },

  boltor: {
    id: 'boltor',
    displayName: '螺钉步枪',
    type: 'primary',
    blueprintCost: 15000,
    buildTime: 43200000,
    materials: {
      ferrite: 600,
      salvage: 900,
      neurodes: 1,
      alloy_plate: 100,
      credits: 20000
    },
    mastery: 2
  },

  lex: {
    id: 'lex',
    displayName: '雷克斯',
    type: 'secondary',
    blueprintCost: 10000,
    buildTime: 43200000,
    materials: {
      ferrite: 500,
      alloy_plate: 200,
      morphics: 1,
      credits: 15000
    },
    mastery: 1
  },

  grakata: {
    id: 'grakata',
    displayName: '葛拉卡达',
    type: 'primary',
    blueprintCost: 15000,
    buildTime: 43200000,
    materials: {
      ferrite: 750,
      salvage: 600,
      circuits: 300,
      neurodes: 1,
      credits: 20000
    },
    mastery: 3
  },

  hek: {
    id: 'hek',
    displayName: '海克',
    type: 'primary',
    blueprintCost: 20000,
    buildTime: 43200000,
    materials: {
      alloy_plate: 900,
      salvage: 500,
      morphics: 2,
      polymer_bundle: 300,
      credits: 25000
    },
    mastery: 4
  },

  soma: {
    id: 'soma',
    displayName: '索玛',
    type: 'primary',
    blueprintCost: 35000,
    buildTime: 86400000, // 24小时
    materials: {
      alloy_plate: 1500,
      circuits: 400,
      control_module: 2,
      neurodes: 2,
      orokin_cell: 1,
      credits: 40000
    },
    mastery: 6
  },

  tigris: {
    id: 'tigris',
    displayName: '猛虎',
    type: 'primary',
    blueprintCost: 25000,
    buildTime: 43200000,
    materials: {
      ferrite: 1200,
      salvage: 800,
      gallium: 2,
      polymer_bundle: 500,
      credits: 30000
    },
    mastery: 4
  },

  aklex: {
    id: 'aklex',
    displayName: '双持雷克斯',
    type: 'secondary',
    blueprintCost: 30000,
    buildTime: 86400000,
    materials: {
      // 需要2把Lex
      lex: 2,
      orokin_cell: 1,
      credits: 25000
    },
    mastery: 4,
    requiresWeapon: ['lex', 'lex']
  },

  dread: {
    id: 'dread',
    displayName: '恐惧',
    type: 'primary',
    blueprintCost: 0, // Boss掉落
    buildTime: 43200000,
    materials: {
      alloy_plate: 800,
      rubedo: 600,
      neurodes: 3,
      gallium: 2,
      credits: 30000
    },
    mastery: 5,
    dropLocation: 'stalker'
  },

  amprex: {
    id: 'amprex',
    displayName: '安培克斯',
    type: 'primary',
    blueprintCost: 40000,
    buildTime: 86400000,
    materials: {
      circuits: 600,
      polymer_bundle: 800,
      neural_sensors: 3,
      control_module: 3,
      orokin_cell: 2,
      credits: 45000
    },
    mastery: 8
  },

  kohm: {
    id: 'kohm',
    displayName: '寇恩',
    type: 'primary',
    blueprintCost: 30000,
    buildTime: 43200000,
    materials: {
      salvage: 1500,
      plastids: 600,
      rubedo: 700,
      morphics: 3,
      credits: 35000
    },
    mastery: 5
  },

  atomos: {
    id: 'atomos',
    displayName: '原子矿融炮',
    type: 'secondary',
    blueprintCost: 25000,
    buildTime: 43200000,
    materials: {
      nano_spores: 1200,
      plastids: 400,
      gallium: 2,
      argon_crystal: 1,
      credits: 30000
    },
    mastery: 5
  },

  opticor: {
    id: 'opticor',
    displayName: '奥堤克光子枪',
    type: 'primary',
    blueprintCost: 50000,
    buildTime: 86400000,
    materials: {
      alloy_plate: 2000,
      circuits: 900,
      neural_sensors: 4,
      control_module: 4,
      orokin_cell: 3,
      forma: 1,
      credits: 60000
    },
    mastery: 10
  }
}

// ========== 消耗品制作 ==========
export const CONSUMABLE_BLUEPRINTS = {
  health_restore_small: {
    id: 'health_restore_small',
    displayName: '生命恢复剂(小)',
    buildTime: 60000,
    materials: {
      nano_spores: 200,
      polymer_bundle: 50,
      credits: 500
    },
    quantity: 10
  },

  health_restore_medium: {
    id: 'health_restore_medium',
    displayName: '生命恢复剂(中)',
    buildTime: 120000,
    materials: {
      nano_spores: 500,
      polymer_bundle: 150,
      morphics: 1,
      credits: 1500
    },
    quantity: 10
  },

  energy_restore_small: {
    id: 'energy_restore_small',
    displayName: '能量恢复剂(小)',
    buildTime: 60000,
    materials: {
      rubedo: 200,
      circuits: 50,
      credits: 500
    },
    quantity: 10
  },

  energy_restore_medium: {
    id: 'energy_restore_medium',
    displayName: '能量恢复剂(中)',
    buildTime: 120000,
    materials: {
      rubedo: 500,
      circuits: 150,
      control_module: 1,
      credits: 1500
    },
    quantity: 10
  },

  ammo_restore: {
    id: 'ammo_restore',
    displayName: '弹药恢复剂',
    buildTime: 60000,
    materials: {
      ferrite: 300,
      salvage: 200,
      credits: 400
    },
    quantity: 20
  },

  forma: {
    id: 'forma',
    displayName: 'Forma',
    buildTime: 86400000, // 24小时
    materials: {
      neurodes: 1,
      morphics: 1,
      control_module: 1,
      orokin_cell: 1,
      credits: 35000
    },
    quantity: 1,
    blueprintSource: 'void'
  }
}

// ========== 特殊制作 ==========
export const SPECIAL_CRAFTING = {
  orokin_reactor: {
    id: 'orokin_reactor',
    displayName: 'Orokin反应堆',
    description: '使战甲MOD容量翻倍',
    buildTime: 86400000,
    materials: {
      control_module: 2,
      neural_sensors: 2,
      orokin_cell: 2,
      argon_crystal: 1,
      credits: 50000
    },
    blueprintSource: 'alert'
  },

  orokin_catalyst: {
    id: 'orokin_catalyst',
    displayName: 'Orokin催化剂',
    description: '使武器MOD容量翻倍',
    buildTime: 86400000,
    materials: {
      control_module: 2,
      gallium: 2,
      orokin_cell: 2,
      argon_crystal: 1,
      credits: 50000
    },
    blueprintSource: 'alert'
  },

  exilus_adapter: {
    id: 'exilus_adapter',
    displayName: 'Exilus适配器',
    description: '解锁战甲的Exilus槽位',
    buildTime: 86400000,
    materials: {
      forma: 2,
      neurodes: 3,
      control_module: 3,
      argon_crystal: 2,
      credits: 75000
    },
    blueprintSource: 'simaris'
  }
}

// ========== 制造厂状态 ==========
export const FOUNDRY_SLOTS = 3 // 同时可制造数量

// 开始制造
export function startCrafting(itemId, category, playerData) {
  let blueprint = null

  if (category === 'warframe') {
    blueprint = WARFRAME_BLUEPRINTS[itemId]
  } else if (category === 'weapon') {
    blueprint = WEAPON_BLUEPRINTS[itemId]
  } else if (category === 'consumable') {
    blueprint = CONSUMABLE_BLUEPRINTS[itemId]
  } else if (category === 'special') {
    blueprint = SPECIAL_CRAFTING[itemId]
  }

  if (!blueprint) {
    return { success: false, reason: '蓝图不存在' }
  }

  // 检查制造槽位
  const activeCrafts = playerData.foundry?.active || []
  if (activeCrafts.length >= FOUNDRY_SLOTS) {
    return { success: false, reason: '制造槽位已满' }
  }

  // 检查材料
  const materials = category === 'warframe' ? blueprint.finalMaterials : blueprint.materials
  for (const [materialId, amount] of Object.entries(materials)) {
    if ((playerData.inventory?.[materialId] || 0) < amount) {
      const mat = MATERIALS[materialId]
      return { success: false, reason: `${mat?.displayName || materialId}不足` }
    }
  }

  // 扣除材料
  const newInventory = { ...playerData.inventory }
  for (const [materialId, amount] of Object.entries(materials)) {
    newInventory[materialId] = (newInventory[materialId] || 0) - amount
  }

  // 添加制造任务
  const craftTask = {
    id: `${Date.now()}_${itemId}`,
    itemId,
    category,
    startTime: Date.now(),
    endTime: Date.now() + blueprint.buildTime,
    quantity: blueprint.quantity || 1
  }

  return {
    success: true,
    inventory: newInventory,
    craftTask
  }
}

// 检查制造是否完成
export function checkCraftingComplete(craftTask) {
  return Date.now() >= craftTask.endTime
}

// 领取制造完成的物品
export function claimCrafted(craftTask, playerData) {
  if (!checkCraftingComplete(craftTask)) {
    return { success: false, reason: '制造尚未完成' }
  }

  const newPlayerData = { ...playerData }
  const { itemId, category, quantity } = craftTask

  if (category === 'warframe') {
    newPlayerData.ownedWarframes = [...(newPlayerData.ownedWarframes || []), itemId]
  } else if (category === 'weapon') {
    newPlayerData.ownedWeapons = [...(newPlayerData.ownedWeapons || []), itemId]
  } else if (category === 'consumable' || category === 'special') {
    newPlayerData.inventory = newPlayerData.inventory || {}
    newPlayerData.inventory[itemId] = (newPlayerData.inventory[itemId] || 0) + quantity
  }

  return { success: true, playerData: newPlayerData }
}

// 使用白金加速制造
export function rushCrafting(craftTask, playerData) {
  const remainingTime = craftTask.endTime - Date.now()
  if (remainingTime <= 0) {
    return { success: false, reason: '已完成' }
  }

  // 每小时花费2白金
  const platinumCost = Math.ceil(remainingTime / 3600000) * 2
  if ((playerData.platinum || 0) < platinumCost) {
    return { success: false, reason: '白金不足' }
  }

  return {
    success: true,
    platinumCost,
    newEndTime: Date.now()
  }
}

// 获取蓝图信息
export function getBlueprintInfo(itemId, category) {
  if (category === 'warframe') return WARFRAME_BLUEPRINTS[itemId]
  if (category === 'weapon') return WEAPON_BLUEPRINTS[itemId]
  if (category === 'consumable') return CONSUMABLE_BLUEPRINTS[itemId]
  if (category === 'special') return SPECIAL_CRAFTING[itemId]
  return null
}

// 格式化剩余时间
export function formatBuildTime(ms) {
  if (ms <= 0) return '已完成'

  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  if (hours > 0) {
    return `${hours}时${minutes}分`
  } else if (minutes > 0) {
    return `${minutes}分${seconds}秒`
  } else {
    return `${seconds}秒`
  }
}
