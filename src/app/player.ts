import * as PIXI from 'pixi.js'
import { Circle } from './circle'
import {
  circleRadius,
  gameWidth,
  bottomLimit,
  playerSpeed,
  topLimit
} from '../config'
import { TweenMax, Power2 } from 'gsap/TweenMax'
import { grow, fade, promiseTo } from './animations'

export class Player extends Circle {
  speed: number
  launched: boolean
  crossedCallback: () => void
  constructor({ speed, color, crossedCallback }) {
    super({ x: gameWidth / 2, y: bottomLimit + circleRadius * 3, color })
    this.speed = speed

    this.interactive = true
    this.buttonMode = true
    this.on('pointerup', this.launch)

    this.crossedCallback = crossedCallback
  }

  private checkConstraints = () => {
    if (this.x > gameWidth - circleRadius) {
      this.x = gameWidth - circleRadius
    } else if (this.x < circleRadius) {
      this.x = circleRadius
    }

    if (this.y < topLimit - circleRadius * 2 && this.speed > 0) {
      this.reset()
    }
  }

  private reset = () => {
    this.launched = false
    Promise.all([this.disappear(), promiseTo(this, 0.5, { speed: 0 })]).then(
      () => {
        this.crossedCallback()
        this.y = bottomLimit + circleRadius * 3

        this.appear()
      }
    )
  }

  private launch = () => {
    this.launched = true
    this.speed = playerSpeed
  }

  update = (delta: number, mousePosition) => {
    this.y -= this.speed * delta

    if (!this.launched) this.x = mousePosition.x
    else this.checkConstraints()
  }
}

export default Player
