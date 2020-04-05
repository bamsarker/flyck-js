import * as PIXI from "pixi.js";
import { Circle } from "./Circle";
import {
  gameWidth,
  circleRadius,
  powerUpMeterPosition,
  circleAlpha,
} from "../config";
import { spinForever } from "./animations";
import Cluster from "./Cluster";

const circlePositions = [
  { x: 0, y: -23 },
  { x: 21, y: -11 },
  { x: 21, y: 11 },
  { x: 0, y: 23 },
  { x: -21, y: 11 },
  { x: -21, y: -11 },
];

const grey = 0xaaaaaa;
const collectedGrey = 0xababab;

export class PowerUpMeter extends PIXI.Container {
  enableCallback: any;
  spinTween: any;
  cluster: Cluster;
  constructor(enableCallback: () => void) {
    super();
    this.x = powerUpMeterPosition.x;
    this.y = powerUpMeterPosition.y;
    this.enableCallback = enableCallback;

    this.addClickLayer();
    this.cluster = new Cluster({ x: 0, y: 0 });
    this.addChild(this.cluster);
  }

  quickPreCollect = () => {
    const nextCircle = this.cluster.circles.find((c) => c.color === grey);
    if (!nextCircle) return;
    nextCircle.color = collectedGrey;
  };

  nextPosition = () => {
    let nextCircle = this.cluster.circles.find(
      (c) => c.color === collectedGrey
    );
    if (!nextCircle)
      nextCircle = this.cluster.circles.find((c) => c.color === grey);
    return nextCircle.position;
  };

  public get full(): boolean {
    return (
      !this.cluster.circles.find((c) => c.color === collectedGrey) &&
      !this.cluster.circles.find((c) => c.color === grey)
    );
  }

  private addClickLayer = () => {
    const clickLayer = new Circle({
      x: 0,
      y: 0,
      color: grey,
      radius: circleRadius,
    });
    clickLayer.alpha = 0;
    this.addChild(clickLayer);
  };

  collect = (color: number) => {
    const nextCircle = this.cluster.circles.find((c) => c.color === grey);
    if (!nextCircle) return;
    nextCircle.color = color;
    nextCircle.redraw();
    nextCircle.appear();
    if (
      this.cluster.circles.indexOf(nextCircle) ===
      this.cluster.circles.length - 1
    ) {
      this.activateButton();
    }
  };

  private activateButton = () => {
    this.spinTween = spinForever(this);
    this.interactive = true;
    this.buttonMode = true;
    this.on("pointerup", this.enablePowerUp);
  };

  private enablePowerUp = () => {
    this.enableCallback();
    this.spinTween.kill();
    this.rotation = 0;
  };

  reset = () => {
    this.cluster.circles.forEach((c, i) => {
      setTimeout(() => {
        c.color = grey;
        c.disappear()
          .then(() => c.redraw())
          .then(() => c.appear(circleAlpha));
      }, 150 * i);
    });
  };
}

export default PowerUpMeter;
