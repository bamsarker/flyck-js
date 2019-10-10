import * as PIXI from 'pixi.js';
import { Circle } from './circle';
import { randomYPos, randomXPos, randomCircleColor, topLimit, bottomLimit, circleRadius, gameWidth, backgroundColor, baseCircleSpeed, circleSpeedModifier, lineColor, lineHeight, randomPlayerColor } from '../config'
import Player from './player';

export class GameApp {

    private app: PIXI.Application;
    circles: Circle[];
    circlesCreated: number;
    player: Player;

    constructor(parent: HTMLElement, width: number, height: number) {

        this.app = new PIXI.Application({ width, height, backgroundColor: backgroundColor });
        parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

        this.circles = []
        this.circlesCreated = 0

        // init Pixi loader
        let loader = new PIXI.Loader();

        // Load assets
        loader.load(this.onAssetsLoaded);
    }

    private addCircle = () => {
        const newCircle = new Circle({
            speed: baseCircleSpeed + (this.circlesCreated / circleSpeedModifier),
            y: randomYPos(),
            x: randomXPos(),
            color: randomCircleColor()
        })
        this.circles.push(
            newCircle
        )
        this.circlesCreated++
        this.app.stage.addChild(newCircle)
    }

    addLines = () => {
        const topLine = new PIXI.Graphics()
        topLine.beginFill(lineColor)
        topLine.drawRect(0, topLimit - circleRadius, gameWidth, lineHeight)
        this.app.stage.addChild(topLine)
        const bottomLine = new PIXI.Graphics()
        bottomLine.beginFill(lineColor)
        bottomLine.drawRect(0, bottomLimit + circleRadius, gameWidth, lineHeight)
        this.app.stage.addChild(bottomLine)
    }

    addPlayer = () => {
        const player = new Player({
            speed: 0,
            color: randomPlayerColor(this.circles, this.circlesCreated)
        })
        this.player = player
        this.app.stage.addChild(this.player)
    }

    private onAssetsLoaded = () => {

        this.addLines()

        this.addCircle();
        this.addPlayer()
        this.app.ticker.add((delta: number) => {
            this.circles.forEach(c => c.update(delta));
            this.player.update(delta, this.app.renderer.plugins.interaction.mouse.global)
        });

        // setInterval(() => this.addCircle(), 100)
    }

}
