import AppWindow from './AppWIndow'
import memorystyle from '../../css/memory.css?inline'

const MEMORYATTR = {
  TWOTWO: '2 x 2',
  TWOFOUR: '2 x 4',
  FOURFOUR: '4 x 4'
}

/**
 * Class that encapsulates state and behaviour of the Memory Game
 */
export default class Memory extends AppWindow {
  state = {
    first: null,
    second: null,
    flipped: false,
    block: false,
    flipCallBack: null,
    flippedCards: 0,
    attempts: 0,
    boardRows: 0,
    boardCols: 0,
    cards: null,
    timer: null,
    seconds: 0
  }

  constructor (iconSource) {
    super(iconSource)
    this.createStyle(memorystyle)
    this.addToHeader(this.createNode(this._timerMarkup()))

    this.addEventListener('keydown', (e) => {
      console.log('Focusing and highlighting first active card')
      e.stopPropagation()
      if (this.state.cards) {
        for (const card of this.state.cards) {
          if (!card.classList.contains('out-of-game')) {
            card.focus()
            return
          }
        }
      }
    })
    this._startNewGame()
  }

  /**
   * Called by the browser when the current element (this) is removed from DOM.
   */
  disconnectedCallback () {
    if (this.state.cards) {
      this.state.cards.forEach(card => card.blur())
    }
    if (this.isRemoved) {
      clearInterval(this.state.timer)
    }
  }

