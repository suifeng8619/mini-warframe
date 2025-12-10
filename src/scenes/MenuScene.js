import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 背景
    this.add.image(width / 2, height / 2, 'background')

    // 标题
    const titleText = this.add.text(width / 2, height * 0.2, 'MINI WARFRAME', {
      fontFamily: 'Arial Black, Arial',
      fontSize: '64px',
      color: '#00ccff',
      stroke: '#003344',
      strokeThickness: 4
    }).setOrigin(0.5)

    // 标题发光动画
    this.tweens.add({
      targets: titleText,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // 副标题
    this.add.text(width / 2, height * 0.3, 'TENNO AWAKENING', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#88aacc'
    }).setOrigin(0.5)

    // 菜单按钮 - 调整间距使其更紧凑
    this.createMenuButton(width / 2, height * 0.42, '星图导航', () => {
      this.scene.start('NavigationScene')
    })

    this.createMenuButton(width / 2, height * 0.50, '军械库', () => {
      this.scene.start('ArsenalScene')
    })

    this.createMenuButton(width / 2, height * 0.58, 'MOD配置', () => {
      this.scene.start('ModScene')
    })

    this.createMenuButton(width / 2, height * 0.66, '铸造厂', () => {
      this.scene.start('FoundryScene')
    })

    this.createMenuButton(width / 2, height * 0.74, '商店', () => {
      this.scene.start('ShopScene')
    })

    // 设置按钮 - 放在右下角
    this.createSmallButton(width - 80, height - 40, '设置', () => {
      this.scene.start('SettingsScene')
    })

    // 显示当前装备信息
    this.add.text(width * 0.05, height * 0.85, `当前战甲: ${window.GAME_STATE.currentWarframe}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    })

    this.add.text(width * 0.05, height * 0.9, `当前武器: ${window.GAME_STATE.currentWeapon}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    })

    // 最高分
    this.add.text(width * 0.05, height * 0.95, `最高波次: ${window.GAME_STATE.highScore || 0}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffaa00'
    })

    // Credits
    this.add.text(width * 0.95, height * 0.95, `Credits: ${window.GAME_STATE.credits}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffcc00'
    }).setOrigin(1, 0)

    // 操作说明
    const controlsText = [
      'WASD - 移动',
      'SPACE - 跳跃',
      'SHIFT - 翻滚/冲刺',
      '鼠标 - 瞄准射击',
      '1/2/3 - 技能',
      'R - 换弹'
    ].join('\n')

    this.add.text(width * 0.95, height * 0.5, controlsText, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#667788',
      align: 'right'
    }).setOrigin(1, 0.5)
  }

  createMenuButton(x, y, text, callback) {
    const button = this.add.container(x, y)

    // 按钮背景
    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.8)
    bg.fillRoundedRect(-120, -25, 240, 50, 8)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-120, -25, 240, 50, 8)

    // 按钮文字
    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#00ccff'
    }).setOrigin(0.5)

    button.add([bg, buttonText])
    button.setSize(240, 50)
    button.setInteractive()

    // 悬停效果
    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x335566, 0.9)
      bg.fillRoundedRect(-120, -25, 240, 50, 8)
      bg.lineStyle(2, 0x00ccff, 1)
      bg.strokeRoundedRect(-120, -25, 240, 50, 8)
      buttonText.setColor('#ffffff')
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.8)
      bg.fillRoundedRect(-120, -25, 240, 50, 8)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-120, -25, 240, 50, 8)
      buttonText.setColor('#00ccff')
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      callback()
    })

    return button
  }

  createSmallButton(x, y, text, callback) {
    const button = this.add.container(x, y)

    // 按钮背景
    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.8)
    bg.fillRoundedRect(-50, -18, 100, 36, 6)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-50, -18, 100, 36, 6)

    // 按钮文字
    const buttonText = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)

    button.add([bg, buttonText])
    button.setSize(100, 36)
    button.setInteractive()

    // 悬停效果
    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x335566, 0.9)
      bg.fillRoundedRect(-50, -18, 100, 36, 6)
      bg.lineStyle(2, 0x66aacc, 1)
      bg.strokeRoundedRect(-50, -18, 100, 36, 6)
      buttonText.setColor('#ffffff')
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.8)
      bg.fillRoundedRect(-50, -18, 100, 36, 6)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-50, -18, 100, 36, 6)
      buttonText.setColor('#88aacc')
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      callback()
    })

    return button
  }
}
