import Phaser from 'phaser'
import { OPEN_WORLDS, getWorldTimePhase } from '../data/openworld.js'

// 星球/节点配置
const PLANETS = {
  earth: {
    id: 'earth',
    name: '地球',
    color: 0x44aa44,
    position: { x: 200, y: 300 },
    faction: 'grineer',
    unlocked: true,
    nodes: [
      { id: 'e_defense', name: '防御', type: 'defense', difficulty: 1, enemyLevel: [1, 5] },
      { id: 'e_exterminate', name: '歼灭', type: 'exterminate', difficulty: 1, enemyLevel: [1, 8] },
      { id: 'e_survival', name: '生存', type: 'survival', difficulty: 2, enemyLevel: [5, 15] },
      { id: 'e_boss', name: '议员大厅', type: 'boss', difficulty: 3, enemyLevel: [10, 15], bossType: 'captain_vor' }
    ],
    openWorld: 'plains_of_eidolon'
  },
  venus: {
    id: 'venus',
    name: '金星',
    color: 0xffaa44,
    position: { x: 350, y: 200 },
    faction: 'corpus',
    unlocked: false,
    unlockCondition: { type: 'node', nodeId: 'e_boss' },
    nodes: [
      { id: 'v_capture', name: '捕获', type: 'capture', difficulty: 2, enemyLevel: [5, 10] },
      { id: 'v_spy', name: '间谍', type: 'spy', difficulty: 2, enemyLevel: [8, 15] },
      { id: 'v_defense', name: '防御', type: 'defense', difficulty: 2, enemyLevel: [10, 18] },
      { id: 'v_boss', name: 'Jackal工厂', type: 'boss', difficulty: 4, enemyLevel: [15, 20], bossType: 'jackal' }
    ],
    openWorld: 'orb_vallis'
  },
  mars: {
    id: 'mars',
    name: '火星',
    color: 0xcc4422,
    position: { x: 520, y: 280 },
    faction: 'grineer',
    unlocked: false,
    unlockCondition: { type: 'node', nodeId: 'v_boss' },
    nodes: [
      { id: 'm_exterminate', name: '歼灭', type: 'exterminate', difficulty: 3, enemyLevel: [15, 22] },
      { id: 'm_sabotage', name: '破坏', type: 'sabotage', difficulty: 3, enemyLevel: [18, 25] },
      { id: 'm_survival', name: '生存', type: 'survival', difficulty: 4, enemyLevel: [20, 30] },
      { id: 'm_boss', name: '战争领主', type: 'boss', difficulty: 5, enemyLevel: [25, 30], bossType: 'phorid' }
    ]
  },
  jupiter: {
    id: 'jupiter',
    name: '木星',
    color: 0xddaa88,
    position: { x: 700, y: 180 },
    faction: 'corpus',
    unlocked: false,
    unlockCondition: { type: 'node', nodeId: 'm_boss' },
    nodes: [
      { id: 'j_capture', name: '捕获', type: 'capture', difficulty: 4, enemyLevel: [25, 32] },
      { id: 'j_defense', name: '防御', type: 'defense', difficulty: 4, enemyLevel: [28, 35] },
      { id: 'j_spy', name: '间谍', type: 'spy', difficulty: 5, enemyLevel: [30, 40] },
      { id: 'j_boss', name: '机械军团', type: 'boss', difficulty: 6, enemyLevel: [35, 45], bossType: 'jackal' }
    ]
  },
  saturn: {
    id: 'saturn',
    name: '土星',
    color: 0xccaa66,
    position: { x: 880, y: 300 },
    faction: 'grineer',
    unlocked: false,
    unlockCondition: { type: 'node', nodeId: 'j_boss' },
    nodes: [
      { id: 's_survival', name: '生存', type: 'survival', difficulty: 5, enemyLevel: [35, 45] },
      { id: 's_exterminate', name: '歼灭', type: 'exterminate', difficulty: 5, enemyLevel: [38, 48] },
      { id: 's_defense', name: '防御', type: 'defense', difficulty: 6, enemyLevel: [40, 50] },
      { id: 's_boss', name: '重装堡垒', type: 'boss', difficulty: 7, enemyLevel: [45, 55], bossType: 'captain_vor' }
    ]
  },
  deimos: {
    id: 'deimos',
    name: '火卫二',
    color: 0x884466,
    position: { x: 640, y: 380 },
    faction: 'infested',
    unlocked: false,
    unlockCondition: { type: 'mastery', level: 5 },
    nodes: [
      { id: 'd_exterminate', name: '净化', type: 'exterminate', difficulty: 5, enemyLevel: [30, 40] },
      { id: 'd_survival', name: '生存', type: 'survival', difficulty: 6, enemyLevel: [35, 50] },
      { id: 'd_boss', name: '巢穴核心', type: 'boss', difficulty: 7, enemyLevel: [40, 55], bossType: 'phorid' }
    ],
    openWorld: 'cambion_drift'
  },
  void: {
    id: 'void',
    name: '虚空',
    color: 0xffffff,
    position: { x: 1050, y: 220 },
    faction: 'corrupted',
    unlocked: false,
    unlockCondition: { type: 'node', nodeId: 's_boss' },
    nodes: [
      { id: 'void_capture', name: '捕获', type: 'capture', difficulty: 6, enemyLevel: [40, 50] },
      { id: 'void_survival', name: '生存', type: 'survival', difficulty: 7, enemyLevel: [45, 60] },
      { id: 'void_defense', name: '防御', type: 'defense', difficulty: 8, enemyLevel: [50, 70] }
    ]
  }
}

