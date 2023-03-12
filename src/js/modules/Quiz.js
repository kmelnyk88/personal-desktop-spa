import AppWindow from './AppWIndow'
import Player from './Player.js'
import * as Fetch from './Fetch.js'
import * as PlayerInput from './PlayerInput.js'
import quizstyle from '../../css/quiz.css?inline'
import Timer from './QuizTimer.js'
import { saveTime, getTimings, timingToString } from './Storage.js'

export default class Quiz extends AppWindow {
  startURL = 'https://courselab.lnu.se/quiz/question/1'

  constructor (iconSrc) {
    super(iconSrc)
    this.changeAppWindowDimensions('350px', '350px')
    this.createStyle(quizstyle)
    this.shadowRoot.appendChild(this.createNode(this._quizMarkup()))
    this._selectShadowDOMElements()

    this.timer = new Timer()
    this._toggleWelcomeArea()

    this.playerNameInputField.addEventListener('click', e => e.stopPropagation())

    // event listener on the let's play button
    this.letsPlayBtn.addEventListener('click', async (event) => {
      event.preventDefault()
      event.stopPropagation()
      this._initQuizData()
      await this._tryCatch(async () => {
        await this._getnextQuestion()
      })
      this._toggleWelcomeArea()
      this._toggleQuestionArea()
    })

    // event listener on the next button
    this.nextBtn.addEventListener('click', async (event) => {
      // async
      event.preventDefault()
      event.stopPropagation()
      await this._tryCatch(async () => {
        // async
        const response = await this._postAnswer()
        if (!Object.prototype.hasOwnProperty.call(response, 'nextURL')) {
          saveTime(this.player.getNickName(), this.player.getTime())
          this._displayResults(
            `${this.player.getNickName()} won in ${this.player.getTime()} seconds 🧡`,
            getTimings()
          )
        } else {
          this.nextURL = response.nextURL
          await this._getnextQuestion()
        }
      })
    })

    // event listener in case of the timeout
    this.timerSpan.addEventListener('timeout', () => {
      this._displayResults('Timeout! You lost 👀', getTimings())
    })

    this.playAgainBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.playerNameInputField.value = ''
      this._toggleResultArea()
      this._toggleWelcomeArea()
    })
  }

  _selectShadowDOMElements () {
    this.welcomeBox = this.shadowRoot.querySelector('.welcome-box')
    this.playerNameInputField = this.shadowRoot.querySelector('#name')
    this.letsPlayBtn = this.shadowRoot.querySelector('.lets-play-btn')
    this.playerTimer = this.shadowRoot.querySelector('.player-timer')
    this.playerSpan = this.shadowRoot.querySelector('.player')
    this.timerSpan = this.shadowRoot.querySelector('.timer')
    this.questionBox = this.shadowRoot.querySelector('.question-box')
    this.question = this.shadowRoot.querySelector('.question')
    this.playerInput = this.shadowRoot.querySelector('.player-input')
    this.nextBtn = this.shadowRoot.querySelector('.next')
    this.result = this.shadowRoot.querySelector('.result')
    this.top5 = this.shadowRoot.querySelector('.top-timings')
    this.playAgainBtn = this.shadowRoot.querySelector('.play-again')
  }

  /**
   * Create new player, update starting url, etc.
   */
  _initQuizData () {
    this.player = new Player()
    this.nextURL = this.startURL
    this.player.setNickName(this.playerNameInputField.value)
    this.playerSpan.textContent = this.player.getNickName()
  }

  /**
   * Reveal welcome view by toggling class on the HTML element
   */
  _toggleWelcomeArea () {
    this.welcomeBox.classList.toggle('hidden')
  }

  /**
   * Reveal question view by toggling class on the HTML element
   */
  _toggleQuestionArea () {
    this.playerTimer.classList.toggle('hidden')
    this.questionBox.classList.toggle('flex')
    this.questionBox.classList.toggle('hidden')
  }

  /**
   * Reveal results view by toggling class on the HTML element
   */
  _toggleResultArea () {
    this.result.classList.toggle('flex')
    this.result.classList.toggle('hidden')
    this.top5.innerHTML = ''
  }

  /**
   * Get the question from the server and prepare input area
   */
  async _getnextQuestion () {
    const response = await Fetch.get(this.nextURL)
    this.question.innerText = `${response.question}`
    this.timer.startTimer(this.timerSpan)
    this.nextURL = response.nextURL
    PlayerInput.createInputArea(this.playerInput, response)
  }

  /**
   *
   * @returns {JSON} response from the server after posting the answer
   */
  async _postAnswer () {
    this.timer.stopTimer()
    this.player.updateTime(this.timer.getTiming(this.timerSpan))
    const answer = this._checkAnswer()
    const response = await Fetch.post(this.nextURL, {
      answer
    })
    return response
  }

  /**
   *
   * @returns {string} player's answer on the question
   */
  _checkAnswer () {
    const answer = PlayerInput.getAnswer(this.playerInput).trim()
    if (!answer) {
      throw new Error('400')
    }
    return answer
  }

  /**
   *
   * @param {string} resultMessage to display for the player (failure, win)
   * @param {Array} timings top 5 timings to display
   */
  _displayResults (resultMessage, timings) {
    this._toggleQuestionArea()
    this._toggleResultArea()
    this.result.querySelector('.result-header').textContent = resultMessage
    for (let i = 0; i < timings.length; i++) {
      const li = document.createElement('li')
      li.textContent = timingToString(timings[i])
      this.top5.appendChild(li)
    }
  }

  /**
   *
   * @param {*} callBack executes in the try catch block
   */
  async _tryCatch (callBack) {
    try {
      await callBack()
    } catch (error) {
      if (error.message.localeCompare('400') === 0) {
        this._displayResults('Wrong answer! You lost 👀', getTimings())
      } else {
        alert(`Something went wrong. Response code ${error.message}`)
      }
    }
  }

  /**
   *
   * @returns {string} HTMl markup of the whole quiz game
   */
  _quizMarkup () {
    return `
  <div class="centered">
  <header>
    <h1 class="quiz-title">amazing quiz game</h1>
    <div class="player-timer hidden">
        <span class="label">Player: </span>
        <span class="player">Default</span>
        <span class="label">Time left: </span>
        <span class="timer"></span>
    </div>
  </header>
  <div class="welcome-box hidden">
    <ul class="rules">
      <li>You have 10 seconds to answer each question</li>
      <li>You lose if you don't answer during 10 seconds</li>
      <li>You lose if your answer is not correct</li>
    </ul>
    <form class="nickname-form" autocomplete="off">
      <input type="text" id="name" name="name" placeholder="Please enter your name here" maxlength="15" />
    </form>
    <button class="lets-play-btn">Let's Play</button>
  </div>
  <form class="question-box hidden" autocomplete="off">
    <h3 class="question">Here comes the question</h3>
    <div class="player-input"></div>
    <button class="next">Next</button>
  </form>
  <div class="result hidden">
    <h4 class="result-header"></h4>
    <div>
      <h3>top 5 timings</h3>
      <ul class="top-timings"></ul>
    </div>
    <button class="play-again">Play Again</button>
  </div>
</div>
  `
  }
}

customElements.define('quiz-app', Quiz)
