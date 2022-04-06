import React from 'react'
import PropTypes from 'prop-types'

import { SelectionTool } from './common'

function SelectionToolSwatch(props) {
  let backgroundColor = ''
  if (props.selectionTool === SelectionTool.Available) {
    backgroundColor = 'green'
  } else if (props.selectionTool === SelectionTool.Maybe) {
    backgroundColor = 'NavajoWhite'
  } else {
    backgroundColor = 'IndianRed'
  }
  return (
    <div
      style={{
        flex: '0 0 auto',
        display: 'flex',
        width: props.size,
        height: props.size,
        backgroundColor: backgroundColor
      }}
    />
  )
}
SelectionToolSwatch.propTypes = {
  selectionTool: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}

function ToolSelector(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
      }}
      onClick={() => props.onClick()}>
      {props.bumpOut()}
      <SelectionToolSwatch
        selectionTool={props.toolSelector}
        size={props.swatchSize}
      />
      <p>{props.label}</p>
    </div>
  )
}
ToolSelector.propTypes = {
  toolSelector: PropTypes.number.isRequired,
  bumpOut: PropTypes.func.isRequired,
  swatchSize: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export class Controls extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionTool: SelectionTool.Available
    }
  }

  handleOptionChange(selectionTool) {
    this.setState({ selectionTool: selectionTool })
    this.props.selectionToolChange(selectionTool)
  }

  bumpOut(selectionTool, size) {
    if (selectionTool === this.state.selectionTool) {
      return <div style={{ width: size }} />
    }
    return <div />
  }

  render() {
    return (
      <div
        style={Object.assign({}, this.props.style, {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'white',
          margin: 10,
          border: 'solid'
        })}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            gap: 5,
            width: 250
          }}>
          <ToolSelector
            toolSelector={SelectionTool.Available}
            bumpOut={() => this.bumpOut(SelectionTool.Available, 10)}
            swatchSize={50}
            label={'Available'}
            onClick={() => this.handleOptionChange(SelectionTool.Available)}
          />
          <ToolSelector
            toolSelector={SelectionTool.Maybe}
            bumpOut={() => this.bumpOut(SelectionTool.Maybe, 10)}
            swatchSize={50}
            label={'Maybe available'}
            onClick={() => this.handleOptionChange(SelectionTool.Maybe)}
          />
          <ToolSelector
            toolSelector={SelectionTool.Unavailable}
            bumpOut={() => this.bumpOut(SelectionTool.Unavailable, 10)}
            swatchSize={50}
            label={'Unavailable'}
            onClick={() => this.handleOptionChange(SelectionTool.Unavailable)}
          />
        </div>
        <div style={{ height: 20 }} />
      </div>
    )
  }
}
Controls.propTypes = {
  selectionTool: PropTypes.number.isRequired,
  selectionToolChange: PropTypes.func.isRequired,
  style: PropTypes.object
}
