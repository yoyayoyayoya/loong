import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withLoong } from 'react-loong'
import { events } from '../Models/Todos'

@withLoong()
export default class TextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
    this._handleChange = this._handleChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }
  _handleChange(e) {
    this.setState({ text: e.target.value })
  }
  _handleSubmit(e) {
    if (e.keyCode === 13) {
      this.props.publish(events.ADD_TODO, { text: e.target.value })
    }
  }
  render() {
    return (
      <section>
        <input
          type="text"
          placeholder={this.props.placeholder}
          autoFocus="true"
          value={this.state.text}
          onChange={this._handleChange}
          onKeyDown={this._handleSubmit}
        />
      </section>
    )
  }
}

TextInput.propTypes = {
  placeholder: PropTypes.string.isRequired
}