  /**
   * Creates the game structure, appends HTML markups to the DOM.
   * Registers even listeners.
   */
  _startNewGame () {
    this.changeAppWindowDimensions('250px', '250px')
    this.shadowRoot.querySelector('.timer').innerHTML = '00:00:00'
    this.shadowRoot.appendChild(this.createNode(this._chooseBoardMarkup()))

    this.shadowRoot.querySelectorAll('.btn-board-dimension').forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation()

      this.shadowRoot.removeChild(this.shadowRoot.querySelector('.board-dimension'))

      this.state.timer = setInterval(() => this._countTime(), 1000)

      this.shadowRoot.appendChild(this.createNode(this._gameAreaMarkup()))
      this.board = this.shadowRoot.querySelector('.memory-game')

      this._createBoard(e.target.textContent)

      this.state.flipCallBack = this._turnCard.bind(this)
      this.state.cards = this.shadowRoot.querySelectorAll('.memory-card')
      this.state.cards.forEach(card => card.addEventListener('click', this.state.flipCallBack))
      this.state.cards.forEach(card => card.addEventListener('keydown', this._keyDownCallBack.bind(this)))
      this.customFocus()
    }))
  }

  /**
   * Counts the number of seconds during 1 game.
   * Displays seconds as hours, minutes, seconds.
   */
  _countTime () {
    ++this.state.seconds
    let h = Math.floor(this.state.seconds / 3600)
    let min = Math.floor((this.state.seconds - h * 3600) / 60)
    let sec = this.state.seconds - (h * 3600 + min * 60)
    if (h < 10) { h = `0${h}` }
    if (min < 10) { min = `0${min}` }
    if (sec < 10) { sec = `0${sec}` }
    this.shadowRoot.querySelector('.timer').innerHTML = `${h}:${min}:${sec}`
  }

  /**
   * If there's a card above - blur currently focused card and focus card above
   *
   * @param {HTMLElement} card that is currently focused
   */
  _checkAndFocusCardAbove (card) {
    const x = +card.dataset.x
    const y = +card.dataset.y
    if (y > 0) {
      card.blur()
      this.state.cards[(y - 1) * this.state.boardCols + x].focus()
    }
  }

  /**
   * If there's a card below - blur currently focused card and focus card below
   *
   * @param {HTMLElement} card that is currently focused
   */
  _checkAndFocusCardBelow (card) {
    const x = +card.dataset.x
    const y = +card.dataset.y

    if (y < this.state.boardRows - 1) {
      card.blur()
      this.state.cards[(y + 1) * this.state.boardCols + x].focus()
    }
  }

  /**
   * If there's a card to the left - blur currently focused card and focus card to the left
   *
   * @param {HTMLElement} card that is currently focused
   */
  _checkAndFocusCardLeft (card) {
    const x = +card.dataset.x
    const y = +card.dataset.y

    if (x > 0) {
      card.blur()
      this.state.cards[y * this.state.boardCols + x - 1].focus()
    }
  }

  /**
   * If there's a card to the right - blur currently focused card and focus card to the right
   *
   * @param {HTMLElement} card that is currently focused
   */
  _checkAndFocusCardRight (card) {
    const x = +card.dataset.x
    const y = +card.dataset.y

    if (x < this.state.boardCols - 1) {
      card.blur()
      this.state.cards[y * this.state.boardCols + x + 1].focus()
    }
  }

  /**
   * Trigger that is processed in the eventlistener.
   * Dispatches event thus notifying current memory window that it needs to focus 1st card (to enable keyboard playing)
   */
  customFocus () {
    this.dispatchEvent(new KeyboardEvent('keydown'))
  }

  /**
   * Creates the board based on the number of cards.
   * More cards - larger the board.
   *
   * @param {*} dimensions enum
   */
  _createBoard (dimensions) {
    switch (dimensions) {
      case MEMORYATTR.TWOTWO:
        this._board(2, 2, '49%', '49%', '200px', '200px')
        break
      case MEMORYATTR.TWOFOUR:
        this._board(2, 4, '24%', '49%', '400px', '200px')
        break
      case MEMORYATTR.FOURFOUR:
        this._board(4, 4, '24%', '24%', '400px', '400px')
        break
    }
  }

  /**
   * Populates the board with the cards.
   * Each card is created as the node from the template and added to the DOM.
   *
   * @param {*} numRows number of rows in the board
   * @param {*} numCols number of columns in the board
   * @param {*} cardWidth relative card width
   * @param {*} cardHeight relative card height
   * @param {*} boardWidth to fit in all the cards
   * @param {*} boardHeight  to fit in all the cards
   */
  _board (numRows, numCols, cardWidth, cardHeight, boardWidth, boardHeight) {
    const cardsIds = this._shuffle(this._randomDistinctCards(numRows * numCols / 2))
    this.state.flippedCards = cardsIds.length
    this.state.boardRows = numRows
    this.state.boardCols = numCols

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const card = this.createNode(this._memoryCardMarkup(j, i, cardsIds[j + i * numCols], cardWidth, cardHeight))
        this.board.appendChild(card)
      }
    }
    this.changeAppWindowDimensions(boardWidth, boardHeight)
    this.board.style.width = 'inherit'
    this.board.style.height = 'inherit'
  }

  _keyDownCallBack (e) {
    e.stopPropagation()
    switch (e.key) {
      case 'ArrowUp':
        this._checkAndFocusCardAbove(e.target)
        break
      case 'ArrowDown':
        this._checkAndFocusCardBelow(e.target)
        break
      case 'ArrowLeft':
        this._checkAndFocusCardLeft(e.target)
        break
      case 'ArrowRight':
        this._checkAndFocusCardRight(e.target)
        break
      case 'Enter':
        if (!this.classList.contains('out-of-game')) {
          e.target.dispatchEvent(new Event('click'))
        }
        break
    }
  }

  /**
   * Callback function that is called when card is clicked in order to be flipped
   *
   * @param {*} e click event that triggers card flipping
   */
  _turnCard (e) {
    e.stopPropagation()
    const card = e.currentTarget
    if (this.state.block || card === this.state.first) return

    card.classList.toggle('turn')
    if (!this.state.flipped) {
      this.state.first = card
      this.state.flipped = true
    } else {
      this.state.attempts++
      this.state.second = card
      this.state.flipped = false
      this._checkMatch()
    }
  }

  /**
   * Checks if two cars have the same image - match.
   * If match - block the board, remove eventlisteners from cards, mark cards as out of game,
   * reset variables that kept the state of two flipped cards.
   * Else - no match - hide the fronts of the cards, reset variables that kep the state of two flipped cards
   */
  _checkMatch () {
    if (this.state.first.dataset.id === this.state.second.dataset.id) {
      this.state.block = true
      this.state.flippedCards -= 2
      this.state.first.removeEventListener('click', this.state.flipCallBack)
      this.state.second.removeEventListener('click', this.state.flipCallBack)
      setTimeout(() => {
        this.state.first.classList.toggle('out-of-game')
        this.state.second.classList.toggle('out-of-game')
        this._resetAfterCheckMatch()
        this._checkGameOver()
      }, 800)
    } else {
      this.state.block = true
      setTimeout(() => {
        this.state.first.classList.toggle('turn')
        this.state.second.classList.toggle('turn')
        this._resetAfterCheckMatch()
      }, 1500)
    }
  }

  /**
   * If there's no cards to flip, then game is over.
   * Clear timer, display the number of attempts and play again button.
   * Reset the inner state of the game.
   */
  _checkGameOver () {
    if (this.state.flippedCards === 0) {
      clearInterval(this.state.timer)
      this.shadowRoot.removeChild(this.board)
      this.changeAppWindowDimensions('250px', '250px')
      this.shadowRoot.appendChild(this.createNode(this._gameResultMarkup()))
      this.shadowRoot.querySelector('.play-again').addEventListener('click', (e) => {
        e.stopPropagation()
        this.shadowRoot.removeChild(this.shadowRoot.querySelector('.game-result'))
        this._globalReset()
        this._startNewGame()
      })
    }
  }

  _resetAfterCheckMatch () {
    this.state.flipped = false
    this.state.block = false
    this.state.first = null
    this.state.second = null
  }

  _globalReset () {
    this.state.flipped = false
    this.state.block = false
    this.state.first = null
    this.state.second = null
    this.state.flipCallBack = null
    this.state.cards = null
    this.state.timer = null
    this.state.flippedCards = 0
    this.state.attempts = 0
    this.state.boardCols = 0
    this.state.seconds = 0
  }

  /**
   *
   * @param {*} numberOfMemoryCards - the number of distinct random card ids to generate
   * @returns {Array} of card ids
   */
  _randomDistinctCards (numberOfMemoryCards) {
    const memoryCardsIds = new Set()
    while (memoryCardsIds.size < numberOfMemoryCards) {
      memoryCardsIds.add(Math.floor(Math.random() * 8))
    }
    const setToarray = Array.from(memoryCardsIds)
    const arrayOfCardsIds = [...setToarray, ...setToarray]
    return arrayOfCardsIds
  }

  /**
   *
   * @param {Array} arrayOfCardsIds - array of card ids
   * @returns {Array} - shuffled  array of card ids
   */
  _shuffle (arrayOfCardsIds) {
    arrayOfCardsIds.sort()
    const length = arrayOfCardsIds.length
    for (let i = 1; i < length; i++) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arrayOfCardsIds[i]
      arrayOfCardsIds[i] = arrayOfCardsIds[j]
      arrayOfCardsIds[j] = temp
    }
    return arrayOfCardsIds
  }

  /**
   *
   * @returns {string} HTML markup to choose the board dimensions
   */
  _chooseBoardMarkup () {
    return `
    <div class="board-dimension">
      <p>Board dimensions</p>
      <button class="btn-board-dimension">${MEMORYATTR.TWOTWO}</button>
      <button class="btn-board-dimension">${MEMORYATTR.TWOFOUR}</button>
      <button class="btn-board-dimension">${MEMORYATTR.FOURFOUR}</button>
    </div>
    `
  }

  /**
   *
   * @returns {string} HTML markup of displaying the timer
   */
  _timerMarkup () {
    return `
    <div class="timer">
      00:00:00
    </div>
    `
  }

  _gameAreaMarkup () {
    return `
    <div class="memory-game"></div>
    `
  }

  _memoryCardMarkup (x, y, cardId, width, height) {
    return `
    <style>
    .memory-card {
      width: calc(${width} - 14px);
      height: calc(${height} - 14px);
    }
    </style>

    <div class="memory-card" data-id="${cardId}" data-x="${x}" data-y="${y}" tabindex="0">
      <img class="front" src="img/memory/${cardId}.svg" alt="Memory Game Card Front">
      <img class="back" src="img/memory/back.svg" alt="Memory Game Card Back">
    </div>
    `
  }

  /**
   *
   * @returns {string} HTML markup of the game results
   */
  _gameResultMarkup () {
    return `
    <div class="game-result">
      <p>It took you ${this.state.attempts} attempts</p>
      <button class="play-again">Play again</button>
    </div>
    `
  }
}

customElements.define('memory-app', Memory)
