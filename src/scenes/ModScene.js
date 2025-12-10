import Phaser from 'phaser'
import { MODS, RARITY_COLORS } from '../data/mods.js'
import { WARFRAMES } from '../data/warframes.js'
import { WEAPONS } from '../data/weapons.js'

export class ModScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 背景
    this.add.image(width / 2, height / 2, 'background')

    // 标题
    this.add.text(width / 2, 40, 'MOD 配置', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 返回按钮
    this.createButton(100, 40, '返回', () => {
      this.saveAndExit()
    })

    // 升级按钮
    this.createButton(250, 40, '升级MOD', () => {
      this.showUpgradePanel()
    })

    // Endo显示
    this.endoText = this.add.text(width - 150, 40, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    }).setOrigin(0.5)
    this.updateEndoDisplay()

    // 当前配置类型
    this.configType = 'warframe' // warframe 或 weapon

    // 升级面板相关
    this.upgradePanel = null
    this.selectedUpgradeMod = null

    // 切换标签
    this.createTabs()

    // MOD槽位区域
    this.createModSlots()

    // MOD库存区域
    this.createModInventory()

    // 当前选中的MOD
    this.selectedMod = null
    this.selectedSlot = null

    // 当前装备的MOD - 初始化为8个槽位的数组，填充null
    this.equippedWarframeMods = new Array(8).fill(null)
    this.equippedWeaponMods = new Array(8).fill(null)

    // 从保存数据恢复
    const savedWarframeMods = window.GAME_STATE.warframeMods || []
    const savedWeaponMods = window.GAME_STATE.weaponMods || []

    savedWarframeMods.forEach((mod, index) => {
      if (mod && index < 8) this.equippedWarframeMods[index] = mod
    })
    savedWeaponMods.forEach((mod, index) => {
      if (mod && index < 8) this.equippedWeaponMods[index] = mod
    })

    this.updateDisplay()
  }

  updateEndoDisplay() {
    const endo = window.GAME_STATE.inventory?.endo || 0
    this.endoText.setText(`Endo: ${endo.toLocaleString()}`)
  }

  createTabs() {
    const startX = 200
    const y = 100

    // 战甲标签
    this.warframeTab = this.add.container(startX, y)
    const wfBg = this.add.graphics()
    wfBg.fillStyle(0x335566, 0.9)
    wfBg.fillRoundedRect(-80, -20, 160, 40, 6)
    const wfText = this.add.text(0, 0, '战甲 MOD', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#00ccff'
    }).setOrigin(0.5)
    this.warframeTab.add([wfBg, wfText])
    this.warframeTab.setSize(160, 40)
    this.warframeTab.setInteractive()
    this.warframeTab.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.switchTab('warframe')
    })
    this.warframeTabBg = wfBg

    // 武器标签
    this.weaponTab = this.add.container(startX + 180, y)
    const wpBg = this.add.graphics()
    wpBg.fillStyle(0x223344, 0.9)
    wpBg.fillRoundedRect(-80, -20, 160, 40, 6)
    const wpText = this.add.text(0, 0, '武器 MOD', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)
    this.weaponTab.add([wpBg, wpText])
    this.weaponTab.setSize(160, 40)
    this.weaponTab.setInteractive()
    this.weaponTab.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.switchTab('weapon')
    })
    this.weaponTabBg = wpBg
    this.weaponTabText = wpText
    this.warframeTabText = wfText
  }

  switchTab(type) {
    this.configType = type

    // 更新标签样式
    if (type === 'warframe') {
      this.warframeTabBg.clear()
      this.warframeTabBg.fillStyle(0x335566, 0.9)
      this.warframeTabBg.fillRoundedRect(-80, -20, 160, 40, 6)
      this.warframeTabText.setColor('#00ccff')

      this.weaponTabBg.clear()
      this.weaponTabBg.fillStyle(0x223344, 0.9)
      this.weaponTabBg.fillRoundedRect(-80, -20, 160, 40, 6)
      this.weaponTabText.setColor('#88aacc')
    } else {
      this.weaponTabBg.clear()
      this.weaponTabBg.fillStyle(0x335566, 0.9)
      this.weaponTabBg.fillRoundedRect(-80, -20, 160, 40, 6)
      this.weaponTabText.setColor('#00ccff')

      this.warframeTabBg.clear()
      this.warframeTabBg.fillStyle(0x223344, 0.9)
      this.warframeTabBg.fillRoundedRect(-80, -20, 160, 40, 6)
      this.warframeTabText.setColor('#88aacc')
    }

    this.updateDisplay()
  }

  createModSlots() {
    const startX = 100
    const startY = 180
    const slotWidth = 100
    const slotHeight = 120
    const spacing = 10

    this.modSlots = []

    // 8个MOD槽位（2行4列）
    for (let i = 0; i < 8; i++) {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = startX + col * (slotWidth + spacing)
      const y = startY + row * (slotHeight + spacing)

      const slot = this.add.container(x, y)

      const bg = this.add.graphics()
      bg.fillStyle(0x1a1a2e, 0.9)
      bg.fillRoundedRect(0, 0, slotWidth, slotHeight, 8)
      bg.lineStyle(2, 0x334455, 1)
      bg.strokeRoundedRect(0, 0, slotWidth, slotHeight, 8)

      const slotLabel = this.add.text(slotWidth / 2, slotHeight / 2, `槽位 ${i + 1}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#445566'
      }).setOrigin(0.5)

      slot.add([bg, slotLabel])
      slot.setSize(slotWidth, slotHeight)
      slot.setInteractive()

      slot.slotIndex = i
      slot.slotBg = bg
      slot.slotLabel = slotLabel
      slot.equippedMod = null

      slot.on('pointerdown', () => {
        if (window.audioManager) {
          window.audioManager.playUIClick()
        }
        this.selectSlot(i)
      })

      this.modSlots.push(slot)
    }

    // 容量显示
    this.capacityText = this.add.text(startX, startY + slotHeight * 2 + spacing * 2 + 20, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    })
  }

  createModInventory() {
    const startX = 550
    const startY = 150
    const width = 680
    const height = 450

    // 背景框
    const invBg = this.add.graphics()
    invBg.fillStyle(0x111122, 0.9)
    invBg.fillRoundedRect(startX, startY, width, height, 12)
    invBg.lineStyle(1, 0x334455, 1)
    invBg.strokeRoundedRect(startX, startY, width, height, 12)

    this.add.text(startX + 20, startY + 15, 'MOD 库存', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    })

    // MOD列表容器
    this.modListContainer = this.add.container(startX + 20, startY + 50)

    // 说明文字
    this.add.text(startX + 20, startY + height - 30, '点击MOD装备到选中的槽位，再次点击已装备的MOD可卸下', {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#556677'
    })
  }

  updateDisplay() {
    // 清除现有MOD显示
    this.modListContainer.removeAll(true)

    // 获取当前类型的已装备MOD
    const equippedMods = this.configType === 'warframe' ? this.equippedWarframeMods : this.equippedWeaponMods

    // 更新槽位显示
    this.modSlots.forEach((slot, index) => {
      slot.slotBg.clear()

      const equippedMod = equippedMods[index]

      if (equippedMod) {
        const modData = MODS[equippedMod.id]
        const rarityColor = RARITY_COLORS[modData.rarity]

        slot.slotBg.fillStyle(0x1a1a2e, 0.9)
        slot.slotBg.fillRoundedRect(0, 0, 100, 120, 8)
        slot.slotBg.lineStyle(2, rarityColor, 1)
        slot.slotBg.strokeRoundedRect(0, 0, 100, 120, 8)

        slot.slotLabel.setText(`${modData.displayName}\nRank ${equippedMod.rank}`)
        slot.slotLabel.setColor('#ffffff')
        slot.slotLabel.setFontSize('11px')
        slot.equippedMod = equippedMod
      } else {
        slot.slotBg.fillStyle(0x1a1a2e, 0.9)
        slot.slotBg.fillRoundedRect(0, 0, 100, 120, 8)
        slot.slotBg.lineStyle(2, 0x334455, 1)
        slot.slotBg.strokeRoundedRect(0, 0, 100, 120, 8)

        slot.slotLabel.setText(`槽位 ${index + 1}`)
        slot.slotLabel.setColor('#445566')
        slot.slotLabel.setFontSize('12px')
        slot.equippedMod = null
      }
    })

    // 显示库存中的MOD
    const inventory = window.GAME_STATE.inventory?.mods || []
    const filteredMods = inventory.filter(mod => {
      const modData = MODS[mod.id]
      if (!modData) return false

      if (this.configType === 'warframe') {
        return modData.target === 'warframe'
      } else {
        if (modData.target !== 'weapon') return false
        // 检查武器类型匹配
        const currentWeapon = WEAPONS[window.GAME_STATE.currentWeapon]
        if (modData.weaponType && modData.weaponType !== currentWeapon.type) {
          return false
        }
        return true
      }
    })

    const modWidth = 130
    const modHeight = 80
    const spacing = 10
    const cols = 5

    filteredMods.forEach((mod, index) => {
      const modData = MODS[mod.id]
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = col * (modWidth + spacing)
      const y = row * (modHeight + spacing)

      // 检查是否已装备
      const isEquipped = equippedMods.some(e => e && e.id === mod.id)

      const container = this.add.container(x, y)

      const rarityColor = RARITY_COLORS[modData.rarity]

      const bg = this.add.graphics()
      bg.fillStyle(isEquipped ? 0x223344 : 0x1a1a2e, 0.9)
      bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
      bg.lineStyle(2, isEquipped ? 0x00ccff : rarityColor, 1)
      bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)

      // MOD名称
      const nameText = this.add.text(modWidth / 2, 15, modData.displayName, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: isEquipped ? '#00ccff' : '#ffffff'
      }).setOrigin(0.5)

      // 等级
      const rankText = this.add.text(modWidth / 2, 35, `Rank ${mod.rank}/${modData.maxRank}`, {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: '#88aacc'
      }).setOrigin(0.5)

      // 消耗
      const cost = modData.baseCost + mod.rank
      const costText = this.add.text(modWidth / 2, 55, `消耗: ${cost}`, {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: '#ffaa00'
      }).setOrigin(0.5)

      // 已装备标记
      if (isEquipped) {
        const equippedLabel = this.add.text(modWidth - 5, 5, '✓', {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#00ff88'
        }).setOrigin(1, 0)
        container.add(equippedLabel)
      }

      container.add([bg, nameText, rankText, costText])
      container.setSize(modWidth, modHeight)
      container.setInteractive()

      container.modData = mod

      container.on('pointerdown', () => {
        if (window.audioManager) {
          window.audioManager.playUIClick()
        }
        this.onModClick(mod, isEquipped)
      })

      container.on('pointerover', () => {
        bg.clear()
        bg.fillStyle(0x334455, 0.9)
        bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
        bg.lineStyle(2, 0x00ccff, 1)
        bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)
      })

      container.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(isEquipped ? 0x223344 : 0x1a1a2e, 0.9)
        bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
        bg.lineStyle(2, isEquipped ? 0x00ccff : rarityColor, 1)
        bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)
      })

      this.modListContainer.add(container)
    })

    // 更新容量显示
    this.updateCapacity()
  }

  selectSlot(index) {
    // 如果点击同一个槽位，取消选中
    if (this.selectedSlot === index) {
      this.selectedSlot = null
      this.updateDisplay() // 刷新显示以移除高亮
      return
    }

    this.selectedSlot = index

    // 先刷新显示以重置所有槽位样式
    this.updateDisplay()

    // 高亮选中的槽位
    this.modSlots.forEach((slot, i) => {
      if (i === index) {
        slot.slotBg.lineStyle(3, 0x00ff88, 1)
        slot.slotBg.strokeRoundedRect(0, 0, 100, 120, 8)
      }
    })
  }

  onModClick(mod, isEquipped) {
    const equippedMods = this.configType === 'warframe' ? this.equippedWarframeMods : this.equippedWeaponMods

    if (isEquipped) {
      // 卸下MOD
      const index = equippedMods.findIndex(e => e && e.id === mod.id)
      if (index !== -1) {
        equippedMods[index] = null
      }
    } else {
      // 装备MOD
      // 检查是否已经装备了同类型MOD
      const existingIndex = equippedMods.findIndex(e => e && e.id === mod.id)
      if (existingIndex !== -1) {
        return // 已装备，不能重复装备
      }

      // 找到空槽位或使用选中的槽位
      let targetSlot = this.selectedSlot

      if (targetSlot === null || equippedMods[targetSlot] !== null) {
        // 找第一个空槽位（null）
        targetSlot = equippedMods.findIndex(e => e === null)
        if (targetSlot === -1) {
          return // 没有空槽位
        }
      }

      if (targetSlot >= 0 && targetSlot < 8) {
        equippedMods[targetSlot] = { id: mod.id, rank: mod.rank }
      }
    }

    // 不再清理空槽位，保持数组长度为8

    this.selectedSlot = null
    this.updateDisplay()
  }

  updateCapacity() {
    const equippedMods = this.configType === 'warframe' ? this.equippedWarframeMods : this.equippedWeaponMods

    let totalCost = 0
    equippedMods.forEach(mod => {
      if (mod) {
        const modData = MODS[mod.id]
        if (modData) {
          totalCost += modData.baseCost + mod.rank
        }
      }
    })

    const maxCapacity = 30 + window.GAME_STATE.mastery * 2

    const color = totalCost > maxCapacity ? '#ff4444' : '#88aacc'
    this.capacityText.setText(`容量: ${totalCost} / ${maxCapacity}`)
    this.capacityText.setColor(color)
  }

  createButton(x, y, text, callback) {
    const container = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.9)
    bg.fillRoundedRect(-60, -20, 120, 40, 6)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-60, -20, 120, 40, 6)

    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#00ccff'
    }).setOrigin(0.5)

    container.add([bg, buttonText])
    container.setSize(120, 40)
    container.setInteractive()

    container.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x335566, 0.9)
      bg.fillRoundedRect(-60, -20, 120, 40, 6)
      bg.lineStyle(2, 0x00ccff, 1)
      bg.strokeRoundedRect(-60, -20, 120, 40, 6)
    })

    container.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.9)
      bg.fillRoundedRect(-60, -20, 120, 40, 6)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-60, -20, 120, 40, 6)
    })

    container.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      callback()
    })

    return container
  }

  saveAndExit() {
    // 保存MOD配置 - 保持索引位置，只过滤掉null
    // 这样可以保留玩家的槽位布局
    window.GAME_STATE.warframeMods = this.equippedWarframeMods.map(m => m || null)
    window.GAME_STATE.weaponMods = this.equippedWeaponMods.map(m => m || null)

    localStorage.setItem('miniWarframeSave', JSON.stringify(window.GAME_STATE))
    this.scene.start('MenuScene')
  }

  showUpgradePanel() {
    if (this.upgradePanel) {
      this.closeUpgradePanel()
      return
    }

    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 创建升级面板
    this.upgradePanel = this.add.container(0, 0)

    // 半透明背景覆盖
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, width, height)
    overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)

    // 面板背景
    const panelWidth = 700
    const panelHeight = 500
    const panelX = (width - panelWidth) / 2
    const panelY = (height - panelHeight) / 2

    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x1a1a2e, 0.98)
    panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)
    panelBg.lineStyle(2, 0x00ccff, 1)
    panelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)

    // 标题
    const title = this.add.text(width / 2, panelY + 30, 'MOD 升级', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 关闭按钮
    const closeBtn = this.add.text(panelX + panelWidth - 30, panelY + 15, '✕', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ff6666'
    }).setOrigin(0.5).setInteractive()
    closeBtn.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.closeUpgradePanel()
    })
    closeBtn.on('pointerover', () => closeBtn.setColor('#ff9999'))
    closeBtn.on('pointerout', () => closeBtn.setColor('#ff6666'))

    // Endo显示
    const endo = window.GAME_STATE.inventory?.endo || 0
    const endoLabel = this.add.text(panelX + 30, panelY + 25, `Endo: ${endo.toLocaleString()}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffcc00'
    })

    this.upgradePanel.add([overlay, panelBg, title, closeBtn, endoLabel])

    // MOD列表区域
    this.upgradeModList = this.add.container(panelX + 30, panelY + 70)
    this.upgradePanel.add(this.upgradeModList)

    // 升级详情区域
    this.upgradeDetailContainer = this.add.container(panelX + 400, panelY + 70)
    this.upgradePanel.add(this.upgradeDetailContainer)

    // 填充MOD列表
    this.populateUpgradeModList()
  }

  populateUpgradeModList() {
    this.upgradeModList.removeAll(true)

    const inventory = window.GAME_STATE.inventory?.mods || []
    const modWidth = 160
    const modHeight = 60
    const spacing = 8
    const cols = 2

    inventory.forEach((mod, index) => {
      const modData = MODS[mod.id]
      if (!modData) return

      const col = index % cols
      const row = Math.floor(index / cols)
      const x = col * (modWidth + spacing)
      const y = row * (modHeight + spacing)

      const container = this.add.container(x, y)

      const rarityColor = RARITY_COLORS[modData.rarity]
      const isMaxRank = mod.rank >= modData.maxRank

      const bg = this.add.graphics()
      bg.fillStyle(isMaxRank ? 0x224422 : 0x1a1a2e, 0.9)
      bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
      bg.lineStyle(2, rarityColor, 1)
      bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)

      const nameText = this.add.text(10, 10, modData.displayName, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff'
      })

      const rankText = this.add.text(10, 30, `Rank ${mod.rank}/${modData.maxRank}`, {
        fontFamily: 'Arial',
        fontSize: '11px',
        color: isMaxRank ? '#00ff88' : '#88aacc'
      })

      if (isMaxRank) {
        const maxLabel = this.add.text(modWidth - 10, 10, 'MAX', {
          fontFamily: 'Arial',
          fontSize: '10px',
          color: '#00ff88'
        }).setOrigin(1, 0)
        container.add(maxLabel)
      }

      container.add([bg, nameText, rankText])
      container.setSize(modWidth, modHeight)
      container.setInteractive()

      container.on('pointerdown', () => {
        if (window.audioManager) {
          window.audioManager.playUIClick()
        }
        this.selectUpgradeMod(mod, index)
      })

      container.on('pointerover', () => {
        if (!isMaxRank) {
          bg.clear()
          bg.fillStyle(0x334455, 0.9)
          bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
          bg.lineStyle(2, 0x00ccff, 1)
          bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)
        }
      })

      container.on('pointerout', () => {
        bg.clear()
        bg.fillStyle(isMaxRank ? 0x224422 : 0x1a1a2e, 0.9)
        bg.fillRoundedRect(0, 0, modWidth, modHeight, 6)
        bg.lineStyle(2, rarityColor, 1)
        bg.strokeRoundedRect(0, 0, modWidth, modHeight, 6)
      })

      this.upgradeModList.add(container)
    })
  }

  selectUpgradeMod(mod, index) {
    this.selectedUpgradeMod = { mod, index }
    this.showUpgradeDetail()
  }

  showUpgradeDetail() {
    this.upgradeDetailContainer.removeAll(true)

    if (!this.selectedUpgradeMod) return

    const { mod } = this.selectedUpgradeMod
    const modData = MODS[mod.id]

    if (!modData) return

    const isMaxRank = mod.rank >= modData.maxRank
    const rarityColor = RARITY_COLORS[modData.rarity]

    // MOD详情卡片
    const cardBg = this.add.graphics()
    cardBg.fillStyle(0x223344, 0.95)
    cardBg.fillRoundedRect(0, 0, 260, 350, 8)
    cardBg.lineStyle(2, rarityColor, 1)
    cardBg.strokeRoundedRect(0, 0, 260, 350, 8)

    // MOD名称
    const nameText = this.add.text(130, 25, modData.displayName, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 稀有度
    const rarityNames = { common: '普通', uncommon: '罕见', rare: '稀有', legendary: '传说' }
    const rarityText = this.add.text(130, 50, rarityNames[modData.rarity] || modData.rarity, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: `#${rarityColor.toString(16).padStart(6, '0')}`
    }).setOrigin(0.5)

    // 当前等级
    const currentRankText = this.add.text(130, 80, `当前等级: ${mod.rank} / ${modData.maxRank}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: isMaxRank ? '#00ff88' : '#88aacc'
    }).setOrigin(0.5)

    // 描述
    const descText = this.add.text(130, 110, modData.description, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#aabbcc',
      wordWrap: { width: 230 }
    }).setOrigin(0.5, 0)

    this.upgradeDetailContainer.add([cardBg, nameText, rarityText, currentRankText, descText])

    // 效果显示
    let effectY = 150
    if (modData.getEffect) {
      const currentEffect = modData.getEffect(mod.rank)
      const nextEffect = mod.rank < modData.maxRank ? modData.getEffect(mod.rank + 1) : null

      const effectLabel = this.add.text(20, effectY, '效果:', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#88aacc'
      })
      effectY += 20

      for (const [key, value] of Object.entries(currentEffect)) {
        const effectName = this.getEffectName(key)
        const valueStr = modData.isMultiplier ? `${((value - 1) * 100).toFixed(0)}%` : `${(value * 100).toFixed(0)}%`

        let effectLine = `${effectName}: +${valueStr}`

        if (nextEffect && nextEffect[key] !== undefined) {
          const nextValueStr = modData.isMultiplier ? `${((nextEffect[key] - 1) * 100).toFixed(0)}%` : `${(nextEffect[key] * 100).toFixed(0)}%`
          effectLine += ` → +${nextValueStr}`
        }

        const effectText = this.add.text(20, effectY, effectLine, {
          fontFamily: 'Arial',
          fontSize: '11px',
          color: '#ffffff'
        })
        this.upgradeDetailContainer.add(effectText)
        effectY += 16
      }

      this.upgradeDetailContainer.add(effectLabel)
    }

    if (!isMaxRank) {
      // 升级费用
      const endoCost = this.calculateUpgradeCost(mod, modData)
      const creditCost = Math.floor(endoCost * 0.5)

      const costY = 260
      const costLabel = this.add.text(130, costY, '升级费用:', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#88aacc'
      }).setOrigin(0.5)

      const endo = window.GAME_STATE.inventory?.endo || 0
      const credits = window.GAME_STATE.credits || 0
      const canAffordEndo = endo >= endoCost
      const canAffordCredits = credits >= creditCost

      const endoCostText = this.add.text(130, costY + 20, `Endo: ${endoCost.toLocaleString()}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: canAffordEndo ? '#00ff88' : '#ff4444'
      }).setOrigin(0.5)

      const creditCostText = this.add.text(130, costY + 38, `星币: ${creditCost.toLocaleString()}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: canAffordCredits ? '#00ff88' : '#ff4444'
      }).setOrigin(0.5)

      this.upgradeDetailContainer.add([costLabel, endoCostText, creditCostText])

      // 升级按钮
      const canUpgrade = canAffordEndo && canAffordCredits
      const btnY = 320
      const btnContainer = this.add.container(130, btnY)

      const btnBg = this.add.graphics()
      btnBg.fillStyle(canUpgrade ? 0x225522 : 0x333333, 0.9)
      btnBg.fillRoundedRect(-80, -18, 160, 36, 6)
      btnBg.lineStyle(2, canUpgrade ? 0x44aa44 : 0x555555, 1)
      btnBg.strokeRoundedRect(-80, -18, 160, 36, 6)

      const btnText = this.add.text(0, 0, '升级', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: canUpgrade ? '#00ff88' : '#666666'
      }).setOrigin(0.5)

      btnContainer.add([btnBg, btnText])
      btnContainer.setSize(160, 36)

      if (canUpgrade) {
        btnContainer.setInteractive()
        btnContainer.on('pointerdown', () => {
          if (window.audioManager) {
            window.audioManager.playUIClick()
          }
          this.upgradeMod()
        })
        btnContainer.on('pointerover', () => {
          btnBg.clear()
          btnBg.fillStyle(0x337733, 0.9)
          btnBg.fillRoundedRect(-80, -18, 160, 36, 6)
          btnBg.lineStyle(2, 0x00ff88, 1)
          btnBg.strokeRoundedRect(-80, -18, 160, 36, 6)
        })
        btnContainer.on('pointerout', () => {
          btnBg.clear()
          btnBg.fillStyle(0x225522, 0.9)
          btnBg.fillRoundedRect(-80, -18, 160, 36, 6)
          btnBg.lineStyle(2, 0x44aa44, 1)
          btnBg.strokeRoundedRect(-80, -18, 160, 36, 6)
        })
      }

      this.upgradeDetailContainer.add(btnContainer)
    } else {
      // 已满级提示
      const maxText = this.add.text(130, 300, '已达最高等级', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#00ff88'
      }).setOrigin(0.5)
      this.upgradeDetailContainer.add(maxText)
    }
  }

  getEffectName(key) {
    const names = {
      maxHealth: '生命上限',
      maxShield: '护盾上限',
      armor: '护甲',
      maxEnergy: '能量上限',
      energyEfficiency: '技能效率',
      speed: '移动速度',
      damage: '伤害',
      critChance: '暴击率',
      critMultiplier: '暴击伤害',
      fireRate: '射速',
      reloadTime: '换弹速度',
      magazineSize: '弹匣容量',
      multishot: '多重射击',
      punchThrough: '穿透',
      abilityStrength: '技能强度',
      abilityDuration: '技能持续',
      abilityRange: '技能范围',
      jumpForce: '跳跃高度',
      energyToHealth: '能量护命',
      critOnKill: '击杀暴击',
      headshotCrit: '爆头暴击',
      critUpgrade: '暴击升级'
    }
    return names[key] || key
  }

  calculateUpgradeCost(mod, modData) {
    // 升级费用基于稀有度和当前等级
    const rarityMultiplier = {
      common: 1,
      uncommon: 1.5,
      rare: 2,
      legendary: 3
    }

    const baseEndo = 80
    const multiplier = rarityMultiplier[modData.rarity] || 1
    // 每级费用递增
    return Math.floor(baseEndo * multiplier * (mod.rank + 1))
  }

  upgradeMod() {
    if (!this.selectedUpgradeMod) return

    const { mod, index } = this.selectedUpgradeMod
    const modData = MODS[mod.id]

    if (!modData || mod.rank >= modData.maxRank) return

    const endoCost = this.calculateUpgradeCost(mod, modData)
    const creditCost = Math.floor(endoCost * 0.5)

    const endo = window.GAME_STATE.inventory?.endo || 0
    const credits = window.GAME_STATE.credits || 0

    if (endo < endoCost || credits < creditCost) return

    // 扣除资源
    if (!window.GAME_STATE.inventory) {
      window.GAME_STATE.inventory = {}
    }
    window.GAME_STATE.inventory.endo = endo - endoCost
    window.GAME_STATE.credits = credits - creditCost

    // 升级MOD
    window.GAME_STATE.inventory.mods[index].rank += 1

    // 同步已装备的MOD等级
    this.syncEquippedModRank(mod.id, window.GAME_STATE.inventory.mods[index].rank)

    // 保存
    this.saveGame()

    // 刷新显示
    this.updateEndoDisplay()
    this.populateUpgradeModList()
    this.selectedUpgradeMod.mod = window.GAME_STATE.inventory.mods[index]
    this.showUpgradeDetail()
    this.updateDisplay()

    // 更新面板中的Endo显示
    if (this.upgradePanel) {
      const endoLabel = this.upgradePanel.list.find(obj => obj.type === 'Text' && obj.text.startsWith('Endo:'))
      if (endoLabel) {
        endoLabel.setText(`Endo: ${window.GAME_STATE.inventory.endo.toLocaleString()}`)
      }
    }
  }

  syncEquippedModRank(modId, newRank) {
    // 同步战甲MOD
    this.equippedWarframeMods.forEach((mod, i) => {
      if (mod && mod.id === modId) {
        this.equippedWarframeMods[i].rank = newRank
      }
    })

    // 同步武器MOD
    this.equippedWeaponMods.forEach((mod, i) => {
      if (mod && mod.id === modId) {
        this.equippedWeaponMods[i].rank = newRank
      }
    })

    // 同步到GAME_STATE
    if (window.GAME_STATE.warframeMods) {
      window.GAME_STATE.warframeMods.forEach((mod, i) => {
        if (mod && mod.id === modId) {
          window.GAME_STATE.warframeMods[i].rank = newRank
        }
      })
    }
    if (window.GAME_STATE.weaponMods) {
      window.GAME_STATE.weaponMods.forEach((mod, i) => {
        if (mod && mod.id === modId) {
          window.GAME_STATE.weaponMods[i].rank = newRank
        }
      })
    }
  }

  closeUpgradePanel() {
    if (this.upgradePanel) {
      this.upgradePanel.destroy()
      this.upgradePanel = null
      this.selectedUpgradeMod = null
    }
  }

  saveGame() {
    try {
      localStorage.setItem('miniWarframeSave', JSON.stringify(window.GAME_STATE))
    } catch (e) {
      console.warn('保存失败:', e)
    }
  }
}
