import * as PIXI from 'pixi.js'
import { Circle } from './circle'
import {
  circleRadius,
  gameWidth,
  bottomLimit,
  playerSpeed,
  topLimit,
  baseObstacleSpeed,
  gameHeight,
  randomPlayerColor,
  startingYPosition
} from '../config'
import { TweenMax, Power2 } from 'gsap/TweenMax'
import { grow, fade, promiseTo } from './animations'

interface Vector {
  x: number
  y: number
}

const normalizeVector = (vector: Vector, scale: number = 1) => {
  const len = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  return {
    x: (vector.x / len) * scale,
    y: (vector.y / len) * scale
  }
}

export class Player extends Circle {
  speed: number
  launched: boolean
  crossedCallback: () => void
  increaseScore: () => void
  newColor: () => number
  dragData: any
  dragging: boolean
  direction: Vector
  positionHistory: Vector[]
  dead: boolean
  constructor({ speed, color, crossedCallback, increaseScore, newColor }) {
    super({ x: gameWidth / 2, y: startingYPosition, color })
    this.speed = speed

    this.interactive = true
    this.buttonMode = true

    this.on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove)

    this.crossedCallback = crossedCallback
    this.increaseScore = increaseScore
    this.newColor = newColor

    this.direction = { x: 0, y: 0 }
    this.positionHistory = []
  }

  private onDragStart = event => {
    this.dragData = event.data
    this.dragging = true
  }

  private onDragEnd = () => {
    this.dragging = false
    this.dragData = null
    this.positionHistory = []
  }

  private onDragMove = () => {
    if (!this.launched && this.dragging) {
      const newPosition = this.dragData.getLocalPosition(this.parent)
      this.x = newPosition.x
      this.y = newPosition.y
      this.positionHistory.push({ x: this.x, y: this.y })
      if (this.positionHistory.length > 3) this.positionHistory.shift()
      this.checkForLaunch()
    }
  }

  die = () => {
    this.dead = true
    this.direction = { x: 0, y: 0 }
    this.disappear()
  }

  private movementVector = () => {
    const vectors = this.positionHistory
      .map((position, i) => {
        if (i < this.positionHistory.length - 1) {
          const nextPosition = this.positionHistory[i + 1]
          return {
            x: nextPosition.x - position.x,
            y: nextPosition.y - position.y
          }
        } else {
          return undefined
        }
      })
      .filter(p => !!p)
    const total = vectors.reduce(
      (totalVector, v, i) => {
        return {
          x: totalVector.x + v.x,
          y: totalVector.y + v.y
        }
      },
      { x: 0, y: 0 }
    )
    return {
      x: total.x / vectors.length || 0,
      y: total.y / vectors.length || 0
    }
  }

  private checkForLaunch = () => {
    if (this.y < bottomLimit + circleRadius) {
      this.launch()
    }
  }

  private checkConstraints = () => {
    if (this.x > gameWidth - circleRadius || this.x < circleRadius) {
      this.x =
        this.x > gameWidth - circleRadius
          ? gameWidth - circleRadius
          : circleRadius
      this.direction.x = -this.direction.x
    }

    if (this.y < topLimit - circleRadius * 2 && this.launched) {
      this.reset()
    }
  }

  private reset = () => {
    this.launched = false
    this.increaseScore()
    Promise.all([promiseTo(this, 0.4, {})]).then(() => {
      this.crossedCallback()
      this.direction = { x: 0, y: 0 }
      this.x = gameWidth / 2
      this.y = gameHeight + circleRadius * 2
      this.appear()
      promiseTo(this, 0.5, { y: startingYPosition })
      this.color = this.newColor()

      this.redraw()
    })
  }

  private launch = () => {
    this.launched = true
    this.direction = normalizeVector(this.movementVector(), playerSpeed)
  }

  update = (delta: number) => {
    this.y += this.direction.y * delta
    this.x += this.direction.x * delta
    if (this.launched) {
      this.checkConstraints()
    }
  }
}

export default Player
