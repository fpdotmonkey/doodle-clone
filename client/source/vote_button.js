import React from 'react'
import PropTypes from 'prop-types'

export function VoteButton(props) {
  return (
    <div
      style={Object.assign({}, props.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      })}>
      <div>
        <button onClick={() => props.onVote()}>
          <h1>Vote</h1>
        </button>
      </div>
    </div>
  )
}
VoteButton.propTypes = {
  onVote: PropTypes.func.isRequired,
  style: PropTypes.object
}
