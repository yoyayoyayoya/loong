import Model from '../../src/Model'
import Listen from '../../src/annotations/Listen'
import { ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO } from './TodoEvents'

class TodoModel extends Model {
  constructor() {
    super()
    this.todos = []
  }
  @Listen(ADD_TODO)
  add(todo) {
    this.todos.push(todo)
    return this
  }

  @Listen(COMPLETE_TODO)
  complete(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo && (todo.isCompleted = true)
    return this
  }

  @Listen(UNDO_TODO)
  undo(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo && (todo.isCompleted = false)
    return this
  }

  @Listen(REMOVE_TODO)
  remove(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId)
    return this
  }

  clean() {
    this.todos = []
  }
}

export default new TodoModel()
