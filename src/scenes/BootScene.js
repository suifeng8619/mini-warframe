import Phaser from 'phaser'

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
        const loaded = JSON.parse(savedState)
        // 先设置默认值，然后用存档覆盖
        // 这样可以确保新版本添加的字段有默认值
        this.setDefaultState()
        // 深度合并存档数据
        window.GAME_STATE = this.mergeState(window.GAME_STATE, loaded)
      } catch (e) {
        console.warn('Failed to load save, using defaults')
        this.setDefaultState()
      }
    } else {
      this.setDefaultState()
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
      mastery: 1,
      highScore: 0,
      totalKills: 0,
      totalMissions: 0
    }
  }
}
