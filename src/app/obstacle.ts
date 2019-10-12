import * as PIXI from 'pixi.js'
import { Circle } from './circle'

const randomDirection = () => [-1, 1][Math.floor(Math.random() * 2)]

export class Obstacle extends Circle {
  direction: number
  speed: number
  constructor({ speed, y, x, color }) {
    super({ x, y, color })
    this.direction = randomDirection()
    this.speed = speed
  }

  private checkConstraints = () => {
    if (this.x > 500 - this.width / 2) {
      this.direction = -1
    } else if (this.x < 0 + this.width / 2) {
      this.direction = 1
    }
  }

  update = (delta: number) => {
    this.x += this.speed * this.direction * delta
    this.checkConstraints()
  }
}

export default Obstacle