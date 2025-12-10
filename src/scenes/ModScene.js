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

    // 当前配置类型
    this.configType = 'warframe' // warframe 或 weapon

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
    this.warframeTab.on('pointerdown', () => this.switchTab('warframe'))
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
    this.weaponTab.on('pointerdown', () => this.switchTab('weapon'))
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

    container.on('pointerdown', callback)

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
}
