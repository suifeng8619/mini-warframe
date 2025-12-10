import Phaser from 'phaser'
import { BOSSES } from '../data/enemies.js'
import { Enemy } from './Enemy.js'

export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, bossType) {
    const bossData = BOSSES[bossType]

    super(scene, x, y, `boss_${bossType}`)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.bossType = bossType
    this.bossData = bossData

    // Boss属性
    this.stats = {
      health: bossData.baseStats.health,
      maxHealth: bossData.baseStats.health,
      armor: bossData.baseStats.armor,
      damage: bossData.baseStats.damage,
      speed: bossData.baseStats.speed,
      attackRange: bossData.baseStats.attackRange,
      attackRate: bossData.baseStats.attackRate,
      detectionRange: bossData.baseStats.detectionRange,
      xpReward: bossData.baseStats.xpReward
    }

    // Corpus Boss有护盾
    if (bossData.baseStats.shield) {
      this.stats.shield = bossData.baseStats.shield
      this.stats.maxShield = bossData.baseStats.shield
    } else {
      this.stats.shield = 0
      this.stats.maxShield = 0
    }

    // Boss状态
    this.currentPhase = 0
    this.isStunned = false
    this.stunEndTime = 0
    this.lastAttackTime = 0
    this.target = null
    this.abilityCooldowns = {}

    // 初始化技能冷却
    bossData.abilities.forEach(ability => {
      this.abilityCooldowns[ability.id] = 0
    })

    // 物理设置
    this.setCollideWorldBounds(true)
    this.setBounce(0)
    this.setDragX(500)
    this.body.setSize(64, 80)
    this.setScale(1.5)
    this.setDepth(100)

    // 设置颜色
    this.setTint(bossData.color)

    // 创建血条
    this.createHealthBar()

    // Boss名称显示
    this.createNamePlate()
  }

  createHealthBar() {
    // Boss血条比普通敌人大
    this.healthBarBg = this.scene.add.graphics()
    this.healthBar = this.scene.add.graphics()
    this.shieldBar = this.scene.add.graphics()
    this.healthBarBg.setDepth(150)
    this.healthBar.setDepth(151)
    this.shieldBar.setDepth(152)
  }

  createNamePlate() {
    this.namePlate = this.scene.add.text(this.x, this.y - 80, this.bossData.displayName, {
      fontFamily: 'Arial Black',
      fontSize: '18px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3
    })
    this.namePlate.setOrigin(0.5)
    this.namePlate.setDepth(160)
  }

  updateHealthBar() {
    const barWidth = 120
    const barHeight = 10
    const x = this.x - barWidth / 2
    const y = this.y - this.height - 20

    // 背景
    this.healthBarBg.clear()
    this.healthBarBg.fillStyle(0x333333, 0.9)
    this.healthBarBg.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4)
    this.healthBarBg.lineStyle(2, 0xffcc00, 1)
    this.healthBarBg.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4)

    // 血条
    const healthPercent = this.stats.health / this.stats.maxHealth
    this.healthBar.clear()

    // 根据阶段变色
    let healthColor = 0xff4444
    if (this.currentPhase === 1) healthColor = 0xff8800
    if (this.currentPhase === 2) healthColor = 0xff0000

    this.healthBar.fillStyle(healthColor, 1)
    this.healthBar.fillRect(x, y, barWidth * healthPercent, barHeight)

    // 护盾条
    if (this.stats.maxShield > 0) {
      const shieldPercent = this.stats.shield / this.stats.maxShield
      this.shieldBar.clear()
      this.shieldBar.fillStyle(0x4488ff, 0.8)
      this.shieldBar.fillRect(x, y - 6, barWidth * shieldPercent, 4)
    }

    // 更新名牌位置
    if (this.namePlate) {
      this.namePlate.setPosition(this.x, y - 20)
    }
  }

  update(time, delta) {
    if (!this.active) return

    this.updateHealthBar()

    // 更新技能冷却
    for (const abilityId of Object.keys(this.abilityCooldowns)) {
      if (this.abilityCooldowns[abilityId] > 0) {
        this.abilityCooldowns[abilityId] -= delta
      }
    }

    // 检查眩晕
    if (this.isStunned) {
      if (time > this.stunEndTime) {
        this.isStunned = false
        this.clearTint()
        this.setTint(this.bossData.color)
      } else {
        this.setVelocityX(0)
        return
      }
    }

    // 检查阶段切换
    this.checkPhaseTransition()

    // 获取玩家
    if (!this.target || !this.target.active) {
      this.target = this.scene.player
    }

    if (!this.target || !this.target.active) return

    const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)

    // 根据Boss类型执行行为
    switch (this.bossType) {
      case 'captain_vor':
        this.captainVorBehavior(time, distToPlayer)
        break
      case 'jackal':
        this.jackalBehavior(time, distToPlayer)
        break
      case 'phorid':
        this.phoridBehavior(time, distToPlayer)
        break
    }

    // 面向玩家
    if (this.target.x < this.x) {
      this.setFlipX(true)
    } else {
      this.setFlipX(false)
    }
  }

  checkPhaseTransition() {
    const phases = this.bossData.phases
    const healthPercent = this.stats.health / this.stats.maxHealth

    for (let i = phases.length - 1; i >= 0; i--) {
      if (healthPercent <= phases[i].healthThreshold && this.currentPhase < i) {
        this.currentPhase = i
        this.onPhaseChange(phases[i])
        break
      }
    }
  }

  onPhaseChange(phase) {
    // 阶段切换特效
    const phaseEffect = this.scene.add.circle(this.x, this.y, 50, 0xffcc00, 0.8)
    phaseEffect.setDepth(200)

    this.scene.tweens.add({
      targets: phaseEffect,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (phaseEffect && phaseEffect.active) phaseEffect.destroy()
      }
    })

    // Boss阶段转换提示
    const phaseText = this.scene.add.text(this.x, this.y - 100, `Phase ${this.currentPhase + 1}`, {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 3
    })
    phaseText.setOrigin(0.5)
    phaseText.setDepth(300)

    this.scene.tweens.add({
      targets: phaseText,
      y: phaseText.y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        if (phaseText && phaseText.active) phaseText.destroy()
      }
    })
  }

  // ========== Captain Vor 行为 ==========
  captainVorBehavior(time, distToPlayer) {
    const phase = this.bossData.phases[this.currentPhase]

    // 根据阶段行为
    if (phase.behavior === 'teleport' && this.abilityCooldowns['vor_teleport'] <= 0) {
      this.vorTeleport()
      this.abilityCooldowns['vor_teleport'] = 8000
    }

    // 护盾技能
    if (this.currentPhase >= 2 && this.abilityCooldowns['vor_shield'] <= 0) {
      this.vorShield()
      this.abilityCooldowns['vor_shield'] = 15000
    }

    // 光束攻击
    if (distToPlayer < this.stats.attackRange && this.abilityCooldowns['vor_beam'] <= 0) {
      this.vorBeam()
      this.abilityCooldowns['vor_beam'] = 5000
    }

    // 基础移动和攻击
    if (distToPlayer > this.stats.attackRange * 0.5) {
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir)
    } else {
      this.setVelocityX(0)
    }

    // 普通攻击
    if (time - this.lastAttackTime >= this.stats.attackRate) {
      this.rangedAttack()
      this.lastAttackTime = time
    }
  }

  vorTeleport() {
    // 传送特效
    const startEffect = this.scene.add.circle(this.x, this.y, 30, 0xffcc00, 0.8)
    startEffect.setDepth(200)

    this.scene.tweens.add({
      targets: startEffect,
      scale: 0,
      duration: 200,
      onComplete: () => {
        if (startEffect && startEffect.active) startEffect.destroy()
      }
    })

    // 传送到玩家附近
    const angle = Math.random() * Math.PI * 2
    const dist = 150 + Math.random() * 100
    this.x = this.target.x + Math.cos(angle) * dist
    this.y = this.target.y + Math.sin(angle) * dist * 0.3

    // 结束特效
    const endEffect = this.scene.add.circle(this.x, this.y, 5, 0xffcc00, 0.8)
    endEffect.setDepth(200)

    this.scene.tweens.add({
      targets: endEffect,
      scale: 6,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (endEffect && endEffect.active) endEffect.destroy()
      }
    })
  }

  vorBeam() {
    if (!this.target || !this.target.active) return

    const ability = this.bossData.abilities.find(a => a.id === 'vor_beam')

    // 蓄力提示
    const chargeEffect = this.scene.add.circle(this.x, this.y, 20, 0xffff00, 0.5)
    chargeEffect.setDepth(200)

    this.scene.tweens.add({
      targets: chargeEffect,
      scale: 2,
      duration: 500,
      onComplete: () => {
        if (chargeEffect && chargeEffect.active) chargeEffect.destroy()

        if (!this.target || !this.target.active) return

        // 发射光束
        const beam = this.scene.add.graphics()
        beam.lineStyle(8, 0xffff00, 1)
        beam.lineBetween(this.x, this.y, this.target.x, this.target.y)
        beam.setDepth(200)

        // 伤害
        this.target.takeDamage(ability.damage)

        this.scene.tweens.add({
          targets: beam,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            if (beam && beam.active) beam.destroy()
          }
        })
      }
    })
  }

  vorShield() {
    const ability = this.bossData.abilities.find(a => a.id === 'vor_shield')

    this.isShielded = true

    // 护盾特效
    const shield = this.scene.add.circle(this.x, this.y, 60, 0xffcc00, 0.3)
    shield.setDepth(99)

    const shieldFollow = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        if (this.active) {
          shield.setPosition(this.x, this.y)
        }
      },
      loop: true
    })

    this.scene.time.delayedCall(ability.duration, () => {
      this.isShielded = false
      shieldFollow.destroy()
      if (shield && shield.active) shield.destroy()
    })
  }

  // ========== Jackal 行为 ==========
  jackalBehavior(time, distToPlayer) {
    const phase = this.bossData.phases[this.currentPhase]

    // 眩晕阶段
    if (phase.behavior === 'stunned') {
      this.setVelocityX(0)
      return
    }

    // 踩踏攻击
    if (distToPlayer < 200 && this.abilityCooldowns['jackal_stomp'] <= 0) {
      this.jackalStomp()
      this.abilityCooldowns['jackal_stomp'] = 8000
    }

    // 导弹攻击
    if (this.abilityCooldowns['jackal_missiles'] <= 0) {
      this.jackalMissiles()
      this.abilityCooldowns['jackal_missiles'] = 6000
    }

    // 激光扫射
    if (distToPlayer < this.stats.attackRange && this.abilityCooldowns['jackal_laser'] <= 0) {
      this.jackalLaser()
      this.abilityCooldowns['jackal_laser'] = 3000
    }

    // 移动
    const speedMult = phase.attackSpeedMultiplier || 1
    if (distToPlayer > 150) {
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir * speedMult)
    } else {
      this.setVelocityX(0)
    }
  }

  jackalStomp() {
    const ability = this.bossData.abilities.find(a => a.id === 'jackal_stomp')

    // 踩踏特效
    const stomp = this.scene.add.circle(this.x, this.y + 40, ability.radius, 0xff8800, 0.6)
    stomp.setDepth(50)

    this.scene.tweens.add({
      targets: stomp,
      scale: 1.5,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (stomp && stomp.active) stomp.destroy()
      }
    })

    // 伤害范围内玩家
    if (this.target && this.target.active) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
      if (dist < ability.radius) {
        this.target.takeDamage(ability.damage)
        // 击飞
        if (this.target.body) {
          this.target.body.velocity.y = -400
        }
      }
    }
  }

  jackalMissiles() {
    const ability = this.bossData.abilities.find(a => a.id === 'jackal_missiles')

    for (let i = 0; i < ability.count; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        if (!this.active || !this.target || !this.target.active) return

        const missile = this.scene.add.circle(this.x, this.y - 20, 8, 0xff4444)
        missile.setDepth(200)

        // 追踪玩家
        const missileUpdate = this.scene.time.addEvent({
          delay: 16,
          callback: () => {
            if (!missile.active || !this.target || !this.target.active) {
              missileUpdate.destroy()
              return
            }

            const angle = Phaser.Math.Angle.Between(missile.x, missile.y, this.target.x, this.target.y)
            missile.x += Math.cos(angle) * 8
            missile.y += Math.sin(angle) * 8

            // 命中检测
            const dist = Phaser.Math.Distance.Between(missile.x, missile.y, this.target.x, this.target.y)
            if (dist < 30) {
              this.target.takeDamage(ability.damage)
              missile.destroy()
              missileUpdate.destroy()

              // 爆炸特效
              const explosion = this.scene.add.circle(missile.x, missile.y, 20, 0xff4444, 0.8)
              explosion.setDepth(200)
              this.scene.tweens.add({
                targets: explosion,
                scale: 2,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                  if (explosion && explosion.active) explosion.destroy()
                }
              })
            }
          },
          loop: true
        })

        // 超时销毁
        this.scene.time.delayedCall(3000, () => {
          missileUpdate.destroy()
          if (missile && missile.active) missile.destroy()
        })
      })
    }
  }

  jackalLaser() {
    const ability = this.bossData.abilities.find(a => a.id === 'jackal_laser')

    // 激光扫射
    const startAngle = this.target.x < this.x ? Math.PI : 0
    const sweepAngle = ability.angle * Math.PI / 180

    const laser = this.scene.add.graphics()
    laser.setDepth(200)

    let currentAngle = startAngle - sweepAngle / 2
    const endAngle = startAngle + sweepAngle / 2
    const sweepSpeed = sweepAngle / 30 // 30帧完成

    const laserSweep = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        if (!this.active) {
          laserSweep.destroy()
          if (laser && laser.active) laser.destroy()
          return
        }

        laser.clear()
        laser.lineStyle(4, 0xff0000, 0.8)

        const laserLength = 400
        const endX = this.x + Math.cos(currentAngle) * laserLength
        const endY = this.y + Math.sin(currentAngle) * laserLength

        laser.lineBetween(this.x, this.y, endX, endY)

        // 伤害检测
        if (this.target && this.target.active) {
          const playerDist = Phaser.Geom.Line.GetNearestPoint(
            new Phaser.Geom.Line(this.x, this.y, endX, endY),
            { x: this.target.x, y: this.target.y }
          )
          const dist = Phaser.Math.Distance.Between(this.target.x, this.target.y, playerDist.x, playerDist.y)
          if (dist < 30) {
            this.target.takeDamage(ability.damage)
          }
        }

        currentAngle += sweepSpeed

        if (currentAngle >= endAngle) {
          laserSweep.destroy()
          this.scene.tweens.add({
            targets: laser,
            alpha: 0,
            duration: 100,
            onComplete: () => {
              if (laser && laser.active) laser.destroy()
            }
          })
        }
      },
      loop: true
    })
  }

  // ========== Phorid 行为 ==========
  phoridBehavior(time, distToPlayer) {
    const phase = this.bossData.phases[this.currentPhase]

    // 恐惧尖啸
    if (this.abilityCooldowns['phorid_scream'] <= 0) {
      this.phoridScream()
      this.abilityCooldowns['phorid_scream'] = 10000
    }

    // 召唤小怪
    if (this.abilityCooldowns['phorid_spawn'] <= 0) {
      this.phoridSpawn(phase.spawnRate)
      this.abilityCooldowns['phorid_spawn'] = 12000
    }

    // 横扫攻击
    if (distToPlayer < this.stats.attackRange && this.abilityCooldowns['phorid_swipe'] <= 0) {
      this.phoridSwipe()
      this.abilityCooldowns['phorid_swipe'] = 2000
    }

    // 移动 - 狂暴阶段更快
    let speedMult = 1
    if (phase.behavior === 'frenzy') speedMult = 1.5

    if (distToPlayer > this.stats.attackRange * 0.8) {
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir * speedMult)
    } else {
      this.setVelocityX(0)
    }

    // 基础攻击
    if (distToPlayer < this.stats.attackRange) {
      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.meleeAttack()
        this.lastAttackTime = time
      }
    }
  }

  phoridScream() {
    const ability = this.bossData.abilities.find(a => a.id === 'phorid_scream')

    // 尖啸波纹
    const scream = this.scene.add.circle(this.x, this.y, 10, 0x66ff44, 0.5)
    scream.setDepth(100)

    this.scene.tweens.add({
      targets: scream,
      scale: ability.range / 10,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (scream && scream.active) scream.destroy()
      }
    })

    // 恐惧效果 - 击退玩家
    if (this.target && this.target.active) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
      if (dist < ability.range) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
        if (this.target.body) {
          this.target.body.velocity.x = Math.cos(angle) * 500
          this.target.body.velocity.y = -200
        }
        // 短暂眩晕效果
        this.target.invincibleTime = 500
      }
    }
  }

  phoridSpawn(spawnRate) {
    const ability = this.bossData.abilities.find(a => a.id === 'phorid_spawn')

    let spawnCount = ability.count
    if (spawnRate === 'medium') spawnCount += 2
    if (spawnRate === 'high') spawnCount += 4

    for (let i = 0; i < spawnCount; i++) {
      const spawnX = this.x + (Math.random() - 0.5) * 200
      const spawnY = this.y

      // 召唤特效
      const spawnEffect = this.scene.add.circle(spawnX, spawnY, 20, 0x66ff44, 0.6)
      spawnEffect.setDepth(100)

      this.scene.tweens.add({
        targets: spawnEffect,
        scale: 0,
        duration: 300,
        onComplete: () => {
          if (spawnEffect && spawnEffect.active) spawnEffect.destroy()

          // 创建小怪
          const minion = new Enemy(this.scene, spawnX, spawnY, ability.summonType, Math.floor(this.scene.waveNumber * 0.8))
          this.scene.enemies.add(minion)
        }
      })
    }
  }

  phoridSwipe() {
    const ability = this.bossData.abilities.find(a => a.id === 'phorid_swipe')

    // 横扫特效
    const swipe = this.scene.add.graphics()
    swipe.fillStyle(0x66ff44, 0.5)

    const startAngle = this.flipX ? Math.PI : 0
    const arcAngle = ability.arc * Math.PI / 180

    swipe.slice(this.x, this.y, 100, startAngle - arcAngle / 2, startAngle + arcAngle / 2, false)
    swipe.fillPath()
    swipe.setDepth(100)

    this.scene.tweens.add({
      targets: swipe,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        if (swipe && swipe.active) swipe.destroy()
      }
    })

    // 伤害检测
    if (this.target && this.target.active) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
      if (dist < 100) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
        const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angle - startAngle))
        if (angleDiff < arcAngle / 2) {
          this.target.takeDamage(ability.damage)
        }
      }
    }
  }

  // 通用方法
  rangedAttack() {
    if (!this.target || !this.target.active) return

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
    const bullet = this.scene.enemyBullets.get(this.x, this.y, 'enemy_bullet')

    if (bullet) {
      bullet.setActive(true)
      bullet.setVisible(true)
      bullet.setRotation(angle)
      bullet.setScale(1.5)

      if (bullet.body) {
        const speed = 500
        bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
      }
      bullet.damage = this.stats.damage

      this.scene.time.delayedCall(3000, () => {
        if (bullet.active) {
          bullet.setActive(false)
          bullet.setVisible(false)
        }
      })
    }
  }

  meleeAttack() {
    if (!this.target || !this.target.active) return

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)

    if (dist < this.stats.attackRange + 30) {
      this.target.takeDamage(this.stats.damage)

      const attackEffect = this.scene.add.circle(
        (this.x + this.target.x) / 2,
        (this.y + this.target.y) / 2,
        40,
        0xff4444,
        0.6
      )
      attackEffect.setDepth(200)

      this.scene.tweens.add({
        targets: attackEffect,
        alpha: 0,
        scale: 1.5,
        duration: 150,
        onComplete: () => {
          if (attackEffect && attackEffect.active) attackEffect.destroy()
        }
      })
    }
  }

  takeDamage(amount, isCrit = false) {
    // 护盾减伤
    if (this.isShielded) {
      amount *= 0.3
    }

    // 先扣护盾
    if (this.stats.shield > 0) {
      const shieldDamage = Math.min(this.stats.shield, amount)
      this.stats.shield -= shieldDamage
      amount -= shieldDamage
    }

    // 护甲减伤
    const armorReduction = this.stats.armor / (this.stats.armor + 300)
    amount *= (1 - armorReduction)

    this.stats.health -= amount

    // 伤害数字
    this.showDamageNumber(amount, isCrit)

    // 受击闪烁
    this.setTintFill(0xffffff)
    this.scene.time.delayedCall(50, () => {
      if (this.active) {
        this.clearTint()
        this.setTint(this.bossData.color)
      }
    })

    if (this.stats.health <= 0) {
      this.die()
    }
  }

  showDamageNumber(amount, isCrit) {
    const color = isCrit ? '#ffff00' : '#ffffff'
    const size = isCrit ? '24px' : '20px'

    const damageText = this.scene.add.text(
      this.x + (Math.random() - 0.5) * 50,
      this.y - 30,
      Math.floor(amount).toString(),
      {
        fontFamily: 'Arial Black',
        fontSize: size,
        color: color,
        stroke: '#000000',
        strokeThickness: 3
      }
    )
    damageText.setOrigin(0.5)
    damageText.setDepth(300)

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 60,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (damageText && damageText.active) damageText.destroy()
      }
    })
  }

  stun(duration) {
    this.isStunned = true
    this.stunEndTime = this.scene.time.now + duration
    this.setTint(0x888888)
    this.setVelocityX(0)
  }

  die() {
    // 通知场景Boss被击杀（用于任务奖励和材料掉落）
    if (this.scene.onEnemyKilled) {
      // Boss掉落更多奖励，设置一个标记
      this.isBoss = true
      this.stats.level = this.scene.waveNumber || 10
      this.scene.onEnemyKilled(this)
    }

    // Boss击杀特效
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const explosion = this.scene.add.circle(
          this.x + (Math.random() - 0.5) * 100,
          this.y + (Math.random() - 0.5) * 100,
          30,
          0xffcc00,
          0.8
        )
        explosion.setDepth(200)

        this.scene.tweens.add({
          targets: explosion,
          scale: 3,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            if (explosion && explosion.active) explosion.destroy()
          }
        })
      })
    }

    // Boss击杀提示
    const defeatText = this.scene.add.text(this.x, this.y - 50, `${this.bossData.displayName} DEFEATED!`, {
      fontFamily: 'Arial Black',
      fontSize: '32px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4
    })
    defeatText.setOrigin(0.5)
    defeatText.setDepth(500)
    defeatText.setScrollFactor(0)

    this.scene.tweens.add({
      targets: defeatText,
      y: defeatText.y - 100,
      alpha: 0,
      duration: 3000,
      onComplete: () => {
        if (defeatText && defeatText.active) defeatText.destroy()
      }
    })

    // 更新击杀数
    this.scene.killCount++

    // 清理UI元素
    if (this.healthBarBg) this.healthBarBg.destroy()
    if (this.healthBar) this.healthBar.destroy()
    if (this.shieldBar) this.shieldBar.destroy()
    if (this.namePlate) this.namePlate.destroy()

    // 标记Boss已击杀
    this.scene.bossDefeated = true

    this.destroy()
  }
}
