import * as PIXI from 'pixi.js'
import { circleRadius } from '../config'
import { fade, grow } from './animations'

export class Circle extends PIXI.Graphics {
  color: number
  radius: number
  constructor({
    y,
    x,
    color,
    radius = circleRadius
  }: {
    y: number
    x: number
    color: number
    radius?: number
  }) {
    super()
    this.color = color
    this.beginFill(this.color)
    this.radius = radius
    this.drawCircle(0, 0, this.radius)
    this.x = x
    this.y = y
  }

  redraw = () => {
    this.clear()
    this.beginFill(this.color)
    this.drawCircle(0, 0, this.radius)
  }

  appear = (alpha: number = 1) =>
    Promise.all([fade(this, undefined, alpha), grow(this, 1)])
  disappear = () => Promise.all([fade(this), grow(this)])
}

export default Circle
