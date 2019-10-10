import Circle from './app/circle'

export const gameWidth = 500
export const gameHeight = 800

export const backgroundColor = 0xFFFCF2

export const circleColors = [0xFE4A49, 0xFED766, 0x009FB7, 0xCCFF66, 0x5D2E8C, 0x00A878]
export const randomCircleColor = () => circleColors[Math.floor(Math.random() * circleColors.length)]
export const randomPlayerColor = (currentCircles: Circle[], circlesCreated: number) => {
    // every 3 circles, give a color that exists
    if (currentCircles.length > 0 && circlesCreated % 3 === 0) {
        return currentCircles.map(c => c.color)[Math.floor(Math.random() * currentCircles.length)]
    }
    // totally random
    return randomCircleColor()
}

export const baseCircleSpeed = 2
export const circleSpeedModifier = 10

export const playerSpeed = 10

export const lineColor = 0xcccccc
export const lineHeight = 3

export const topLimit = 175
export const height = 400
export const bottomLimit = topLimit + height

export const randomYPos = () => topLimit + (Math.random() * height)
export const randomXPos = () => 100 + (Math.random() * 300)

export const circleRadius = 45