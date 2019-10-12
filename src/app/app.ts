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
  randomPlayerColor
} from '../config'
import Player from './player'

export class GameApp {
  private app: PIXI.Application
  obstacles: Obstacle[]
  obstaclesCreated: number
  player: Player

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

  addLine = (y: number) => {
    const line = new PIXI.Graphics()
    line.beginFill(lineColor)
    line.drawRect(0, y, gameWidth, lineHeight)
    this.app.stage.addChild(line)
  }

  addLines = () => {
    this.addLine(topLimit - circleRadius)
    this.addLine(bottomLimit + circleRadius)
  }

  addPlayer = () => {
    const player = new Player({
      speed: 0,
      color: randomPlayerColor(this.obstacles, this.obstaclesCreated),
      crossedCallback: this.addCircle
    })
    this.player = player
    this.app.stage.addChild(this.player)
  }

  private collectObstacle = obstacle => {
    obstacle.speed = 0
    obstacle.disappear()
  }

  private gameOver = () => {
    console.log('GAME OVER')
    this.player.speed = 0
    this.player.disappear()
  }

  private obstacleCollisionCheck = () => {
    this.obstacles.forEach(obstacle => {
      const distance = Math.hypot(
        obstacle.x - this.player.x,
        obstacle.y - this.player.y
      )
      if (distance < circleRadius * 2) {
        if (obstacle.color === this.player.color) this.collectObstacle(obstacle)
        else this.gameOver()
      }
    })
  }

  private onAssetsLoaded = () => {
    this.addLines()

    this.addCircle()
    this.addPlayer()
    this.app.ticker.add(this.update)

    // setInterval(() => this.addCircle(), 100)
  }

  private update = (delta: number) => {
    this.obstacles.forEach(c => c.update(delta))
    this.player.update(
      delta,
      this.app.renderer.plugins.interaction.mouse.global
    )
    this.obstacleCollisionCheck()
  }
}
