/**
 * Mark the method as a event listener, it will push each method to the
 * eventListeners in instance of target class.
 * if the eventListeners is not existed in instance. will create empty one for instance
 *
 * @param {String} eventType event name
 */

export default function Listen(eventType) {
  return function listenDecorator(target, key, descriptor) {
    if (!target.eventListeners) {
      target.eventListenrs = []
    }
    target.eventListeners.push({ eventType, fn: key })
    return descriptor
  }
}
