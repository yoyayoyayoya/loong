export default class Model {
  getEventListeners() {
    for (let listener of this.eventListeners) {
      if (this[listener.fn]) {
        listener.fn = this[listener.fn].bind(this)
      }
    }
    return this.eventListeners
  }
}

Object.defineProperty(Model.prototype, 'eventListeners', {
  value: [],
  enumerable: false,
  configurable: true,
  writable: true
})
