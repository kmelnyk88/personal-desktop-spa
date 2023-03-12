import AppWindow from './AppWIndow'
import { getCachedMessages, saveChatMessage } from './Storage.js'
import chatstyle from '../../css/chat.css?inline'

/**
 * Class that represents state and behaviour of the chat application.
 */
export default class Chat extends AppWindow {
  isLightTheme = false
  isEditing = false
  isUsernameRegistered = false
  serverAddress = 'wss://courselab.lnu.se/message-app/socket'
  key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  emojis = {
    ':)': '😀',
    ':(': '🙁',
    '<3': '♥️',
    xD: '😂',
    ';)': '😉',
    ':p': '😜',
    ':\'(': '😭',
    ':*': '😘'
  }

  static {
    // Reset the flag used to block several
    // user registration dialogs from being opened at the same time
    localStorage.removeItem('chat-register-user-dialog')
  }

  constructor (iconSource) {
    super(iconSource)

    this.socket = new WebSocket(this.serverAddress)

    // will throw exception if there're connection problems
    this._checkSocket()

    this.socket.onclose = () => {
      console.log('%cCurrent socket is closed', 'color: yellow;')
    }

    // add chat.css rules to the current shadow DOM
    this.createStyle(chatstyle)

    // check if the user has been registered earlier and create chat area
    if (!localStorage.getItem('chat-username') && !localStorage.getItem('chat-register-user-dialog')) {
      console.log('-> user name input...')
      localStorage.setItem('chat-register-user-dialog', true)
      this.shadowRoot.appendChild(this.createNode(this._registerUserMarkup()))
      this.usernameField = this.shadowRoot.querySelector('.username')
      this.usernameField.addEventListener('click', (e) => e.stopPropagation())
      this.shadowRoot.querySelector('.submit').addEventListener('click', this._submitUsername.bind(this))
      this.isUsernameRegistered = true
    } else if (localStorage.getItem('chat-username')) {
      console.log('-> chat mode...')
      this._prepareChatArea()
      this.isUsernameRegistered = true
    } else {
      console.log('-> nothing (preventing another user name input dialog)...')
    }
  }

  /**
   * Closes the socket when current chat is permanently removed from the DOM
   */
  disconnectedCallback () {
    if (this.isRemoved) {
      console.log('%cClosing socket in the disconnected callback', 'color: yellow;')
      this.socket.close(1000, 'Regular socket shutdown')
      localStorage.removeItem('chat-register-user-dialog')
    }
  }

  /**
   *
   * @param {Event} e event instance created when pressing on submit username button
   */
  _submitUsername (e) {
    e.preventDefault()
    e.stopPropagation()
    const username = this.usernameField.value.trim()
    if (!username) {
      alert('Invalid username. Please try again.')
      this.usernameField.value = ''
    } else {
      this.shadowRoot.removeChild(this.shadowRoot.querySelector('form'))
      localStorage.setItem('chat-username', username)
      localStorage.removeItem('chat-register-user-dialog')
      this._prepareChatArea()
    }
  }

