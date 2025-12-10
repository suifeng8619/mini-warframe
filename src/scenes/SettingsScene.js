import Phaser from 'phaser'

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' })
  }

  create() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height

    // 背景
    this.add.image(this.width / 2, this.height / 2, 'background')

    // 半透明遮罩
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.7)
    overlay.fillRect(0, 0, this.width, this.height)

    // 面板背景
    const panelWidth = 600
    const panelHeight = 500
    const panelX = (this.width - panelWidth) / 2
    const panelY = (this.height - panelHeight) / 2

    const panelBg = this.add.graphics()
    panelBg.fillStyle(0x112233, 0.95)
    panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)
    panelBg.lineStyle(2, 0x00ccff, 1)
    panelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 12)

    // 标题
    this.add.text(this.width / 2, panelY + 40, '设置', {
      fontFamily: 'Arial Black',
      fontSize: '32px',
      color: '#00ccff'
    }).setOrigin(0.5)

    // 音量设置区域
    this.createVolumeSection(panelX + 50, panelY + 100, panelWidth - 100)

    // 游戏设置区域
    this.createGameSection(panelX + 50, panelY + 280, panelWidth - 100)

    // 返回按钮
    this.createBackButton(this.width / 2, panelY + panelHeight - 50)

    // 从localStorage加载设置
    this.loadSettings()
  }

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('miniWarframeSettings') || '{}')

    // 应用音量设置
    if (window.audioManager) {
      if (settings.masterVolume !== undefined) {
        window.audioManager.setMasterVolume(settings.masterVolume)
        this.masterSlider.setValue(settings.masterVolume)
      }
      if (settings.sfxVolume !== undefined) {
        window.audioManager.setSfxVolume(settings.sfxVolume)
        this.sfxSlider.setValue(settings.sfxVolume)
      }
      if (settings.muted !== undefined && settings.muted) {
        window.audioManager.toggleMute()
        this.muteToggle.setChecked(true)
      }
    }

    // 应用游戏设置
    if (settings.showDamageNumbers !== undefined) {
      this.damageNumbersToggle.setChecked(settings.showDamageNumbers)
    }
    if (settings.screenShake !== undefined) {
      this.screenShakeToggle.setChecked(settings.screenShake)
    }
  }

  saveSettings() {
    const settings = {
      masterVolume: this.masterSlider.value,
      sfxVolume: this.sfxSlider.value,
      muted: this.muteToggle.checked,
      showDamageNumbers: this.damageNumbersToggle.checked,
      screenShake: this.screenShakeToggle.checked
    }
    localStorage.setItem('miniWarframeSettings', JSON.stringify(settings))
  }

  createVolumeSection(x, y, width) {
    // 音量设置标题
    this.add.text(x, y, '音量设置', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffaa00'
    })

    // 主音量滑块
    this.add.text(x, y + 40, '主音量', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.masterSlider = this.createSlider(x + 120, y + 40, width - 150, (value) => {
      if (window.audioManager) {
        window.audioManager.setMasterVolume(value)
      }
      this.saveSettings()
    })

    // 音效音量滑块
    this.add.text(x, y + 80, '音效音量', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.sfxSlider = this.createSlider(x + 120, y + 80, width - 150, (value) => {
      if (window.audioManager) {
        window.audioManager.setSfxVolume(value)
      }
      this.saveSettings()
    })

    // 静音开关
    this.add.text(x, y + 120, '静音', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.muteToggle = this.createToggle(x + 120, y + 120, (checked) => {
      if (window.audioManager) {
        // 只有当状态不同时才切换
        if (window.audioManager.isMuted !== checked) {
          window.audioManager.toggleMute()
        }
      }
      this.saveSettings()
    })
  }

  createGameSection(x, y, width) {
    // 游戏设置标题
    this.add.text(x, y, '游戏设置', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffaa00'
    })

    // 显示伤害数字
    this.add.text(x, y + 40, '显示伤害数字', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.damageNumbersToggle = this.createToggle(x + 150, y + 40, (checked) => {
      window.GAME_STATE.showDamageNumbers = checked
      this.saveSettings()
    }, true)

    // 屏幕震动
    this.add.text(x, y + 80, '屏幕震动', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    })
    this.screenShakeToggle = this.createToggle(x + 150, y + 80, (checked) => {
      window.GAME_STATE.screenShake = checked
      this.saveSettings()
    }, true)

    // 重置存档按钮
    this.createDangerButton(x + width / 2, y + 140, '重置存档', () => {
      this.showResetConfirm()
    })
  }

  createSlider(x, y, width, onChange) {
    const slider = this.add.container(x, y)
    const sliderHeight = 8
    const handleSize = 20

    // 滑块轨道背景
    const trackBg = this.add.graphics()
    trackBg.fillStyle(0x333344, 1)
    trackBg.fillRoundedRect(0, -sliderHeight / 2, width, sliderHeight, 4)

    // 滑块轨道填充
    const trackFill = this.add.graphics()

    // 滑块手柄
    const handle = this.add.circle(0, 0, handleSize / 2, 0x00ccff)
    handle.setInteractive({ draggable: true })

    // 当前值显示
    const valueText = this.add.text(width + 15, 0, '100%', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#88aacc'
    }).setOrigin(0, 0.5)

    slider.add([trackBg, trackFill, handle, valueText])

    // 初始值
    slider.value = 1.0
    slider.width = width

    slider.setValue = (value) => {
      slider.value = Math.max(0, Math.min(1, value))
      const handleX = slider.value * width
      handle.x = handleX

      // 更新填充
      trackFill.clear()
      trackFill.fillStyle(0x00ccff, 1)
      trackFill.fillRoundedRect(0, -sliderHeight / 2, handleX, sliderHeight, 4)

      valueText.setText(`${Math.round(slider.value * 100)}%`)
    }

    // 初始化位置
    slider.setValue(1.0)

    // 拖拽事件
    handle.on('drag', (pointer, dragX) => {
      const newX = Phaser.Math.Clamp(dragX, 0, width)
      slider.setValue(newX / width)
      onChange(slider.value)
    })

    // 点击轨道事件
    const hitArea = this.add.rectangle(width / 2, 0, width, 30, 0x000000, 0)
    hitArea.setInteractive()
    slider.add(hitArea)
    slider.sendToBack(hitArea)

    hitArea.on('pointerdown', (pointer) => {
      const localX = pointer.x - slider.x - x
      slider.setValue(Phaser.Math.Clamp(localX / width, 0, 1))
      onChange(slider.value)
    })

    return slider
  }

  createToggle(x, y, onChange, defaultValue = false) {
    const toggle = this.add.container(x, y)
    const toggleWidth = 50
    const toggleHeight = 26

    // 背景
    const bg = this.add.graphics()

    // 开关圆点
    const dot = this.add.circle(0, 0, 10, 0xffffff)

    toggle.add([bg, dot])
    toggle.setSize(toggleWidth, toggleHeight)
    toggle.setInteractive()

    toggle.checked = defaultValue
    toggle.setChecked = (checked) => {
      toggle.checked = checked
      if (checked) {
        bg.clear()
        bg.fillStyle(0x44aa44, 1)
        bg.fillRoundedRect(-toggleWidth / 2, -toggleHeight / 2, toggleWidth, toggleHeight, toggleHeight / 2)
        dot.x = toggleWidth / 2 - 15
      } else {
        bg.clear()
        bg.fillStyle(0x444455, 1)
        bg.fillRoundedRect(-toggleWidth / 2, -toggleHeight / 2, toggleWidth, toggleHeight, toggleHeight / 2)
        dot.x = -toggleWidth / 2 + 15
      }
    }

    toggle.setChecked(defaultValue)

    toggle.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      toggle.setChecked(!toggle.checked)
      onChange(toggle.checked)
    })

    toggle.on('pointerover', () => {
      dot.setScale(1.1)
    })

    toggle.on('pointerout', () => {
      dot.setScale(1)
    })

    return toggle
  }

  createDangerButton(x, y, text, onClick) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x662222, 0.9)
    bg.fillRoundedRect(-80, -18, 160, 36, 6)
    bg.lineStyle(2, 0xaa4444, 1)
    bg.strokeRoundedRect(-80, -18, 160, 36, 6)

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ff6666'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(160, 36)
    button.setInteractive()

    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x883333, 0.9)
      bg.fillRoundedRect(-80, -18, 160, 36, 6)
      bg.lineStyle(2, 0xff6666, 1)
      bg.strokeRoundedRect(-80, -18, 160, 36, 6)
      label.setColor('#ffffff')
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x662222, 0.9)
      bg.fillRoundedRect(-80, -18, 160, 36, 6)
      bg.lineStyle(2, 0xaa4444, 1)
      bg.strokeRoundedRect(-80, -18, 160, 36, 6)
      label.setColor('#ff6666')
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      onClick()
    })

    return button
  }

  showResetConfirm() {
    // 创建确认弹窗
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.8)
    overlay.fillRect(0, 0, this.width, this.height)
    overlay.setDepth(1000)

    const dialogWidth = 400
    const dialogHeight = 200
    const dialogX = (this.width - dialogWidth) / 2
    const dialogY = (this.height - dialogHeight) / 2

    const dialogBg = this.add.graphics()
    dialogBg.fillStyle(0x1a1a2e, 0.98)
    dialogBg.fillRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 12)
    dialogBg.lineStyle(2, 0xff4444, 1)
    dialogBg.strokeRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 12)
    dialogBg.setDepth(1001)

    const warningText = this.add.text(this.width / 2, dialogY + 40, '确定要重置存档吗?', {
      fontFamily: 'Arial Black',
      fontSize: '24px',
      color: '#ff4444'
    }).setOrigin(0.5).setDepth(1002)

    const descText = this.add.text(this.width / 2, dialogY + 80, '所有游戏进度将被清除!', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(1002)

    // 确认按钮
    const confirmBtn = this.add.container(this.width / 2 - 70, dialogY + 140)
    const confirmBg = this.add.graphics()
    confirmBg.fillStyle(0x662222, 0.9)
    confirmBg.fillRoundedRect(-50, -16, 100, 32, 6)
    const confirmLabel = this.add.text(0, 0, '确定', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ff6666'
    }).setOrigin(0.5)
    confirmBtn.add([confirmBg, confirmLabel])
    confirmBtn.setSize(100, 32)
    confirmBtn.setInteractive()
    confirmBtn.setDepth(1002)

    // 取消按钮
    const cancelBtn = this.add.container(this.width / 2 + 70, dialogY + 140)
    const cancelBg = this.add.graphics()
    cancelBg.fillStyle(0x223344, 0.9)
    cancelBg.fillRoundedRect(-50, -16, 100, 32, 6)
    const cancelLabel = this.add.text(0, 0, '取消', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#88aacc'
    }).setOrigin(0.5)
    cancelBtn.add([cancelBg, cancelLabel])
    cancelBtn.setSize(100, 32)
    cancelBtn.setInteractive()
    cancelBtn.setDepth(1002)

    const closeDialog = () => {
      overlay.destroy()
      dialogBg.destroy()
      warningText.destroy()
      descText.destroy()
      confirmBtn.destroy()
      cancelBtn.destroy()
    }

    confirmBtn.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.resetSaveData()
      closeDialog()
    })

    cancelBtn.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      closeDialog()
    })
  }

  resetSaveData() {
    localStorage.removeItem('miniWarframeSave')
    localStorage.removeItem('miniWarframeSettings')

    // 显示提示并重新加载
    this.showMessage('存档已重置，游戏将重新开始...', '#ff6666')

    this.time.delayedCall(1500, () => {
      window.location.reload()
    })
  }

  createBackButton(x, y) {
    const button = this.add.container(x, y)

    const bg = this.add.graphics()
    bg.fillStyle(0x223344, 0.9)
    bg.fillRoundedRect(-60, -20, 120, 40, 6)
    bg.lineStyle(2, 0x4488aa, 1)
    bg.strokeRoundedRect(-60, -20, 120, 40, 6)

    const label = this.add.text(0, 0, '返回', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#88aacc'
    }).setOrigin(0.5)

    button.add([bg, label])
    button.setSize(120, 40)
    button.setInteractive()

    button.on('pointerover', () => {
      bg.clear()
      bg.fillStyle(0x334455, 0.9)
      bg.fillRoundedRect(-60, -20, 120, 40, 6)
      bg.lineStyle(2, 0x66aacc, 1)
      bg.strokeRoundedRect(-60, -20, 120, 40, 6)
      label.setColor('#ffffff')
    })

    button.on('pointerout', () => {
      bg.clear()
      bg.fillStyle(0x223344, 0.9)
      bg.fillRoundedRect(-60, -20, 120, 40, 6)
      bg.lineStyle(2, 0x4488aa, 1)
      bg.strokeRoundedRect(-60, -20, 120, 40, 6)
      label.setColor('#88aacc')
    })

    button.on('pointerdown', () => {
      if (window.audioManager) {
        window.audioManager.playUIClick()
      }
      this.scene.start('MenuScene')
    })
  }

  showMessage(text, color) {
    const message = this.add.text(this.width / 2, this.height / 2, text, {
      fontFamily: 'Arial Black',
      fontSize: '28px',
      color: color,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(2000)

    this.tweens.add({
      targets: message,
      y: message.y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        message.destroy()
      }
    })
  }
}
