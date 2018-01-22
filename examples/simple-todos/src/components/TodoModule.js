import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { withLoong } from 'react-loong'
// import { events } from '../Models/Todos'
import Todos from './Todos'
import TextInput from './TextInput'

export default class TodoModule extends Component {
  render() {
    return (
      <div>
        <TextInput placeholder="type the todo description" />
        <Todos />
      </div>
    )
  }
}
