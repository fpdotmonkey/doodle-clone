import React from 'react'
import PropTypes from 'prop-types'

import { mountComponents } from 'react-sinatra-ujs'

import { VoteButton } from './vote_button'
import {
  DoodleMetadata,
  AvailableTimes,
  SelectionTool,
  VoteResult
} from './common'
import { Metadata } from './metadata'
import { Calendar } from './calendar'
import { Controls } from './controls'

class Doodle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionTool: SelectionTool.Available,
      metadata: new DoodleMetadata({}),
      data: new AvailableTimes([], [], 30),
      showVoteResult: false,
      voteResult: new VoteResult({})
    }
    this.getDoodleData(this.props.id)
  }

  getDoodleData(id) {
    const doodleDataRequest = new XMLHttpRequest()
    doodleDataRequest.addEventListener('load', () => {
      this.setState({
        metadata: new DoodleMetadata(doodleDataRequest.response.metadata)
      })
    })
    doodleDataRequest.open('GET', `/api/data/${id}`)
    doodleDataRequest.responseType = 'json'
    doodleDataRequest.send()
  }

  postDoodleData(id, metadata, data) {
    const packet = { metadata: metadata, data: data }
    const doodleDataUpdate = new XMLHttpRequest()
    doodleDataUpdate.addEventListener('load', () => {
      console.log(doodleDataUpdate.response.data)
      this.setState({
        metadata: new DoodleMetadata(doodleDataUpdate.response.metadata),
        voteResult: new VoteResult(doodleDataUpdate.response.data)
      })
    })
    doodleDataUpdate.open('POST', `/api/data/${id}`)
    doodleDataUpdate.setRequestHeader('Content-Type', 'text/json')
    doodleDataUpdate.responseType = 'json'
    doodleDataUpdate.send(JSON.stringify(packet))
  }

  handleNewMetadata(newMetadata) {
    const metadata = this.state.metadata.update(newMetadata)
    this.setState({ metadata: metadata })
    this.postDoodleData(this.props.id, metadata, {})
  }

  handleNewCalendarData(data) {
    this.setState({ data: data })
  }

  vote() {
    this.postDoodleData(this.props.id, this.state.metadata, this.state.data)
    this.setState({ showVoteResult: true })
  }

  useSelectionTool(tool) {
    this.setState({ selectionTool: tool })
  }

  render() {
    return (
      <main
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          background:
            'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,214,212,1) 100%)',
          fontFamily: 'sans'
        }}>
        <aside
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Metadata
            metadata={this.state.metadata}
            metadataChange={(newMetadata) =>
              this.handleNewMetadata(newMetadata)
            }
            style={{ flex: '0 1 auto' }}
          />
          <VoteButton style={{ flex: '1 0 auto' }} onVote={() => this.vote()} />
          <Controls
            style={{ flex: '0 1 auto', alignSelf: 'flex-end' }}
            selectionTool={this.state.selectionTool}
            selectionToolChange={(tool) => this.useSelectionTool(tool)}
          />
        </aside>
        <Calendar
          style={{ flex: '1 1 auto' }}
          selectionTool={this.state.selectionTool}
          calendarData={this.state.data}
          calendarDataChange={(data) => this.handleNewCalendarData(data)}
          voteResult={this.state.voteResult}
          showVoteResult={this.state.showVoteResult}
        />
      </main>
    )
  }
}
Doodle.propTypes = {
  id: PropTypes.string.isRequired
}

addEventListener(
  'load',
  function () {
    mountComponents({ Doodle: Doodle })
  },
  false
)