  /**
   * Creates basic structure of the chat area
   */
  _prepareChatArea () {
    const chatContent = this.createNode(this._chatAreaMarkup())

    // prepare text area for the user input
    this.input = chatContent.querySelector('.user-input')
    this._prepareTextAreaForInput()

    // prepare the display of the chat messages
    this.output = chatContent.querySelector('.chat-messages')
    getCachedMessages().forEach(element => {
      this.output.appendChild(this.createNode(this._chatMessageMarkup(JSON.parse(element), '')))
    })
    this._socketOnMessage()

    // add chat area to the shadow DOM
    this.shadowRoot.appendChild(chatContent)

    // enable editing of the username
    this.addToHeader(this.createNode(this._editUsernameMarkup()))
    this.editUsernameDiv = this.shadowRoot.querySelector('.edit-username')
    this.editUsernameInput = this.editUsernameDiv.querySelector('.edit-username-input')
    this.shadowRoot.querySelector('.edit-btn').addEventListener('click', this._editUsername.bind(this))
    this.editUsernameInput.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })

    // enable toggle between light and dark mode
    this.addToHeader(this.createNode(this._toggleThemeMarkup()))
    this.shadowRoot.querySelector('.toggle-btn').addEventListener('click', this._changeTheme.bind(this))
  }

  /**
   * Add event listeners to the user input text area
   */
  _prepareTextAreaForInput () {
    this.input.addEventListener('input', (e) => {
      e.stopPropagation()
      for (const i in this.emojis) {
        const temp = e.target.value
        e.target.value = temp.replaceAll(i, this.emojis[i])
      }
    })

    this.input.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        this._sendMessage()
      }
    })
  }

  /**
   * Callback function when clicking on the edit username button.
   * Clicking the edit button reveals the input field where it is possible to edit username.
   *
   * @param {Event} e event instance that is created when interacting with edit username button
   */
  _editUsername (e) {
    e.preventDefault()
    e.stopPropagation()
    const username = localStorage.getItem('chat-username')

    this.isEditing = !this.isEditing
    if (this.isEditing) {
      e.target.innerHTML = `
      ☑️`
      this.editUsernameInput.value = username
      this.editUsernameInput.focus()
      this.editUsernameInput.classList.add('editing')
    } else {
      e.target.innerHTML = `
      ✏️`
      const newUsername = this.editUsernameInput.value.trim()
      if (newUsername) {
        localStorage.setItem('chat-username', newUsername)
      } else {
        alert('New username is invalid.')
      }
      this.editUsernameInput.classList.remove('editing')
      this.editUsernameDiv.style.border = 'none'
    }
  }

  /**
   * Callback function when toggling between dark and light modes
   *
   * @param {Event} e event instance created when interacting with toggle theme button
   */
  _changeTheme (e) {
    e.preventDefault()
    e.stopPropagation()
    this.isLightTheme = !this.isLightTheme

    if (this.isLightTheme) {
      e.currentTarget.classList.add('active')
      this.shadowRoot.host.classList.add('light')
      this.output.querySelectorAll('li').forEach(li => {
        li.classList.add('light')
        li.querySelector('.timestamp').classList.add('light')
      })
    } else {
      e.currentTarget.classList.remove('active')
      this.shadowRoot.host.classList.remove('light')
      this.output.querySelectorAll('li').forEach(li => {
        li.classList.remove('light')
        li.querySelector('.timestamp').classList.remove('light')
      })
    }
  }

  /**
   * Get incoming message, save it to the local storage and render in the chat area
   */
  _socketOnMessage () {
    this.socket.onmessage = (e) => {
      const parsed = JSON.parse(e.data)

      if (parsed.type === 'heartbeat') {
        console.log(`%c${parsed.username} sends ${parsed.type}`, 'color: green;')
      } else {
        parsed.date = new Date().toLocaleString()
        if (parsed.type !== 'notification') saveChatMessage(JSON.stringify(parsed))
        const liClass = this.isLightTheme ? 'light' : ''
        this.output.appendChild(this.createNode(this._chatMessageMarkup(parsed, liClass)))
        this.output.scrollTop = this.output.scrollHeight
      }
    }
  }

  /**
   * Check if socket is not null or undefined and its state is ready
   */
  _checkSocket () {
    if (!this.socket || this.socket.readyState === 3) {
      throw new Error(`Failed to connect to  ${this.serverAddress}`)
    }
  }

  /**
   * Message is sent to the chat via socket connection
   */
  _sendMessage () {
    this._checkSocket()

    const messageText = this.input.value.trim()

    if (messageText) {
      const json =
      {
        type: 'message',
        data: messageText,
        username: localStorage.getItem('chat-username'),
        channel: 'my, not so secret, channel',
        key: this.key
      }
      this.socket.send(JSON.stringify(json))
    }
    this.input.value = ''
  }

  /**
   *
   * @returns {string} HTML markup for the toggle button
   */
  _toggleThemeMarkup () {
    return `
    <div class="toggle-btn">
      <div class="circle"></div>
    </div>
    `
  }

  /**
   *
   * @returns {string} HTML markup for the edit username functionality
   */
  _editUsernameMarkup () {
    return `
    <div class="edit-username">
        <input type="text" class="edit-username-input" maxlength="15">
        <button class="edit-btn">
          ✏️
        </button>
      </div>
    `
  }

  /**
   *
   * @returns {string} html markup for the whole chat area
   */
  _chatAreaMarkup () {
    return `
    <ul class="chat-messages"></ul>
    <textarea rows="2" class="user-input"></textarea>
    `
  }

  /**
   *
   * @param {object} parsed object that contains all the chat message data
   * @param {string} lightClass  indicates if current message should be rendered in the light mode
   * @returns {string} HTML markup of the chat message
   */
  _chatMessageMarkup (parsed, lightClass) {
    return `
    <li class=${lightClass}>
      <div class="message-header">
        <h4>${parsed.username}</h4>
        <p class="timestamp ${lightClass}">${parsed.date}</p>
      </div>
      <span>${parsed.data}</span>
    </li>
    `
  }

  /**
   *
   * @returns {string} html markup for the register user view
   */
  _registerUserMarkup () {
    return `  
    <form class="register-user">
      <input type="text" class="username" placeholder="Enter your username" maxlength="15"><br>
      <input type="submit" class="submit" value="Submit">
    </form> 
    `
  }
}

customElements.define('chat-app', Chat)
