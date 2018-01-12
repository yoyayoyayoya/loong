/**
 * Annotation Subscribe:
 * Be able to subscribe event
 *
 * @param {String} eventType subscription event
 */

export default function Event(eventType) {
  return function eventDecorator(target, key, descriptor) {
    target.eventListeners.push({ eventType, fn: key })
    return descriptor
  }
}
