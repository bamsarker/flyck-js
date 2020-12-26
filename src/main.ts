import { GameApp } from "./app/App";
import { gameWidth, gameHeight } from "./config";
import { MenuBackground } from "./app/MenuBackground";

const menu = document.querySelector("#menu");
const endgame = document.querySelector("#endgame");
const inGame = document.querySelector("#in-game");

const versionEl = document.querySelector("#version");

versionEl.innerHTML = process.env.PACKAGE_VERSION;

let background = new MenuBackground(document.body, gameWidth, gameHeight);
let currentGame: GameApp;

const loadGame = () => {
  endgame.style.display = "none";
  menu.style.display = "none";
  inGame.style.display = "block";

  if (currentGame) {
    const prevApp = currentGame;
    setTimeout(() => prevApp.app.destroy(true), 1000);
  }
  currentGame = new GameApp(
    document.body,
    inGame.querySelector("#score"),
    gameWidth,
    gameHeight,
    loadGame
  );
  background.destroy();
};
menu.querySelector("#play").addEventListener("click", loadGame);
