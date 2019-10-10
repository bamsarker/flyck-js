import * as PIXI from 'pixi.js';
import { circleRadius, gameWidth, bottomLimit, playerSpeed, topLimit } from '../config';
import { TweenMax, Power2 } from "gsap/TweenMax";
import { grow, fade, promiseTo } from './animations';

export class Player extends PIXI.Graphics {
    speed: number;
    color: any;
    launched: boolean;
    constructor({ speed, color }) {
        super()
        this.color = color;
        this.beginFill(this.color);
        this.drawCircle(0, 0, circleRadius);
        this.x = gameWidth / 2;
        this.y = bottomLimit + (circleRadius * 3);
        this.speed = speed;

        this.interactive = true
        this.buttonMode = true
        this.on('pointerup', this.launch);
    }

    private checkConstraints = () => {
        if (this.x > gameWidth - circleRadius) {
            this.x = gameWidth - circleRadius
        } else if (this.x < circleRadius) {
            this.x = circleRadius
        }

        if (this.y < topLimit - (circleRadius * 2) && this.speed > 0) {
            this.reset()
        }
    }

    private reset = () => {
        Promise.all(
            [
                grow(this),
                fade(this),
                promiseTo(this, 0.5, { speed: 0 })
            ]
        ).then(() => {
            console.log('finished')
            this.y = bottomLimit + (circleRadius * 3)
            this.launched = false
            this.alpha = 1
            this.scale.x = 1
            this.scale.y = 1
        })
    }

    private launch = () => {
        this.launched = true
        this.speed = playerSpeed
    }

    update = (delta: number, mousePosition) => {
        this.y -= this.speed * delta;

        if (!this.launched)
            this.x = mousePosition.x
        this.checkConstraints()

    }
}

export default Player