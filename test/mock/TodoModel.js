import { Subscribe } from '../../src/index'
import { ADD_TODO, COMPLETE_TODO, UNDO_TODO, REMOVE_TODO } from './TodoEvents'

class TodoModel {
  constructor() {
    this.todos = []
  }
  @Subscribe(ADD_TODO)
  add(todo) {
    this.todos.push(todo)
    return this
  }

  @Subscribe(COMPLETE_TODO)
  complete(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo.isCompleted = true
    return this
  }

  @Subscribe(UNDO_TODO)
  undo(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    todo.isCompleted = false
    return this
  }

  @Subscribe(REMOVE_TODO)
  remove(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId)
    return this
  }
}

export default new TodoModel()
