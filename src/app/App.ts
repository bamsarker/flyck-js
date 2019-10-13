import * as PIXI from 'pixi.js'
import { Obstacle } from './Obstacle'
import {
  randomYPos,
  randomXPos,
  randomCircleColor,
  topLimit,
  bottomLimit,
  circleRadius,
  gameWidth,
  backgroundColor,
  obstacleSpeedModifier,
  baseObstacleSpeed,
  lineColor,
  lineHeight,
  randomPlayerColor,
  colorNameMap
} from '../config'
import Player from './Player'
import PowerUpMeter from './PowerUpMeter'

export class GameApp {
  private app: PIXI.Application
  obstacles: Obstacle[]
  obstaclesCreated: number
  player: Player
  score: number
  powerUpMeter: PowerUpMeter

  constructor(parent: HTMLElement, width: number, height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: backgroundColor,
      antialias: true
    })
    parent.replaceChild(this.app.view, parent.lastElementChild) // Hack for parcel HMR

    this.obstacles = []
    this.obstaclesCreated = 0

    this.score = 0

    // init Pixi loader
    let loader = new PIXI.Loader()

    // Load assets
    loader.load(this.onAssetsLoaded)
  }

  private addCircle = () => {
    const newCircle = new Obstacle({
      speed: baseObstacleSpeed + this.obstaclesCreated / obstacleSpeedModifier,
      y: randomYPos(),
      x: randomXPos(),
      color: randomCircleColor()
    })
    this.obstacles.push(newCircle)
    this.obstaclesCreated++
    this.app.stage.addChild(newCircle)
  }

  private addLine = (y: number) => {
    const line = new PIXI.Graphics()
    line.beginFill(lineColor)
    line.drawRect(0, y, gameWidth, lineHeight)
    this.app.stage.addChild(line)
  }

  private addLines = () => {
    this.addLine(topLimit - circleRadius)
    this.addLine(bottomLimit + circleRadius)
  }

  private increaseScore = () => {
    this.score++
    document.querySelector('#score').innerHTML = `SCORE: ${this.score}`
  }

  private addPlayer = () => {
    const player = new Player({
      speed: 0,
      color: randomPlayerColor(this.obstacles, this.obstaclesCreated),
      increaseScore: this.increaseScore,
      crossedCallback: this.addCircle,
      newColor: () => randomPlayerColor(this.obstacles, this.obstaclesCreated)
    })
    this.player = player
    this.app.stage.addChild(this.player)
  }

  private collectObstacle = obstacle => {
    obstacle.speed = 0
    obstacle.collected = true
    this.powerUpMeter.collect(obstacle.color)
    obstacle.disappear().then(() => {
      this.obstacles = this.obstacles.filter(o => o !== obstacle)
    })
  }

  private gameOver = () => {
    if (this.player.dead) return
    this.player.die()
    document.getElementById('endgame').style.display = 'block'
    console.log('GAME OVER')
  }

  private obstacleCollisionCheck = () => {
    this.obstacles
      .filter(o => !o.collected)
      .forEach(obstacle => {
        const distance = Math.hypot(
          obstacle.x - this.player.x,
          obstacle.y - this.player.y
        )
        if (distance < circleRadius * 2) {
          if (this.player.poweredUp || obstacle.color === this.player.color)
            this.collectObstacle(obstacle)
          else this.gameOver()
        }
      })
  }

  private addPowerUpMeter = () => {
    this.powerUpMeter = new PowerUpMeter(this.powerUpEnabled)
    this.app.stage.addChild(this.powerUpMeter)
  }

  private powerUpEnabled = () => {
    this.player.enablePowerUp()
  }

  private onAssetsLoaded = () => {
    this.addPowerUpMeter()
    this.addLines()

    this.addCircle()
    this.addPlayer()
    this.app.ticker.add(this.update)
  }

  private update = (delta: number) => {
    this.obstacles.forEach(c => c.update(delta))
    this.player.update(delta)
    this.obstacleCollisionCheck()
  }
}
