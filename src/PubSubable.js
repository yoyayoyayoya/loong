import PluginExecutable from './PluginExecutable'

class Subscriber {
  constructor(eventType, handler) {
    this.subscribeTotype = eventType
    this.name = `${eventType}:Subscriber`
    this.listeners = [handler]
  }
  addListener(handler) {
    this.listeners.push(handler)
  }
  getListeners() {
    return this.listeners
  }
  unsubscribe(handler) {
    this.listeners = this.listeners.filter(listener => listener !== handler)
  }
  unsubscribeAll() {
    this.listeners = []
  }
}

export default class PubSubable extends PluginExecutable {
  constructor({ plugins = [] } = {}) {
    super(plugins)
    this.subscribers = {}
  }

  subscribe(eventType, handler) {
    let subscriber = this.subscribers[eventType]
    if (subscriber) {
      subscriber.addListener(handler)
    } else {
      subscriber = this.subscribers[eventType] = new Subscriber(
        eventType,
        handler
      )
    }
    return subscriber
  }
  getSubscribers() {
    return this.subscribers
  }
  /**
   * Publish the data to the listeners of eventType subscriber
   *
   * @param {String} eventType
   * @param {Object} data
   */
  publish(eventType, data) {
    const subscriber = this.subscribers[eventType]
    if (typeof subscriber === 'undefined') {
      return
    }
    const listeners = subscriber.getListeners()

    for (let listener of listeners) {
      listener(data)
    }
  }
}
