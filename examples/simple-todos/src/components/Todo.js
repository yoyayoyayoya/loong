import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withLoong } from 'react-loong'
import { events } from '../Models/Todos'

@withLoong()
export default class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false
    }
    this._enableEditing = this._enableEditing.bind(this)
    this._save = this._save.bind(this)
    this._remove = this._remove.bind(this)
  }
  _enableEditing() {
    this.setState({ isEditing: true })
  }
  _save(e) {
    if (e.keyCode === 13) {
      this.props.todo.text = this.value
      this.props.publish(events.UPDATE_TODO, this.props.todo)
    }
  }
  _remove() {
    this.props.publish(events.REMOVE_TODO, { id: this.props.todo.id })
  }
  render() {
    const { isEditing } = this.state
    const { text } = this.props
    let content = null
    if (isEditing) {
      content = (
        <li>
          <input
            value={text}
            onKeydown={this._save}
            ref={input => {
              this.value = input
            }}
          />
        </li>
      )
    } else {
      content = (
        <li onDoubleClick={this._enableEditing}>
          <span>{this.props.text}</span>
          <span>
            <button onClick={this.props._remove}>X</button>
          </span>
        </li>
      )
    }

    return content
  }
}

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  publish: PropTypes.func.isRequired
}
