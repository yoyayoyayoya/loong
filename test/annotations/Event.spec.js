import TodosModel from '../mock/TodosModel'
import {
  ADD_TODO,
  COMPLETE_TODO,
  UNDO_TODO,
  REMOVE_TODO
} from '../mock/TodoEvents'

describe('Annotation: Subscribe ', () => {
  describe('TestModel', () => {
    const expectedEvents = [ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO]
    it('should lisnter the 4 types of todo events', () => {
      const eventListeners = TodosModel.getEventListeners()

      expect(eventListeners.map(l => l.eventType)).toEqual(
        expect.arrayContaining(expectedEvents)
      )
    })
  })
})
