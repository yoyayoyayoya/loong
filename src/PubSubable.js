const isPromise = require('is-promise')

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

export default class PubSubable {
  constructor() {
    this.subscribers = {}
  }
  // leave them to be implementes by sub class
  beforeSubscribe() {}
  afterSubscribe() {}
  beforePublish() {}
  afterPublish() {}

  subscribe(eventType, handler) {
    if (this.beforeSubscribe(this, eventType, handler) === false) {
      return null
    }
    let subscriber = this.subscribers[eventType]
    if (subscriber) {
      subscriber.addListener(handler)
    } else {
      subscriber = this.subscribers[eventType] = new Subscriber(
        eventType,
        handler
      )
    }
    this.afterSubscribe(this, eventType, handler)
    return subscriber
  }
  getSubscribers() {
    return this.subscribers
  }
  publish(eventType, data, callback = () => {}) {
    if (this.beforePublish(this, eventType, data) === false) {
      return callback(true, null)
    }
    const subscriber = this.subscribers[eventType]
    if (typeof subscriber === 'undefined') {
      throw new Error(
        `Could not find the related listener for event: ${eventType}`
      )
    }
    const listeners = subscriber.getListeners()
    let result = null
    for (let listener of listeners) {
      result = listener(data)
      if (isPromise(result)) {
        result.then(d => callback(false, this.afterPublish(d)))
      } else {
        callback(false, this.afterPublish(result))
      }
    }
  }
}
