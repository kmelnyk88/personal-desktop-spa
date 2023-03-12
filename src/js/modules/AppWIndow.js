import { initializeDragElement } from './DragDrop'
import windowstyle from '../../css/appwindow.css?inline'

/**
 * Base class for the application windows.
 * It has its own shadow root that is inherited by the classes that extend AppWindow.
 */
export default class AppWindow extends HTMLElement {
  constructor (iconSource) {
    super()
    this.attachShadow({ mode: 'open' })
    // appending css style to the current shadow DOM
    this.createStyle(windowstyle)
    this.classList.add('custom-app')
    this.shadowRoot.appendChild(this.createNode(this._windowBox(iconSource)))

    this.addEventListener('click', (e) => {
      e.stopPropagation()
      console.log('EVENT IN THE GLOBAL APPWINDOW', e)
      e.currentTarget.parentElement.appendChild(e.currentTarget)
    })

    // flags helpers to assist in the drag and drop priority when putting elements on top of each other
    // (alternative approach to the z-index)
    this.connected = false
    this.isRemoved = false
  }

  /**
   * Is executed by the browser on each addition to the DOM
   */
  connectedCallback () {
    this.customFocus()
    if (!this.initFlag) {
      this.draggable = true
      initializeDragElement(this)
      this.shadowRoot.querySelector('.close').addEventListener('click', this.closeWindow.bind(this))
      this.initFlag = true
    }
  }

  /**
   *
   * @param {*} e Event instance that is created when the close button is clicked
   */
  closeWindow (e) {
    if (e) {
      e.stopPropagation()
    }
    this.isRemoved = true
    this.remove()
  }

  customFocus () {
    // method is overriden by memory app
  }

  /**
   *
   * @param {*} node to be added to the window navigation if needed
   */
  addToHeader (node) {
    this.shadowRoot.querySelector('nav').insertBefore(node, this.shadowRoot.querySelector('.close'))
  }

  /**
   *
   * @param {*} markup to be converted into the node
   * @returns {Node} document fragment to be subsequently added to the DOM
   */
  createNode (markup) {
    const template = document.createElement('template')
    template.innerHTML = markup
    return template.content.cloneNode(true)
  }

  /**
   *
   * @param {*} windowstyle css rules to be added to the DOM as internal css
   */
  createStyle (windowstyle) {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(windowstyle))
    this.shadowRoot.appendChild(style)
  }

  /**
   *
   * @param {*} width in px
   * @param {*} height in px
   */
  changeAppWindowDimensions (width, height) {
    this.shadowRoot.host.style.width = width
    this.shadowRoot.host.style.height = height
  }

  /**
   *
   * @param {*} imgSrc path to the application icon
   * @returns {string} base HTML markup of every window inside PWD
   */
  _windowBox (imgSrc) {
    return `
      <nav> 
        <img class="logo" src=${imgSrc} alt="app icon">
        <img class="close" src="img/close.svg" alt="close button">
      </nav>
  `
  }
}

customElements.define('app-window', AppWindow)
