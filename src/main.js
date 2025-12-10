import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene.js'
import { PreloadScene } from './scenes/PreloadScene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { GameScene } from './scenes/GameScene.js'
import { UIScene } from './scenes/UIScene.js'
import { ModScene } from './scenes/ModScene.js'
import { ArsenalScene } from './scenes/ArsenalScene.js'
import { FoundryScene } from './scenes/FoundryScene.js'
import { ShopScene } from './scenes/ShopScene.js'
import { NavigationScene } from './scenes/NavigationScene.js'

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a0f',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [BootScene, PreloadScene, MenuScene, ArsenalScene, ModScene, FoundryScene, ShopScene, NavigationScene, GameScene, UIScene],
  pixelArt: false,
  antialias: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

const game = new Phaser.Game(config)

// 注意：全局游戏状态在 BootScene 中初始化
// window.GAME_STATE 会从 localStorage 读取或设置默认值
