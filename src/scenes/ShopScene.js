import Phaser from 'phaser'
import {
  SHOP_ITEMS,
  MASTERY_RANKS,
  canPurchaseItem,
  purchaseItem,
  getMasteryRankInfo
} from '../data/shop.js'
import { WARFRAMES } from '../data/warframes.js'
import { WEAPONS } from '../data/weapons.js'

export class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' })
  }

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // 当前选择的分类和物品
    this.currentCategory = 'warframes'
    this.selectedItem = null
    this.scrollOffset = 0

    // 背景
    this.add.image(this.width / 2, this.height / 2, 'background')

    // 暗色遮罩
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.width, this.height)

    // 标题
    this.add.text(this.width / 2, 40, '市场商店', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    // 玩家货币显示
    this.createCurrencyDisplay()

    // 创建UI
    this.createCategoryTabs()
    this.createItemList()
    this.createDetailPanel()

    // 返回按钮
    this.createBackButton()
  }

  createCurrencyDisplay() {
    const credits = window.GAME_STATE.credits || 0
    const platinum = window.GAME_STATE.platinum || 0

    // 星币
    this.creditsText = this.add.text(this.width - 300, 30, `星币: ${credits.toLocaleString()}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffcc00'
    })

    // 白金
    this.platinumText = this.add.text(this.width - 150, 30, `白金: ${platinum}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ccccff'
    })

    // 段位
    const masteryInfo = getMasteryRankInfo(window.GAME_STATE.masteryXp || 0)
    this.add.text(50, 30, `段位: ${masteryInfo.name} (${masteryInfo.rank})`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    })
  }

  createCategoryTabs() {
    const categories = [
      { id: 'warframes', name: '战甲' },
      { id: 'weapons', name: '武器' },
      { id: 'modPacks', name: 'MOD包' },
      { id: 'consumables', name: '消耗品' }
    ]

    this.categoryButtons = []
    const startX = 100
    const tabWidth = 120

    categories.forEach((cat, index) => {
      const x = startX + index * (tabWidth + 10)
      const button = this.createTabButton(x, 90, tabWidth, cat.name, () => {
        this.currentCategory = cat.id
        this.selectedItem = null
        this.scrollOffset = 0
        this.updateCategoryHighlight()
        this.refreshItemList()
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
        btn.bg.lineStyle(2, 0xffcc00, 1)
        btn.bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)
        btn.label.setColor('#ffcc00')
      } else {
        btn.bg.fillStyle(0x223344, 0.8)
        btn.bg.fillRoundedRect(-width / 2, -20, width, 40, 6)
        btn.bg.lineStyle(2, 0x4488aa, 1)
        btn.bg.strokeRoundedRect(-width / 2, -20, width, 40, 6)
        btn.label.setColor('#88aacc')
      }
    })
  }

  createItemList() {
    // 列表背景
    const listBg = this.add.graphics()
    listBg.fillStyle(0x112233, 0.9)
    listBg.fillRoundedRect(30, 130, 400, 480, 8)
    listBg.lineStyle(2, 0x334455, 1)
    listBg.strokeRoundedRect(30, 130, 400, 480, 8)

    // 标题
    this.add.text(230, 145, '可购买物品', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)

    // 列表容器
    this.listContainer = this.add.container(30, 170)

    // 遮罩
    const maskShape = this.make.graphics()
    maskShape.fillStyle(0xffffff)
    maskShape.fillRect(30, 170, 400, 430)
    const mask = maskShape.createGeometryMask()
    this.listContainer.setMask(mask)

    this.refreshItemList()

    // 滚动
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x > 30 && pointer.x < 430 && pointer.y > 170 && pointer.y < 600) {
        this.scrollOffset += deltaY * 0.5
        this.scrollOffset = Math.max(0, this.scrollOffset)
        this.refreshItemList()
      }
    })
  }

  refreshItemList() {
    this.listContainer.removeAll(true)

    const items = Object.values(SHOP_ITEMS[this.currentCategory] || {})
    const itemHeight = 70
    const maxScroll = Math.max(0, items.length * itemHeight - 420)
    this.scrollOffset = Math.min(this.scrollOffset, maxScroll)

    items.forEach((item, index) => {
      const y = index * itemHeight - this.scrollOffset

      if (y < -itemHeight || y > 440) return

      const itemContainer = this.add.container(10, y)

      // 检查状态
      const owned = this.isOwned(item)
      const locked = this.isLocked(item)
      const canBuy = this.canAfford(item) && !locked && !owned
      const isSelected = this.selectedItem?.id === item.id

      // 背景
      const itemBg = this.add.graphics()

      if (isSelected) {
        itemBg.fillStyle(0x445566, 0.9)
        itemBg.lineStyle(2, 0xffcc00, 1)
      } else if (owned) {
        itemBg.fillStyle(0x224422, 0.7)
        itemBg.lineStyle(1, 0x446644, 1)
      } else if (locked) {
        itemBg.fillStyle(0x332222, 0.7)
        itemBg.lineStyle(1, 0x443333, 1)
      } else if (!canBuy) {
        itemBg.fillStyle(0x332222, 0.6)
        itemBg.lineStyle(1, 0x443333, 1)
      } else {
        itemBg.fillStyle(0x223344, 0.7)
        itemBg.lineStyle(1, 0x334455, 1)
      }
      itemBg.fillRoundedRect(0, 0, 380, 65, 6)
      itemBg.strokeRoundedRect(0, 0, 380, 65, 6)

      // 名称
      let nameColor = '#ffffff'
      if (owned) nameColor = '#88cc88'
      else if (locked) nameColor = '#666666'
      else if (!canBuy) nameColor = '#ff6666'

      const nameText = this.add.text(15, 12, item.displayName, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: nameColor
      })

      // 状态标签
      let statusText = ''
      let statusColor = '#888888'

      if (owned) {
        statusText = '已拥有'
        statusColor = '#88cc88'
      } else if (locked) {
        const req = item.unlockCondition
        statusText = `需要段位 ${req.level}`
        statusColor = '#ff6666'
      } else {
        statusText = `${item.price.toLocaleString()} 星币`
        statusColor = canBuy ? '#ffcc00' : '#ff6666'
      }

      const statusLabel = this.add.text(365, 12, statusText, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: statusColor
      }).setOrigin(1, 0)

      // 描述
      const descText = this.add.text(15, 40, item.description || '', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#666666'
      })

      itemContainer.add([itemBg, nameText, statusLabel, descText])

      // 交互
      if (!owned) {
        itemContainer.setSize(380, 65)
        itemContainer.setInteractive()

        itemContainer.on('pointerover', () => {
          if (!isSelected) {
            itemBg.clear()
            itemBg.fillStyle(0x334455, 0.9)
            itemBg.fillRoundedRect(0, 0, 380, 65, 6)
            itemBg.lineStyle(1, 0x5588aa, 1)
            itemBg.strokeRoundedRect(0, 0, 380, 65, 6)
          }
        })

        itemContainer.on('pointerout', () => {
          if (!isSelected) {
            itemBg.clear()
            if (locked) {
              itemBg.fillStyle(0x332222, 0.7)
              itemBg.lineStyle(1, 0x443333, 1)
            } else if (!canBuy) {
              itemBg.fillStyle(0x332222, 0.6)
              itemBg.lineStyle(1, 0x443333, 1)
            } else {
              itemBg.fillStyle(0x223344, 0.7)
              itemBg.lineStyle(1, 0x334455, 1)
            }
            itemBg.fillRoundedRect(0, 0, 380, 65, 6)
            itemBg.strokeRoundedRect(0, 0, 380, 65, 6)
          }
        })

        itemContainer.on('pointerdown', () => {
          this.selectedItem = item
          this.refreshItemList()
          this.refreshDetailPanel()
        })
      }

      this.listContainer.add(itemContainer)
    })
  }

  isOwned(item) {
    if (item.type === 'warframe') {
      return (window.GAME_STATE.ownedWarframes || []).includes(item.id)
    } else if (item.type === 'weapon') {
      return (window.GAME_STATE.ownedWeapons || []).includes(item.id)
    }
    return false
  }

  isLocked(item) {
    if (!item.unlockCondition) return false
    const { type, level } = item.unlockCondition
    if (type === 'mastery') {
      return (window.GAME_STATE.masteryRank || 0) < level
    }
    return false
  }

  canAfford(item) {
    const currency = item.purchaseCurrency
    const playerAmount = window.GAME_STATE[currency] || 0
    return playerAmount >= item.price
  }

  createDetailPanel() {
    // 详情面板背景
    const detailBg = this.add.graphics()
    detailBg.fillStyle(0x112233, 0.9)
    detailBg.fillRoundedRect(450, 130, 400, 480, 8)
    detailBg.lineStyle(2, 0x334455, 1)
    detailBg.strokeRoundedRect(450, 130, 400, 480, 8)

    this.detailContainer = this.add.container(450, 130)
    this.refreshDetailPanel()
  }

  refreshDetailPanel() {
    this.detailContainer.removeAll(true)

    if (!this.selectedItem) {
      const hint = this.add.text(200, 230, '选择一个物品查看详情', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#666666'
      }).setOrigin(0.5)
      this.detailContainer.add(hint)
      return
    }

    const item = this.selectedItem

    // 物品名称
    const nameText = this.add.text(200, 30, item.displayName, {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: '#ffcc00'
    }).setOrigin(0.5)
    this.detailContainer.add(nameText)

    // 类型标签
    let typeLabel = ''
    switch (item.type) {
      case 'warframe': typeLabel = '战甲'; break
      case 'weapon': typeLabel = '武器'; break
      case 'mod_pack': typeLabel = 'MOD包'; break
      case 'consumable': typeLabel = '消耗品'; break
    }

    const typeText = this.add.text(200, 65, typeLabel, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    }).setOrigin(0.5)
    this.detailContainer.add(typeText)

    // 分隔线
    const divider = this.add.graphics()
    divider.lineStyle(1, 0x445566, 1)
    divider.lineBetween(20, 90, 380, 90)
    this.detailContainer.add(divider)

    // 描述
    const descText = this.add.text(20, 105, item.description || '暂无描述', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#cccccc',
      wordWrap: { width: 360 }
    })
    this.detailContainer.add(descText)

    // 详细属性
    let yOffset = 160

    if (item.type === 'warframe') {
      const warframeData = WARFRAMES[item.id]
      if (warframeData) {
        const stats = warframeData.baseStats
        const statsInfo = [
          `生命: ${stats.health}`,
          `护盾: ${stats.shield}`,
          `护甲: ${stats.armor}`,
          `能量: ${stats.energy}`,
          `速度: ${stats.sprint}`
        ]

        statsInfo.forEach(stat => {
          const statText = this.add.text(30, yOffset, stat, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#aaaaaa'
          })
          this.detailContainer.add(statText)
          yOffset += 22
        })
      }
    } else if (item.type === 'weapon') {
      const weaponData = WEAPONS[item.id]
      if (weaponData) {
        const stats = weaponData.stats
        const statsInfo = [
          `伤害: ${stats.damage}`,
          `暴击率: ${(stats.critChance * 100).toFixed(0)}%`,
          `暴击倍率: ${stats.critMultiplier}x`,
          `射速: ${stats.fireRate}/s`,
          `弹匣: ${stats.magazine}`
        ]

        statsInfo.forEach(stat => {
          const statText = this.add.text(30, yOffset, stat, {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#aaaaaa'
          })
          this.detailContainer.add(statText)
          yOffset += 22
        })
      }
    } else if (item.type === 'mod_pack') {
      const contentsTitle = this.add.text(30, yOffset, '可能内容:', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff'
      })
      this.detailContainer.add(contentsTitle)
      yOffset += 25

      const contents = item.contents || item.possibleContents || []
      contents.forEach(modId => {
        const modText = this.add.text(40, yOffset, `- ${modId.replace('mod_', '')}`, {
          fontFamily: 'Arial',
          fontSize: '13px',
          color: '#aaaaaa'
        })
        this.detailContainer.add(modText)
        yOffset += 20
      })
    } else if (item.type === 'consumable') {
      if (item.effect) {
        const effectTitle = this.add.text(30, yOffset, '效果:', {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#ffffff'
        })
        this.detailContainer.add(effectTitle)
        yOffset += 25

        let effectDesc = ''
        switch (item.effect.type) {
          case 'heal':
            effectDesc = `恢复 ${item.effect.percent * 100}% 生命值`
            break
          case 'energy':
            effectDesc = `恢复 ${item.effect.percent * 100}% 能量`
            break
          case 'ammo':
            effectDesc = '填满所有弹药'
            break
          case 'xp_boost':
            effectDesc = `经验获取 x${item.effect.multiplier}`
            break
          case 'credit_boost':
            effectDesc = `金币获取 x${item.effect.multiplier}`
            break
        }

        const effectText = this.add.text(40, yOffset, effectDesc, {
          fontFamily: 'Arial',
          fontSize: '13px',
          color: '#88ff88'
        })
        this.detailContainer.add(effectText)
        yOffset += 25

        if (item.duration) {
          const durationText = this.add.text(40, yOffset, `持续时间: ${item.duration / 60000} 分钟`, {
            fontFamily: 'Arial',
            fontSize: '13px',
            color: '#aaaaaa'
          })
          this.detailContainer.add(durationText)
          yOffset += 25
        }
      }
    }

    // 价格和购买区域
    const priceY = 380

    // 分隔线
    const divider2 = this.add.graphics()
    divider2.lineStyle(1, 0x445566, 1)
    divider2.lineBetween(20, priceY - 10, 380, priceY - 10)
    this.detailContainer.add(divider2)

    // 检查状态
    const owned = this.isOwned(item)
    const locked = this.isLocked(item)
    const canBuy = this.canAfford(item) && !locked && !owned

    if (owned) {
      const ownedText = this.add.text(200, priceY + 30, '已拥有此物品', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#88cc88'
      }).setOrigin(0.5)
      this.detailContainer.add(ownedText)
    } else if (locked) {
      const lockedText = this.add.text(200, priceY + 10, '物品已锁定', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ff6666'
      }).setOrigin(0.5)
      this.detailContainer.add(lockedText)

      const reqText = this.add.text(200, priceY + 40, `需要段位 ${item.unlockCondition.level} 解锁`, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#aaaaaa'
      }).setOrigin(0.5)
      this.detailContainer.add(reqText)
    } else {
      // 价格显示
      const currencyName = item.purchaseCurrency === 'credits' ? '星币' : '白金'
      const priceColor = canBuy ? '#ffcc00' : '#ff6666'

      const priceText = this.add.text(200, priceY + 10, `价格: ${item.price.toLocaleString()} ${currencyName}`, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: priceColor
      }).setOrigin(0.5)
      this.detailContainer.add(priceText)

      // 购买按钮
      this.createBuyButton(200, priceY + 55, canBuy)
    }
  }

  createBuyButton(x, y, canBuy) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    if (canBuy) {
      bg.fillStyle(0x44aa44, 0.9)
      bg.lineStyle(2, 0x66cc66, 1)
    } else {
      bg.fillStyle(0x444444, 0.7)
      bg.lineStyle(2, 0x555555, 1)
    }
    bg.fillRoundedRect(-80, -22, 160, 44, 6)
    bg.strokeRoundedRect(-80, -22, 160, 44, 6)

    const label = this.add.text(0, 0, '购买', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: canBuy ? '#ffffff' : '#666666'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(160, 44)

    if (canBuy) {
      button.setInteractive()

      button.on('pointerover', () => {
        bg.clear()
        bg.fillStyle(0x55bb55, 1)
        bg.lineStyle(2, 0x88ee88, 1)
        bg.fillRoundedRect(-80, -22, 160, 44, 6)
        bg.strokeRoundedRect(-80, -22, 160, 44, 6)
      })

      button.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(0x44aa44, 0.9)
        bg.lineStyle(2, 0x66cc66, 1)
        bg.fillRoundedRect(-80, -22, 160, 44, 6)
        bg.strokeRoundedRect(-80, -22, 160, 44, 6)
      })

      button.on('pointerdown', () => {
        this.purchaseSelectedItem()
      })
    }

    this.detailContainer.add(button)
  }

  purchaseSelectedItem() {
    if (!this.selectedItem) return

    const result = purchaseItem(
      this.selectedItem.id,
      this.currentCategory,
      {
        credits: window.GAME_STATE.credits,
        platinum: window.GAME_STATE.platinum,
        ownedWarframes: window.GAME_STATE.ownedWarframes,
        ownedWeapons: window.GAME_STATE.ownedWeapons,
        ownedMods: window.GAME_STATE.ownedMods,
        consumables: window.GAME_STATE.consumables,
        masteryRank: window.GAME_STATE.masteryRank
      }
    )

    if (result.success) {
      // 更新游戏状态
      window.GAME_STATE.credits = result.playerData.credits
      window.GAME_STATE.platinum = result.playerData.platinum

      if (result.playerData.ownedWarframes) {
        window.GAME_STATE.ownedWarframes = result.playerData.ownedWarframes
      }
      if (result.playerData.ownedWeapons) {
        window.GAME_STATE.ownedWeapons = result.playerData.ownedWeapons
      }
      if (result.playerData.ownedMods) {
        window.GAME_STATE.ownedMods = result.playerData.ownedMods
      }
      if (result.playerData.consumables) {
        window.GAME_STATE.consumables = result.playerData.consumables
      }

      // 刷新UI
      this.updateCurrencyDisplay()
      this.refreshItemList()
      this.refreshDetailPanel()

      this.showMessage(`成功购买 ${this.selectedItem.displayName}!`, '#88ff88')
    } else {
      this.showMessage(result.reason, '#ff6666')
    }
  }

  updateCurrencyDisplay() {
    this.creditsText.setText(`星币: ${(window.GAME_STATE.credits || 0).toLocaleString()}`)
    this.platinumText.setText(`白金: ${window.GAME_STATE.platinum || 0}`)
  }

  createBackButton() {
    const button = this.add.container(70, 650)

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