// 任务类型配置
const MISSION_TYPES = {
  defense: { name: '防御', description: '保护目标存活指定波数', icon: 'shield', waves: true },
  exterminate: { name: '歼灭', description: '消灭所有敌人', icon: 'skull' },
  survival: { name: '生存', description: '坚持指定时间', icon: 'clock', timed: true },
  capture: { name: '捕获', description: '捕获目标并撤离', icon: 'target' },
  spy: { name: '间谍', description: '入侵数据终端', icon: 'eye' },
  sabotage: { name: '破坏', description: '摧毁敌人设施', icon: 'bomb' },
  boss: { name: 'Boss战', description: '击败Boss', icon: 'crown' }
}

export class NavigationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NavigationScene' })
  }

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // 初始化已完成节点
    if (!window.GAME_STATE.completedNodes) {
      window.GAME_STATE.completedNodes = []
    }

    // 当前选择
    this.selectedPlanet = null
    this.selectedNode = null

    // 背景 - 星空效果
    this.createStarfield()

    // 标题
    this.add.text(this.width / 2, 40, '星图导航', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#00ccff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    // 创建星球
    this.createPlanets()

    // 节点列表面板
    this.createNodePanel()

    // 任务详情面板
    this.createMissionPanel()

    // 返回按钮
    this.createBackButton()

    // 玩家信息
    this.createPlayerInfo()
  }

  createStarfield() {
    // 深色背景
    const bg = this.add.graphics()
    bg.fillStyle(0x050510, 1)
    bg.fillRect(0, 0, this.width, this.height)

    // 随机星星
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      const size = Math.random() * 2 + 0.5
      const alpha = Math.random() * 0.5 + 0.3

      const star = this.add.circle(x, y, size, 0xffffff, alpha)

      // 闪烁动画
      if (Math.random() > 0.7) {
        this.tweens.add({
          targets: star,
          alpha: alpha * 0.3,
          duration: 1000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1
        })
      }
    }

    // 连接线 (星球之间的航线)
    this.connectionLines = this.add.graphics()
    this.drawConnections()
  }

  drawConnections() {
    this.connectionLines.clear()
    this.connectionLines.lineStyle(1, 0x334455, 0.5)

    const connections = [
      ['earth', 'venus'],
      ['venus', 'mars'],
      ['mars', 'jupiter'],
      ['jupiter', 'saturn'],
      ['saturn', 'void'],
      ['mars', 'deimos']
    ]

    connections.forEach(([from, to]) => {
      const p1 = PLANETS[from].position
      const p2 = PLANETS[to].position
      this.connectionLines.lineBetween(p1.x, p1.y, p2.x, p2.y)
    })
  }

  createPlanets() {
    this.planetButtons = {}

    Object.values(PLANETS).forEach(planet => {
      const { x, y } = planet.position
      const isUnlocked = this.isPlanetUnlocked(planet)

      // 星球容器
      const container = this.add.container(x, y)

      // 星球圆形
      const planetCircle = this.add.circle(0, 0, 35, planet.color, isUnlocked ? 1 : 0.3)
      planetCircle.setStrokeStyle(3, isUnlocked ? 0xffffff : 0x444444, isUnlocked ? 0.8 : 0.3)

      // 发光效果
      if (isUnlocked) {
        const glow = this.add.circle(0, 0, 45, planet.color, 0.2)
        container.add(glow)

        // 脉冲动画
        this.tweens.add({
          targets: glow,
          scale: 1.2,
          alpha: 0.1,
          duration: 1500,
          yoyo: true,
          repeat: -1
        })
      }

      // 星球名称
      const nameText = this.add.text(0, 50, planet.name, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: isUnlocked ? '#ffffff' : '#555555'
      }).setOrigin(0.5)

      // 阵营图标
      const factionColor = {
        grineer: '#ff6644',
        corpus: '#44aaff',
        infested: '#66ff44',
        corrupted: '#ffaa44'
      }[planet.faction]

      const factionDot = this.add.circle(0, -45, 5, Phaser.Display.Color.HexStringToColor(factionColor).color)

      container.add([planetCircle, nameText, factionDot])

      // 交互
      if (isUnlocked) {
        container.setSize(80, 80)
        container.setInteractive()

        container.on('pointerover', () => {
          planetCircle.setScale(1.1)
          nameText.setColor('#ffcc00')
        })

        container.on('pointerout', () => {
          planetCircle.setScale(1)
          nameText.setColor('#ffffff')
        })

        container.on('pointerdown', () => {
          if (window.audioManager) {
            window.audioManager.playUIClick()
          }
          this.selectPlanet(planet)
        })
      }

      this.planetButtons[planet.id] = container
    })
  }

  isPlanetUnlocked(planet) {
    if (planet.unlocked) return true

    const condition = planet.unlockCondition
    if (!condition) return false

    if (condition.type === 'node') {
      return (window.GAME_STATE.completedNodes || []).includes(condition.nodeId)
    }
    if (condition.type === 'mastery') {
      return (window.GAME_STATE.masteryRank || 0) >= condition.level
    }

    return false
  }

  selectPlanet(planet) {
    this.selectedPlanet = planet
    this.selectedNode = null
    this.refreshNodePanel()
    this.refreshMissionPanel()

    // 高亮选中的星球
    Object.entries(this.planetButtons).forEach(([id, container]) => {
      const isSelected = id === planet.id
      container.first.setStrokeStyle(3, isSelected ? 0xffcc00 : 0xffffff, isSelected ? 1 : 0.8)
    })
  }

  createNodePanel() {
    // 节点列表背景
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x112233, 0.9)
    panelBg.fillRoundedRect(30, 450, 350, 210, 8)
    panelBg.lineStyle(2, 0x334455, 1)
    panelBg.strokeRoundedRect(30, 450, 350, 210, 8)

    // 标题
    this.nodePanelTitle = this.add.text(205, 465, '选择一个星球', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)

    // 节点列表容器
    this.nodeContainer = this.add.container(30, 490)
  }

  refreshNodePanel() {
    this.nodeContainer.removeAll(true)

    if (!this.selectedPlanet) {
      this.nodePanelTitle.setText('选择一个星球')
      return
    }

    this.nodePanelTitle.setText(`${this.selectedPlanet.name} - 任务节点`)

    // 开放世界入口
    if (this.selectedPlanet.openWorld) {
      const owData = OPEN_WORLDS[this.selectedPlanet.openWorld]
      if (owData) {
        const owButton = this.createOpenWorldButton(owData, 0)
        this.nodeContainer.add(owButton)
      }
    }

    // 任务节点
    const startY = this.selectedPlanet.openWorld ? 50 : 0
    this.selectedPlanet.nodes.forEach((node, index) => {
      const nodeButton = this.createNodeButton(node, startY + index * 40)
      this.nodeContainer.add(nodeButton)
    })
  }

  createOpenWorldButton(owData, y) {
    const container = this.add.container(10, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x224433, 0.8)
    bg.fillRoundedRect(0, 0, 330, 38, 4)
    bg.lineStyle(1, 0x44aa66, 1)
    bg.strokeRoundedRect(0, 0, 330, 38, 4)

    const icon = this.add.text(15, 10, '[OW]', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#44ff88'
    })

    const nameText = this.add.text(55, 10, owData.displayName, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88ffaa'
    })

    container.add([bg, icon, nameText])
    container.setSize(330, 38)
    container.setInteractive()

    container.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x335544, 0.9)
      bg.fillRoundedRect(0, 0, 330, 38, 4)
      bg.lineStyle(1, 0x66cc88, 1)
      bg.strokeRoundedRect(0, 0, 330, 38, 4)
    })

    container.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x224433, 0.8)
      bg.fillRoundedRect(0, 0, 330, 38, 4)
      bg.lineStyle(1, 0x44aa66, 1)
      bg.strokeRoundedRect(0, 0, 330, 38, 4)
    })

    container.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.showMessage('开放世界功能开发中...', '#ffaa00')
    })

    return container
  }

  createNodeButton(node, y) {
    const container = this.add.container(10, y)
    const isCompleted = (window.GAME_STATE.completedNodes || []).includes(node.id)
    const missionType = MISSION_TYPES[node.type]

    const bg = this.add.graphics()
    if (isCompleted) {
      bg.fillStyle(0x223322, 0.7)
      bg.lineStyle(1, 0x446644, 1)
    } else {
      bg.fillStyle(0x223344, 0.7)
      bg.lineStyle(1, 0x334455, 1)
    }
    bg.fillRoundedRect(0, 0, 330, 35, 4)
    bg.strokeRoundedRect(0, 0, 330, 35, 4)

    // 类型图标
    const typeIcon = this.add.text(15, 8, missionType.name.charAt(0), {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: node.type === 'boss' ? '#ffaa00' : '#88aacc'
    })

    // 名称
    const nameText = this.add.text(40, 8, node.name, {
      fontFamily: 'Arial',
      fontSize: '15px',
      color: isCompleted ? '#88cc88' : '#ffffff'
    })

    // 等级范围
    const levelText = this.add.text(315, 8, `Lv.${node.enemyLevel[0]}-${node.enemyLevel[1]}`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888'
    }).setOrigin(1, 0)

    // 完成标记
    if (isCompleted) {
      const checkMark = this.add.text(200, 8, '[已完成]', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#66aa66'
      })
      container.add(checkMark)
    }

    container.add([bg, typeIcon, nameText, levelText])
    container.setSize(330, 35)
    container.setInteractive()

    container.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x334455, 0.9)
      bg.fillRoundedRect(0, 0, 330, 35, 4)
      bg.lineStyle(1, 0x5588aa, 1)
      bg.strokeRoundedRect(0, 0, 330, 35, 4)
    })

    container.on('pointerout', () => {
      bg.clear()
      if (isCompleted) {
        bg.fillStyle(0x223322, 0.7)
        bg.lineStyle(1, 0x446644, 1)
      } else {
        bg.fillStyle(0x223344, 0.7)
        bg.lineStyle(1, 0x334455, 1)
      }
      bg.fillRoundedRect(0, 0, 330, 35, 4)
      bg.strokeRoundedRect(0, 0, 330, 35, 4)
    })

    container.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.selectedNode = node
      this.refreshMissionPanel()
    })

    return container
  }

  createMissionPanel() {
    // 任务详情背景
    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x112233, 0.9)
    panelBg.fillRoundedRect(400, 450, 450, 210, 8)
    panelBg.lineStyle(2, 0x334455, 1)
    panelBg.strokeRoundedRect(400, 450, 450, 210, 8)

    this.missionContainer = this.add.container(400, 450)
    this.refreshMissionPanel()
  }

  refreshMissionPanel() {
    this.missionContainer.removeAll(true)

    if (!this.selectedNode) {
      const hint = this.add.text(225, 100, '选择一个任务节点', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#666666'
      }).setOrigin(0.5)
      this.missionContainer.add(hint)
      return
    }

    const node = this.selectedNode
    const missionType = MISSION_TYPES[node.type]

    // 任务名称
    const titleText = this.add.text(225, 25, node.name, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: node.type === 'boss' ? '#ffaa00' : '#00ccff'
    }).setOrigin(0.5)
    this.missionContainer.add(titleText)

    // 任务类型
    const typeText = this.add.text(225, 55, missionType.name, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)
    this.missionContainer.add(typeText)

    // 分隔线
    const divider = this.add.graphics()
    divider.lineStyle(1, 0x445566, 1)
    divider.lineBetween(20, 75, 430, 75)
    this.missionContainer.add(divider)

    // 描述
    const descText = this.add.text(20, 90, missionType.description, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#aaaaaa'
    })
    this.missionContainer.add(descText)

    // 敌人等级
    const levelText = this.add.text(20, 115, `敌人等级: ${node.enemyLevel[0]} - ${node.enemyLevel[1]}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    })
    this.missionContainer.add(levelText)

    // 阵营
    const factionText = this.add.text(200, 115, `阵营: ${this.selectedPlanet.faction}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#888888'
    })
    this.missionContainer.add(factionText)

    // 难度
    const difficultyStars = '★'.repeat(node.difficulty) + '☆'.repeat(10 - node.difficulty)
    const diffText = this.add.text(20, 140, `难度: ${difficultyStars.substring(0, 10)}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffaa00'
    })
    this.missionContainer.add(diffText)

    // 开始任务按钮
    this.createStartButton(350, 175)
  }

  createStartButton(x, y) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x44aa44, 0.9)
    bg.lineStyle(2, 0x66cc66, 1)
    bg.fillRoundedRect(-70, -22, 140, 44, 6)
    bg.strokeRoundedRect(-70, -22, 140, 44, 6)

    const label = this.add.text(0, 0, '开始任务', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(140, 44)
    button.setInteractive()

    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x55bb55, 1)
      bg.lineStyle(2, 0x88ee88, 1)
      bg.fillRoundedRect(-70, -22, 140, 44, 6)
      bg.strokeRoundedRect(-70, -22, 140, 44, 6)
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x44aa44, 0.9)
      bg.lineStyle(2, 0x66cc66, 1)
      bg.fillRoundedRect(-70, -22, 140, 44, 6)
      bg.strokeRoundedRect(-70, -22, 140, 44, 6)
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.startMission()
    })

    this.missionContainer.add(button)
  }

  startMission() {
    if (!this.selectedNode) return

    // 存储当前任务信息
    window.GAME_STATE.currentMission = {
      nodeId: this.selectedNode.id,
      type: this.selectedNode.type,
      enemyLevel: this.selectedNode.enemyLevel,
      bossType: this.selectedNode.bossType,
      planet: this.selectedPlanet.id,
      faction: this.selectedPlanet.faction
    }

    // 跳转到游戏场景
    this.scene.start('GameScene')
  }

  createBackButton() {
    const button = this.add.container(70, 680)

    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.8)
    bg.fillRoundedRect(-50, -20, 100, 40, 6)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-50, -20, 100, 40, 6)

    const label = this.add.text(0, 0, '返回', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#88aacc'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(100, 40)
    button.setInteractive()

    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x334455, 0.9)
      bg.fillRoundedRect(-50, -20, 100, 40, 6)
      bg.lineStyle(2, 0x66aacc, 1)
      bg.strokeRoundedRect(-50, -20, 100, 40, 6)
      label.setColor('#ffffff')
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.8)
      bg.fillRoundedRect(-50, -20, 100, 40, 6)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-50, -20, 100, 40, 6)
      label.setColor('#88aacc')
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.scene.start('MenuScene')
    })
  }

  createPlayerInfo() {
    // 玩家信息面板
    const infoBg = this.add.graphics()
    infoBg.fillStyle(0x112233, 0.8)
    infoBg.fillRoundedRect(880, 450, 370, 210, 8)
    infoBg.lineStyle(2, 0x334455, 1)
    infoBg.strokeRoundedRect(880, 450, 370, 210, 8)

    // 当前装备
    this.add.text(900, 470, '当前装备', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffaa00'
    })

    this.add.text(900, 500, `战甲: ${window.GAME_STATE.currentWarframe}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    })

    this.add.text(900, 525, `武器: ${window.GAME_STATE.currentWeapon}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    })

    // 资源
    this.add.text(900, 560, '资源', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffaa00'
    })

    this.add.text(900, 590, `星币: ${(window.GAME_STATE.credits || 0).toLocaleString()}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffcc00'
    })

    // 段位
    this.add.text(1050, 590, `段位: ${window.GAME_STATE.masteryRank || 0}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    })

    // 已完成节点数
    const completedCount = (window.GAME_STATE.completedNodes || []).length
    this.add.text(900, 620, `已完成节点: ${completedCount}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88cc88'
    })
  }

  showMessage(text, color) {
    const message = this.add.text(this.width / 2, this.height / 2, text, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: color,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(1000)

    this.tweens.add({
      targets: message,
      y: message.y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        message.destroy()
      }
    })
  }
}
