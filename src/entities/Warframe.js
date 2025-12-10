import Phaser from 'phaser'
import { WARFRAMES, getWarframeWithMods } from '../data/warframes.js'
import { WEAPONS, getWeaponWithMods } from '../data/weapons.js'
import { MODS } from '../data/mods.js'

export class Warframe extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    const warframeId = window.GAME_STATE.currentWarframe
    super(scene, x, y, `warframe_${warframeId}`)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // 加载配置（传入MODS数据）
    this.warframeData = getWarframeWithMods(warframeId, window.GAME_STATE.warframeMods, MODS)
    this.weaponData = getWeaponWithMods(window.GAME_STATE.currentWeapon, window.GAME_STATE.weaponMods, MODS)

    // 初始化状态 - 使用maxHealth等作为实际上限
    this.stats = { ...this.warframeData.baseStats }
    // 确保stats中有正确的属性名（兼容MOD系统）
    this.stats.maxHealth = this.stats.maxHealth || this.stats.health
    this.stats.maxShield = this.stats.maxShield || this.stats.shield
    this.stats.maxEnergy = this.stats.maxEnergy || this.stats.energy

    this.currentHealth = this.stats.maxHealth
    this.currentShield = this.stats.maxShield
    this.currentEnergy = this.stats.maxEnergy

    // 武器状态
    this.currentAmmo = this.weaponData.baseStats.magazineSize
    this.isReloading = false
    this.lastFireTime = 0
    this.fireInterval = 1000 / this.weaponData.baseStats.fireRate

    // 移动状态
    this.isGrounded = false
    this.canDoubleJump = true
    this.isDodging = false
    this.dodgeCooldown = 0
    this.facingRight = true
    this.wallSliding = false

    // 技能冷却
    this.abilityCooldowns = [0, 0, 0]
    this.activeAbility = null // 用于toggle技能

    // 受伤无敌时间
    this.invincibleTime = 0

    // 设置物理属性
    this.setCollideWorldBounds(true)
    this.setBounce(0)
    this.setDragX(800)
    this.body.setSize(32, 56)
    this.body.setOffset(8, 8)
    this.setDepth(100)

    // 缓冲机制
    this.jumpBuffer = 0
    this.coyoteTime = 0

    // 设置输入
    this.setupInput()

    // 创建特效发射器
    this.createEffects()
  }

  setupInput() {
    this.keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      dodge: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      reload: Phaser.Input.Keyboard.KeyCodes.R,
      skill1: Phaser.Input.Keyboard.KeyCodes.ONE,
      skill2: Phaser.Input.Keyboard.KeyCodes.TWO,
      skill3: Phaser.Input.Keyboard.KeyCodes.THREE
    })

    // 技能按键监听
    this.keys.skill1.on('down', () => this.useAbility(0))
    this.keys.skill2.on('down', () => this.useAbility(1))
    this.keys.skill3.on('down', () => this.useAbility(2))
    this.keys.reload.on('down', () => this.reload())
  }

  createEffects() {
    // 能量粒子
    this.energyParticles = this.scene.add.particles(0, 0, 'particle_energy', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 300,
      frequency: -1
    })
    this.energyParticles.setDepth(99)

    // 翻滚拖尾
    this.dodgeTrail = this.scene.add.particles(0, 0, 'particle_energy', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 200,
      frequency: 20
    })
    this.dodgeTrail.stop()
    this.dodgeTrail.setDepth(98)
  }

  update(time, delta) {
    // 更新冷却时间
    this.updateCooldowns(delta)

    // 更新无敌时间
    if (this.invincibleTime > 0) {
      this.invincibleTime -= delta
      this.setAlpha(Math.sin(time / 50) > 0 ? 0.5 : 1)
    } else {
      this.setAlpha(1)
    }

    // 检测地面（确保body存在）
    if (!this.body) return
    this.isGrounded = this.body.blocked.down || this.body.touching.down

    // Coyote time - 离开平台后短暂时间内仍可跳跃
    if (this.isGrounded) {
      this.coyoteTime = 100
      this.canDoubleJump = true
    } else {
      this.coyoteTime -= delta
    }

    // 翻滚中不处理其他输入
    if (this.isDodging) {
      return
    }

    // 处理移动
    this.handleMovement()

    // 处理跳跃
    this.handleJump()

    // 处理翻滚
    this.handleDodge()

    // 处理射击
    this.handleShooting(time)

    // 处理墙壁滑行
    this.handleWallSlide()

    // 护盾恢复
    this.handleShieldRegen(delta)

    // 能量恢复
    this.handleEnergyRegen(delta)

    // 更新粒子位置（检查粒子是否仍然存在）
    if (this.energyParticles && this.energyParticles.active) {
      this.energyParticles.setPosition(this.x, this.y)
    }
    if (this.dodgeTrail && this.dodgeTrail.active) {
      this.dodgeTrail.setPosition(this.x, this.y)
    }
  }

  handleMovement() {
    const speed = this.stats.speed * 300

    if (this.keys.left.isDown) {
      this.setVelocityX(-speed)
      this.facingRight = false
      this.setFlipX(true)
    } else if (this.keys.right.isDown) {
      this.setVelocityX(speed)
      this.facingRight = true
      this.setFlipX(false)
    }

    // 空中移动减速
    if (!this.isGrounded) {
      this.setDragX(100)
    } else {
      this.setDragX(800)
    }
  }

  handleJump() {
    // Jump buffer - 提前按跳跃键
    if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {
      this.jumpBuffer = 100
    }
    this.jumpBuffer -= this.scene.game.loop.delta

    if (this.jumpBuffer > 0) {
      if (this.coyoteTime > 0) {
        // 普通跳跃
        this.setVelocityY(-this.stats.jumpForce)
        this.coyoteTime = 0
        this.jumpBuffer = 0
        this.emitJumpEffect()
      } else if (this.canDoubleJump) {
        // 二段跳
        this.setVelocityY(-this.stats.jumpForce * 0.85)
        this.canDoubleJump = false
        this.jumpBuffer = 0
        this.emitJumpEffect()
      } else if (this.wallSliding && this.body) {
        // 墙跳（检查body存在）
        const wallJumpDir = this.body.blocked.left ? 1 : -1
        this.setVelocityX(wallJumpDir * 400)
        this.setVelocityY(-this.stats.jumpForce * 0.9)
        this.canDoubleJump = true
        this.jumpBuffer = 0
        this.emitJumpEffect()
      }
    }
  }

  handleWallSlide() {
    // 确保body存在
    if (!this.body) {
      this.wallSliding = false
      return
    }

    const touchingWall = this.body.blocked.left || this.body.blocked.right
    const moving = this.keys.left.isDown || this.keys.right.isDown

    if (touchingWall && !this.isGrounded && this.body.velocity.y > 0 && moving) {
      this.wallSliding = true
      this.setVelocityY(Math.min(this.body.velocity.y, 100))
    } else {
      this.wallSliding = false
    }
  }

  handleDodge() {
    if (this.keys.dodge.isDown && this.dodgeCooldown <= 0) {
      this.performDodge()
    }
  }

  performDodge() {
    this.isDodging = true
    this.dodgeCooldown = 800 // 冷却时间

    // 翻滚方向
    const direction = this.facingRight ? 1 : -1
    const dodgeSpeed = 600

    // 设置速度
    this.setVelocityX(direction * dodgeSpeed)
    if (this.isGrounded) {
      this.setVelocityY(-100) // 轻微抬起
    }

    // 翻滚无敌
    this.invincibleTime = 300

    // 启动拖尾效果
    this.dodgeTrail.start()

    // 翻滚结束 - 保存引用以便清理
    this.dodgeTimer = this.scene.time.delayedCall(250, () => {
      // 检查玩家是否仍然存活
      if (this.active) {
        this.isDodging = false
        if (this.dodgeTrail) {
          this.dodgeTrail.stop()
        }
      }
      this.dodgeTimer = null
    })
  }

  handleShooting(time) {
    const pointer = this.scene.input.activePointer

    if (pointer.isDown && !this.isReloading && this.currentAmmo > 0) {
      if (time - this.lastFireTime >= this.fireInterval) {
        this.fire(pointer)
        this.lastFireTime = time
      }
    }

    // 自动换弹
    if (this.currentAmmo <= 0 && !this.isReloading) {
      this.reload()
    }
  }

  fire(pointer) {
    // 获取世界坐标中的鼠标位置
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)

    // 计算射击角度
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    const weaponStats = this.weaponData.baseStats

    if (this.weaponData.baseStats.pellets) {
      // 霰弹枪
      const pellets = weaponStats.pellets
      const spread = weaponStats.spread

      for (let i = 0; i < pellets; i++) {
        const spreadAngle = angle + (Math.random() - 0.5) * spread * 2
        this.createBullet(spreadAngle, weaponStats)
      }
    } else {
      // 普通武器
      const accuracy = weaponStats.accuracy
      const spreadAngle = angle + (Math.random() - 0.5) * (1 - accuracy) * 0.3
      this.createBullet(spreadAngle, weaponStats)
    }

    this.currentAmmo--

    // 射击后座力（确保body存在）
    if (this.body && this.body.velocity) {
      this.setVelocityX(this.body.velocity.x - Math.cos(angle) * 20)
    }
  }

  createBullet(angle, weaponStats) {
    // 根据武器类型选择子弹精灵
    let bulletSprite = 'bullet_normal'
    const weaponType = this.weaponData?.type

    if (weaponType === 'shotgun') {
      bulletSprite = 'bullet_shotgun'
    } else if (weaponType === 'bow') {
      bulletSprite = 'bullet_arrow'
    } else if (weaponStats.chainCount) {
      // 连锁武器使用光束精灵
      bulletSprite = 'bullet_beam'
    } else if (weaponStats.chargeTime && weaponStats.aoeRadius) {
      // 蓄力AOE武器使用激光精灵
      bulletSprite = 'bullet_laser'
    }

    const bullet = this.scene.playerBullets.get(this.x, this.y, bulletSprite)

    if (bullet) {
      bullet.setActive(true)
      bullet.setVisible(true)
      bullet.setRotation(angle)

      // 确保body存在再设置速度
      if (bullet.body) {
        const speed = weaponStats.projectileSpeed
        bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
      }

      // 存储伤害信息
      bullet.damage = weaponStats.damage
      bullet.critChance = weaponStats.critChance
      bullet.critMultiplier = weaponStats.critMultiplier
      bullet.punchThrough = weaponStats.punchThrough || 0
      bullet.chainCount = weaponStats.chainCount || 0
      bullet.chainRange = weaponStats.chainRange || 0
      bullet.aoeRadius = weaponStats.aoeRadius || 0

      // 子弹存活时间 - 子弹的定时器不需要保存引用
      // 因为当子弹被回收到池中或场景销毁时，定时器会自动清理
      // 而且这里只是设置inactive，不会导致内存泄漏
      this.scene.time.delayedCall(2000, () => {
        if (bullet && bullet.active) {
          bullet.setActive(false)
          bullet.setVisible(false)
        }
      })
    }
  }

  reload() {
    if (this.isReloading || this.currentAmmo >= this.weaponData.baseStats.magazineSize) {
      return
    }

    this.isReloading = true

    // 播放换弹效果 - 保存引用以便清理
    this.reloadTimer = this.scene.time.delayedCall(this.weaponData.baseStats.reloadTime, () => {
      // 检查玩家是否仍然存活
      if (this.active) {
        this.currentAmmo = Math.floor(this.weaponData.baseStats.magazineSize)
        this.isReloading = false
      }
      this.reloadTimer = null
    })
  }

  useAbility(index) {
    const ability = this.warframeData.abilities[index]
    if (!ability || this.abilityCooldowns[index] > 0) {
      return
    }

    // 计算实际能量消耗（应用效率MOD）
    const efficiency = this.stats.energyEfficiency || 0
    const actualEnergyCost = Math.max(1, ability.energyCost * (1 - efficiency))

    // 检查能量
    if (this.currentEnergy < actualEnergyCost) {
      return
    }

    // 消耗能量
    this.currentEnergy -= actualEnergyCost

    // 设置冷却
    this.abilityCooldowns[index] = ability.cooldown

    // 执行技能效果
    this.executeAbility(ability)
  }

  executeAbility(ability) {
    // 发射能量粒子（检查粒子是否存在）
    if (this.energyParticles && this.energyParticles.active) {
      this.energyParticles.explode(20)
    }

    // 根据技能ID执行不同效果
    switch (ability.id) {
      case 'slash_dash':
        this.abilitySlashDash(ability)
        break
      case 'radial_blind':
        this.abilityRadialBlind(ability)
        break
      case 'exalted_blade':
        this.abilityExaltedBlade(ability)
        break
      case 'shock':
        this.abilityShock(ability)
        break
      case 'speed':
        this.abilitySpeed(ability)
        break
      case 'discharge':
        this.abilityDischarge(ability)
        break
      case 'pull':
        this.abilityPull(ability)
        break
      case 'magnetize':
        this.abilityMagnetize(ability)
        break
      case 'crush':
        this.abilityCrush(ability)
        break
      // Rhino技能
      case 'rhino_charge':
        this.abilityRhinoCharge(ability)
        break
      case 'iron_skin':
        this.abilityIronSkin(ability)
        break
      case 'roar':
        this.abilityRoar(ability)
        break
      // Loki技能
      case 'decoy':
        this.abilityDecoy(ability)
        break
      case 'invisibility':
        this.abilityInvisibility(ability)
        break
      case 'radial_disarm':
        this.abilityRadialDisarm(ability)
        break
      // Nova技能
      case 'null_star':
        this.abilityNullStar(ability)
        break
      case 'antimatter_drop':
        this.abilityAntimatterDrop(ability)
        break
      case 'molecular_prime':
        this.abilityMolecularPrime(ability)
        break
      // Trinity技能
      case 'well_of_life':
        this.abilityWellOfLife(ability)
        break
      case 'energy_vampire':
        this.abilityEnergyVampire(ability)
        break
      case 'blessing':
        this.abilityBlessing(ability)
        break
      // Ash技能
      case 'shuriken':
        this.abilityShuriken(ability)
        break
      case 'smoke_screen':
        this.abilitySmokeScreen(ability)
        break
      case 'blade_storm':
        this.abilityBladeStorm(ability)
        break
    }
  }

  // ========== Excalibur 技能 ==========
  abilitySlashDash(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    // 记录起始位置
    const startX = this.x
    const startY = this.y
    const endX = startX + Math.cos(angle) * ability.range
    const endY = startY + Math.sin(angle) * ability.range

    // 冲刺
    this.setVelocity(Math.cos(angle) * 800, Math.sin(angle) * 800)
    this.invincibleTime = 300

    // 创建斩击特效
    const slash = this.scene.add.graphics()
    slash.lineStyle(4, 0x00ccff, 1)
    slash.lineBetween(startX, startY, endX, endY)
    slash.setDepth(200)

    // 对冲刺路径上的敌人造成伤害（检查敌人到线段的距离）
    const hitEnemies = new Set()
    this.scene.enemies.getChildren().forEach(enemy => {
      // 检查敌人是否活跃
      if (!enemy.active) return
      // 计算敌人到线段的最近距离
      const dist = Phaser.Math.Distance.BetweenPointsSquared(
        { x: enemy.x, y: enemy.y },
        Phaser.Geom.Line.GetNearestPoint(
          new Phaser.Geom.Line(startX, startY, endX, endY),
          { x: enemy.x, y: enemy.y }
        )
      )
      // 如果敌人离线段足够近（50像素内），造成伤害
      if (dist < 50 * 50) {
        enemy.takeDamage(ability.damage)
        hitEnemies.add(enemy)
      }
    })

    this.scene.tweens.add({
      targets: slash,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        if (slash && slash.active) {
          slash.destroy()
        }
      }
    })
  }

  abilityRadialBlind(ability) {
    // 记录技能释放位置（玩家在动画期间可能移动）
    const castX = this.x
    const castY = this.y

    // 闪光效果
    const flash = this.scene.add.circle(castX, castY, ability.range, 0xffffff, 0.8)
    flash.setDepth(200)

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => {
        if (flash && flash.active) {
          flash.destroy()
        }
      }
    })

    // 致盲范围内敌人（使用技能释放时的位置）
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(castX, castY, enemy.x, enemy.y)
      if (dist < ability.range) {
        enemy.stun(ability.duration)
      }
    })
  }

  abilityExaltedBlade(ability) {
    // Toggle技能
    if (this.activeAbility === 'exalted_blade') {
      this.deactivateExaltedBlade()
      return
    }

    this.activeAbility = 'exalted_blade'

    // 保存原始武器伤害值（在类实例上，而非闭包中）
    this.exaltedBladeOriginalDamage = this.weaponData.baseStats.damage
    this.weaponData.baseStats.damage *= ability.damageMultiplier

    // 能量持续消耗 - 保存timer引用以便关闭时销毁
    this.exaltedBladeTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        // 检查玩家是否仍然活跃
        if (!this.active) {
          this.deactivateExaltedBlade()
          return
        }
        if (this.activeAbility !== 'exalted_blade') {
          this.deactivateExaltedBlade()
          return
        }
        this.currentEnergy -= ability.drainPerSecond
        if (this.currentEnergy <= 0) {
          this.currentEnergy = 0
          this.deactivateExaltedBlade()
        }
      },
      loop: true
    })
  }

  deactivateExaltedBlade() {
    this.activeAbility = null
    if (this.exaltedBladeTimer) {
      this.exaltedBladeTimer.destroy()
      this.exaltedBladeTimer = null
    }
    // 恢复原武器数据（重新加载而非使用闭包值）
    this.weaponData = getWeaponWithMods(window.GAME_STATE.currentWeapon, window.GAME_STATE.weaponMods, MODS)
    this.exaltedBladeOriginalDamage = null
  }

  // ========== Volt 技能 ==========
  abilityShock(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)

    // 找到最近的敌人
    let nearestEnemy = null
    let nearestDist = Infinity

    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, enemy.x, enemy.y)
      if (dist < nearestDist && dist < 300) {
        nearestDist = dist
        nearestEnemy = enemy
      }
    })

    if (nearestEnemy && nearestEnemy.active) {
      // 电击效果
      this.createLightningEffect(this.x, this.y, nearestEnemy.x, nearestEnemy.y)
      nearestEnemy.takeDamage(ability.damage)

      // 连锁 - 使用已击中集合避免重复，并按距离排序
      const hitEnemies = new Set([nearestEnemy])
      let lastTarget = nearestEnemy
      let chainCount = 0

      while (chainCount < ability.chainCount) {
        // 检查lastTarget是否仍然活跃（可能被上次攻击击杀）
        if (!lastTarget.active) break

        // 找到离lastTarget最近且未被击中的敌人
        let nextTarget = null
        let nextDist = Infinity

        this.scene.enemies.getChildren().forEach(enemy => {
          if (hitEnemies.has(enemy) || !enemy.active) return
          const dist = Phaser.Math.Distance.Between(lastTarget.x, lastTarget.y, enemy.x, enemy.y)
          if (dist < ability.chainRange && dist < nextDist) {
            nextDist = dist
            nextTarget = enemy
          }
        })

        if (nextTarget && nextTarget.active) {
          this.createLightningEffect(lastTarget.x, lastTarget.y, nextTarget.x, nextTarget.y)
          nextTarget.takeDamage(ability.damage * 0.7)
          hitEnemies.add(nextTarget)
          lastTarget = nextTarget
          chainCount++
        } else {
          break // 没有更多可链接的敌人
        }
      }
    }
  }

  createLightningEffect(x1, y1, x2, y2) {
    const lightning = this.scene.add.graphics()
    lightning.lineStyle(3, 0xffff00, 1)

    lightning.beginPath()
    lightning.moveTo(x1, y1)

    // 创建锯齿状闪电
    const segments = 5
    for (let i = 1; i < segments; i++) {
      const t = i / segments
      const midX = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30
      const midY = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30
      lightning.lineTo(midX, midY)
    }
    lightning.lineTo(x2, y2)
    lightning.strokePath()
    lightning.setDepth(200)

    this.scene.tweens.add({
      targets: lightning,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        if (lightning && lightning.active) {
          lightning.destroy()
        }
      }
    })
  }

  abilitySpeed(ability) {
    const originalSpeed = this.stats.speed
    const originalFireInterval = this.fireInterval

    this.stats.speed *= ability.speedMultiplier
    this.fireInterval /= ability.speedMultiplier

    // 标记速度buff激活
    this.speedBuffActive = true

    // 速度特效 - 保存引用以便清理
    const speedLines = this.scene.add.particles(this.x, this.y, 'particle_electric', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 200,
      frequency: 50,
      follow: this
    })

    // 保存粒子引用到数组，用于死亡时清理
    if (!this.activeParticles) this.activeParticles = []
    this.activeParticles.push(speedLines)

    this.scene.time.delayedCall(ability.duration, () => {
      // 检查玩家是否仍然活跃
      if (this.active) {
        this.stats.speed = originalSpeed
        // 只有在没有切换武器时才恢复fireInterval
        // 如果武器改变了（比如Exalted Blade），使用当前武器数据
        if (this.speedBuffActive) {
          this.fireInterval = 1000 / this.weaponData.baseStats.fireRate
          this.speedBuffActive = false
        }
      }
      // 安全销毁粒子（即使玩家不活跃也要清理）
      if (speedLines && speedLines.active) {
        speedLines.destroy()
      }
      // 从活动粒子列表中移除
      if (this.activeParticles) {
        const idx = this.activeParticles.indexOf(speedLines)
        if (idx > -1) this.activeParticles.splice(idx, 1)
      }
    })
  }

  abilityDischarge(ability) {
    // 创建电场
    const field = this.scene.add.circle(this.x, this.y, ability.range, 0xffff00, 0.2)
    field.setDepth(50)

    // 电场跟随玩家
    const followEvent = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        if (this.active) {
          field.setPosition(this.x, this.y)
        }
      },
      loop: true
    })

    const pulseInterval = this.scene.time.addEvent({
      delay: ability.tickRate,
      callback: () => {
        // 检查玩家是否仍然活跃
        if (!this.active) return
        // 检查field是否仍然存在
        if (!field || !field.active) return
        this.scene.enemies.getChildren().forEach(enemy => {
          // 检查敌人是否活跃
          if (!enemy.active) return
          // 使用玩家当前位置计算距离
          const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
          if (dist < ability.range) {
            enemy.takeDamage(ability.damage)
            this.createLightningEffect(this.x, this.y, enemy.x, enemy.y)
          }
        })
      },
      repeat: ability.duration / ability.tickRate - 1
    })

    // 保存timer引用以便清理
    if (!this.activeTimers) this.activeTimers = []
    this.activeTimers.push(followEvent, pulseInterval)

    this.scene.time.delayedCall(ability.duration, () => {
      followEvent.destroy()
      pulseInterval.destroy()
      // 从活动列表中移除
      if (this.activeTimers) {
        this.activeTimers = this.activeTimers.filter(t => t !== followEvent && t !== pulseInterval)
      }
      if (field && field.active) {
        this.scene.tweens.add({
          targets: field,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            if (field && field.active) {
              field.destroy()
            }
          }
        })
      }
    })
  }

  // ========== Mag 技能 ==========
  abilityPull(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    // 创建牵引波
    const wave = this.scene.add.graphics()
    wave.fillStyle(0xff00ff, 0.4)
    wave.fillTriangle(
      this.x, this.y,
      this.x + Math.cos(angle - 0.3) * ability.range, this.y + Math.sin(angle - 0.3) * ability.range,
      this.x + Math.cos(angle + 0.3) * ability.range, this.y + Math.sin(angle + 0.3) * ability.range
    )
    wave.setDepth(50)

    this.scene.enemies.getChildren().forEach(enemy => {
      // 检查敌人是否活跃且有body
      if (!enemy.active || !enemy.body) return

      const enemyAngle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle))
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)

      if (angleDiff < 0.4 && dist < ability.range) {
        // 拉向玩家
        const pullAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.x, this.y)
        enemy.body.velocity.x += Math.cos(pullAngle) * ability.pullForce
        enemy.body.velocity.y += Math.sin(pullAngle) * ability.pullForce
        enemy.takeDamage(ability.damage)
      }
    })

    this.scene.tweens.add({
      targets: wave,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (wave && wave.active) {
          wave.destroy()
        }
      }
    })
  }

  abilityMagnetize(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)

    // 找最近敌人
    let target = null
    let nearestDist = Infinity

    this.scene.enemies.getChildren().forEach(enemy => {
      // 只考虑活跃的敌人
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(worldPoint.x, worldPoint.y, enemy.x, enemy.y)
      if (dist < nearestDist) {
        nearestDist = dist
        target = enemy
      }
    })

    // 检查target是否存在且活跃
    if (!target || !target.active) return

    // 创建磁场
    const field = this.scene.add.circle(target.x, target.y, ability.range, 0xff00ff, 0.3)
    field.setDepth(50)

    // 标记磁场中心目标，用于伤害放大
    target.magnetized = true
    target.magnetizeDamageMultiplier = ability.damageMultiplier

    // 磁场跟随目标
    const followEvent = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        // 检查目标和玩家是否仍然活跃
        if (!target.active || !this.active) {
          // 目标死亡，提前清理
          followEvent.destroy()
          if (field && field.active) field.destroy()
          if (this.activeTimers) {
            this.activeTimers = this.activeTimers.filter(t => t !== followEvent)
          }
          return
        }
        field.setPosition(target.x, target.y)

        // 吸引附近子弹向目标偏移
        this.scene.playerBullets.getChildren().forEach(bullet => {
          if (!bullet.active || !bullet.body) return
          const dist = Phaser.Math.Distance.Between(target.x, target.y, bullet.x, bullet.y)
          if (dist < ability.range && dist > 20) {
            // 轻微改变子弹方向朝向目标
            const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, target.x, target.y)
            const currentSpeed = Math.sqrt(bullet.body.velocity.x ** 2 + bullet.body.velocity.y ** 2)
            const pullStrength = 0.15
            bullet.body.velocity.x += Math.cos(angle) * currentSpeed * pullStrength
            bullet.body.velocity.y += Math.sin(angle) * currentSpeed * pullStrength
          }
        })
      },
      loop: true
    })

    // 保存timer引用以便清理
    if (!this.activeTimers) this.activeTimers = []
    this.activeTimers.push(followEvent)

    this.scene.time.delayedCall(ability.duration, () => {
      // 清理磁化状态
      if (target.active) {
        target.magnetized = false
        target.magnetizeDamageMultiplier = 1
      }
      followEvent.destroy()
      // 从活动列表中移除
      if (this.activeTimers) {
        this.activeTimers = this.activeTimers.filter(t => t !== followEvent)
      }
      if (field && field.active) {
        this.scene.tweens.add({
          targets: field,
          alpha: 0,
          scale: 2,
          duration: 200,
          onComplete: () => {
            if (field && field.active) {
              field.destroy()
            }
          }
        })
      }
    })
  }

  abilityCrush(ability) {
    // 记录技能释放位置（玩家在动画期间可能移动）
    const crushX = this.x
    const crushY = this.y

    // 粉碎效果
    const crushEffect = this.scene.add.circle(crushX, crushY, ability.range, 0xff00ff, 0.5)
    crushEffect.setDepth(200)

    this.scene.tweens.add({
      targets: crushEffect,
      scale: 0.1,
      duration: 500,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        // 检查crushEffect是否仍然存在
        if (!crushEffect || !crushEffect.active) return

        // 伤害范围内敌人（使用技能释放时的位置）
        this.scene.enemies.getChildren().forEach(enemy => {
          if (!enemy.active) return
          const dist = Phaser.Math.Distance.Between(crushX, crushY, enemy.x, enemy.y)
          if (dist < ability.range) {
            enemy.takeDamage(ability.damage)
            enemy.stun(ability.stunDuration)
          }
        })

        // 冲击波
        this.scene.tweens.add({
          targets: crushEffect,
          scale: 1.5,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            if (crushEffect && crushEffect.active) {
              crushEffect.destroy()
            }
          }
        })
      }
    })
  }

  updateCooldowns(delta) {
    for (let i = 0; i < this.abilityCooldowns.length; i++) {
      if (this.abilityCooldowns[i] > 0) {
        this.abilityCooldowns[i] -= delta
      }
    }
    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown -= delta
    }
  }

  handleShieldRegen(delta) {
    if (this.invincibleTime <= 0 && this.currentShield < this.stats.maxShield) {
      this.currentShield += delta * 0.02 // 每秒恢复20点
      this.currentShield = Math.min(this.currentShield, this.stats.maxShield)
    }
  }

  handleEnergyRegen(delta) {
    if (this.currentEnergy < this.stats.maxEnergy) {
      this.currentEnergy += delta * 0.005 // 每秒恢复5点
      this.currentEnergy = Math.min(this.currentEnergy, this.stats.maxEnergy)
    }
  }

  emitJumpEffect() {
    if (this.energyParticles && this.energyParticles.active) {
      this.energyParticles.explode(10)
    }
  }

  takeDamage(amount) {
    if (this.invincibleTime > 0) return

    // Rhino钢铁皮肤优先吸收伤害
    if (this.ironSkinActive && this.ironSkinHealth > 0) {
      const absorbed = Math.min(this.ironSkinHealth, amount)
      this.ironSkinHealth -= absorbed
      amount -= absorbed

      if (this.ironSkinHealth <= 0) {
        this.ironSkinActive = false
        if (this.ironSkinGraphics) {
          this.ironSkinGraphics.destroy()
          this.ironSkinGraphics = null
        }
        if (this.ironSkinUpdateEvent) {
          this.ironSkinUpdateEvent.destroy()
          this.ironSkinUpdateEvent = null
        }
      }

      if (amount <= 0) return
    }

    // Trinity祝福减伤
    if (this.blessingActive && this.blessingDR > 0) {
      amount *= (1 - this.blessingDR)
    }

    // 先扣护盾
    if (this.currentShield > 0) {
      const shieldDamage = Math.min(this.currentShield, amount)
      this.currentShield -= shieldDamage
      amount -= shieldDamage
    }

    // 护甲减伤
    const armorReduction = this.stats.armor / (this.stats.armor + 300)
    amount *= (1 - armorReduction)

    // 扣血
    this.currentHealth -= amount
    this.invincibleTime = 500

    // 受伤效果
    this.scene.cameras.main.shake(100, 0.01)

    if (this.currentHealth <= 0) {
      this.die()
    }
  }

  die() {
    // 清理粒子效果
    if (this.energyParticles) {
      this.energyParticles.destroy()
      this.energyParticles = null
    }
    if (this.dodgeTrail) {
      this.dodgeTrail.destroy()
      this.dodgeTrail = null
    }
    // 清理技能timer
    if (this.exaltedBladeTimer) {
      this.exaltedBladeTimer.destroy()
      this.exaltedBladeTimer = null
    }
    // 清理翻滚timer
    if (this.dodgeTimer) {
      this.dodgeTimer.destroy()
      this.dodgeTimer = null
    }
    // 清理换弹timer
    if (this.reloadTimer) {
      this.reloadTimer.destroy()
      this.reloadTimer = null
    }
    // 清理所有活动粒子
    if (this.activeParticles) {
      this.activeParticles.forEach(p => {
        if (p && p.active) p.destroy()
      })
      this.activeParticles = []
    }
    // 清理所有活动定时器
    if (this.activeTimers) {
      this.activeTimers.forEach(t => {
        if (t) t.destroy()
      })
      this.activeTimers = []
    }
    // 移除输入事件监听
    if (this.keys) {
      this.keys.skill1.off('down')
      this.keys.skill2.off('down')
      this.keys.skill3.off('down')
      this.keys.reload.off('down')
    }

    this.scene.gameOver()
  }

  heal(amount) {
    // 检查负数，防止误伤
    if (amount < 0) return
    this.currentHealth = Math.min(this.currentHealth + amount, this.stats.maxHealth)
  }

  addEnergy(amount) {
    // 检查负数，防止误扣能量
    if (amount < 0) return
    this.currentEnergy = Math.min(this.currentEnergy + amount, this.stats.maxEnergy)
  }

  // ========== Rhino 技能 ==========
  abilityRhinoCharge(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    // 冲锋
    this.setVelocity(Math.cos(angle) * 800, Math.sin(angle) * 400)
    this.invincibleTime = 500

    // 冲锋特效
    const chargeEffect = this.scene.add.graphics()
    chargeEffect.fillStyle(0x888888, 0.6)
    chargeEffect.fillCircle(0, 0, 40)
    chargeEffect.setPosition(this.x, this.y)
    chargeEffect.setDepth(95)

    // 跟随玩家的冲锋波
    const chargeTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (!this.active) return
        chargeEffect.setPosition(this.x, this.y)
        // 撞击敌人
        this.scene.enemies.getChildren().forEach(enemy => {
          if (!enemy.active) return
          const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
          if (dist < 60) {
            enemy.takeDamage(ability.damage)
            // 击退
            if (enemy.body) {
              const knockAngle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)
              enemy.body.velocity.x = Math.cos(knockAngle) * ability.knockback
              enemy.body.velocity.y = Math.sin(knockAngle) * ability.knockback - 200
            }
          }
        })
      },
      repeat: 8
    })

    this.scene.time.delayedCall(500, () => {
      chargeTimer.destroy()
      if (chargeEffect && chargeEffect.active) {
        chargeEffect.destroy()
      }
    })
  }

  abilityIronSkin(ability) {
    // 如果已有铁甲，不能重复施放
    if (this.ironSkinActive) return

    this.ironSkinActive = true
    this.ironSkinHealth = ability.absorb

    // 铁甲视觉效果
    this.ironSkinGraphics = this.scene.add.graphics()
    this.ironSkinGraphics.setDepth(99)

    const updateIronSkin = () => {
      if (!this.active || !this.ironSkinActive) return
      this.ironSkinGraphics.clear()
      this.ironSkinGraphics.lineStyle(3, 0xaaaaaa, 0.8)
      this.ironSkinGraphics.strokeCircle(this.x, this.y, 35)
    }

    this.ironSkinUpdateEvent = this.scene.time.addEvent({
      delay: 16,
      callback: updateIronSkin,
      loop: true
    })
  }

  abilityRoar(ability) {
    const castX = this.x
    const castY = this.y

    // 战吼效果
    const roarEffect = this.scene.add.circle(castX, castY, ability.range, 0xffaa00, 0.3)
    roarEffect.setDepth(50)

    this.scene.tweens.add({
      targets: roarEffect,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      onComplete: () => {
        if (roarEffect && roarEffect.active) roarEffect.destroy()
      }
    })

    // 提升伤害
    this.damageBoost = ability.damageBoost
    this.roarActive = true

    this.scene.time.delayedCall(ability.duration, () => {
      if (this.active) {
        this.damageBoost = 0
        this.roarActive = false
      }
    })
  }

  // ========== Loki 技能 ==========
  abilityDecoy(ability) {
    // 创建诱饵
    const decoy = this.scene.add.sprite(this.x, this.y, this.texture.key)
    decoy.setTint(0x4488ff)
    decoy.setAlpha(0.7)
    decoy.setDepth(90)
    decoy.health = ability.health

    // 诱饵吸引敌人
    this.scene.enemies.getChildren().forEach(enemy => {
      if (enemy.active) {
        enemy.decoyTarget = decoy
      }
    })

    this.scene.time.delayedCall(ability.duration, () => {
      // 移除诱饵目标
      this.scene.enemies.getChildren().forEach(enemy => {
        if (enemy.decoyTarget === decoy) {
          enemy.decoyTarget = null
        }
      })
      if (decoy && decoy.active) {
        decoy.destroy()
      }
    })
  }

  abilityInvisibility(ability) {
    if (this.isInvisible) return

    this.isInvisible = true
    this.setAlpha(0.3)
    this.backstabMultiplier = ability.backstabMultiplier

    // 敌人无法检测
    this.scene.enemies.getChildren().forEach(enemy => {
      if (enemy.target === this) {
        enemy.target = null
      }
    })

    this.scene.time.delayedCall(ability.duration, () => {
      if (this.active) {
        this.isInvisible = false
        this.setAlpha(1)
        this.backstabMultiplier = 1
      }
    })
  }

  abilityRadialDisarm(ability) {
    const castX = this.x
    const castY = this.y

    // 缴械波
    const disarmWave = this.scene.add.circle(castX, castY, 10, 0x44aaff, 0.5)
    disarmWave.setDepth(200)

    this.scene.tweens.add({
      targets: disarmWave,
      scale: ability.range / 10,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (disarmWave && disarmWave.active) disarmWave.destroy()
      }
    })

    // 缴械敌人
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(castX, castY, enemy.x, enemy.y)
      if (dist < ability.range) {
        enemy.disarmed = true
        enemy.originalBehavior = enemy.behavior
        enemy.behavior = 'melee'

        this.scene.time.delayedCall(ability.duration, () => {
          if (enemy.active) {
            enemy.disarmed = false
            enemy.behavior = enemy.originalBehavior
          }
        })
      }
    })
  }

  // ========== Nova 技能 ==========
  abilityNullStar(ability) {
    // 创建环绕粒子
    this.nullStars = []
    for (let i = 0; i < ability.particleCount; i++) {
      const angle = (i / ability.particleCount) * Math.PI * 2
      const star = this.scene.add.circle(0, 0, 8, 0xffaa00, 0.8)
      star.setDepth(99)
      star.angle = angle
      this.nullStars.push(star)
    }

    // 粒子环绕并自动攻击
    const starTimer = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (!this.active) return
        this.nullStars.forEach((star, i) => {
          if (!star.active) return
          star.angle += 0.05
          star.x = this.x + Math.cos(star.angle) * 60
          star.y = this.y + Math.sin(star.angle) * 60

          // 自动攻击最近敌人
          this.scene.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return
            const dist = Phaser.Math.Distance.Between(star.x, star.y, enemy.x, enemy.y)
            if (dist < 100 && star.active) {
              enemy.takeDamage(ability.damage)
              star.destroy()
              this.nullStars[i] = null
            }
          })
        })
        this.nullStars = this.nullStars.filter(s => s !== null)
      },
      loop: true
    })

    this.scene.time.delayedCall(ability.duration, () => {
      starTimer.destroy()
      this.nullStars.forEach(star => {
        if (star && star.active) star.destroy()
      })
      this.nullStars = []
    })
  }

  abilityAntimatterDrop(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    // 创建反物质球
    const ball = this.scene.add.circle(this.x, this.y, 20, 0x6600ff, 0.8)
    ball.setDepth(200)
    ball.damage = ability.baseDamage

    const speed = 200
    const vx = Math.cos(angle) * speed
    const vy = Math.sin(angle) * speed

    const moveTimer = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        if (!ball.active) return
        ball.x += vx * 0.016
        ball.y += vy * 0.016

        // 吸收玩家子弹伤害
        this.scene.playerBullets.getChildren().forEach(bullet => {
          if (!bullet.active) return
          const dist = Phaser.Math.Distance.Between(ball.x, ball.y, bullet.x, bullet.y)
          if (dist < 30) {
            ball.damage += bullet.damage * ability.absorbMultiplier
            bullet.setActive(false)
            bullet.setVisible(false)
          }
        })
      },
      loop: true
    })

    // 到达目标或超时后爆炸
    this.scene.time.delayedCall(2000, () => {
      moveTimer.destroy()
      if (!ball.active) return

      // 爆炸
      const explosion = this.scene.add.circle(ball.x, ball.y, 10, 0xff00ff, 0.8)
      explosion.setDepth(200)

      this.scene.tweens.add({
        targets: explosion,
        scale: 8,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          if (explosion && explosion.active) explosion.destroy()
        }
      })

      // 伤害敌人
      this.scene.enemies.getChildren().forEach(enemy => {
        if (!enemy.active) return
        const dist = Phaser.Math.Distance.Between(ball.x, ball.y, enemy.x, enemy.y)
        if (dist < 80) {
          enemy.takeDamage(ball.damage)
        }
      })

      ball.destroy()
    })
  }

  abilityMolecularPrime(ability) {
    const castX = this.x
    const castY = this.y

    // 扩散波
    const wave = this.scene.add.circle(castX, castY, 10, 0xffaa00, 0.4)
    wave.setDepth(50)

    this.scene.tweens.add({
      targets: wave,
      scale: ability.range / 10,
      duration: 1000,
      onComplete: () => {
        if (wave && wave.active) wave.destroy()
      }
    })

    // 标记敌人
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(castX, castY, enemy.x, enemy.y)
      if (dist < ability.range) {
        enemy.primed = true
        enemy.primedMultiplier = ability.damageMultiplier
        enemy.primedExplosion = ability.explosionDamage
        enemy.setTint(0xffaa00)

        // 减速
        if (enemy.stats) {
          enemy.originalSpeed = enemy.stats.speed
          enemy.stats.speed *= (1 - ability.slowPercent)
        }

        this.scene.time.delayedCall(ability.duration, () => {
          if (enemy.active) {
            enemy.primed = false
            enemy.primedMultiplier = 1
            enemy.clearTint()
            enemy.setTint(enemy.enemyData.color)
            if (enemy.originalSpeed) {
              enemy.stats.speed = enemy.originalSpeed
            }
          }
        })
      }
    })
  }

  // ========== Trinity 技能 ==========
  abilityWellOfLife(ability) {
    // 找最近敌人
    let target = null
    let nearestDist = Infinity

    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
      if (dist < nearestDist && dist < 500) {
        nearestDist = dist
        target = enemy
      }
    })

    if (!target) return

    target.wellOfLife = true
    target.setTint(0x00ff00)

    // 生命之井效果
    const wellEffect = this.scene.add.circle(target.x, target.y, 30, 0x00ff00, 0.3)
    wellEffect.setDepth(50)

    const followTimer = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        if (!target.active) return
        wellEffect.setPosition(target.x, target.y)
      },
      loop: true
    })

    this.scene.time.delayedCall(ability.duration, () => {
      followTimer.destroy()
      if (target.active) {
        target.wellOfLife = false
        target.clearTint()
        target.setTint(target.enemyData.color)
      }
      if (wellEffect && wellEffect.active) wellEffect.destroy()
    })
  }

  abilityEnergyVampire(ability) {
    // 找最近敌人
    let target = null
    let nearestDist = Infinity

    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
      if (dist < nearestDist && dist < 500) {
        nearestDist = dist
        target = enemy
      }
    })

    if (!target) return

    target.setTint(0x00ffff)

    // 脉冲恢复能量
    let pulseCount = 0
    const pulseTimer = this.scene.time.addEvent({
      delay: ability.duration / ability.pulseCount,
      callback: () => {
        if (!target.active || !this.active) return

        // 能量脉冲特效
        const pulse = this.scene.add.circle(target.x, target.y, 10, 0x00ffff, 0.8)
        pulse.setDepth(200)

        this.scene.tweens.add({
          targets: pulse,
          x: this.x,
          y: this.y,
          scale: 0.5,
          duration: 300,
          onComplete: () => {
            if (this.active) {
              this.addEnergy(ability.energyPerPulse)
            }
            if (pulse && pulse.active) pulse.destroy()
          }
        })

        pulseCount++
        if (pulseCount >= ability.pulseCount) {
          pulseTimer.destroy()
          if (target.active) {
            target.clearTint()
            target.setTint(target.enemyData.color)
          }
        }
      },
      loop: true
    })
  }

  abilityBlessing(ability) {
    // 恢复生命
    this.heal(this.stats.maxHealth * ability.healPercent)

    // 祝福特效
    const blessEffect = this.scene.add.circle(this.x, this.y, 50, 0x88ffaa, 0.5)
    blessEffect.setDepth(200)

    this.scene.tweens.add({
      targets: blessEffect,
      scale: 3,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (blessEffect && blessEffect.active) blessEffect.destroy()
      }
    })

    // 伤害减免
    this.blessingDR = ability.damageReduction
    this.blessingActive = true

    this.scene.time.delayedCall(ability.duration, () => {
      if (this.active) {
        this.blessingDR = 0
        this.blessingActive = false
      }
    })
  }

  // ========== Ash 技能 ==========
  abilityShuriken(ability) {
    const pointer = this.scene.input.activePointer
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y)

    // 投掷多个手里剑
    for (let i = 0; i < ability.projectileCount; i++) {
      const angle = baseAngle + (i - (ability.projectileCount - 1) / 2) * 0.2

      const shuriken = this.scene.add.star(this.x, this.y, 4, 5, 12, 0xaaaaaa)
      shuriken.setDepth(200)

      const speed = 800
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      const moveTimer = this.scene.time.addEvent({
        delay: 16,
        callback: () => {
          if (!shuriken.active) return
          shuriken.x += vx * 0.016
          shuriken.y += vy * 0.016
          shuriken.rotation += 0.3

          // 检测命中
          this.scene.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return
            const dist = Phaser.Math.Distance.Between(shuriken.x, shuriken.y, enemy.x, enemy.y)
            if (dist < 30) {
              enemy.takeDamage(ability.damage)
              // 流血效果
              enemy.bleeding = true
              enemy.bleedDamage = ability.bleedDamage
              enemy.bleedEnd = this.scene.time.now + ability.bleedDuration
              shuriken.destroy()
              moveTimer.destroy()
            }
          })
        },
        loop: true
      })

      this.scene.time.delayedCall(1000, () => {
        moveTimer.destroy()
        if (shuriken && shuriken.active) shuriken.destroy()
      })
    }
  }

  abilitySmokeScreen(ability) {
    const castX = this.x
    const castY = this.y

    // 烟雾效果
    const smoke = this.scene.add.circle(castX, castY, ability.range, 0x444444, 0.6)
    smoke.setDepth(50)

    // 眩晕范围内敌人
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(castX, castY, enemy.x, enemy.y)
      if (dist < ability.range) {
        enemy.stun(ability.stunDuration)
      }
    })

    // 隐身
    this.isInvisible = true
    this.setAlpha(0.3)

    this.scene.tweens.add({
      targets: smoke,
      alpha: 0,
      duration: ability.duration,
      onComplete: () => {
        if (smoke && smoke.active) smoke.destroy()
      }
    })

    this.scene.time.delayedCall(ability.duration, () => {
      if (this.active) {
        this.isInvisible = false
        this.setAlpha(1)
      }
    })
  }

  abilityBladeStorm(ability) {
    // 收集目标
    const targets = []
    this.scene.enemies.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y)
      if (dist < 400 && targets.length < ability.maxTargets) {
        targets.push(enemy)
        // 标记目标
        enemy.setTint(0xff0000)
      }
    })

    if (targets.length === 0) return

    // 无敌
    this.invincibleTime = targets.length * ability.hitsPerTarget * 200 + 500
    this.setAlpha(0.5)

    // 依次攻击每个目标
    let attackIndex = 0
    const totalAttacks = targets.length * ability.hitsPerTarget

    const attackTimer = this.scene.time.addEvent({
      delay: 150,
      callback: () => {
        if (!this.active || attackIndex >= totalAttacks) {
          attackTimer.destroy()
          if (this.active) this.setAlpha(1)
          return
        }

        const targetIndex = Math.floor(attackIndex / ability.hitsPerTarget)
        const target = targets[targetIndex]

        if (target && target.active) {
          // 瞬移到目标
          this.x = target.x + (Math.random() - 0.5) * 50
          this.y = target.y

          // 斩击特效
          const slash = this.scene.add.graphics()
          slash.lineStyle(3, 0xffffff, 1)
          slash.lineBetween(this.x - 30, this.y - 20, this.x + 30, this.y + 20)
          slash.setDepth(200)

          this.scene.tweens.add({
            targets: slash,
            alpha: 0,
            duration: 100,
            onComplete: () => {
              if (slash && slash.active) slash.destroy()
            }
          })

          target.takeDamage(ability.damagePerHit)
        }

        attackIndex++

        // 清除标记
        if (attackIndex % ability.hitsPerTarget === 0 && target && target.active) {
          target.clearTint()
          target.setTint(target.enemyData.color)
        }
      },
      loop: true
    })
  }
}
