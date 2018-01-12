import Model from '../../src/Model'
import Event from '../../src/annotations/Event'
import { ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO } from './TodoEvents'

class TodoModel extends Model {
  constructor() {
    super()
    this.todos = []
  }
  @Event(ADD_TODO)
  add(todo) {
    this.todos.push(todo)
    return this
  }

  @Event(COMPLETE_TODO)
  complete(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo && (todo.isCompleted = true)
    return this
  }

  @Event(UNDO_TODO)
  undo(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo && (todo.isCompleted = false)
    return this
  }

  @Event(REMOVE_TODO)
  remove(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId)
    return this
  }

  clean() {
    this.todos = []
  }
}

export default new TodoModel()
