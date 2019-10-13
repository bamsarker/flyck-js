import { GameApp } from './app/App'
import { gameWidth, gameHeight } from './config'

const menu = document.querySelector('#menu')
const inGame = document.querySelector('#in-game')
menu.querySelector('#play').addEventListener('click', () => {
  menu.style.display = 'none'
  inGame.style.display = 'block'
  const myGame = new GameApp(document.body, gameWidth, gameHeight)
})
