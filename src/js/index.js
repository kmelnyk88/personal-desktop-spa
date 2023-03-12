import { initializeDropArea } from './modules/DragDrop.js'
import Chat from './modules/Chat.js'
import Memory from './modules/Memory.js'
import Quiz from './modules/Quiz.js'
import { loadCachedMessages } from './modules/Storage.js'

/**
 * Selected DOM elements
 */
const mainWindow = document.querySelector('.main-window')
const chatBtn = document.querySelector('.chat-btn')
const memoBtn = document.querySelector('.memo-btn')
const quizBtn = document.querySelector('.quiz-btn')

/**
 * Initializing functions
 */

// localStorage.clear()
loadCachedMessages()
initializeDropArea(mainWindow)

/**
 * Event listeners
 */

// window handles all the erros
window.onerror = (event, source, lineno, colno, error) => {
  console.error(`${error} at ${source} ${lineno}`)
  alert(`Error message: ${error.message}`)
  return true
}

// event listener to launch chat app
chatBtn.addEventListener('click', () => {
  const chat = new Chat(chatBtn.querySelector('img').src)

  if (chat.isUsernameRegistered) {
    mainWindow.appendChild(chat)
  }
})

// event listener to launch memory app
memoBtn.addEventListener('click', () => {
  const memory = new Memory(memoBtn.querySelector('img').src)
  mainWindow.appendChild(memory)
})

// event listener to launch quiz app
quizBtn.addEventListener('click', () => {
  const quiz = new Quiz(quizBtn.querySelector('img').src)
  mainWindow.appendChild(quiz)
})
