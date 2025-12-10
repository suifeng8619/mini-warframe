import Phaser from 'phaser'
import { WARFRAMES } from '../data/warframes.js'

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.gameScene = this.scene.get('GameScene')

    // UI容器
    this.uiContainer = this.add.container(0, 0)
    this.uiContainer.setDepth(1000)

    // 创建HUD元素
    this.createHealthShieldBars()
    this.createEnergyBar()
    this.createAmmoDisplay()
    this.createSkillBar()
    this.createWaveInfo()
    this.createMiniStats()
  }

  createHealthShieldBars() {
    const x = 20
    const y = 20
    const width = 250
    const height = 20

    // 背景框
    const bgGraphics = this.add.graphics()
    bgGraphics.fillStyle(0x111122, 0.8)
    bgGraphics.fillRoundedRect(x - 5, y - 5, width + 10, height * 2 + 15, 8)
    bgGraphics.lineStyle(1, 0x334455, 1)
    bgGraphics.strokeRoundedRect(x - 5, y - 5, width + 10, height * 2 + 15, 8)

    // 护盾条背景
    this.shieldBarBg = this.add.graphics()
    this.shieldBarBg.fillStyle(0x222244, 1)
    this.shieldBarBg.fillRoundedRect(x, y, width, height, 4)

    // 护盾条
    this.shieldBar = this.add.graphics()

    // 生命条背景
    this.healthBarBg = this.add.graphics()
    this.healthBarBg.fillStyle(0x222222, 1)
    this.healthBarBg.fillRoundedRect(x, y + height + 5, width, height, 4)

    // 生命条
    this.healthBar = this.add.graphics()

    // 数值显示
    this.shieldText = this.add.text(x + width / 2, y + height / 2, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.healthText = this.add.text(x + width / 2, y + height + 5 + height / 2, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 战甲图标/名称
    const warframeName = WARFRAMES[window.GAME_STATE.currentWarframe]?.displayName || 'Unknown'
    this.add.text(x, y - 20, warframeName, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#00ccff'
    })
  }

  createEnergyBar() {
    const x = 20
    const y = 80
    const width = 180
    const height = 12

    // 背景
    const bgGraphics = this.add.graphics()
    bgGraphics.fillStyle(0x111122, 0.8)
    bgGraphics.fillRoundedRect(x - 5, y - 5, width + 10, height + 10, 4)

    // 能量条背景
    this.energyBarBg = this.add.graphics()
    this.energyBarBg.fillStyle(0x112222, 1)
    this.energyBarBg.fillRoundedRect(x, y, width, height, 4)

    // 能量条
    this.energyBar = this.add.graphics()

    // 能量图标
    this.add.text(x - 2, y - 18, 'ENERGY', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#44ff88'
    })

    // 能量数值
    this.energyText = this.add.text(x + width + 10, y + height / 2, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#44ff88'
    }).setOrigin(0, 0.5)
  }

  createAmmoDisplay() {
    const x = 1180
    const y = 650

    // 背景
    const bgGraphics = this.add.graphics()
    bgGraphics.fillStyle(0x111122, 0.8)
    bgGraphics.fillRoundedRect(x - 10, y - 10, 100, 60, 8)
    bgGraphics.lineStyle(1, 0x334455, 1)
    bgGraphics.strokeRoundedRect(x - 10, y - 10, 100, 60, 8)

    // 弹药数
    this.ammoText = this.add.text(x + 40, y + 15, '', {
      fontFamily: 'Arial Black',
      fontSize: '32px',
      color: '#ffaa00'
    }).setOrigin(0.5)

    // 换弹提示
    this.reloadText = this.add.text(x + 40, y + 40, '', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ff4444'
    }).setOrigin(0.5)
  }

  createSkillBar() {
    const startX = 500
    const y = 660
    const spacing = 70

    this.skillIcons = []
    this.skillCooldownOverlays = []
    this.skillKeyLabels = []

    const warframeData = WARFRAMES[window.GAME_STATE.currentWarframe]
    const abilities = warframeData?.abilities || []

    for (let i = 0; i < 3; i++) {
      // 技能背景
      const bg = this.add.image(startX + i * spacing, y, 'ui_skill_bg')
      bg.setScale(1)

      // 冷却遮罩
      const cooldownOverlay = this.add.graphics()
      this.skillCooldownOverlays.push(cooldownOverlay)

      // 技能名称
      const ability = abilities[i]
      if (ability) {
        const nameText = this.add.text(startX + i * spacing, y - 40, ability.name, {
          fontFamily: 'Arial',
          fontSize: '10px',
          color: '#88aacc'
        }).setOrigin(0.5)
      }

      // 按键提示
      const keyLabel = this.add.text(startX + i * spacing, y + 35, (i + 1).toString(), {
        fontFamily: 'Arial Black',
        fontSize: '14px',
        color: '#ffffff'
      }).setOrigin(0.5)
      this.skillKeyLabels.push(keyLabel)

      // 能量消耗
      if (ability) {
        this.add.text(startX + i * spacing, y + 20, ability.energyCost.toString(), {
          fontFamily: 'Arial',
          fontSize: '10px',
          color: '#44ff88'
        }).setOrigin(0.5)
      }

      this.skillIcons.push(bg)
    }
  }

  createWaveInfo() {
    const x = 640
    const y = 30

    // 波次信息
    this.waveText = this.add.text(x, y, '', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 击杀数
    this.killText = this.add.text(x, y + 30, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5)
  }

  createMiniStats() {
    // 右上角小统计
    const x = 1220
    const y = 20

    this.add.text(x, y, 'STATS', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#667788'
    })

    this.statsText = this.add.text(x, y + 18, '', {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#88aacc',
      lineSpacing: 4
    })
  }

  update() {
    // 检查 gameScene、player 和 player 是否仍然活跃
    if (!this.gameScene || !this.gameScene.player || !this.gameScene.player.active) return

    const player = this.gameScene.player

    // 检查必要属性是否存在
    if (!player.stats || !player.weaponData?.baseStats) return

    // 更新护盾条
    const shieldPercent = player.currentShield / player.stats.maxShield
    this.shieldBar.clear()
    this.shieldBar.fillStyle(0x4488ff, 1)
    this.shieldBar.fillRoundedRect(20, 20, 250 * shieldPercent, 20, 4)
    this.shieldText.setText(`${Math.floor(player.currentShield)} / ${Math.floor(player.stats.maxShield)}`)

    // 更新生命条
    const healthPercent = player.currentHealth / player.stats.maxHealth
    const healthColor = healthPercent > 0.5 ? 0xff4444 : (healthPercent > 0.25 ? 0xff8800 : 0xff0000)
    this.healthBar.clear()
    this.healthBar.fillStyle(healthColor, 1)
    this.healthBar.fillRoundedRect(20, 45, 250 * healthPercent, 20, 4)
    this.healthText.setText(`${Math.floor(player.currentHealth)} / ${Math.floor(player.stats.maxHealth)}`)

    // 更新能量条
    const energyPercent = player.currentEnergy / player.stats.maxEnergy
    this.energyBar.clear()
    this.energyBar.fillStyle(0x44ff88, 1)
    this.energyBar.fillRoundedRect(20, 80, 180 * energyPercent, 12, 4)
    this.energyText.setText(`${Math.floor(player.currentEnergy)}`)

    // 更新弹药显示
    const weaponStats = player.weaponData.baseStats
    this.ammoText.setText(`${player.currentAmmo}/${Math.floor(weaponStats.magazineSize)}`)

    if (player.isReloading) {
      this.reloadText.setText('RELOADING...')
      this.ammoText.setColor('#666666')
    } else if (player.currentAmmo <= weaponStats.magazineSize * 0.2) {
      this.reloadText.setText('LOW AMMO [R]')
      this.ammoText.setColor('#ff4444')
    } else {
      this.reloadText.setText('')
      this.ammoText.setColor('#ffaa00')
    }

    // 更新技能冷却（检查数组和abilities是否存在）
    const abilities = player.warframeData?.abilities
    const cooldowns = player.abilityCooldowns
    for (let i = 0; i < 3; i++) {
      // 检查UI数组元素是否存在
      if (!this.skillCooldownOverlays[i] || !this.skillIcons[i]) continue

      // 检查cooldowns数组是否存在且有对应索引
      const cooldown = (cooldowns && cooldowns.length > i) ? cooldowns[i] : 0
      const ability = abilities ? abilities[i] : null

      this.skillCooldownOverlays[i].clear()

      if (cooldown > 0 && ability) {
        const cooldownPercent = cooldown / ability.cooldown
        const overlayHeight = 60 * cooldownPercent
        this.skillCooldownOverlays[i].fillStyle(0x000000, 0.7)
        // 从底部向上绘制冷却遮罩
        this.skillCooldownOverlays[i].fillRect(
          500 + i * 70 - 30,
          660 + 30 - overlayHeight,  // 从底部开始
          60,
          overlayHeight
        )
      }

      // 能量不足时显示暗色
      if (ability && player.currentEnergy < ability.energyCost) {
        this.skillIcons[i].setTint(0x666666)
      } else {
        this.skillIcons[i].clearTint()
      }
    }

    // 更新波次信息
    this.waveText.setText(`WAVE ${this.gameScene.waveNumber}`)
    this.killText.setText(`KILLS: ${this.gameScene.killCount}`)

    // 更新统计（确保enemies存在）
    if (this.gameScene.enemies) {
      this.statsText.setText([
        `ENEMIES: ${this.gameScene.enemies.countActive()}`,
        `SPAWNED: ${this.gameScene.enemiesSpawned}/${this.gameScene.enemiesThisWave}`
      ].join('\n'))
    }
  }

  showPauseMenu() {
    // 防止重复创建
    if (this.pauseOverlay) return

    // 暂停菜单覆盖层
    this.pauseOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.7)
    this.pauseOverlay.setDepth(2000)

    this.pauseText = this.add.text(640, 250, 'PAUSED', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      color: '#00ccff'
    }).setOrigin(0.5)
    this.pauseText.setDepth(2001)

    // 继续按钮
    this.resumeBtn = this.createPauseButton(640, 380, '继续', () => {
      this.gameScene.resumeGame()
    })

    // 返回菜单按钮
    this.menuBtn = this.createPauseButton(640, 450, '返回菜单', () => {
      this.hidePauseMenu()
      // 确保GameScene被正确关闭（会触发shutdown事件进行清理）
      this.scene.stop('GameScene')
      this.scene.stop()
      this.scene.start('MenuScene')
    })
  }

  createPauseButton(x, y, text, callback) {
    const container = this.add.container(x, y)
    container.setDepth(2002)

    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.9)
    bg.fillRoundedRect(-100, -25, 200, 50, 8)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-100, -25, 200, 50, 8)

    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#00ccff'
    }).setOrigin(0.5)

    container.add([bg, buttonText])
    container.setSize(200, 50)
    container.setInteractive()

    container.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x335566, 0.9)
      bg.fillRoundedRect(-100, -25, 200, 50, 8)
      bg.lineStyle(2, 0x00ccff, 1)
      bg.strokeRoundedRect(-100, -25, 200, 50, 8)
    })

    container.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.9)
      bg.fillRoundedRect(-100, -25, 200, 50, 8)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-100, -25, 200, 50, 8)
    })

    container.on('pointerdown', callback)

    return container
  }

  hidePauseMenu() {
    if (this.pauseOverlay) {
      this.pauseOverlay.destroy()
      this.pauseOverlay = null
    }
    if (this.pauseText) {
      this.pauseText.destroy()
      this.pauseText = null
    }
    if (this.resumeBtn) {
      this.resumeBtn.destroy()
      this.resumeBtn = null
    }
    if (this.menuBtn) {
      this.menuBtn.destroy()
      this.menuBtn = null
    }
  }
}
