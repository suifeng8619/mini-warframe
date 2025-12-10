import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 创建加载进度条
    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222244, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    const loadingText = this.add.text(width / 2, height / 2 - 60, 'LOADING TENNO SYSTEMS...', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#00ccff'
    }).setOrigin(0.5)

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 加载进度事件
    this.load.on('progress', (value) => {
      percentText.setText(Math.round(value * 100) + '%')
      progressBar.clear()
      progressBar.fillStyle(0x00ccff, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      percentText.destroy()
    })

    // 生成临时游戏素材
    this.createPlaceholderAssets()
  }

  createPlaceholderAssets() {
    // 生成战甲精灵 - 更帅气的设计
    this.generateWarframeSprite('excalibur', 0x4488ff)
    this.generateWarframeSprite('volt', 0xffff44)
    this.generateWarframeSprite('mag', 0xff44ff)
    this.generateWarframeSprite('rhino', 0x888888)
    this.generateWarframeSprite('loki', 0x44aaff)
    this.generateWarframeSprite('nova', 0xffaa00)
    this.generateWarframeSprite('trinity', 0x88ffaa)
    this.generateWarframeSprite('ash', 0x444444)

    // 生成武器弹药
    this.generateBulletSprite('bullet_normal', 0x00ccff, 12, 4)
    this.generateBulletSprite('bullet_shotgun', 0x66ff66, 8, 8)
    this.generateBulletSprite('bullet_energy', 0xff44ff, 10, 10)
    this.generateBulletSprite('bullet_arrow', 0x220000, 20, 3)  // 弓箭
    this.generateBulletSprite('bullet_beam', 0x00ffff, 30, 6)   // 光束武器
    this.generateBulletSprite('bullet_laser', 0x00ff00, 40, 8)  // 激光炮

    // 生成敌人精灵
    this.generateEnemySprite('grineer', 0xcc4444)
    this.generateEnemySprite('corpus', 0x4488cc)
    this.generateEnemySprite('infested', 0x66aa44)

    // 生成敌人弹药
    this.generateBulletSprite('enemy_bullet', 0xff4444, 8, 4)

    // 生成特效
    this.generateParticle('particle_energy', 0x00ccff)
    this.generateParticle('particle_fire', 0xff6600)
    this.generateParticle('particle_electric', 0xffff00)
    this.generateParticle('particle_magnetic', 0xff00ff)

    // 生成UI元素
    this.generateUIElements()

    // 生成平台/地形
    this.generatePlatformSprite()

    // 生成背景
    this.generateBackground()

    // 生成能量球/掉落物
    this.generatePickups()
  }

  generateWarframeSprite(name, color) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    const width = 48
    const height = 64

    // 身体 - 更流线型的设计
    graphics.fillStyle(color, 1)

    // 躯干 - 梯形
    graphics.beginPath()
    graphics.moveTo(width * 0.3, height * 0.25)
    graphics.lineTo(width * 0.7, height * 0.25)
    graphics.lineTo(width * 0.75, height * 0.6)
    graphics.lineTo(width * 0.25, height * 0.6)
    graphics.closePath()
    graphics.fillPath()

    // 头部 - 尖锐的头盔
    graphics.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(20).color, 1)
    graphics.beginPath()
    graphics.moveTo(width * 0.5, height * 0.05)
    graphics.lineTo(width * 0.65, height * 0.15)
    graphics.lineTo(width * 0.65, height * 0.25)
    graphics.lineTo(width * 0.35, height * 0.25)
    graphics.lineTo(width * 0.35, height * 0.15)
    graphics.closePath()
    graphics.fillPath()

    // 面罩发光
    graphics.fillStyle(0xffffff, 0.9)
    graphics.fillRect(width * 0.4, height * 0.12, width * 0.2, height * 0.06)

    // 腿部
    graphics.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(30).color, 1)
    graphics.fillRect(width * 0.28, height * 0.6, width * 0.18, height * 0.35)
    graphics.fillRect(width * 0.54, height * 0.6, width * 0.18, height * 0.35)

    // 手臂
    graphics.fillRect(width * 0.1, height * 0.28, width * 0.15, height * 0.25)
    graphics.fillRect(width * 0.75, height * 0.28, width * 0.15, height * 0.25)

    // 能量线条装饰
    graphics.lineStyle(2, 0xffffff, 0.5)
    graphics.lineBetween(width * 0.35, height * 0.3, width * 0.35, height * 0.55)
    graphics.lineBetween(width * 0.65, height * 0.3, width * 0.65, height * 0.55)

    // 生成纹理
    graphics.generateTexture(`warframe_${name}`, width, height)
    graphics.destroy()
  }

  generateEnemySprite(faction, color) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    const width = 40
    const height = 56

    // 主体
    graphics.fillStyle(color, 1)
    graphics.fillRoundedRect(width * 0.2, height * 0.2, width * 0.6, height * 0.55, 4)

    // 头部
    graphics.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(20).color, 1)
    graphics.fillCircle(width * 0.5, height * 0.15, width * 0.2)

    // 眼睛/面罩
    graphics.fillStyle(0xff0000, 0.8)
    graphics.fillRect(width * 0.35, height * 0.1, width * 0.3, height * 0.08)

    // 腿
    graphics.fillStyle(Phaser.Display.Color.IntegerToColor(color).darken(40).color, 1)
    graphics.fillRect(width * 0.25, height * 0.75, width * 0.18, height * 0.22)
    graphics.fillRect(width * 0.57, height * 0.75, width * 0.18, height * 0.22)

    graphics.generateTexture(`enemy_${faction}`, width, height)
    graphics.destroy()
  }

  generateBulletSprite(name, color, width, height) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })

    // 发光核心
    graphics.fillStyle(0xffffff, 1)
    graphics.fillEllipse(width / 2, height / 2, width * 0.6, height * 0.6)

    // 外发光
    graphics.fillStyle(color, 0.8)
    graphics.fillEllipse(width / 2, height / 2, width, height)

    graphics.generateTexture(name, width, height)
    graphics.destroy()
  }

  generateParticle(name, color) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    const size = 16

    graphics.fillStyle(color, 0.8)
    graphics.fillCircle(size / 2, size / 2, size / 2)

    graphics.fillStyle(0xffffff, 0.6)
    graphics.fillCircle(size / 2, size / 2, size / 4)

    graphics.generateTexture(name, size, size)
    graphics.destroy()
  }

  generateUIElements() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })

    // 生命条背景
    graphics.fillStyle(0x333333, 1)
    graphics.fillRoundedRect(0, 0, 200, 20, 4)
    graphics.generateTexture('ui_bar_bg', 200, 20)
    graphics.clear()

    // 生命条
    graphics.fillStyle(0xff4444, 1)
    graphics.fillRoundedRect(0, 0, 200, 20, 4)
    graphics.generateTexture('ui_health_bar', 200, 20)
    graphics.clear()

    // 护盾条
    graphics.fillStyle(0x4488ff, 1)
    graphics.fillRoundedRect(0, 0, 200, 20, 4)
    graphics.generateTexture('ui_shield_bar', 200, 20)
    graphics.clear()

    // 能量条
    graphics.fillStyle(0x44ff88, 1)
    graphics.fillRoundedRect(0, 0, 200, 20, 4)
    graphics.generateTexture('ui_energy_bar', 200, 20)
    graphics.clear()

    // 技能按钮背景
    graphics.fillStyle(0x222244, 0.8)
    graphics.fillRoundedRect(0, 0, 60, 60, 8)
    graphics.lineStyle(2, 0x4488ff, 1)
    graphics.strokeRoundedRect(0, 0, 60, 60, 8)
    graphics.generateTexture('ui_skill_bg', 60, 60)
    graphics.clear()

    // 技能按钮激活状态
    graphics.fillStyle(0x4488ff, 0.4)
    graphics.fillRoundedRect(0, 0, 60, 60, 8)
    graphics.lineStyle(2, 0x00ffff, 1)
    graphics.strokeRoundedRect(0, 0, 60, 60, 8)
    graphics.generateTexture('ui_skill_active', 60, 60)
    graphics.clear()

    // 十字准星
    graphics.lineStyle(2, 0x00ffff, 0.8)
    graphics.lineBetween(16, 8, 16, 14)
    graphics.lineBetween(16, 18, 16, 24)
    graphics.lineBetween(8, 16, 14, 16)
    graphics.lineBetween(18, 16, 24, 16)
    graphics.strokeCircle(16, 16, 6)
    graphics.generateTexture('ui_crosshair', 32, 32)
    graphics.clear()

    graphics.destroy()
  }

  generatePlatformSprite() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })

    // 科幻风格平台
    graphics.fillStyle(0x334455, 1)
    graphics.fillRect(0, 0, 64, 32)

    // 上边缘高亮
    graphics.fillStyle(0x5588aa, 1)
    graphics.fillRect(0, 0, 64, 4)

    // 装饰线条
    graphics.lineStyle(1, 0x00ccff, 0.5)
    graphics.lineBetween(8, 16, 56, 16)

    graphics.generateTexture('platform', 64, 32)
    graphics.clear()

    // 地板
    graphics.fillStyle(0x222233, 1)
    graphics.fillRect(0, 0, 64, 64)
    graphics.lineStyle(1, 0x334455, 0.3)
    for (let i = 0; i < 64; i += 16) {
      graphics.lineBetween(i, 0, i, 64)
      graphics.lineBetween(0, i, 64, i)
    }
    graphics.generateTexture('floor_tile', 64, 64)
    graphics.clear()

    // 墙壁
    graphics.fillStyle(0x1a1a2e, 1)
    graphics.fillRect(0, 0, 64, 64)
    graphics.fillStyle(0x2a2a4e, 1)
    graphics.fillRect(4, 4, 56, 56)
    graphics.lineStyle(2, 0x3a3a6e, 0.5)
    graphics.strokeRect(8, 8, 48, 48)
    graphics.generateTexture('wall_tile', 64, 64)

    graphics.destroy()
  }

  generateBackground() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    const width = 1280
    const height = 720

    // 渐变背景
    for (let y = 0; y < height; y++) {
      const t = y / height
      const r = Math.floor(10 + t * 15)
      const g = Math.floor(10 + t * 20)
      const b = Math.floor(20 + t * 30)
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1)
      graphics.fillRect(0, y, width, 1)
    }

    // 添加一些星星/光点
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height * 0.6
      const alpha = 0.3 + Math.random() * 0.4
      const size = 1 + Math.random() * 2
      graphics.fillStyle(0x6688aa, alpha)
      graphics.fillCircle(x, y, size)
    }

    graphics.generateTexture('background', width, height)
    graphics.destroy()
  }

  generatePickups() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    const size = 24

    // 能量球
    graphics.fillStyle(0x00ffff, 0.3)
    graphics.fillCircle(size / 2, size / 2, size / 2)
    graphics.fillStyle(0x00ffff, 0.8)
    graphics.fillCircle(size / 2, size / 2, size / 3)
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(size / 2, size / 2, size / 6)
    graphics.generateTexture('pickup_energy', size, size)
    graphics.clear()

    // 生命球
    graphics.fillStyle(0xff4444, 0.3)
    graphics.fillCircle(size / 2, size / 2, size / 2)
    graphics.fillStyle(0xff4444, 0.8)
    graphics.fillCircle(size / 2, size / 2, size / 3)
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(size / 2, size / 2, size / 6)
    graphics.generateTexture('pickup_health', size, size)
    graphics.clear()

    // 弹药
    graphics.fillStyle(0xffaa00, 0.3)
    graphics.fillCircle(size / 2, size / 2, size / 2)
    graphics.fillStyle(0xffaa00, 0.8)
    graphics.fillCircle(size / 2, size / 2, size / 3)
    graphics.generateTexture('pickup_ammo', size, size)

    graphics.destroy()
  }

  create() {
    // 所有资源加载完成后跳转到菜单
    this.scene.start('MenuScene')
  }
}
