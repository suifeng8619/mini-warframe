import Phaser from 'phaser'
import { ENEMIES } from '../data/enemies.js'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, enemyType, level = 1) {
    const enemyData = ENEMIES[enemyType]
    const faction = enemyData.faction

    super(scene, x, y, `enemy_${faction}`)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.enemyType = enemyType
    this.enemyData = enemyData
    this.level = level

    // 根据等级缩放属性
    const levelMultiplier = 1 + (level - 1) * 0.15
    this.stats = {
      health: enemyData.baseStats.health * levelMultiplier,
      maxHealth: enemyData.baseStats.health * levelMultiplier,
      armor: enemyData.baseStats.armor,
      damage: enemyData.baseStats.damage * levelMultiplier,
      speed: enemyData.baseStats.speed,
      attackRange: enemyData.baseStats.attackRange,
      attackRate: enemyData.baseStats.attackRate,
      detectionRange: enemyData.baseStats.detectionRange,
      xpReward: Math.floor(enemyData.baseStats.xpReward * levelMultiplier)
    }

    // Corpus有护盾
    if (enemyData.baseStats.shield) {
      this.stats.shield = enemyData.baseStats.shield * levelMultiplier
      this.stats.maxShield = this.stats.shield
    } else {
      this.stats.shield = 0
      this.stats.maxShield = 0
    }

    // 状态
    this.isStunned = false
    this.stunEndTime = 0
    this.lastAttackTime = 0
    this.target = null
    this.behavior = enemyData.behavior

    // AI状态
    this.aiState = 'idle' // idle, chase, attack, retreat
    this.stateTimer = 0

    // 物理设置
    this.setCollideWorldBounds(true)
    this.setBounce(0)
    this.setDragX(500)
    this.body.setSize(32, 48)
    this.body.setOffset(4, 8)

    // 设置颜色色调
    this.setTint(enemyData.color)

    // 血条
    this.createHealthBar()
  }

  createHealthBar() {
    this.healthBarBg = this.scene.add.graphics()
    this.healthBar = this.scene.add.graphics()
    this.healthBarBg.setDepth(150)
    this.healthBar.setDepth(151)
  }

  updateHealthBar() {
    const barWidth = 40
    const barHeight = 4
    const x = this.x - barWidth / 2
    const y = this.y - this.height / 2 - 10

    this.healthBarBg.clear()
    this.healthBarBg.fillStyle(0x333333, 0.8)
    this.healthBarBg.fillRect(x, y, barWidth, barHeight)

    // 护盾
    if (this.stats.maxShield > 0 && this.stats.shield > 0) {
      const shieldPercent = this.stats.shield / this.stats.maxShield
      this.healthBar.clear()
      this.healthBar.fillStyle(0x4488ff, 1)
      this.healthBar.fillRect(x, y, barWidth * shieldPercent, barHeight)
    } else {
      const healthPercent = this.stats.health / this.stats.maxHealth
      this.healthBar.clear()
      this.healthBar.fillStyle(0xff4444, 1)
      this.healthBar.fillRect(x, y, barWidth * healthPercent, barHeight)
    }
  }

  update(time, delta) {
    if (!this.active) return

    // 更新血条位置
    this.updateHealthBar()

    // Ancient光环效果 - 给附近友方减伤
    if (this.enemyData.auraEffect) {
      this.applyAuraEffect()
    }

    // 检查眩晕
    if (this.isStunned) {
      if (time > this.stunEndTime) {
        this.isStunned = false
        this.clearTint()
        this.setTint(this.enemyData.color)
      } else {
        this.setVelocityX(0)
        return
      }
    }

    // 获取玩家引用（只在target无效时重新获取，避免每帧查询）
    if (!this.target || !this.target.active) {
      this.target = this.scene.player
    }

    if (!this.target || !this.target.active) {
      this.aiState = 'idle'
      return
    }

    // AI行为
    const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)

    switch (this.behavior) {
      case 'ranged':
        this.rangedBehavior(time, distToPlayer)
        break
      case 'melee':
        this.meleeBehavior(time, distToPlayer)
        break
      case 'charger':
        this.chargerBehavior(time, distToPlayer)
        break
      case 'grappler':
        this.grapplerBehavior(time, distToPlayer)
        break
      case 'summoner':
        this.summonerBehavior(time, distToPlayer)
        break
      case 'flying':
        this.flyingBehavior(time, distToPlayer)
        break
      case 'leaper':
        this.leaperBehavior(time, distToPlayer)
        break
    }

    // 面向目标（已确认target存在且活跃）
    if (this.target && this.target.active) {
      if (this.target.x < this.x) {
        this.setFlipX(true)
      } else {
        this.setFlipX(false)
      }
    }
  }

  rangedBehavior(time, distToPlayer) {
    // 远程敌人：保持距离射击
    const optimalRange = this.stats.attackRange * 0.7
    const minRange = this.stats.attackRange * 0.4

    // 二次检查target（虽然update已检查，但避免竞态）
    if (!this.target || !this.target.active) return

    if (distToPlayer > this.stats.detectionRange) {
      // 玩家太远，待机
      this.aiState = 'idle'
      this.setVelocityX(0)
    } else if (distToPlayer < minRange) {
      // 玩家太近，后退
      this.aiState = 'retreat'
      const retreatDir = this.x < this.target.x ? -1 : 1
      this.setVelocityX(this.stats.speed * retreatDir)
    } else if (distToPlayer > optimalRange) {
      // 追击到最佳射程
      this.aiState = 'chase'
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir)
    } else {
      // 在射程内，攻击
      this.aiState = 'attack'
      this.setVelocityX(0)

      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.rangedAttack()
        this.lastAttackTime = time
      }
    }
  }

  meleeBehavior(time, distToPlayer) {
    // 二次检查target（虽然update已检查，但避免竞态）
    if (!this.target || !this.target.active) return

    // 近战敌人：靠近攻击
    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      this.setVelocityX(0)
    } else if (distToPlayer > this.stats.attackRange) {
      // 追击
      this.aiState = 'chase'
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir)

      // 尝试跳跃追击（检查body存在）
      if (this.body && this.target.y < this.y - 50 && this.body.blocked.down) {
        this.setVelocityY(-350)
      }
    } else {
      // 攻击 - 停止移动进行攻击
      this.aiState = 'attack'
      this.setVelocityX(0)

      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.meleeAttack()
        this.lastAttackTime = time
      }
    }
  }

  chargerBehavior(time, distToPlayer) {
    // 冲锋型：发现玩家后直接冲过去
    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      // 巡逻
      if (!this.patrolDir) this.patrolDir = 1
      this.setVelocityX(this.stats.speed * 0.3 * this.patrolDir)

      // 碰墙换方向（检查body存在）
      if (this.body) {
        if (this.body.blocked.left) this.patrolDir = 1
        if (this.body.blocked.right) this.patrolDir = -1
      }
    } else {
      // 检查target是否仍然活跃
      if (!this.target || !this.target.active) return

      // 冲锋
      this.aiState = 'charge'
      const chargeDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * 1.2 * chargeDir)

      // 跳跃（检查body存在）
      if (this.body && this.target.y < this.y - 30 && this.body.blocked.down) {
        this.setVelocityY(-400)
      }

      // 攻击
      if (distToPlayer < this.stats.attackRange) {
        if (time - this.lastAttackTime >= this.stats.attackRate) {
          this.meleeAttack()
          this.lastAttackTime = time
        }
      }
    }
  }

  // 钩爪型AI (Scorpion)
  grapplerBehavior(time, distToPlayer) {
    if (!this.target || !this.target.active) return

    const grappleRange = this.enemyData.grappleRange || 250

    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      this.setVelocityX(0)
    } else if (distToPlayer <= grappleRange && distToPlayer > this.stats.attackRange) {
      // 在钩爪范围内，发射钩爪
      this.aiState = 'grapple'
      this.setVelocityX(0)

      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.grappleAttack()
        this.lastAttackTime = time
      }
    } else if (distToPlayer > grappleRange) {
      // 追击到钩爪范围
      this.aiState = 'chase'
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir)
    } else {
      // 近战攻击
      this.aiState = 'attack'
      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.meleeAttack()
        this.lastAttackTime = time
      }
    }
  }

  grappleAttack() {
    if (!this.target || !this.target.active) return

    const pullForce = this.enemyData.pullForce || 400

    // 钩爪特效
    const grappleLine = this.scene.add.graphics()
    grappleLine.lineStyle(3, 0xff6600, 1)
    grappleLine.lineBetween(this.x, this.y, this.target.x, this.target.y)
    grappleLine.setDepth(150)

    // 拉拽玩家
    if (this.target.body) {
      const angle = Phaser.Math.Angle.Between(this.target.x, this.target.y, this.x, this.y)
      this.target.body.velocity.x += Math.cos(angle) * pullForce
      this.target.body.velocity.y += Math.sin(angle) * pullForce * 0.5
    }

    // 造成伤害
    this.target.takeDamage(this.stats.damage * 0.5)

    this.scene.tweens.add({
      targets: grappleLine,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        if (grappleLine && grappleLine.active) grappleLine.destroy()
      }
    })
  }

  // 召唤型AI (Tech, Brood Mother)
  summonerBehavior(time, distToPlayer) {
    if (!this.target || !this.target.active) return

    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      this.setVelocityX(0)
    } else {
      // 保持距离
      const optimalRange = this.stats.attackRange * 0.8
      if (distToPlayer < optimalRange * 0.5) {
        // 太近，后退
        const retreatDir = this.x < this.target.x ? -1 : 1
        this.setVelocityX(this.stats.speed * retreatDir)
      } else if (distToPlayer > optimalRange) {
        // 追击
        const chaseDir = this.x < this.target.x ? 1 : -1
        this.setVelocityX(this.stats.speed * 0.5 * chaseDir)
      } else {
        this.setVelocityX(0)
      }

      // 召唤
      const summonCooldown = this.enemyData.summonCooldown || 8000
      if (!this.lastSummonTime) this.lastSummonTime = 0
      if (!this.summonCount) this.summonCount = 0

      const maxSummons = this.enemyData.maxSummons || 2

      if (time - this.lastSummonTime >= summonCooldown && this.summonCount < maxSummons) {
        this.summonMinion()
        this.lastSummonTime = time
      }

      // 远程攻击
      if (time - this.lastAttackTime >= this.stats.attackRate) {
        this.rangedAttack()
        this.lastAttackTime = time
      }
    }
  }

  summonMinion() {
    const summonType = this.enemyData.summonType || 'runner'
    const maxSummons = this.enemyData.maxSummons || 2

    // 检查当前召唤数量
    if (this.summonCount >= maxSummons) return

    // 召唤特效
    const summonEffect = this.scene.add.circle(this.x, this.y, 30, 0x00ff00, 0.5)
    summonEffect.setDepth(100)

    this.scene.tweens.add({
      targets: summonEffect,
      scale: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (summonEffect && summonEffect.active) summonEffect.destroy()
      }
    })

    // 创建召唤物
    const spawnX = this.x + (Math.random() - 0.5) * 100
    const spawnY = this.y

    // 导入Enemy类需要通过scene来创建
    const minion = new Enemy(this.scene, spawnX, spawnY, summonType, this.level)
    this.scene.enemies.add(minion)

    this.summonCount++

    // 标记召唤物，死亡时减少计数
    minion.summoner = this
    minion.isSummoned = true
  }

  // 飞行型AI (Osprey)
  flyingBehavior(time, distToPlayer) {
    if (!this.target || !this.target.active) return

    const hoverHeight = this.enemyData.hoverHeight || 100

    // 禁用重力
    if (this.body) {
      this.body.setAllowGravity(false)
    }

    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      // 悬停
      this.setVelocity(0, Math.sin(time / 500) * 20)
    } else {
      // 在玩家上方盘旋
      const targetX = this.target.x + (Math.random() - 0.5) * 100
      const targetY = this.target.y - hoverHeight

      const dx = targetX - this.x
      const dy = targetY - this.y

      // 平滑移动
      this.setVelocityX(dx * 2)
      this.setVelocityY(dy * 2 + Math.sin(time / 300) * 30)

      // 攻击
      if (distToPlayer < this.stats.attackRange) {
        if (time - this.lastAttackTime >= this.stats.attackRate) {
          this.rangedAttack()
          this.lastAttackTime = time
        }
      }
    }
  }

  // 跳跃型AI (Leaper)
  leaperBehavior(time, distToPlayer) {
    if (!this.target || !this.target.active) return

    const leapRange = this.enemyData.leapRange || 200

    if (distToPlayer > this.stats.detectionRange) {
      this.aiState = 'idle'
      // 巡逻
      if (!this.patrolDir) this.patrolDir = 1
      this.setVelocityX(this.stats.speed * 0.3 * this.patrolDir)
      if (this.body) {
        if (this.body.blocked.left) this.patrolDir = 1
        if (this.body.blocked.right) this.patrolDir = -1
      }
    } else if (distToPlayer <= leapRange && this.body && this.body.blocked.down) {
      // 跳跃攻击
      this.aiState = 'leap'

      if (!this.isLeaping) {
        this.isLeaping = true

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
        const leapSpeed = 500

        this.setVelocity(
          Math.cos(angle) * leapSpeed,
          Math.sin(angle) * leapSpeed - 300
        )

        // 跳跃攻击伤害加成
        this.leapDamageMultiplier = this.enemyData.leapDamageMultiplier || 1.5

        this.scene.time.delayedCall(500, () => {
          this.isLeaping = false
          this.leapDamageMultiplier = 1
        })
      }

      // 攻击
      if (distToPlayer < this.stats.attackRange) {
        if (time - this.lastAttackTime >= this.stats.attackRate) {
          const originalDamage = this.stats.damage
          this.stats.damage *= (this.leapDamageMultiplier || 1)
          this.meleeAttack()
          this.stats.damage = originalDamage
          this.lastAttackTime = time
        }
      }
    } else {
      // 追击
      this.aiState = 'chase'
      const chaseDir = this.x < this.target.x ? 1 : -1
      this.setVelocityX(this.stats.speed * chaseDir)
    }
  }

  rangedAttack() {
    // 检查target是否存在且活跃
    if (!this.target || !this.target.active) return

    // 计算射击角度
    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)

    // 创建敌人子弹
    const bullet = this.scene.enemyBullets.get(this.x, this.y, 'enemy_bullet')

    if (bullet) {
      bullet.setActive(true)
      bullet.setVisible(true)
      bullet.setRotation(angle)

      // 确保body存在再设置速度
      if (bullet.body) {
        const speed = 400
        bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
      }
      bullet.damage = this.stats.damage

      // 子弹存活时间
      this.scene.time.delayedCall(3000, () => {
        if (bullet.active) {
          bullet.setActive(false)
          bullet.setVisible(false)
        }
      })
    }
  }

  meleeAttack() {
    // 检查target是否存在且活跃
    if (!this.target || !this.target.active) return

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)

    if (dist < this.stats.attackRange + 20) {
      this.target.takeDamage(this.stats.damage)

      // 攻击特效
      const attackEffect = this.scene.add.circle(
        (this.x + this.target.x) / 2,
        (this.y + this.target.y) / 2,
        30,
        0xff4444,
        0.5
      )
      attackEffect.setDepth(200)

      this.scene.tweens.add({
        targets: attackEffect,
        alpha: 0,
        scale: 1.5,
        duration: 150,
        onComplete: () => {
          if (attackEffect && attackEffect.active) {
            attackEffect.destroy()
          }
        }
      })
    }
  }

  takeDamage(amount, isCrit = false) {
    // 应用磁化伤害倍数
    if (this.magnetized && this.magnetizeDamageMultiplier) {
      amount *= this.magnetizeDamageMultiplier
    }

    // 应用Ancient光环减伤
    if (this.hasAuraBuff && this.auraDamageReduction) {
      amount *= (1 - this.auraDamageReduction)
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
        this.setTint(this.enemyData.color)
      }
    })

    if (this.stats.health <= 0) {
      this.die()
    }
  }

  showDamageNumber(amount, isCrit) {
    const color = isCrit ? '#ffff00' : '#ffffff'
    const size = isCrit ? '20px' : '16px'

    const damageText = this.scene.add.text(
      this.x + (Math.random() - 0.5) * 30,
      this.y - 20,
      Math.floor(amount).toString(),
      {
        fontFamily: 'Arial',
        fontSize: size,
        color: color,
        stroke: '#000000',
        strokeThickness: 2
      }
    )
    damageText.setOrigin(0.5)
    damageText.setDepth(300)

    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (damageText && damageText.active) {
          damageText.destroy()
        }
      }
    })
  }

  stun(duration) {
    this.isStunned = true
    this.stunEndTime = this.scene.time.now + duration
    this.setTint(0x888888)
    this.setVelocityX(0)
  }

  applyAuraEffect() {
    const aura = this.enemyData.auraEffect
    if (!aura) return

    // 给范围内的友方敌人添加减伤buff
    this.scene.enemies.getChildren().forEach(enemy => {
      if (enemy === this || !enemy.active) return

      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
      if (dist < aura.range) {
        // 标记受到光环影响，并设置光环来源
        enemy.hasAuraBuff = true
        enemy.auraDamageReduction = aura.damageReduction
        enemy.auraSource = this
      } else if (enemy.hasAuraBuff && enemy.auraSource === this) {
        // 离开范围，移除buff
        enemy.hasAuraBuff = false
        enemy.auraDamageReduction = 0
        enemy.auraSource = null
      }
    })
  }

  die() {
    // 清理光环源引用（其他敌人可能引用此敌人作为auraSource）
    if (this.enemyData.auraEffect) {
      this.scene.enemies.getChildren().forEach(enemy => {
        if (enemy.auraSource === this) {
          enemy.hasAuraBuff = false
          enemy.auraDamageReduction = 0
          enemy.auraSource = null
        }
      })
    }

    // 如果是召唤物，减少召唤者的计数
    if (this.isSummoned && this.summoner && this.summoner.active) {
      this.summoner.summonCount = Math.max(0, (this.summoner.summonCount || 1) - 1)
    }

    // 通知场景敌人被击杀（用于任务奖励和材料掉落）
    if (this.scene.onEnemyKilled) {
      this.scene.onEnemyKilled(this)
    }

    // 掉落
    this.dropLoot()

    // 死亡特效 - 使用一次性发射，避免需要手动清理
    const particles = this.scene.add.particles(this.x, this.y, 'particle_energy', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 10,
      tint: this.enemyData.color,
      emitting: false // 不自动发射，用explode手动触发
    })
    particles.explode(10) // 一次性发射

    // 延迟销毁粒子（检查粒子是否仍然存在）
    this.scene.time.delayedCall(600, () => {
      if (particles && particles.active) {
        particles.destroy()
      }
    })

    // 更新击杀数
    this.scene.killCount++

    // 清理血条
    if (this.healthBarBg) {
      this.healthBarBg.destroy()
      this.healthBarBg = null
    }
    if (this.healthBar) {
      this.healthBar.destroy()
      this.healthBar = null
    }

    // 销毁敌人
    this.destroy()
  }

  dropLoot() {
    // 随机掉落
    const rand = Math.random()

    if (rand < 0.3) {
      // 掉落能量球
      const pickup = this.scene.pickups.get(this.x, this.y, 'pickup_energy')
      if (pickup) {
        pickup.setActive(true)
        pickup.setVisible(true)
        pickup.pickupType = 'energy'
        pickup.value = 25
        // 确保body存在再设置属性
        if (pickup.body) {
          pickup.body.setAllowGravity(true)
          pickup.setBounce(0.3)
        }
      }
    } else if (rand < 0.5) {
      // 掉落生命球
      const pickup = this.scene.pickups.get(this.x, this.y, 'pickup_health')
      if (pickup) {
        pickup.setActive(true)
        pickup.setVisible(true)
        pickup.pickupType = 'health'
        pickup.value = 30
        if (pickup.body) {
          pickup.body.setAllowGravity(true)
          pickup.setBounce(0.3)
        }
      }
    } else if (rand < 0.6) {
      // 掉落弹药
      const pickup = this.scene.pickups.get(this.x, this.y, 'pickup_ammo')
      if (pickup) {
        pickup.setActive(true)
        pickup.setVisible(true)
        pickup.pickupType = 'ammo'
        pickup.value = 15
        if (pickup.body) {
          pickup.body.setAllowGravity(true)
          pickup.setBounce(0.3)
        }
      }
    }
  }
}
