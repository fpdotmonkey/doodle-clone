import React from 'react'
import PropTypes from 'prop-types'

import { mountComponents } from 'react-sinatra-ujs'

class CommentBox extends React.Component {
  handleClick() {
    console.log('this is:', this)
  }

  render() {
    console.log('rendering')
    return (
      <div className="commentBox" onClick={(e) => this.handleClick(e)}>
        Hello, {this.props.name}! I am a CommentBox.
      </div>
    )
  }
}
CommentBox.propTypes = {
  name: PropTypes.string
}

addEventListener(
  'load',
  function () {
    mountComponents({ CommentBox: CommentBox })
  },
  false
)
