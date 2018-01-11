const isPromise = require('is-promise')

class Subscriber {
  constructor(eventType, handler) {
    this.name = eventType
    this.displayName = eventType
    this.listeners = !handler ? [] : [handler]
  }
  addListener(handler) {
    this.listeners.push(handler)
  }
  getListeners() {
    return this.listeners
  }
  publish(data) {
    for (let listener in this.listeners) {
      listener(data)
    }
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
    beforeSubscribe && (this.beforePublish = beforeSubscribe)
    afterSubscribe && (this.beforePublish = beforeSubscribe)
    beforePublish && (this.beforePublish = beforeSubscribe)
    afterPublish && (this.beforePublish = beforeSubscribe)
  }
  subscribe(eventType, handler) {
    this.beforeSubscribe(this, eventType, handler)
    let subscriber = this.subscribers[eventType]
    if (subscriber) {
      subscriber.addListener(handler)
    } else {
      subscriber = this.subscribers[eventType] = new Subscriber(
        eventType,
        handler
      )
    }
    this.afterSubscribe()
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
    for (let listener in listeners) {
      result = listener(data)
      if (isPromise(result)) {
        result.then(d => this.afterPublish(d))
      } else {
        this.afterPublish(result)
      }
    }
  }
  publishAsync(eventType, data, postProccer) {
    setTimeout(() => this.publish(eventType, data, postProccer), 0)
  }
}

const pubsub = new PubSub()
export default pubsub
