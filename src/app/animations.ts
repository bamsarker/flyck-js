import { TweenMax, Power2 } from 'gsap/TweenMax'

export const promiseTo = (obj, duration: number, vars) =>
  new Promise(resolve =>
    TweenMax.to(obj, duration, {
      ...vars,
      onComplete: resolve
    })
  )

export const grow = (
  displayObject,
  targetSize: number = 2,
  duration: number = 0.5
) => promiseTo(displayObject.scale, duration, { x: targetSize, y: targetSize })

export const fade = (
  displayObject,
  duration: number = 0.5,
  alpha: number = 0
) => promiseTo(displayObject, duration, { alpha })
