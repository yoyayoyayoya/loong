import Pubsub from '../pubsub'

/**
 * Annotation Subscribe:
 * Be able to subscribe event
 *
 * @param {String} eventType subscription event
 */

export default function Subscribe(eventType) {
  return function subscribeDecorator(target, key, descriptor) {
    Pubsub.subscribe(eventType, descriptor)
    return descriptor
  }
}
