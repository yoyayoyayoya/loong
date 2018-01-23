import React from 'react'
import PropTypes from 'prop-types'
import Header from '../components/Header'
import MainSection from '../components/MainSection'
import { withLoong } from 'react-loong'
import * as events from '../Models/Todos'

const creatActions = publish => {
  return {
    addTodo: text => publish(events.ADD_TODO, { text }),
    deleteTodo: id => publish(events.DELETE_TODO, { id }),
    editTodo: (id, text) => publish(events.EDIT_TODO, { id, text }),
    completeTodo: id => publish(events.COMPLETE_TODO, { id }),
    completeAll: () => publish(events.COMPLETE_ALL),
    clearCompleted: () => publish(events.CLEAR_COMPLETED)
  }
}
@withLoong([events.TODOS_CHANGE, events.CLEAR_COMPLETED])
export default class App extends React.Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    publish: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    const { publish } = props
    this.actions = creatActions(publish)
  }
  render() {
    return (
      <div>
        <Header addTodo={this.actions.addTodo} />
        <MainSection todos={this.props.todos} actions={this.actions} />
      </div>
    )
  }
}
