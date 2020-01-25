import * as PIXI from "pixi.js";
import { Obstacle } from "./Obstacle";
import {
  randomYPos,
  randomXPos,
  randomCircleColor,
  topLimit,
  bottomLimit,
  circleRadius,
  gameWidth,
  backgroundColor,
  obstacleSpeedModifier,
  baseObstacleSpeed,
  lineColor,
  lineHeight,
  randomPlayerColor
} from "../config";
import Player from "./Player";
import PowerUpMeter from "./PowerUpMeter";
import CollectionParticle from "./CollectionParticle";
import score from "../score";

export class GameApp {
  app: PIXI.Application;
  scoreElement: HTMLElement;
  obstacles: Obstacle[];
  obstaclesCreated: number;
  player: Player;
  score: number;
  powerUpMeter: PowerUpMeter;
  replay: () => void;

  constructor(
    parent: HTMLElement,
    scoreElement: HTMLElement,
    width: number,
    height: number,
    replay: () => void
  ) {
    this.replay = replay;
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: backgroundColor,
      antialias: true
    });
    parent.append(this.app.view); // Hack for parcel HMR

    this.obstacles = [];
    this.obstaclesCreated = 0;

    this.score = 0;
    this.scoreElement = scoreElement;
    this.scoreElement.innerText = `SCORE: ${this.score}`;

    // init Pixi loader
    let loader = new PIXI.Loader();

    // Load assets
    loader.load(this.onAssetsLoaded);
  }

  private addObstacle = () => {
    const newCircle = new Obstacle({
      speed: baseObstacleSpeed + this.obstaclesCreated / obstacleSpeedModifier,
      y: randomYPos(),
      x: randomXPos(),
      color: randomCircleColor()
    });
    this.obstacles.push(newCircle);
    this.obstaclesCreated++;
    this.app.stage.addChild(newCircle);
  };

  private addLine = (y: number) => {
    const line = new PIXI.Graphics();
    line.beginFill(lineColor);
    line.drawRect(0, y, gameWidth, lineHeight);
    this.app.stage.addChild(line);
  };

  private addLines = () => {
    this.addLine(topLimit - circleRadius);
    this.addLine(bottomLimit + circleRadius);
  };

  private increaseScore = () => {
    this.score++;
    this.scoreElement.innerText = `SCORE: ${this.score}`;
  };

  private addPlayer = () => {
    const player = new Player({
      speed: 0,
      color: randomPlayerColor(this.obstacles, this.obstaclesCreated),
      increaseScore: this.increaseScore,
      crossedCallback: this.addObstacle,
      newColor: () => randomPlayerColor(this.obstacles, this.obstaclesCreated)
    });
    this.player = player;
    this.app.stage.addChild(this.player);
  };

  private spawnParticle = (obstacle: Obstacle) => {
    const particle = new CollectionParticle({
      x: obstacle.x,
      y: obstacle.y,
      color: obstacle.color
    });
    this.app.stage.addChild(particle);
    return particle
      .moveToPowerUpMeter(this.powerUpMeter.nextPosition())
      .then(() => particle.destroy());
  };

  private collectObstacle = (obstacle: Obstacle) => {
    obstacle.speed = 0;
    obstacle.collected = true;
    if (!this.player.poweredUp) {
      this.spawnParticle(obstacle).then(() =>
        this.powerUpMeter.collect(obstacle.color)
      );
    }
    obstacle
      .disappear()
      .then(
        () => (this.obstacles = this.obstacles.filter(o => o !== obstacle))
      );
  };

  private showEndGameUI = (score: number, newHighScore: boolean) => {
    document.querySelector(
      ".buttons>.message>span"
    ).innerHTML = score.toString();
    const message = newHighScore ? "New high score!" : "You scored";
    document.querySelector(".buttons>.message>div").innerHTML = message;
    document.getElementById("endgame").style.display = "block";
    document
      .getElementById("play-again")
      .addEventListener("click", this.replay);
  };

  private gameOver = () => {
    if (this.player.dead) return;
    this.player.die();
    this.showEndGameUI(this.score, score.checkHighScore(this.score));
  };

  private obstacleCollisionCheck = () => {
    this.obstacles
      .filter(o => !o.collected)
      .forEach(obstacle => {
        const distance = Math.hypot(
          obstacle.x - this.player.x,
          obstacle.y - this.player.y
        );
        const beNice =
          this.player.poweredUp || obstacle.color === this.player.color;
        const niceBuffer = beNice ? 3 : -3;
        if (distance < circleRadius * 2 + niceBuffer) {
          if (beNice) this.collectObstacle(obstacle);
          else this.gameOver();
        }
      });
  };

  private addPowerUpMeter = () => {
    this.powerUpMeter = new PowerUpMeter(this.powerUpEnabled);
    this.app.stage.addChild(this.powerUpMeter);
  };

  private powerUpEnabled = () => {
    this.player.enablePowerUp(this.powerUpMeter.reset);
  };

  private onAssetsLoaded = () => {
    this.addPowerUpMeter();
    this.addLines();

    this.addObstacle();
    this.addPlayer();
    this.app.ticker.add(this.update);
  };

  private update = (delta: number) => {
    this.obstacles.forEach(c => c.update(delta));
    this.player.update(delta);
    this.obstacleCollisionCheck();
  };
}
