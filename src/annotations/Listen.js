/**
 * Annotation Subscribe:
 * Catching the event published by instance of PubSubable class and be marked as
 * one event listener
 *
 * @param {String} eventType subscription event
 */

export default function Listen(eventType) {
  return function listenDecorator(target, key, descriptor) {
    target.eventListeners.push({ eventType, fn: key })
    return descriptor
  }
}
