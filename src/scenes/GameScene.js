import Phaser from 'phaser'
import { Warframe } from '../entities/Warframe.js'
import { Enemy } from '../entities/Enemy.js'
import { Boss } from '../entities/Boss.js'
import { WAVE_CONFIG, getRandomEnemyType, ENEMIES } from '../data/enemies.js'
import { MATERIALS } from '../data/materials.js'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // 获取任务信息
    this.missionData = window.GAME_STATE.currentMission || null

    // 游戏状态
    this.waveNumber = 1
    this.killCount = 0
    this.enemiesSpawned = 0
    this.enemiesThisWave = 0
    this.waveComplete = false
    this.isGameOver = false
    this.isPaused = false
    this.missionComplete = false

    // 任务奖励累计
    this.earnedCredits = 0
    this.earnedMaterials = {}

    // 根据任务设置敌人等级范围
    if (this.missionData) {
      this.minEnemyLevel = this.missionData.enemyLevel[0]
      this.maxEnemyLevel = this.missionData.enemyLevel[1]
    } else {
      this.minEnemyLevel = 1
      this.maxEnemyLevel = 100
    }

    // 背景
    this.add.image(640, 360, 'background').setScrollFactor(0)

    // 创建关卡
    this.createLevel()

    // 创建玩家
    this.player = new Warframe(this, 200, 500)

    // 创建组 - 子弹不受重力影响
    this.playerBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 100,
      runChildUpdate: false,
      allowGravity: false
    })

    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 50,
      runChildUpdate: false,
      allowGravity: false
    })

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    })

    this.pickups = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 30
    })

    // 碰撞设置
    this.setupCollisions()

    // 相机跟随
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
    this.cameras.main.setZoom(1)
    // 相机边界设置为关卡大小，确保不会超出
    // 使用setDeadzone让玩家在中间区域移动时相机不跟随
    this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight)
    this.cameras.main.setDeadzone(200, 100)

    // 十字准星
    this.crosshair = this.add.image(0, 0, 'ui_crosshair')
    this.crosshair.setScrollFactor(0)
    this.crosshair.setDepth(1000)

    // 隐藏系统鼠标
    this.input.setDefaultCursor('none')

    // 启动UI场景
    this.scene.launch('UIScene')

    // 开始第一波
    this.startWave()

    // ESC暂停 - 保存回调引用以便清理
    this.escHandler = () => {
      this.pauseGame()
    }
    this.input.keyboard.on('keydown-ESC', this.escHandler)

    // 场景事件 - 清理资源
    this.events.on('shutdown', this.cleanup, this)
  }

  cleanup() {
    // 移除ESC事件监听
    if (this.escHandler) {
      this.input.keyboard.off('keydown-ESC', this.escHandler)
      this.escHandler = null
    }
    // 清理生成定时器
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = null
    }
    // 清理波次文本引用
    if (this.waveAnnouncementText) {
      this.waveAnnouncementText.destroy()
      this.waveAnnouncementText = null
    }
    if (this.waveCompleteText) {
      this.waveCompleteText.destroy()
      this.waveCompleteText = null
    }
    // 清理游戏结束UI
    if (this.gameOverOverlay) {
      this.gameOverOverlay.destroy()
      this.gameOverOverlay = null
    }
    if (this.gameOverText) {
      this.gameOverText.destroy()
      this.gameOverText = null
    }
    if (this.gameOverStats) {
      this.gameOverStats.destroy()
      this.gameOverStats = null
    }
    if (this.restartBtn) {
      this.restartBtn.destroy()
      this.restartBtn = null
    }
    if (this.menuBtn) {
      this.menuBtn.destroy()
      this.menuBtn = null
    }
    // 清理缓存对象
    this.bulletBounds = null
  }

  createLevel() {
    this.levelWidth = 2400
    this.levelHeight = 720

    // 地形组
    this.platforms = this.physics.add.staticGroup()

    // 地板
    for (let x = 0; x < this.levelWidth; x += 64) {
      const floor = this.platforms.create(x + 32, this.levelHeight - 32, 'floor_tile')
      floor.setScale(1).refreshBody()
    }

    // 左墙
    for (let y = 0; y < this.levelHeight; y += 64) {
      const wall = this.platforms.create(32, y + 32, 'wall_tile')
      wall.setScale(1).refreshBody()
    }

    // 右墙
    for (let y = 0; y < this.levelHeight; y += 64) {
      const wall = this.platforms.create(this.levelWidth - 32, y + 32, 'wall_tile')
      wall.setScale(1).refreshBody()
    }

    // 平台布局 - 跑酷风格
    const platformLayout = [
      // 左侧区域
      { x: 150, y: 550, w: 3 },
      { x: 100, y: 420, w: 2 },
      { x: 250, y: 320, w: 3 },
      { x: 120, y: 200, w: 2 },

      // 中央区域
      { x: 500, y: 500, w: 4 },
      { x: 650, y: 380, w: 3 },
      { x: 450, y: 280, w: 2 },
      { x: 600, y: 180, w: 4 },
      { x: 800, y: 450, w: 3 },

      // 右侧区域
      { x: 1000, y: 520, w: 4 },
      { x: 1150, y: 400, w: 3 },
      { x: 1000, y: 280, w: 2 },
      { x: 1200, y: 200, w: 3 },
      { x: 1350, y: 350, w: 2 },

      // 远端区域
      { x: 1500, y: 500, w: 4 },
      { x: 1700, y: 380, w: 3 },
      { x: 1550, y: 250, w: 3 },
      { x: 1800, y: 150, w: 2 },
      { x: 1900, y: 450, w: 3 },

      // 最远端
      { x: 2100, y: 520, w: 3 },
      { x: 2200, y: 380, w: 2 },
      { x: 2050, y: 250, w: 2 },
      { x: 2250, y: 150, w: 2 }
    ]

    platformLayout.forEach(p => {
      for (let i = 0; i < p.w; i++) {
        const platform = this.platforms.create(p.x + i * 64, p.y, 'platform')
        platform.setScale(1).refreshBody()
      }
    })

    // 背景装饰
    this.createBackgroundDecorations()
  }

  createBackgroundDecorations() {
    // 添加一些发光装饰线
    const graphics = this.add.graphics()
    graphics.setDepth(1)

    // 垂直光线
    for (let i = 0; i < 10; i++) {
      const x = 200 + i * 200 + Math.random() * 100
      graphics.lineStyle(1, 0x00ccff, 0.1 + Math.random() * 0.1)
      graphics.lineBetween(x, 0, x, this.levelHeight)
    }

    // 水平光线
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 120 + Math.random() * 50
      graphics.lineStyle(1, 0x0088aa, 0.1)
      graphics.lineBetween(0, y, this.levelWidth, y)
    }
  }

  setupCollisions() {
    // 玩家与平台
    this.physics.add.collider(this.player, this.platforms)

    // 敌人与平台
    this.physics.add.collider(this.enemies, this.platforms)

    // 掉落物与平台
    this.physics.add.collider(this.pickups, this.platforms)

    // 玩家子弹击中敌人
    this.physics.add.overlap(this.playerBullets, this.enemies, this.bulletHitEnemy, null, this)

    // 敌人子弹击中玩家
    this.physics.add.overlap(this.enemyBullets, this.player, this.bulletHitPlayer, null, this)

    // 玩家拾取物品
    this.physics.add.overlap(this.player, this.pickups, this.collectPickup, null, this)

    // 敌人与玩家碰撞（触碰伤害）
    this.physics.add.overlap(this.player, this.enemies, this.enemyTouchPlayer, null, this)
  }

  bulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return

    // 计算暴击
    const isCrit = Math.random() < bullet.critChance
    let damage = bullet.damage
    if (isCrit) {
      damage *= bullet.critMultiplier
    }

    enemy.takeDamage(damage, isCrit)

    // AOE爆炸效果（如Opticor）
    if (bullet.aoeRadius && bullet.aoeRadius > 0) {
      this.createAoeExplosion(bullet.x, bullet.y, bullet.aoeRadius, damage * 0.5)
    }

    // 连锁效果（如Amprex、Atomos）
    if (bullet.chainCount && bullet.chainCount > 0) {
      this.createChainLightning(enemy, bullet.chainCount, bullet.chainRange || 100, damage * 0.7)
    }

    // 穿透逻辑
    if (bullet.punchThrough && bullet.punchThrough > 0) {
      bullet.punchThrough--
    } else {
      bullet.setActive(false)
      bullet.setVisible(false)
    }

    // 击中特效
    const hitEffect = this.add.circle(bullet.x, bullet.y, 10, 0x00ccff, 0.8)
    hitEffect.setDepth(200)
    this.tweens.add({
      targets: hitEffect,
      alpha: 0,
      scale: 2,
      duration: 100,
      onComplete: () => {
        if (hitEffect && hitEffect.active) {
          hitEffect.destroy()
        }
      }
    })
  }

  // AOE爆炸效果
  createAoeExplosion(x, y, radius, damage) {
    // 视觉效果
    const explosion = this.add.circle(x, y, radius, 0x00ff00, 0.5)
    explosion.setDepth(150)
    this.tweens.add({
      targets: explosion,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => {
        if (explosion && explosion.active) {
          explosion.destroy()
        }
      }
    })

    // 对范围内敌人造成伤害
    this.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y)
      if (dist <= radius) {
        enemy.takeDamage(damage, false)
      }
    })
  }

  // 连锁闪电效果
  createChainLightning(sourceEnemy, chainCount, chainRange, damage) {
    const hitEnemies = new Set([sourceEnemy])
    let currentTarget = sourceEnemy

    for (let i = 0; i < chainCount; i++) {
      let nearestEnemy = null
      let nearestDist = chainRange

      // 查找最近的未被击中的敌人
      this.enemies.getChildren().forEach(enemy => {
        if (!enemy.active || hitEnemies.has(enemy)) return
        const dist = Phaser.Math.Distance.Between(currentTarget.x, currentTarget.y, enemy.x, enemy.y)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestEnemy = enemy
        }
      })

      if (!nearestEnemy) break

      // 绘制连锁特效
      const lightning = this.add.graphics()
      lightning.lineStyle(3, 0x00ffff, 0.8)
      lightning.lineBetween(currentTarget.x, currentTarget.y, nearestEnemy.x, nearestEnemy.y)
      lightning.setDepth(150)

      this.tweens.add({
        targets: lightning,
        alpha: 0,
        duration: 150,
        onComplete: () => {
          if (lightning) lightning.destroy()
        }
      })

      // 对连锁目标造成伤害
      nearestEnemy.takeDamage(damage, false)
      hitEnemies.add(nearestEnemy)
      currentTarget = nearestEnemy
    }
  }

  bulletHitPlayer(bullet, player) {
    if (!bullet.active || !player.active) return

    player.takeDamage(bullet.damage)

    bullet.setActive(false)
    bullet.setVisible(false)
  }

  enemyTouchPlayer(player, enemy) {
    // 检查玩家和敌人是否都活跃
    if (!player.active || !enemy.active) return

    // 触碰伤害冷却
    if (!enemy.touchCooldown) {
      enemy.touchCooldown = 0
    }

    const now = this.time.now
    if (now - enemy.touchCooldown > 500) {
      player.takeDamage(enemy.stats.damage * 0.5)
      enemy.touchCooldown = now
    }
  }

  collectPickup(player, pickup) {
    if (!pickup.active) return

    switch (pickup.pickupType) {
      case 'energy':
        player.addEnergy(pickup.value)
        break
      case 'health':
        player.heal(pickup.value)
        break
      case 'ammo':
        player.currentAmmo = Math.min(
          player.currentAmmo + pickup.value,
          player.weaponData.baseStats.magazineSize
        )
        break
    }

    // 拾取特效
    const effect = this.add.circle(pickup.x, pickup.y, 15, 0xffffff, 0.5)
    this.tweens.add({
      targets: effect,
      alpha: 0,
      scale: 2,
      duration: 200,
      onComplete: () => {
        if (effect && effect.active) {
          effect.destroy()
        }
      }
    })

    pickup.setActive(false)
    pickup.setVisible(false)
  }

  startWave() {
    this.waveComplete = false
    this.enemiesSpawned = 0
    this.bossDefeated = false
    this.currentBoss = null

    // 如果是Boss任务类型，第一波就是Boss
    if (this.missionData && this.missionData.type === 'boss' && this.waveNumber === 1) {
      const bossType = this.missionData.bossType || 'captain_vor'
      this.enemiesThisWave = 0
      this.showWaveAnnouncement(true, bossType)

      this.time.delayedCall(2000, () => {
        this.spawnBoss(bossType)
      })
      return
    }

    // 检查是否是Boss波次 (普通模式每5波一个Boss)
    const bossType = WAVE_CONFIG.getBossWave(this.waveNumber)

    if (bossType) {
      // Boss波次
      this.enemiesThisWave = 0 // Boss波次不生成普通敌人
      this.showWaveAnnouncement(true, bossType)

      // 延迟生成Boss
      this.time.delayedCall(2000, () => {
        this.spawnBoss(bossType)
      })
    } else {
      // 普通波次
      this.enemiesThisWave = WAVE_CONFIG.baseEnemyCount + (this.waveNumber - 1) * WAVE_CONFIG.enemyCountPerWave

      // 波次开始提示
      this.showWaveAnnouncement()

      // 开始生成敌人
      this.spawnTimer = this.time.addEvent({
        delay: WAVE_CONFIG.spawnInterval,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
      })
    }
  }

  spawnBoss(bossType) {
    // Boss在地图中央生成
    const spawnX = this.levelWidth / 2
    const spawnY = this.levelHeight - 200

    this.currentBoss = new Boss(this, spawnX, spawnY, bossType)
    this.enemies.add(this.currentBoss)

    // Boss警告特效
    const warning = this.add.text(640, 300, 'WARNING: BOSS INCOMING!', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4
    })
    warning.setOrigin(0.5)
    warning.setScrollFactor(0)
    warning.setDepth(500)

    this.tweens.add({
      targets: warning,
      alpha: 0,
      y: 280,
      duration: 2000,
      onComplete: () => {
        if (warning && warning.active) warning.destroy()
      }
    })
  }

  showWaveAnnouncement(isBossWave = false, bossType = null) {
    // 先销毁旧的文本（如果存在）
    if (this.waveAnnouncementText) {
      this.waveAnnouncementText.destroy()
    }

    let displayText = `WAVE ${this.waveNumber}`
    let color = '#00ccff'
    let strokeColor = '#003344'

    if (isBossWave && bossType) {
      displayText = `WAVE ${this.waveNumber}\nBOSS BATTLE!`
      color = '#ff4444'
      strokeColor = '#440000'
    }

    const text = this.add.text(640, 200, displayText, {
      fontFamily: 'Arial Black',
      fontSize: isBossWave ? '48px' : '64px',
      color: color,
      stroke: strokeColor,
      strokeThickness: 4,
      align: 'center'
    })
    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(500)
    text.setAlpha(0)

    // 保存引用
    this.waveAnnouncementText = text

    this.tweens.add({
      targets: text,
      alpha: 1,
      y: 180,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          // 检查text是否仍然存在
          if (text && text.active) {
            this.tweens.add({
              targets: text,
              alpha: 0,
              y: 160,
              duration: 300,
              onComplete: () => {
                if (text && text.active) {
                  text.destroy()
                }
                if (this.waveAnnouncementText === text) {
                  this.waveAnnouncementText = null
                }
              }
            })
          }
        })
      }
    })
  }

  spawnEnemy() {
    if (this.isGameOver) {
      if (this.spawnTimer) this.spawnTimer.destroy()
      return
    }

    // 检查玩家是否存在且活跃
    if (!this.player || !this.player.active) {
      if (this.spawnTimer) this.spawnTimer.destroy()
      return
    }

    // 检查是否还需要生成
    if (this.enemiesSpawned >= this.enemiesThisWave) {
      if (this.spawnTimer) this.spawnTimer.destroy()
      this.checkWaveComplete()
      return
    }

    // 检查屏幕上敌人数量
    if (this.enemies.countActive() >= WAVE_CONFIG.maxEnemiesOnScreen) {
      return
    }

    // 选择生成位置 - 在玩家视野外
    let spawnX, spawnY

    const side = Math.random() < 0.5 ? 'left' : 'right'
    const playerX = this.player.x
    const viewWidth = this.cameras.main.width

    if (side === 'left') {
      spawnX = Math.max(100, playerX - viewWidth / 2 - 100 - Math.random() * 200)
    } else {
      spawnX = Math.min(this.levelWidth - 100, playerX + viewWidth / 2 + 100 + Math.random() * 200)
    }

    // 确保X坐标在有效范围内（避免生成在墙内）
    spawnX = Math.max(100, Math.min(spawnX, this.levelWidth - 100))

    // 在地面上方一定高度生成，让敌人自然落下
    // 地面y = this.levelHeight - 64，所以在稍微上方生成
    // 确保Y坐标在有效范围内
    spawnY = Math.max(100, Math.min(this.levelHeight - 150 - Math.random() * 200, this.levelHeight - 100))

    // 根据任务阵营选择敌人类型
    let enemyType
    if (this.missionData && this.missionData.faction) {
      enemyType = this.getEnemyTypeByFaction(this.missionData.faction, this.waveNumber)
    } else {
      enemyType = getRandomEnemyType(this.waveNumber)
    }

    // 等级根据任务范围和波次计算
    const baseLevel = this.minEnemyLevel + Math.floor((this.maxEnemyLevel - this.minEnemyLevel) * (this.waveNumber - 1) / 10)
    const enemyLevel = Math.min(baseLevel + Math.floor(Math.random() * 3), this.maxEnemyLevel)

    // 创建敌人
    const enemy = new Enemy(this, spawnX, spawnY, enemyType, enemyLevel)
    this.enemies.add(enemy)

    this.enemiesSpawned++
  }

  // 根据阵营获取敌人类型
  getEnemyTypeByFaction(faction, wave) {
    const factionEnemies = {
      grineer: ['grineer_lancer', 'grineer_trooper', 'grineer_heavy', 'grineer_bombard', 'grineer_napalm'],
      corpus: ['corpus_crewman', 'corpus_tech', 'corpus_moa', 'corpus_nullifier', 'corpus_sniper'],
      infested: ['infested_charger', 'infested_runner', 'infested_leaper', 'infested_ancient', 'infested_boiler'],
      corrupted: ['corrupted_lancer', 'corrupted_crewman', 'corrupted_moa', 'corrupted_heavy', 'corrupted_ancient']
    }

    const enemies = factionEnemies[faction] || factionEnemies.grineer

    // 根据波次解锁更强的敌人
    let maxIndex = Math.min(Math.floor(wave / 2), enemies.length - 1)
    const index = Math.floor(Math.random() * (maxIndex + 1))

    // 检查敌人类型是否在ENEMIES中存在，否则回退
    const selectedType = enemies[index]
    if (ENEMIES[selectedType]) {
      return selectedType
    }
    return getRandomEnemyType(wave)
  }

  checkWaveComplete() {
    // Boss波次检查
    if (this.currentBoss) {
      if (this.bossDefeated || !this.currentBoss.active) {
        this.waveComplete = true
        this.currentBoss = null

        // Boss任务类型 - 击败Boss即完成任务
        if (this.missionData && this.missionData.type === 'boss') {
          this.completeMission()
          return
        }

        this.waveNumber++

        // 更新最高波次记录
        if (this.waveNumber > window.GAME_STATE.highScore) {
          window.GAME_STATE.highScore = this.waveNumber
          this.saveGame()
        }

        // 显示波次完成
        this.showWaveComplete()

        // 延迟后开始下一波
        this.time.delayedCall(WAVE_CONFIG.waveBreakTime + 2000, () => {
          if (!this.isGameOver && !this.missionComplete) {
            this.startWave()
          }
        })
      }
      return
    }

    // 普通波次检查
    if (this.enemies.countActive() === 0 && this.enemiesSpawned >= this.enemiesThisWave) {
      this.waveComplete = true
      this.waveNumber++

      // 检查任务完成条件
      if (this.checkMissionComplete()) {
        this.completeMission()
        return
      }

      // 更新最高波次记录
      if (this.waveNumber > window.GAME_STATE.highScore) {
        window.GAME_STATE.highScore = this.waveNumber
        this.saveGame()
      }

      // 显示波次完成
      this.showWaveComplete()

      // 延迟后开始下一波
      this.time.delayedCall(WAVE_CONFIG.waveBreakTime, () => {
        if (!this.isGameOver && !this.missionComplete) {
          this.startWave()
        }
      })
    }
  }

  // 检查任务是否完成
  checkMissionComplete() {
    if (!this.missionData) return false

    switch (this.missionData.type) {
      case 'defense':
        // 防御任务：完成5波
        return this.waveNumber > 5
      case 'exterminate':
        // 歼灭任务：击杀一定数量
        const targetKills = 20 + (this.missionData.enemyLevel[0] || 1) * 2
        return this.killCount >= targetKills
      case 'survival':
        // 生存任务：坚持5波
        return this.waveNumber > 5
      case 'capture':
      case 'spy':
      case 'sabotage':
        // 简化处理：完成3波
        return this.waveNumber > 3
      default:
        return this.waveNumber > 5
    }
  }

  // 完成任务
  completeMission() {
    if (this.missionComplete) return
    this.missionComplete = true

    // 停止生成
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = null
    }

    // 计算任务奖励
    const baseCredits = 1000 + (this.missionData?.enemyLevel[0] || 1) * 200
    this.earnedCredits += baseCredits + this.killCount * 50

    // 标记节点完成
    if (this.missionData && this.missionData.nodeId) {
      if (!window.GAME_STATE.completedNodes) {
        window.GAME_STATE.completedNodes = []
      }
      if (!window.GAME_STATE.completedNodes.includes(this.missionData.nodeId)) {
        window.GAME_STATE.completedNodes.push(this.missionData.nodeId)
      }
    }

    // 发放奖励
    window.GAME_STATE.credits = (window.GAME_STATE.credits || 0) + this.earnedCredits

    // 发放材料
    for (const [matId, amount] of Object.entries(this.earnedMaterials)) {
      if (!window.GAME_STATE.inventory) {
        window.GAME_STATE.inventory = {}
      }
      window.GAME_STATE.inventory[matId] = (window.GAME_STATE.inventory[matId] || 0) + amount
    }

    // 更新统计
    window.GAME_STATE.totalKills = (window.GAME_STATE.totalKills || 0) + this.killCount
    window.GAME_STATE.totalMissions = (window.GAME_STATE.totalMissions || 0) + 1

    // 保存
    this.saveGame()

    // 显示任务完成界面
    this.time.delayedCall(500, () => {
      this.showMissionComplete()
    })
  }

  showWaveComplete() {
    // 先销毁旧的文本（如果存在）
    if (this.waveCompleteText) {
      this.waveCompleteText.destroy()
    }

    const text = this.add.text(640, 360, 'WAVE COMPLETE', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 4
    })
    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(500)

    // 保存引用
    this.waveCompleteText = text

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 340,
      duration: 2000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (text && text.active) {
          text.destroy()
        }
        if (this.waveCompleteText === text) {
          this.waveCompleteText = null
        }
      }
    })
  }

  update(time, delta) {
    if (this.isGameOver) return

    // 更新玩家（确保玩家存在且活跃）
    if (this.player && this.player.active) {
      this.player.update(time, delta)
    }

    // 更新准星位置
    this.crosshair.setPosition(this.input.activePointer.x, this.input.activePointer.y)

    // 清理屏幕外的子弹
    this.cleanupBullets()

    // 检查波次完成
    if (!this.waveComplete && this.enemiesSpawned >= this.enemiesThisWave) {
      this.checkWaveComplete()
    }
  }

  cleanupBullets() {
    // 使用缓存的bounds对象，避免每帧创建新对象
    if (!this.bulletBounds) {
      this.bulletBounds = new Phaser.Geom.Rectangle(
        -100, -100,
        this.levelWidth + 200,
        this.levelHeight + 200
      )
    }

    const bounds = this.bulletBounds

    this.playerBullets.getChildren().forEach(bullet => {
      if (bullet.active && !bounds.contains(bullet.x, bullet.y)) {
        bullet.setActive(false)
        bullet.setVisible(false)
      }
    })

    this.enemyBullets.getChildren().forEach(bullet => {
      if (bullet.active && !bounds.contains(bullet.x, bullet.y)) {
        bullet.setActive(false)
        bullet.setVisible(false)
      }
    })
  }

  pauseGame() {
    if (this.isPaused || this.isGameOver) return
    this.isPaused = true

    // 只暂停游戏场景，不暂停UIScene（需要响应按钮点击）
    this.scene.pause()

    // 显示暂停菜单
    const uiScene = this.scene.get('UIScene')
    uiScene.showPauseMenu()
  }

  resumeGame() {
    this.isPaused = false
    this.scene.resume()

    const uiScene = this.scene.get('UIScene')
    uiScene.hidePauseMenu()
  }

  gameOver() {
    this.isGameOver = true

    // 停止生成
    if (this.spawnTimer) {
      this.spawnTimer.destroy()
      this.spawnTimer = null
    }

    // 更新统计
    window.GAME_STATE.totalKills += this.killCount
    window.GAME_STATE.totalMissions++
    this.saveGame()

    // 清理玩家对象（玩家已死亡，设置不可见但保持引用）
    if (this.player) {
      this.player.setVisible(false)
      this.player.setActive(false)
    }

    // 显示游戏结束界面
    this.time.delayedCall(1000, () => {
      this.showGameOverScreen()
    })
  }

  showGameOverScreen() {
    // 暗化背景
    this.gameOverOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8)
    this.gameOverOverlay.setScrollFactor(0)
    this.gameOverOverlay.setDepth(400)

    // 游戏结束文字
    this.gameOverText = this.add.text(640, 200, 'MISSION FAILED', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      color: '#ff4444',
      stroke: '#220000',
      strokeThickness: 4
    })
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setDepth(450)

    // 统计信息
    this.gameOverStats = this.add.text(640, 320, [
      `波次: ${this.waveNumber}`,
      `击杀: ${this.killCount}`,
      `最高波次: ${window.GAME_STATE.highScore}`
    ].join('\n'), {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center'
    })
    this.gameOverStats.setOrigin(0.5)
    this.gameOverStats.setScrollFactor(0)
    this.gameOverStats.setDepth(450)

    // 重新开始按钮
    this.restartBtn = this.createButton(640, 480, '重新开始', () => {
      this.scene.stop('UIScene')
      this.scene.restart()
    })

    // 返回菜单按钮
    this.menuBtn = this.createButton(640, 550, '返回菜单', () => {
      this.scene.stop('UIScene')
      this.scene.start('MenuScene')
    })
  }

  createButton(x, y, text, callback) {
    const container = this.add.container(x, y)
    container.setScrollFactor(0)
    container.setDepth(460)

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

  saveGame() {
    localStorage.setItem('miniWarframeSave', JSON.stringify(window.GAME_STATE))
  }

  // 任务完成界面
  showMissionComplete() {
    // 暗化背景
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8)
    overlay.setScrollFactor(0)
    overlay.setDepth(400)

    // 任务完成文字
    const completeText = this.add.text(640, 150, 'MISSION COMPLETE', {
      fontFamily: 'Arial Black',
      fontSize: '56px',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 4
    })
    completeText.setOrigin(0.5)
    completeText.setScrollFactor(0)
    completeText.setDepth(450)

    // 奖励标题
    this.add.text(640, 230, '任务奖励', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffaa00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(450)

    // 星币奖励
    this.add.text(640, 280, `星币: +${this.earnedCredits.toLocaleString()}`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffcc00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(450)

    // 材料奖励
    let yOffset = 320
    const materialEntries = Object.entries(this.earnedMaterials)
    if (materialEntries.length > 0) {
      this.add.text(640, yOffset, '获得材料:', {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#88aacc'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(450)
      yOffset += 30

      materialEntries.slice(0, 6).forEach(([matId, amount]) => {
        const matData = MATERIALS[matId]
        const matName = matData?.displayName || matId
        this.add.text(640, yOffset, `${matName}: +${amount}`, {
          fontFamily: 'Arial',
          fontSize: '16px',
          color: '#aaaaaa'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(450)
        yOffset += 25
      })
    }

    // 统计信息
    yOffset = Math.max(yOffset + 20, 450)
    this.add.text(640, yOffset, [
      `击杀数: ${this.killCount}`,
      `波次: ${this.waveNumber}`
    ].join('    '), {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#888888'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(450)

    // 继续按钮
    const continueBtn = this.createButton(640, 550, '继续', () => {
      this.scene.stop('UIScene')
      this.scene.start('NavigationScene')
    })
    continueBtn.setDepth(460)

    // 返回菜单按钮
    const menuBtn = this.createButton(640, 620, '返回菜单', () => {
      this.scene.stop('UIScene')
      this.scene.start('MenuScene')
    })
    menuBtn.setDepth(460)
  }

  // 敌人死亡时调用的掉落方法
  onEnemyKilled(enemy) {
    this.killCount++

    // 基础星币奖励
    const creditDrop = 10 + enemy.stats.level * 5
    this.earnedCredits += creditDrop

    // 材料掉落
    this.rollMaterialDrop(enemy)

    // 生成拾取物
    this.spawnPickupFromEnemy(enemy)
  }

  // 材料掉落判定
  rollMaterialDrop(enemy) {
    // 根据阵营决定可能掉落的材料
    const factionDrops = {
      grineer: ['ferrite', 'rubedo', 'alloy_plate', 'morphics', 'neurodes'],
      corpus: ['alloy_plate', 'polymer_bundle', 'circuits', 'control_module', 'neural_sensors'],
      infested: ['nano_spores', 'plastids', 'mutagen_sample', 'neurodes'],
      corrupted: ['ferrite', 'rubedo', 'orokin_cell', 'argon_crystal']
    }

    const faction = this.missionData?.faction || 'grineer'
    const possibleDrops = factionDrops[faction] || factionDrops.grineer

    // 掉落概率
    const dropChance = 0.15 + (enemy.stats.level || 1) * 0.005

    if (Math.random() < dropChance) {
      // 随机选择一种材料
      const materialId = possibleDrops[Math.floor(Math.random() * possibleDrops.length)]
      const amount = Math.ceil(Math.random() * 3)

      if (!this.earnedMaterials[materialId]) {
        this.earnedMaterials[materialId] = 0
      }
      this.earnedMaterials[materialId] += amount

      // 显示掉落提示
      this.showDropText(enemy.x, enemy.y, materialId, amount)
    }

    // 稀有材料掉落 (低概率)
    const rareMaterials = ['orokin_cell', 'neural_sensors', 'neurodes', 'argon_crystal']
    if (Math.random() < 0.02) {
      const rareMat = rareMaterials[Math.floor(Math.random() * rareMaterials.length)]
      if (!this.earnedMaterials[rareMat]) {
        this.earnedMaterials[rareMat] = 0
      }
      this.earnedMaterials[rareMat] += 1
      this.showDropText(enemy.x, enemy.y - 20, rareMat, 1, true)
    }
  }

  // 显示掉落文字
  showDropText(x, y, materialId, amount, isRare = false) {
    const matData = MATERIALS[materialId]
    const matName = matData?.displayName || materialId

    const dropText = this.add.text(x, y, `+${amount} ${matName}`, {
      fontFamily: 'Arial',
      fontSize: isRare ? '16px' : '12px',
      color: isRare ? '#ffaa00' : '#88ff88',
      stroke: '#000000',
      strokeThickness: 2
    })
    dropText.setOrigin(0.5)
    dropText.setDepth(300)

    this.tweens.add({
      targets: dropText,
      y: y - 40,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        if (dropText && dropText.active) dropText.destroy()
      }
    })
  }

  // 从敌人位置生成拾取物
  spawnPickupFromEnemy(enemy) {
    // 能量球掉落
    if (Math.random() < 0.2) {
      this.spawnPickup(enemy.x, enemy.y, 'energy', 25)
    }
    // 生命球掉落
    if (Math.random() < 0.15) {
      this.spawnPickup(enemy.x + 20, enemy.y, 'health', 30)
    }
    // 弹药掉落
    if (Math.random() < 0.25) {
      this.spawnPickup(enemy.x - 20, enemy.y, 'ammo', 20)
    }
  }

  // 生成拾取物
  spawnPickup(x, y, type, value) {
    const pickup = this.pickups.get(x, y, `pickup_${type}`)
    if (pickup) {
      pickup.setActive(true)
      pickup.setVisible(true)
      pickup.pickupType = type
      pickup.value = value

      // 让拾取物有一点弹跳
      if (pickup.body) {
        pickup.body.setVelocity((Math.random() - 0.5) * 100, -150)
        pickup.body.setGravityY(300)
        pickup.body.setBounce(0.3)
      }

      // 10秒后消失
      this.time.delayedCall(10000, () => {
        if (pickup.active) {
          pickup.setActive(false)
          pickup.setVisible(false)
        }
      })
    }
  }
}
