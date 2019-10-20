import * as PIXI from 'pixi.js'
import { Circle } from './Circle'
import { gameWidth, circleRadius, circleAlpha } from '../config'

const circlePositions = [
  { x: 0, y: -23 },
  { x: 21, y: -11 },
  { x: 21, y: 11 },
  { x: 0, y: 23 },
  { x: -21, y: 11 },
  { x: -21, y: -11 }
]

const grey = 0xaaaaaa

export class Cluster extends PIXI.Container {
  circles: Circle[]
  constructor({
    x,
    y,
    colors,
    color
  }: {
    x: number
    y: number
    colors?: number[]
    color?: number
  }) {
    super()
    this.x = x
    this.y = y

    this.addCircles(
      colors || Array.from(Array(6).keys()).map(i => color || grey)
    )
  }

  private addCircles = (colors: number[]) => {
    this.circles = circlePositions.map((pos, i) => {
      const circle = new Circle({
        y: pos.y,
        x: pos.x,
        color: colors[i],
        radius: circleRadius / 2.5
      })
      circle.alpha = circleAlpha
      return circle
    })
    this.addChild(...this.circles)
  }
}

export default Cluster
