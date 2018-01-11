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

class PubSub {
  constructor() {
    const emptyFn = () => {}
    this.subscribers = {}
    this.beforeSubscribe = emptyFn
    this.afterSubscribe = emptyFn
    this.beforePublish = emptyFn
    this.afterPublish = emptyFn
  }
  addHooks({ beforeSubscribe, afterSubscribe, beforePublish, afterPublish }) {
    beforeSubscribe && (this.beforeSubscribe = beforeSubscribe)
    afterSubscribe && (this.afterSubscribe = afterSubscribe)
    beforePublish && (this.beforePublish = beforePublish)
    afterPublish && (this.afterPublish = afterPublish)
  }
  removeHooks() {
    const emptyFn = () => {}
    this.beforeSubscribe = emptyFn
    this.afterSubscribe = emptyFn
    this.beforePublish = emptyFn
    this.afterPublish = emptyFn
  }
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
  publish(eventType, data) {
    this.beforePublish(this, eventType, data)
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
        result.then(d => this.afterPublish(d))
      } else {
        this.afterPublish(result)
      }
    }
  }
}

const pubsub = new PubSub()
export default pubsub
