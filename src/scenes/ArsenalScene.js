import Phaser from 'phaser'
import { WARFRAMES } from '../data/warframes.js'
import { WEAPONS } from '../data/weapons.js'

export class ArsenalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ArsenalScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 背景
    this.add.image(width / 2, height / 2, 'background')

    // 标题
    this.add.text(width / 2, 40, '军械库', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 返回按钮
    this.createButton(100, 40, '返回', () => {
      this.saveAndExit()
    })

    // 当前选择
    this.selectedWarframe = window.GAME_STATE.currentWarframe
    this.selectedWeapon = window.GAME_STATE.currentWeapon

    // 战甲区域
    this.createWarframeSection()

    // 武器区域
    this.createWeaponSection()

    // 预览区域
    this.createPreviewSection()

    // 确认按钮
    this.createButton(width / 2, height - 50, '确认装备', () => {
      this.confirmSelection()
    })
  }

  createWarframeSection() {
    const startX = 100
    const startY = 120

    this.add.text(startX, startY, '战甲选择', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#88aacc'
    })

    const warframeIds = Object.keys(WARFRAMES)
    this.warframeButtons = []

    warframeIds.forEach((id, index) => {
      const warframe = WARFRAMES[id]
      const isUnlocked = window.GAME_STATE.unlockedWarframes.includes(id)
      const isSelected = id === this.selectedWarframe

      const y = startY + 50 + index * 80

      const container = this.add.container(startX, y)

      // 背景
      const bg = this.add.graphics()
      bg.fillStyle(isSelected ? 0x335566 : 0x223344, 0.9)
      bg.fillRoundedRect(0, 0, 280, 70, 8)
      bg.lineStyle(2, isSelected ? 0x00ccff : 0x4488aa, 1)
      bg.strokeRoundedRect(0, 0, 280, 70, 8)

      // 战甲图标
      const icon = this.add.image(40, 35, `warframe_${id}`)
      icon.setScale(0.8)
      if (!isUnlocked) icon.setTint(0x333333)

      // 名称
      const nameText = this.add.text(80, 15, warframe.displayName, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: isUnlocked ? '#ffffff' : '#666666'
      })

      // 描述
      const descText = this.add.text(80, 38, warframe.description, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#88aacc'
      })

      // 锁定标识
      if (!isUnlocked) {
        const lockText = this.add.text(240, 35, '🔒', {
          fontSize: '24px'
        }).setOrigin(0.5)
        container.add(lockText)
      }

      container.add([bg, icon, nameText, descText])
      container.setSize(280, 70)

      if (isUnlocked) {
        container.setInteractive()
        container.on('pointerdown', () => {
          if (window.audioManager) {
            window.audioManager.playUIClick()
          }
          this.selectWarframe(id)
        })
        container.on('pointerover', () => {
          if (this.selectedWarframe !== id) {
            bg.clear()
            bg.fillStyle(0x334455, 0.9)
            bg.fillRoundedRect(0, 0, 280, 70, 8)
            bg.lineStyle(2, 0x4488aa, 1)
            bg.strokeRoundedRect(0, 0, 280, 70, 8)
          }
        })
        container.on('pointerout', () => {
          if (this.selectedWarframe !== id) {
            bg.clear()
            bg.fillStyle(0x223344, 0.9)
            bg.fillRoundedRect(0, 0, 280, 70, 8)
            bg.lineStyle(2, 0x4488aa, 1)
            bg.strokeRoundedRect(0, 0, 280, 70, 8)
          }
        })
      }

      this.warframeButtons.push({ id, container, bg })
    })
  }

  createWeaponSection() {
    const startX = 420
    const startY = 120

    this.add.text(startX, startY, '武器选择', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#88aacc'
    })

    const weaponIds = Object.keys(WEAPONS)
    this.weaponButtons = []

    weaponIds.forEach((id, index) => {
      const weapon = WEAPONS[id]
      const isUnlocked = window.GAME_STATE.unlockedWeapons.includes(id)
      const isSelected = id === this.selectedWeapon

      const col = index % 2
      const row = Math.floor(index / 2)
      const x = startX + col * 200
      const y = startY + 50 + row * 80

      const container = this.add.container(x, y)

      // 背景
      const bg = this.add.graphics()
      bg.fillStyle(isSelected ? 0x335566 : 0x223344, 0.9)
      bg.fillRoundedRect(0, 0, 190, 70, 8)
      bg.lineStyle(2, isSelected ? 0x00ccff : 0x4488aa, 1)
      bg.strokeRoundedRect(0, 0, 190, 70, 8)

      // 名称
      const nameText = this.add.text(15, 12, weapon.displayName, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: isUnlocked ? '#ffffff' : '#666666'
      })

      // 类型
      const typeText = this.add.text(15, 32, weapon.type.toUpperCase(), {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: '#667788'
      })

      // 伤害
      const dmgText = this.add.text(15, 48, `DMG: ${weapon.baseStats.damage}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffaa00'
      })

      // 锁定标识
      if (!isUnlocked) {
        const lockText = this.add.text(165, 35, '🔒', {
          fontSize: '20px'
        }).setOrigin(0.5)
        container.add(lockText)
      }

      container.add([bg, nameText, typeText, dmgText])
      container.setSize(190, 70)

      if (isUnlocked) {
        container.setInteractive()
        container.on('pointerdown', () => {
          if (window.audioManager) {
            window.audioManager.playUIClick()
          }
          this.selectWeapon(id)
        })
        container.on('pointerover', () => {
          if (this.selectedWeapon !== id) {
            bg.clear()
            bg.fillStyle(0x334455, 0.9)
            bg.fillRoundedRect(0, 0, 190, 70, 8)
            bg.lineStyle(2, 0x4488aa, 1)
            bg.strokeRoundedRect(0, 0, 190, 70, 8)
          }
        })
        container.on('pointerout', () => {
          if (this.selectedWeapon !== id) {
            bg.clear()
            bg.fillStyle(0x223344, 0.9)
            bg.fillRoundedRect(0, 0, 190, 70, 8)
            bg.lineStyle(2, 0x4488aa, 1)
            bg.strokeRoundedRect(0, 0, 190, 70, 8)
          }
        })
      }

      this.weaponButtons.push({ id, container, bg })
    })
  }

  createPreviewSection() {
    const x = 950
    const y = 150

    // 预览框
    const previewBg = this.add.graphics()
    previewBg.fillStyle(0x111122, 0.9)
    previewBg.fillRoundedRect(x, y, 280, 450, 12)
    previewBg.lineStyle(2, 0x334455, 1)
    previewBg.strokeRoundedRect(x, y, 280, 450, 12)

    this.add.text(x + 140, y + 20, '装备预览', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 战甲预览
    this.previewWarframeIcon = this.add.image(x + 70, y + 100, `warframe_${this.selectedWarframe}`)
    this.previewWarframeIcon.setScale(1.5)

    this.previewWarframeName = this.add.text(x + 140, y + 160, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 战甲属性
    this.previewWarframeStats = this.add.text(x + 20, y + 190, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#88aacc',
      lineSpacing: 4
    })

    // 武器预览
    this.previewWeaponName = this.add.text(x + 140, y + 320, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.previewWeaponStats = this.add.text(x + 20, y + 350, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#88aacc',
      lineSpacing: 4
    })

    this.updatePreview()
  }

  updatePreview() {
    const warframe = WARFRAMES[this.selectedWarframe]
    const weapon = WEAPONS[this.selectedWeapon]

    // 更新战甲预览
    this.previewWarframeIcon.setTexture(`warframe_${this.selectedWarframe}`)
    this.previewWarframeName.setText(warframe.displayName)

    const wfStats = warframe.baseStats
    this.previewWarframeStats.setText([
      `生命: ${wfStats.health}`,
      `护盾: ${wfStats.shield}`,
      `护甲: ${wfStats.armor}`,
      `能量: ${wfStats.energy}`,
      `速度: ${(wfStats.speed * 100).toFixed(0)}%`
    ].join('\n'))

    // 更新武器预览
    this.previewWeaponName.setText(weapon.displayName)

    const wpStats = weapon.baseStats
    this.previewWeaponStats.setText([
      `伤害: ${wpStats.damage}${wpStats.pellets ? ` x${wpStats.pellets}` : ''}`,
      `射速: ${wpStats.fireRate.toFixed(2)}/s`,
      `弹匣: ${wpStats.magazineSize}`,
      `暴击: ${(wpStats.critChance * 100).toFixed(0)}%`,
      `暴伤: ${wpStats.critMultiplier.toFixed(1)}x`
    ].join('\n'))
  }

  selectWarframe(id) {
    this.selectedWarframe = id

    // 更新按钮状态
    this.warframeButtons.forEach(btn => {
      const isSelected = btn.id === id
      btn.bg.clear()
      btn.bg.fillStyle(isSelected ? 0x335566 : 0x223344, 0.9)
      btn.bg.fillRoundedRect(0, 0, 280, 70, 8)
      btn.bg.lineStyle(2, isSelected ? 0x00ccff : 0x4488aa, 1)
      btn.bg.strokeRoundedRect(0, 0, 280, 70, 8)
    })

    this.updatePreview()
  }

  selectWeapon(id) {
    this.selectedWeapon = id

    // 更新按钮状态
    this.weaponButtons.forEach(btn => {
      const isSelected = btn.id === id
      btn.bg.clear()
      btn.bg.fillStyle(isSelected ? 0x335566 : 0x223344, 0.9)
      btn.bg.fillRoundedRect(0, 0, 190, 70, 8)
      btn.bg.lineStyle(2, isSelected ? 0x00ccff : 0x4488aa, 1)
      btn.bg.strokeRoundedRect(0, 0, 190, 70, 8)
    })

    this.updatePreview()
  }

  confirmSelection() {
    window.GAME_STATE.currentWarframe = this.selectedWarframe
    window.GAME_STATE.currentWeapon = this.selectedWeapon
    this.saveAndExit()
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
    localStorage.setItem('miniWarframeSave', JSON.stringify(window.GAME_STATE))
    this.scene.start('MenuScene')
  }
}
