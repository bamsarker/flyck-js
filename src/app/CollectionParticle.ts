import { Circle } from './Circle'
import { promiseTo, grow, moveTo } from './animations'
import { powerUpMeterPosition } from '../config'
import { Power3, TweenMax } from 'gsap/TweenMax'

export class CollectionParticle extends Circle {
  constructor({ y, x, color }) {
    super({ x, y, color })

    this.scale.x = 0.5
    this.scale.y = 0.5
    this.alpha = 0.5
  }

  moveToPowerUpMeter = (targetPosition: { x: number; y: number }) =>
    moveTo(this, 0.75, {
      x: targetPosition.x + powerUpMeterPosition.x,
      y: targetPosition.y + powerUpMeterPosition.y,
      ease: Power3.easeIn
    })
}

export default CollectionParticle
