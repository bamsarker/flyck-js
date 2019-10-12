import * as PIXI from 'pixi.js'
import { circleRadius } from '../config'
import { fade, grow } from './animations'

export class Circle extends PIXI.Graphics {
  color: any
  constructor({ y, x, color }) {
    super()
    this.color = color
    this.beginFill(this.color)
    this.drawCircle(0, 0, circleRadius)
    this.x = x
    this.y = y
  }

  appear = () => Promise.all([fade(this, undefined, 1), grow(this, 1)])
  disappear = () => Promise.all([fade(this), grow(this)])
}

export default Circle
