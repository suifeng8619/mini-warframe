import Phaser from 'phaser'
import {
  WARFRAME_BLUEPRINTS,
  WEAPON_BLUEPRINTS,
  CONSUMABLE_BLUEPRINTS,
  SPECIAL_CRAFTING,
  FOUNDRY_SLOTS,
  startCrafting,
  checkCraftingComplete,
  claimCrafted,
  formatBuildTime
} from '../data/crafting.js'
import { MATERIALS } from '../data/materials.js'

export class FoundryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FoundryScene' })
  }

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // 初始化制造队列
    if (!window.GAME_STATE.foundry) {
      window.GAME_STATE.foundry = { active: [] }
    }

    // 当前选择的分类
    this.currentCategory = 'warframe'
    this.selectedBlueprint = null
    this.scrollOffset = 0

    // 背景
    this.add.image(this.width / 2, this.height / 2, 'background')

    // 暗色遮罩
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.width, this.height)

    // 标题
    this.add.text(this.width / 2, 40, '铸造厂', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#ffaa00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    // 创建UI
    this.createCategoryTabs()
    this.createBlueprintList()
    this.createDetailPanel()
    this.createCraftingQueue()
    this.createResourceBar()

    // 返回按钮
    this.createBackButton()

    // 更新定时器
    this.time.addEvent({
      delay: 1000,
      callback: this.updateCraftingQueue,
      callbackScope: this,
      loop: true
    })
  }

  createCategoryTabs() {
    const categories = [
      { id: 'warframe', name: '战甲' },
      { id: 'weapon', name: '武器' },
      { id: 'consumable', name: '消耗品' },
      { id: 'special', name: '特殊' }
    ]

    this.categoryButtons = []
    const startX = 100
    const tabWidth = 120

    categories.forEach((cat, index) => {
      const x = startX + index * (tabWidth + 10)
      const button = this.createTabButton(x, 100, tabWidth, cat.name, () => {
        this.currentCategory = cat.id
        this.selectedBlueprint = null
        this.scrollOffset = 0
        this.updateCategoryHighlight()
        this.refreshBlueprintList()
        this.refreshDetailPanel()
      })
      button.categoryId = cat.id
      this.categoryButtons.push(button)
    })

    this.updateCategoryHighlight()
  }

  createTabButton(x, y, width, text, callback) {
    const container = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.8)
    bg.fillRoundedRect(-width / 2, -20, width, 40, 6)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#88aacc'
    }).setOrigin(0.5)

    container.add([bg, label])
    container.setSize(width, 40)
    container.setInteractive()
    container.bg = bg
    container.label = label

    container.on('pointerover', () => {
      if (container.categoryId !== this.currentCategory) {
        bg.clear()
        bg.fillStyle(0x334455, 0.9)
        bg.fillRoundedRect(-width / 2, -20, width, 40, 6)
        bg.lineStyle(2, 0x66aacc, 1)
        bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)
      }
    })

    container.on('pointerout', () => {
      this.updateCategoryHighlight()
    })

    container.on('pointerdown', callback)

    return container
  }

  updateCategoryHighlight() {
    this.categoryButtons.forEach(btn => {
      const isActive = btn.categoryId === this.currentCategory
      const width = 120

      btn.bg.clear()
      if (isActive) {
        btn.bg.fillStyle(0x445566, 1)
        btn.bg.fillRoundedRect(-width / 2, -20, width, 40, 6)
        btn.bg.lineStyle(2, 0xffaa00, 1)
        btn.bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)
        btn.label.setColor('#ffaa00')
      } else {
        btn.bg.fillStyle(0x223344, 0.8)
        btn.bg.fillRoundedRect(-width / 2, -20, width, 40, 6)
        btn.bg.lineStyle(2, 0x4488aa, 1)
        btn.bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)
        btn.label.setColor('#88aacc')
      }
    })
  }

  createBlueprintList() {
    // 列表容器背景
    const listBg = this.add.graphics()
    listBg.fillStyle(0x112233, 0.9)
    listBg.fillRoundedRect(30, 140, 350, 420, 8)
    listBg.lineStyle(2, 0x334455, 1)
    listBg.strokeRoundedRect(30, 140, 350, 420, 8)

    // 列表标题
    this.add.text(205, 155, '可制造物品', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)

    // 列表区域
    this.listContainer = this.add.container(30, 180)

    // 创建遮罩
    const maskShape = this.make.graphics()
    maskShape.fillStyle(0xffffff)
    maskShape.fillRect(30, 180, 350, 370)
    const mask = maskShape.createGeometryMask()
    this.listContainer.setMask(mask)

    this.refreshBlueprintList()

    // 滚动
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x > 30 && pointer.x < 380 && pointer.y > 180 && pointer.y < 550) {
        this.scrollOffset += deltaY * 0.5
        this.scrollOffset = Math.max(0, this.scrollOffset)
        this.refreshBlueprintList()
      }
    })
  }

  refreshBlueprintList() {
    this.listContainer.removeAll(true)

    let blueprints = {}
    if (this.currentCategory === 'warframe') {
      blueprints = WARFRAME_BLUEPRINTS
    } else if (this.currentCategory === 'weapon') {
      blueprints = WEAPON_BLUEPRINTS
    } else if (this.currentCategory === 'consumable') {
      blueprints = CONSUMABLE_BLUEPRINTS
    } else if (this.currentCategory === 'special') {
      blueprints = SPECIAL_CRAFTING
    }

    const items = Object.values(blueprints)
    const itemHeight = 60
    const maxScroll = Math.max(0, items.length * itemHeight - 360)
    this.scrollOffset = Math.min(this.scrollOffset, maxScroll)

    items.forEach((blueprint, index) => {
      const y = index * itemHeight - this.scrollOffset

      if (y < -itemHeight || y > 380) return

      const itemContainer = this.add.container(10, y)

      // 背景
      const itemBg = this.add.graphics()
      const isSelected = this.selectedBlueprint?.id === blueprint.id
      const owned = this.isOwned(blueprint.id)

      if (isSelected) {
        itemBg.fillStyle(0x445566, 0.9)
        itemBg.lineStyle(2, 0xffaa00, 1)
      } else if (owned) {
        itemBg.fillStyle(0x224422, 0.7)
        itemBg.lineStyle(1, 0x446644, 1)
      } else {
        itemBg.fillStyle(0x223344, 0.7)
        itemBg.lineStyle(1, 0x334455, 1)
      }
      itemBg.fillRoundedRect(0, 0, 330, 55, 6)
      itemBg.strokeRoundedRect(0, 0, 330, 55, 6)

      // 名称
      const nameColor = owned ? '#88cc88' : '#ffffff'
      const nameText = this.add.text(15, 10, blueprint.displayName, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: nameColor
      })

      // 状态/类型标签
      let statusText = ''
      if (owned) {
        statusText = '已拥有'
      } else if (blueprint.buildTime === 0) {
        statusText = '即时'
      } else {
        statusText = formatBuildTime(blueprint.buildTime)
      }

      const statusLabel = this.add.text(315, 10, statusText, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: owned ? '#88cc88' : '#888888'
      }).setOrigin(1, 0)

      // 材料需求数量
      const materials = this.currentCategory === 'warframe' ?
        blueprint.finalMaterials : blueprint.materials
      const materialCount = Object.keys(materials || {}).length

      const materialText = this.add.text(15, 35, `需要 ${materialCount} 种材料`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#666666'
      })

      itemContainer.add([itemBg, nameText, statusLabel, materialText])

      // 交互
      itemContainer.setSize(330, 55)
      itemContainer.setInteractive()

      itemContainer.on('pointerover', () => {
        if (!isSelected) {
          itemBg.clear()
          itemBg.fillStyle(0x334455, 0.9)
          itemBg.fillRoundedRect(0, 0, 330, 55, 6)
          itemBg.lineStyle(1, 0x5588aa, 1)
          itemBg.strokeRoundedRect(0, 0, 330, 55, 6)
        }
      })

      itemContainer.on('pointerout', () => {
        if (!isSelected) {
          itemBg.clear()
          if (owned) {
            itemBg.fillStyle(0x224422, 0.7)
            itemBg.lineStyle(1, 0x446644, 1)
          } else {
            itemBg.fillStyle(0x223344, 0.7)
            itemBg.lineStyle(1, 0x334455, 1)
          }
          itemBg.fillRoundedRect(0, 0, 330, 55, 6)
          itemBg.strokeRoundedRect(0, 0, 330, 55, 6)
        }
      })

      itemContainer.on('pointerdown', () => {
        this.selectedBlueprint = blueprint
        this.refreshBlueprintList()
        this.refreshDetailPanel()
      })

      this.listContainer.add(itemContainer)
    })
  }

  isOwned(itemId) {
    if (this.currentCategory === 'warframe') {
      return (window.GAME_STATE.ownedWarframes || []).includes(itemId)
    } else if (this.currentCategory === 'weapon') {
      return (window.GAME_STATE.ownedWeapons || []).includes(itemId)
    }
    return false
  }

  createDetailPanel() {
    // 详情面板背景
    const detailBg = this.add.graphics()
    detailBg.fillStyle(0x112233, 0.9)
    detailBg.fillRoundedRect(400, 140, 400, 420, 8)
    detailBg.lineStyle(2, 0x334455, 1)
    detailBg.strokeRoundedRect(400, 140, 400, 420, 8)

    this.detailContainer = this.add.container(400, 140)
    this.refreshDetailPanel()
  }

  refreshDetailPanel() {
    this.detailContainer.removeAll(true)

    if (!this.selectedBlueprint) {
      const hint = this.add.text(200, 200, '选择一个蓝图查看详情', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#666666'
      }).setOrigin(0.5)
      this.detailContainer.add(hint)
      return
    }

    const bp = this.selectedBlueprint

    // 物品名称
    const nameText = this.add.text(200, 25, bp.displayName, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ffaa00'
    }).setOrigin(0.5)
    this.detailContainer.add(nameText)

    // 制造时间
    const timeText = this.add.text(200, 55, `制造时间: ${formatBuildTime(bp.buildTime)}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    }).setOrigin(0.5)
    this.detailContainer.add(timeText)

    // 分隔线
    const divider = this.add.graphics()
    divider.lineStyle(1, 0x445566, 1)
    divider.lineBetween(20, 80, 380, 80)
    this.detailContainer.add(divider)

    // 材料需求标题
    const matTitle = this.add.text(20, 95, '所需材料:', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.detailContainer.add(matTitle)

    // 材料列表
    const materials = this.currentCategory === 'warframe' ?
      bp.finalMaterials : bp.materials
    let yOffset = 120
    let canCraft = true

    for (const [matId, required] of Object.entries(materials || {})) {
      const matData = MATERIALS[matId]
      const owned = window.GAME_STATE.inventory?.[matId] || 0
      const hasEnough = owned >= required

      if (!hasEnough) canCraft = false

      const matName = matData?.displayName || matId
      const matColor = hasEnough ? '#88cc88' : '#ff6666'

      const matText = this.add.text(30, yOffset, `${matName}:`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#cccccc'
      })

      const countText = this.add.text(370, yOffset, `${owned} / ${required}`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: matColor
      }).setOrigin(1, 0)

      this.detailContainer.add([matText, countText])
      yOffset += 25
    }

    // 检查是否已拥有
    const owned = this.isOwned(bp.id)

    // 检查是否正在制造
    const isCrafting = window.GAME_STATE.foundry?.active?.some(
      task => task.itemId === bp.id
    )

    // 制造按钮
    yOffset = Math.max(yOffset + 20, 320)

    if (owned) {
      const ownedText = this.add.text(200, yOffset, '已拥有此物品', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#88cc88'
      }).setOrigin(0.5)
      this.detailContainer.add(ownedText)
    } else if (isCrafting) {
      const craftingText = this.add.text(200, yOffset, '正在制造中...', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffaa00'
      }).setOrigin(0.5)
      this.detailContainer.add(craftingText)
    } else {
      this.createCraftButton(200, yOffset, canCraft)
    }

    // 掉落来源
    if (bp.dropLocation) {
      const dropText = this.add.text(200, 390, `蓝图获取: ${bp.dropLocation}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#666666'
      }).setOrigin(0.5)
      this.detailContainer.add(dropText)
    }
  }

  createCraftButton(x, y, canCraft) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    if (canCraft) {
      bg.fillStyle(0x44aa44, 0.9)
      bg.lineStyle(2, 0x66cc66, 1)
    } else {
      bg.fillStyle(0x444444, 0.7)
      bg.lineStyle(2, 0x555555, 1)
    }
    bg.fillRoundedRect(-80, -20, 160, 40, 6)
    bg.strokeRoundedRect(-80, -20, 160, 40, 6)

    const label = this.add.text(0, 0, '开始制造', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: canCraft ? '#ffffff' : '#666666'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(160, 40)

    if (canCraft) {
      button.setInteractive()

      button.on('pointerover', () => {
        bg.clear()
        bg.fillStyle(0x55bb55, 1)
        bg.lineStyle(2, 0x88ee88, 1)
        bg.fillRoundedRect(-80, -20, 160, 40, 6)
        bg.strokeRoundedRect(-80, -20, 160, 40, 6)
      })

      button.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(0x44aa44, 0.9)
        bg.lineStyle(2, 0x66cc66, 1)
        bg.fillRoundedRect(-80, -20, 160, 40, 6)
        bg.strokeRoundedRect(-80, -20, 160, 40, 6)
      })

      button.on('pointerdown', () => {
        this.startCraft()
      })
    }

    this.detailContainer.add(button)
  }

  startCraft() {
    if (!this.selectedBlueprint) return

    const result = startCrafting(
      this.selectedBlueprint.id,
      this.currentCategory,
      {
        inventory: window.GAME_STATE.inventory,
        foundry: window.GAME_STATE.foundry,
        ownedWarframes: window.GAME_STATE.ownedWarframes,
        ownedWeapons: window.GAME_STATE.ownedWeapons
      }
    )

    if (result.success) {
      // 更新库存
      window.GAME_STATE.inventory = result.inventory

      // 添加制造任务
      if (!window.GAME_STATE.foundry.active) {
        window.GAME_STATE.foundry.active = []
      }
      window.GAME_STATE.foundry.active.push(result.craftTask)

      // 刷新UI
      this.refreshBlueprintList()
      this.refreshDetailPanel()
      this.updateCraftingQueue()
      this.updateResourceBar()

      // 成功提示
      this.showMessage('开始制造!', '#88ff88')
    } else {
      this.showMessage(result.reason, '#ff6666')
    }
  }

  createCraftingQueue() {
    // 制造队列背景
    const queueBg = this.add.graphics()
    queueBg.fillStyle(0x112233, 0.9)
    queueBg.fillRoundedRect(820, 140, 430, 420, 8)
    queueBg.lineStyle(2, 0x334455, 1)
    queueBg.strokeRoundedRect(820, 140, 430, 420, 8)

    // 标题
    this.add.text(1035, 155, `制造队列 (${FOUNDRY_SLOTS}槽位)`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)

    this.queueContainer = this.add.container(820, 180)
    this.updateCraftingQueue()
  }

  updateCraftingQueue() {
    if (!this.queueContainer) return

    this.queueContainer.removeAll(true)

    const activeTasks = window.GAME_STATE.foundry?.active || []

    if (activeTasks.length === 0) {
      const emptyText = this.add.text(215, 100, '没有正在制造的物品', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#666666'
      }).setOrigin(0.5)
      this.queueContainer.add(emptyText)
      return
    }

    activeTasks.forEach((task, index) => {
      const y = index * 100 + 20
      const taskContainer = this.add.container(15, y)

      // 背景
      const taskBg = this.add.graphics()
      const isComplete = checkCraftingComplete(task)

      if (isComplete) {
        taskBg.fillStyle(0x336633, 0.9)
        taskBg.lineStyle(2, 0x66cc66, 1)
      } else {
        taskBg.fillStyle(0x223344, 0.8)
        taskBg.lineStyle(2, 0x445566, 1)
      }
      taskBg.fillRoundedRect(0, 0, 400, 85, 6)
      taskBg.strokeRoundedRect(0, 0, 400, 85, 6)

      // 获取蓝图信息
      let blueprint = null
      if (task.category === 'warframe') {
        blueprint = WARFRAME_BLUEPRINTS[task.itemId]
      } else if (task.category === 'weapon') {
        blueprint = WEAPON_BLUEPRINTS[task.itemId]
      } else if (task.category === 'consumable') {
        blueprint = CONSUMABLE_BLUEPRINTS[task.itemId]
      } else if (task.category === 'special') {
        blueprint = SPECIAL_CRAFTING[task.itemId]
      }

      // 名称
      const nameText = this.add.text(15, 12, blueprint?.displayName || task.itemId, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff'
      })

      // 剩余时间或完成状态
      let statusText
      if (isComplete) {
        statusText = this.add.text(385, 12, '已完成!', {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#88ff88'
        }).setOrigin(1, 0)
      } else {
        const remaining = task.endTime - Date.now()
        statusText = this.add.text(385, 12, formatBuildTime(remaining), {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#ffaa00'
        }).setOrigin(1, 0)
      }

      // 进度条
      const progressBg = this.add.graphics()
      progressBg.fillStyle(0x333333, 1)
      progressBg.fillRect(15, 45, 370, 12)

      const progressBar = this.add.graphics()
      const elapsed = Date.now() - task.startTime
      const total = task.endTime - task.startTime
      const progress = Math.min(1, elapsed / total)

      progressBar.fillStyle(isComplete ? 0x88ff88 : 0xffaa00, 1)
      progressBar.fillRect(15, 45, 370 * progress, 12)

      taskContainer.add([taskBg, nameText, statusText, progressBg, progressBar])

      // 领取按钮
      if (isComplete) {
        const claimBtn = this.createClaimButton(300, 68, task, index)
        taskContainer.add(claimBtn)
      }

      this.queueContainer.add(taskContainer)
    })
  }

  createClaimButton(x, y, task, index) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x44aa44, 0.9)
    bg.lineStyle(2, 0x66cc66, 1)
    bg.fillRoundedRect(-50, -12, 100, 24, 4)
    bg.strokeRoundedRect(-50, -12, 100, 24, 4)

    const label = this.add.text(0, 0, '领取', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(100, 24)
    button.setInteractive()

    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x55bb55, 1)
      bg.lineStyle(2, 0x88ee88, 1)
      bg.fillRoundedRect(-50, -12, 100, 24, 4)
      bg.strokeRoundedRect(-50, -12, 100, 24, 4)
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x44aa44, 0.9)
      bg.lineStyle(2, 0x66cc66, 1)
      bg.fillRoundedRect(-50, -12, 100, 24, 4)
      bg.strokeRoundedRect(-50, -12, 100, 24, 4)
    })

    button.on('pointerdown', () => {
      this.claimItem(task, index)
    })

    return button
  }

  claimItem(task, index) {
    const result = claimCrafted(task, {
      inventory: window.GAME_STATE.inventory,
      ownedWarframes: window.GAME_STATE.ownedWarframes,
      ownedWeapons: window.GAME_STATE.ownedWeapons
    })

    if (result.success) {
      // 更新游戏状态
      if (result.playerData.ownedWarframes) {
        window.GAME_STATE.ownedWarframes = result.playerData.ownedWarframes
      }
      if (result.playerData.ownedWeapons) {
        window.GAME_STATE.ownedWeapons = result.playerData.ownedWeapons
      }
      if (result.playerData.inventory) {
        window.GAME_STATE.inventory = result.playerData.inventory
      }

      // 移除任务
      window.GAME_STATE.foundry.active.splice(index, 1)

      // 刷新UI
      this.updateCraftingQueue()
      this.refreshBlueprintList()
      this.refreshDetailPanel()
      this.updateResourceBar()

      this.showMessage('物品已领取!', '#88ff88')
    } else {
      this.showMessage(result.reason, '#ff6666')
    }
  }

  createResourceBar() {
    this.resourceContainer = this.add.container(0, 580)
    this.updateResourceBar()
  }

  updateResourceBar() {
    if (!this.resourceContainer) return

    this.resourceContainer.removeAll(true)

    // 背景
    const barBg = this.add.graphics()
    barBg.fillStyle(0x112233, 0.9)
    barBg.fillRect(0, 0, this.width, 60)
    barBg.lineStyle(1, 0x334455, 1)
    barBg.lineBetween(0, 0, this.width, 0)
    this.resourceContainer.add(barBg)

    // 常用资源显示
    const resources = [
      { id: 'credits', name: '星币', color: '#ffcc00' },
      { id: 'ferrite', name: '铁氧体', color: '#888888' },
      { id: 'nano_spores', name: '纳米孢子', color: '#88ff88' },
      { id: 'alloy_plate', name: '合金板', color: '#aaaaaa' },
      { id: 'orokin_cell', name: 'Orokin电池', color: '#ffaa00' }
    ]

    resources.forEach((res, index) => {
      const x = 100 + index * 200
      const amount = window.GAME_STATE.inventory?.[res.id] || 0

      const nameText = this.add.text(x, 15, res.name, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#888888'
      })

      const valueText = this.add.text(x, 35, amount.toLocaleString(), {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: res.color
      })

      this.resourceContainer.add([nameText, valueText])
    })
  }

  createBackButton() {
    const button = this.add.container(70, 640)

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
      this.scene.start('MenuScene')
    })
  }

  showMessage(text, color) {
    const message = this.add.text(this.width / 2, this.height / 2, text, {
      fontFamily: 'Arial Black',
      fontSize: '28px',
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
