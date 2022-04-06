import React from 'react'
import PropTypes from 'prop-types'

export class Metadata extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventName: this.props.metadata.eventName
    }
  }

  handleMetadataChange(metadataKey, event) {
    this.props.metadataChange({ [metadataKey]: event.target.value })
  }

  render() {
    return (
      <div
        style={Object.assign({}, this.props.style, {
          borderBottom: 'solid',
          borderRight: 'solid'
        })}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            margin: 10
          }}>
          <h1>
            When should <br />
            <input
              onFocus={(event) => (event.target.style.color = 'black')}
              onBlur={(event) => this.handleMetadataChange('eventName', event)}
              type="text"
              placeholder={this.props.metadata.eventName}
              style={{
                color: this.props.metadata.default ? 'gray' : 'black',
                fontSize: 24,
                display: 'inline-block'
              }}
              size={9}
            />
            <br /> be held?
          </h1>
          <textarea
            onFocus={(event) => (event.target.style.color = 'black')}
            onBlur={(event) => this.handleMetadataChange('description', event)}
            type="text"
            placeholder={this.props.metadata.description}
            style={{ color: this.props.metadata.default ? 'gray' : 'black' }}
          />
          <input
            onFocus={(event) => (event.target.style.color = 'black')}
            onBlur={(event) => this.handleMetadataChange('location', event)}
            type="text"
            placeholder={this.props.metadata.location}
            style={{ color: this.props.metadata.default ? 'gray' : 'black' }}
          />
          <input
            onFocus={(event) => (event.target.style.color = 'black')}
            onBlur={(event) => this.handleMetadataChange('duration', event)}
            type="text"
            placeholder={this.props.metadata.duration}
            style={{ color: this.props.metadata.default ? 'gray' : 'black' }}
          />
        </div>
      </div>
    )
  }
}
Metadata.propTypes = {
  metadata: PropTypes.object.isRequired,
  metadataChange: PropTypes.func.isRequired,
  style: PropTypes.object
}
