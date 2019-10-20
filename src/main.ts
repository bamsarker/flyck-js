import { GameApp } from './app/App'
import { gameWidth, gameHeight } from './config'
import { MenuBackground } from './app/MenuBackground'

const menu = document.querySelector('#menu')
const endgame = document.querySelector('#endgame')
const inGame = document.querySelector('#in-game')

let background = new MenuBackground(document.body, gameWidth, gameHeight)

const loadGame = () => {
  endgame.style.display = 'none'
  menu.style.display = 'none'
  inGame.style.display = 'block'
  const myGame = new GameApp(
    document.body,
    inGame.querySelector('#score'),
    gameWidth,
    gameHeight,
    loadGame
  )
  background.destroy()
}
menu.querySelector('#play').addEventListener('click', loadGame)
