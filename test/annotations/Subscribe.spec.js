import Pubsub from '../../src/pubsub'
import TodoModel from '../mock/TodoModel'
import {
  ADD_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO
} from '../mock/TodoEvents'

describe('Annotation: Subscribe ', () => {
  describe('TestModel', () => {
    const subscribers = Pubsub.getSubscribers()
    const events = [ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO]
    it('should subscribe the 4 todo events', () => {
      const keys = Object.keys(subscribers)

      expect(keys).toHaveLength(4)
      expect(keys).toEqual(expect.arrayContaining(events))
    })
    it(`should make the add function to subscribe event ${ADD_TODO}`, () => {
      const subscribers = Pubsub.getSubscribers()
      const subscriber = subscribers[ADD_TODO]

      expect(subscriber).toBeDefined()
      expect(subscriber.getListeners().length).toBe(1)
      expect(TodoModel.add({ id: 1, text: '' }).todos).toHaveLength(1)
    })
  })
})
