import * as PIXI from 'pixi.js';
import { circleRadius } from '../config';

const randomDirection = () => ([-1, 1])[Math.floor(Math.random() * 2)]

export class Circle extends PIXI.Graphics {
    direction: number;
    speed: number;
    color: any;
    constructor({ speed, y, x, color }) {
        super()
        this.color = color;
        this.beginFill(this.color);
        this.drawCircle(0, 0, circleRadius);
        this.x = x;
        this.y = y;
        this.direction = randomDirection();
        this.speed = speed;
    }

    private checkConstraints = () => {
        if (this.x > 500 - (this.width / 2)) {
            this.direction = -1;
        } else if (this.x < 0 + (this.width / 2)) {
            this.direction = 1;
        }
    }

    update = (delta: number) => {
        this.x += this.speed * this.direction * delta;
        this.checkConstraints()
    }
}

export default Circle