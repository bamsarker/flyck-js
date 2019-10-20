import * as PIXI from 'pixi.js'
import { Obstacle } from './Obstacle'
import {
  backgroundColor,
  baseObstacleSpeed,
  randomYPos,
  randomXPos,
  randomCircleColor,
  circleColors
} from '../config'

export class MenuBackground {
  private app: PIXI.Application

  constructor(parent: HTMLElement, width: number, height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: backgroundColor,
      antialias: true
    })
    parent.append(this.app.view)

    circleColors.map(this.addObstacle)
  }

  private addObstacle = (color: number) => {
    const newCircle = new Obstacle({
      speed: baseObstacleSpeed,
      y: randomYPos(),
      x: randomXPos(),
      color
    })
    this.app.stage.addChild(newCircle)
    this.app.ticker.add(newCircle.update)
  }

  destroy = () => {
    if (this.app) {
      this.app.destroy(true)
      delete this.app
    }
  }
}
