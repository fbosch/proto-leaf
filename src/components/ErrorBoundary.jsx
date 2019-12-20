import { Component } from 'react'

export default class ErrorBoundary extends Component {
  componentDidCatch (error, info) {
    this.setState({ error })
  }

  render () {
    const { error } = this.state || {}
    if (error) {
      return error.message
    }
    return this.props.children
  }
}
