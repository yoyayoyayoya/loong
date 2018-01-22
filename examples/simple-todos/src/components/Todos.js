import React, { Component } from 'react'
import { withLoong } from 'react-loong'
import PropTypes from 'prop-types'
import Todo from './Todo'
import { events as todosEvents } from '../Models/Todos'

@withLoong([todosEvents.TODOS_CHANGE])
export default class Todos extends Component {
  _removeTodo() {}
  render() {
    return (
      <ul>
        {this.props.todos.map(todo => (
          <Todo key={todo.id} todo={todo} remove={this._removeTodo} />
        ))}
      </ul>
    )
  }
}

Todos.propTypes = {
  todos: PropTypes.array.isRequired
}
