import { GameApp } from './app/App'
import { gameWidth, gameHeight } from './config'

const menu = document.querySelector('#menu')
const endgame = document.querySelector('#endgame')
const inGame = document.querySelector('#in-game')
const loadGame = () => {
  endgame.style.display = 'none'
  menu.style.display = 'none'
  inGame.style.display = 'block'
  const myGame = new GameApp(document.body, gameWidth, gameHeight, loadGame)
}
menu.querySelector('#play').addEventListener('click', loadGame)
