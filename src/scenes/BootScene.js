import Phaser from 'phaser'

// 当前存档版本号
const SAVE_VERSION = 2

// 存档迁移函数
const MIGRATIONS = {
  // 版本 1 -> 2: 添加 endo、设置、伤害数字等
  1: (state) => {
    // 确保 inventory 结构存在
    if (!state.inventory) {
      state.inventory = {}
    }

    // 添加 endo 字段
    if (state.inventory.endo === undefined) {
      state.inventory.endo = 1000
    }

    // 迁移字段名称: unlockedWarframes -> ownedWarframes
    if (state.unlockedWarframes && !state.ownedWarframes) {
      state.ownedWarframes = [...state.unlockedWarframes]
    }
    if (state.unlockedWeapons && !state.ownedWeapons) {
      state.ownedWeapons = [...state.unlockedWeapons]
    }

    // 添加游戏设置字段
    if (state.showDamageNumbers === undefined) {
      state.showDamageNumbers = true
    }
    if (state.screenShake === undefined) {
      state.screenShake = true
    }

    // 迁移 mastery -> masteryRank
    if (state.mastery !== undefined && state.masteryRank === undefined) {
      state.masteryRank = state.mastery
    }

    return state
  }
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // 显示加载文字
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.add.text(width / 2, height / 2, 'INITIALIZING...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#00ccff'
    }).setOrigin(0.5)
  }

  create() {
    // 初始化游戏存档
    this.initGameState()

    // 跳转到预加载场景
    this.scene.start('PreloadScene')
  }

  initGameState() {
    // 从localStorage读取存档，如果没有则使用默认值
    const savedState = localStorage.getItem('miniWarframeSave')

    if (savedState) {
      try {
        let loaded = JSON.parse(savedState)

        // 检查存档版本并进行迁移
        const saveVersion = loaded._saveVersion || 1
        loaded = this.migrateState(loaded, saveVersion)

        // 先设置默认值，然后用存档覆盖
        // 这样可以确保新版本添加的字段有默认值
        this.setDefaultState()
        // 深度合并存档数据
        window.GAME_STATE = this.mergeState(window.GAME_STATE, loaded)

        // 确保版本号是最新的
        window.GAME_STATE._saveVersion = SAVE_VERSION

        // 如果进行了迁移，立即保存
        if (saveVersion < SAVE_VERSION) {
          console.log(`存档已从版本 ${saveVersion} 迁移到版本 ${SAVE_VERSION}`)
          this.saveGame()
        }
      } catch (e) {
        console.warn('Failed to load save, using defaults:', e)
        this.setDefaultState()
      }
    } else {
      this.setDefaultState()
    }
  }

  migrateState(state, fromVersion) {
    let currentState = { ...state }

    // 依次执行每个版本的迁移
    for (let v = fromVersion; v < SAVE_VERSION; v++) {
      if (MIGRATIONS[v]) {
        console.log(`执行存档迁移: 版本 ${v} -> ${v + 1}`)
        currentState = MIGRATIONS[v](currentState)
      }
    }

    return currentState
  }

  saveGame() {
    try {
      localStorage.setItem('miniWarframeSave', JSON.stringify(window.GAME_STATE))
    } catch (e) {
      console.warn('保存失败:', e)
    }
  }

  mergeState(defaults, saved) {
    const result = { ...defaults }
    for (const key of Object.keys(saved)) {
      if (saved[key] !== null && saved[key] !== undefined) {
        if (typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
          result[key] = this.mergeState(defaults[key] || {}, saved[key])
        } else {
          result[key] = saved[key]
        }
      }
    }
    return result
  }

  setDefaultState() {
    window.GAME_STATE = {
      currentWarframe: 'excalibur',
      currentWeapon: 'braton',
      unlockedWarframes: ['excalibur'],
      unlockedWeapons: ['braton', 'lex'],
      warframeMods: [],
      weaponMods: [],
      inventory: {
        mods: [
          { id: 'vitality', rank: 3 },
          { id: 'redirection', rank: 2 },
          { id: 'serration', rank: 5 },
          { id: 'point_strike', rank: 2 }
        ],
        // 新手初始材料，让玩家能体验铸造功能
        materials: {
          ferrite: 500,
          nano_spores: 300,
          alloy_plate: 200,
          polymer_bundle: 150,
          rubedo: 100,
          salvage: 200,
          plastids: 50,
          circuits: 30,
          morphics: 5,
          neurodes: 2,
          control_module: 1,
          orokin_cell: 1
        },
        // Endo用于MOD升级
        endo: 2000,
        // 初始蓝图
        blueprints: [
          { id: 'braton_vandal', type: 'weapon' },
          { id: 'health_restore', type: 'consumable' }
        ]
      },
      // 已完成的星图节点
      completedNodes: [],
      // 当前任务信息（从星图选择后设置）
      currentMission: null,
      // 铸造队列
      foundryQueue: [],
      credits: 15000,
      masteryRank: 1,
      highScore: 0,
      totalKills: 0,
      totalMissions: 0,
      // 游戏设置
      showDamageNumbers: true,
      screenShake: true,
      // 兼容字段
      ownedWarframes: ['excalibur'],
      ownedWeapons: ['braton', 'lex'],
      // 存档版本号
      _saveVersion: SAVE_VERSION
    }
  }
}
