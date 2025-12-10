// 程序化音效生成器和音效管理器
export class AudioManager {
  constructor() {
    this.audioContext = null
    this.masterVolume = 0.5
    this.sfxVolume = 0.7
    this.musicVolume = 0.3
    this.isMuted = false

    // 音效缓存
    this.soundCache = {}

    // 初始化
    this.init()
  }

  init() {
    // 延迟创建AudioContext直到用户交互
    if (typeof window !== 'undefined') {
      const initAudio = () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        }
        document.removeEventListener('click', initAudio)
        document.removeEventListener('keydown', initAudio)
      }
      document.addEventListener('click', initAudio)
      document.addEventListener('keydown', initAudio)
    }
  }

  ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    return this.audioContext
  }

  // 设置主音量
  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, value))
  }

  // 设置音效音量
  setSfxVolume(value) {
    this.sfxVolume = Math.max(0, Math.min(1, value))
  }

  // 设置音乐音量
  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, value))
  }

  // 静音切换
  toggleMute() {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  getEffectiveVolume(type = 'sfx') {
    if (this.isMuted) return 0
    const typeVolume = type === 'music' ? this.musicVolume : this.sfxVolume
    return this.masterVolume * typeVolume
  }

  // 播放射击音效
  playShoot(weaponType = 'rifle') {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    // 创建增益节点
    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.3, now)
    gainNode.gain.exponentialDecayTo = (value, time) => {
      gainNode.gain.exponentialRampToValueAtTime(Math.max(0.001, value), time)
    }

    // 根据武器类型生成不同音效
    switch (weaponType) {
      case 'rifle':
        this.createRifleSound(ctx, gainNode, now)
        break
      case 'pistol':
        this.createPistolSound(ctx, gainNode, now)
        break
      case 'shotgun':
        this.createShotgunSound(ctx, gainNode, now)
        break
      case 'bow':
        this.createBowSound(ctx, gainNode, now)
        break
      case 'beam':
        this.createBeamSound(ctx, gainNode, now)
        break
      default:
        this.createRifleSound(ctx, gainNode, now)
    }
  }

  createRifleSound(ctx, gainNode, now) {
    // 噪声爆发
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02))
    }
    noise.buffer = noiseBuffer
    noise.connect(gainNode)
    noise.start(now)

    // 低频共鸣
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.3, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(oscGain)
    oscGain.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.1)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  }

  createPistolSound(ctx, gainNode, now) {
    // 短促爆发
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01))
    }
    noise.buffer = noiseBuffer
    noise.connect(gainNode)
    noise.start(now)

    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.03)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.2, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(oscGain)
    oscGain.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.06)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
  }

  createShotgunSound(ctx, gainNode, now) {
    // 大爆发
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
    }
    noise.buffer = noiseBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.15)

    noise.connect(filter)
    filter.connect(gainNode)
    noise.start(now)

    gainNode.gain.setValueAtTime(this.getEffectiveVolume('sfx') * 0.5, now)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
  }

  createBowSound(ctx, gainNode, now) {
    // 弦声
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.3, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(oscGain)
    oscGain.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.25)

    // 箭飞行嘶嘶声
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 * Math.exp(-i / (ctx.sampleRate * 0.1))
    }
    noise.buffer = noiseBuffer
    noise.connect(gainNode)
    noise.start(now + 0.02)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  }

  createBeamSound(ctx, gainNode, now) {
    // 电子嗡嗡声
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.setValueAtTime(442, now + 0.02)
    osc.frequency.setValueAtTime(438, now + 0.04)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.1, now)
    oscGain.gain.setValueAtTime(0.15, now + 0.02)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

    osc.connect(oscGain)
    oscGain.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.12)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  }

  // 播放击中音效
  playHit(isCrit = false) {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)

    if (isCrit) {
      // 暴击音效 - 更响亮更尖锐
      gainNode.gain.setValueAtTime(volume * 0.4, now)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1)
      osc.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.12)

      // 额外的高频闪光
      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(1200, now)
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.05)
      const osc2Gain = ctx.createGain()
      osc2Gain.gain.setValueAtTime(0.2, now)
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc2.connect(osc2Gain)
      osc2Gain.connect(gainNode)
      osc2.start(now)
      osc2.stop(now + 0.08)
    } else {
      // 普通击中
      gainNode.gain.setValueAtTime(volume * 0.2, now)

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05)
      osc.connect(gainNode)
      osc.start(now)
      osc.stop(now + 0.06)
    }

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  }

  // 播放敌人死亡音效
  playEnemyDeath() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.3, now)

    // 爆炸噪声
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08))
    }
    noise.buffer = noiseBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1500, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.2)

    noise.connect(filter)
    filter.connect(gainNode)
    noise.start(now)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
  }

  // 播放玩家受伤音效
  playPlayerHurt() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.3, now)

    // 低频撞击
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.15)

    // 警告音
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(200, now)
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.setValueAtTime(0.1, now)
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    osc2.connect(osc2Gain)
    osc2Gain.connect(gainNode)
    osc2.start(now)
    osc2.stop(now + 0.12)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
  }

  // 播放能量/血球拾取音效
  playPickup(type = 'energy') {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.2, now)

    const baseFreq = type === 'energy' ? 600 : type === 'health' ? 400 : 500

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.15)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
  }

  // 播放UI点击音效
  playUIClick() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.15, now)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.setValueAtTime(1000, now + 0.02)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.05)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
  }

  // 播放升级/成功音效
  playSuccess() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.25, now)

    // 上升的和弦
    const frequencies = [400, 500, 600, 800]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.1)
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.2, now + i * 0.1)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2)
      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.25)
    })

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
  }

  // 播放波次开始音效
  playWaveStart() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.3, now)

    // 警报声
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.setValueAtTime(300, now + 0.2)
    osc.frequency.setValueAtTime(200, now + 0.4)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.5)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
  }

  // 播放Boss出现音效
  playBossAppear() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.4, now)

    // 低沉的警告
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, now)
    osc.frequency.setValueAtTime(80, now + 0.3)
    osc.frequency.setValueAtTime(60, now + 0.6)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.8)

    // 高频警报
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(400, now)
    osc2.frequency.setValueAtTime(500, now + 0.15)
    osc2.frequency.setValueAtTime(400, now + 0.3)
    osc2.frequency.setValueAtTime(500, now + 0.45)
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.setValueAtTime(0.1, now)
    osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc2.connect(osc2Gain)
    osc2Gain.connect(gainNode)
    osc2.start(now)
    osc2.stop(now + 0.65)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
  }

  // 播放游戏结束音效
  playGameOver() {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.3, now)

    // 下降的悲伤音
    const frequencies = [400, 350, 300, 250]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.2)
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.25, now + i * 0.2)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.3)
      osc.connect(oscGain)
      oscGain.connect(gainNode)
      osc.start(now + i * 0.2)
      osc.stop(now + i * 0.2 + 0.35)
    })

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
  }

  // 播放技能音效
  playAbility(abilityType = 'default') {
    const ctx = this.ensureContext()
    if (!ctx) return

    const volume = this.getEffectiveVolume('sfx')
    if (volume === 0) return

    const now = ctx.currentTime

    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(volume * 0.35, now)

    // 能量释放声
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3)
    osc.connect(gainNode)
    osc.start(now)
    osc.stop(now + 0.35)

    // 嗡嗡的能量余音
    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3 * Math.exp(-i / (ctx.sampleRate * 0.15))
    }
    noise.buffer = noiseBuffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.1, now + 0.1)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    noise.connect(noiseGain)
    noiseGain.connect(gainNode)
    noise.start(now + 0.1)

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
  }
}

// 单例模式
let audioManagerInstance = null

export function getAudioManager() {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}
