import React from 'react'
import PropTypes from 'prop-types'

import { mountComponents } from 'react-sinatra-ujs'

const SelectionTool = {
  Available: 0,
  Maybe: 1,
  Unavailable: 2
}

function timeFrom(minutesSinceMidnight) {
  const minutesPerHour = 60
  return (
    Math.floor(minutesSinceMidnight / minutesPerHour)
      .toString()
      .padStart(2, '0') +
    ':' +
    (minutesSinceMidnight % minutesPerHour).toString().padStart(2, '0')
  )
}

/**
  Query if a 2D time range contains the time.

  The two dimensions are time of day and day of the week.  Think of this
  as drawing a rectangle in a calendar application and testing if the
  time is in that rectangle.
*/
function in2dTimeRange(candidateTime, timeRange) {
  const minutesPerDay = 1440
  if (timeRange.length !== 2) {
    console.log('timeRange must be a list of two number')
    return false
  }
  if (timeRange[0] < 0 || timeRange[1] < 0) return false
  const dayBounds = timeRange
    .slice()
    .map((time) => Math.floor(time / minutesPerDay))
    .sort((a, b) => a > b)
  const timeOfDayBounds = timeRange
    .slice()
    .map((time) => time % minutesPerDay)
    .sort((a, b) => a > b)
  const candidateDay = Math.floor(candidateTime / minutesPerDay)
  const candidateTimeOfDay = candidateTime % minutesPerDay
  return (
    dayBounds[0] <= candidateDay &&
    candidateDay <= dayBounds[1] &&
    timeOfDayBounds[0] <= candidateTimeOfDay &&
    candidateTimeOfDay <= timeOfDayBounds[1]
  )
}

class Metadata extends React.Component {
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

class Controls extends React.Component {
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
          gap: 10
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

function VoteButton(props) {
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

function AMomentInTime(props) {
  return (
    <div
      className="a-moment-in-time"
      id={props.minutesIntoTheWeek}
      style={Object.assign({}, props.style, {
        flex: '1 1 auto',
        borderLeft: 'solid',
        borderBottom: 'solid thin',
        cursor: 'crosshair'
      })}
      onClick={() => {
        props.onClick()
      }}
      onDragStart={(event) => {
        props.onDragStart()
        const fakeDragImage = document.createElement('div')
        fakeDragImage.style.backgroundColor = 'red'
        fakeDragImage.style.display = 'none'
        document.body.appendChild(fakeDragImage)
        event.dataTransfer.setDragImage(fakeDragImage, -10, -10)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        props.onDragOver()
      }}
      onDrop={() => {
        props.onDrop()
      }}
      draggable={true}
    />
  )
}
AMomentInTime.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  minutesIntoTheWeek: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
}

class TimeOfDay extends React.Component {
  render() {
    const minutesPerDay = 1440
    const daysPerWeek = 7
    const days = []
    for (let day = 0; day < daysPerWeek; ++day) {
      const minutesIntoTheWeek =
        this.props.minutesSinceMidnight + day * minutesPerDay
      let backgroundColor = 'transparent'
      if (in2dTimeRange(minutesIntoTheWeek, this.props.candidateTimes)) {
        if (this.props.selectionTool === SelectionTool.Unavailable) {
          backgroundColor = 'IndianRed'
        } else if (this.props.selectionTool === SelectionTool.Maybe) {
          backgroundColor = 'LemonChiffon'
        } else {
          backgroundColor = 'PaleGreen'
        }
      } else if (
        this.props.availableTimes.available().includes(minutesIntoTheWeek)
      ) {
        backgroundColor = 'green'
      } else if (
        this.props.availableTimes.maybe().includes(minutesIntoTheWeek)
      ) {
        backgroundColor = 'NavajoWhite'
      }
      days.push(
        <AMomentInTime
          key={minutesIntoTheWeek}
          minutesIntoTheWeek={minutesIntoTheWeek}
          onClick={() => {
            this.props.onClick(minutesIntoTheWeek)
          }}
          onDragStart={() => this.props.onDragStart(minutesIntoTheWeek)}
          onDragOver={() => this.props.onDragOver(minutesIntoTheWeek)}
          onDrop={() => this.props.onDrop()}
          style={{ backgroundColor: backgroundColor }}
        />
      )
    }
    return (
      <div
        style={Object.assign({}, this.props.style, {
          borderRight: 'solid',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        })}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'right',
            borderBottom: 'solid'
          }}>
          <p style={{ margin: 0, width: 50, fontSize: 13 }}>
            {timeFrom(this.props.minutesSinceMidnight)}
          </p>
        </div>
        {days}
      </div>
    )
  }
}
TimeOfDay.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  minutesSinceMidnight: PropTypes.number.isRequired,
  availableTimes: PropTypes.object.isRequired,
  candidateTimes: PropTypes.array.isRequired,
  selectionTool: PropTypes.number.isRequired
}

class DayLabels extends React.Component {
  render() {
    const dayLabels = []
    const dayAbbreviations = ['S', 'M', 'T', 'W', 'R', 'F', 'A']
    dayAbbreviations.forEach((dayAbbreviation) => {
      dayLabels.push(
        <div
          style={{
            flex: '1 1 0',
            borderLeft: 'solid',
            borderBottom: 'solid',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'min-content'
          }}
          key={dayAbbreviation}>
          <h2 style={{ margin: 0 }}>{dayAbbreviation}</h2>
        </div>
      )
    })
    return (
      <div
        style={Object.assign({}, this.props.style, {
          borderRight: 'solid',
          display: 'flex',
          flexDirection: 'row'
        })}>
        <div style={{ width: 50, borderBottom: 'solid' }} />
        {dayLabels}
      </div>
    )
  }
}
DayLabels.propTypes = {
  style: PropTypes.object
}

class Week extends React.Component {
  render() {
    const minutesPerDay = 1440
    const times = []
    for (
      let minutesSinceMidnight = 0;
      minutesSinceMidnight < minutesPerDay;
      minutesSinceMidnight += this.props.timeInterval
    ) {
      times.push(
        <TimeOfDay
          minutesSinceMidnight={minutesSinceMidnight}
          availableTimes={this.props.availableTimes.withSameTimeOfDayAs(
            minutesSinceMidnight
          )}
          candidateTimes={this.props.candidateTimes}
          selectionTool={this.props.selectionTool}
          key={minutesSinceMidnight}
          onClick={(minutesIntoTheWeek) =>
            this.props.onClick(minutesIntoTheWeek)
          }
          onDragStart={(minutesIntoTheWeek) =>
            this.props.onDragStart(minutesIntoTheWeek)
          }
          onDragOver={(minutesIntoTheWeek) =>
            this.props.onDragOver(minutesIntoTheWeek)
          }
          onDrop={() => this.props.onDrop()}
        />
      )
    }

    return (
      <div
        style={Object.assign({}, this.props.style, {
          display: 'flex',
          flex: '0 1 auto',
          width: 750,
          flexDirection: 'column'
        })}>
        <div style={{ flex: '1 1 0' }} />
        <DayLabels />
        {times}
        <div style={{ flex: '1 1 0' }} />
      </div>
    )
  }
}
Week.propTypes = {
  timeInterval: PropTypes.number.isRequired,
  availableTimes: PropTypes.object.isRequired,
  candidateTimes: PropTypes.array.isRequired,
  selectionTool: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
}

class AvailableTimes {
  constructor(availableTimes, maybeTimes, timeInterval) {
    this.availableTimes = availableTimes
    this.maybeTimes = maybeTimes
    this.timeInterval = timeInterval
  }

  addAvailableTimes(times) {
    const oldAvailableTimes = this.availableTimes.slice()
    const allTimes = [...times, ...oldAvailableTimes]

    const availableTimes = [...new Set(allTimes)]
    const maybeTimes = this.maybeTimes
      .slice()
      .filter((time) => !availableTimes.includes(time))
    return new AvailableTimes(availableTimes, maybeTimes, this.timeInterval)
  }

  addMaybeTimes(times) {
    const oldMaybeTimes = this.maybeTimes.slice()
    const allTimes = [...times, ...oldMaybeTimes]

    const maybeTimes = [...new Set(allTimes)]
    const availableTimes = this.availableTimes
      .slice()
      .filter((time) => !maybeTimes.includes(time))
    return new AvailableTimes(availableTimes, maybeTimes, this.timeInterval)
  }

  removeTimes(times) {
    const availableTimes = this.availableTimes
      .slice()
      .filter((time) => !times.includes(time))
    const maybeTimes = this.maybeTimes
      .slice()
      .filter((time) => !times.includes(time))
    return new AvailableTimes(availableTimes, maybeTimes, this.timeInterval)
  }

  available() {
    return this.availableTimes
  }

  maybe() {
    return this.maybeTimes
  }

  withSameTimeOfDayAs(time) {
    const minutesPerDay = 1440
    const availableTimes = this.availableTimes
      .slice()
      .filter((oldTime) => oldTime % minutesPerDay === time % minutesPerDay)
    const maybeTimes = this.maybeTimes
      .slice()
      .filter((oldTime) => oldTime % minutesPerDay === time % minutesPerDay)
    return new AvailableTimes(availableTimes, maybeTimes, this.timeInterval)
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      candidateTimes: [-1, -1]
    }
  }

  addAvailableTimes(times) {
    this.props.calendarDataChange(
      this.props.calendarData.addAvailableTimes(times)
    )
  }

  addMaybeTimes(times) {
    this.props.calendarDataChange(this.props.calendarData.addMaybeTimes(times))
  }

  removeTimes(times) {
    this.props.calendarDataChange(this.props.calendarData.removeTimes(times))
  }

  handleClick(minutesSinceMidnight) {
    if (this.props.selectionTool === SelectionTool.Available) {
      this.addAvailableTimes([minutesSinceMidnight])
    } else if (this.props.selectionTool === SelectionTool.Maybe) {
      this.addMaybeTimes([minutesSinceMidnight])
    } else {
      this.removeTimes([minutesSinceMidnight])
    }
  }

  handleDragStart(minutesSinceMidnight) {
    this.setState({
      candidateTimes: [minutesSinceMidnight, minutesSinceMidnight]
    })
  }

  handleDragOver(minutesSinceMidnight) {
    const candidateTimes = this.state.candidateTimes
    candidateTimes[1] = minutesSinceMidnight
    this.setState({ candidateTimes: candidateTimes })
  }

  handleDragDrop() {
    const minutesPerDay = 1440
    const dayBounds = this.state.candidateTimes
      .slice()
      .map((time) => Math.floor(time / minutesPerDay))
      .sort((a, b) => a > b)
    const timeOfDayBounds = this.state.candidateTimes
      .slice()
      .map((time) => time % minutesPerDay)
      .sort((a, b) => a > b)

    const times = []
    for (let day = dayBounds[0]; day <= dayBounds[1]; ++day) {
      for (
        let timeOfDay = timeOfDayBounds[0];
        timeOfDay <= timeOfDayBounds[1];
        timeOfDay += this.props.calendarData.timeInterval
      ) {
        times.push(day * minutesPerDay + timeOfDay)
      }
    }
    if (this.props.selectionTool === SelectionTool.Available) {
      this.addAvailableTimes(times)
    } else if (this.props.selectionTool === SelectionTool.Maybe) {
      this.addMaybeTimes(times)
    } else {
      this.removeTimes(times)
    }
    this.setState({ candidateTimes: [-1, -1] })
  }

  render() {
    return (
      <Week
        timeInterval={this.props.calendarData.timeInterval}
        onClick={(minutesIntoTheWeek) => this.handleClick(minutesIntoTheWeek)}
        onDragStart={(minutesIntoTheWeek) =>
          this.handleDragStart(minutesIntoTheWeek)
        }
        onDragOver={(minutesIntoTheWeek) =>
          this.handleDragOver(minutesIntoTheWeek)
        }
        onDrop={() => this.handleDragDrop()}
        availableTimes={this.props.calendarData}
        candidateTimes={this.state.candidateTimes}
        selectionTool={this.props.selectionTool}
        style={this.props.style}
      />
    )
  }
}
Calendar.propTypes = {
  selectionTool: PropTypes.number.isRequired,
  calendarData: PropTypes.object.isRequired,
  calendarDataChange: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
}

class DoodleMetadata {
  constructor(metadata) {
    this.eventName =
      typeof metadata.eventName !== 'undefined' ? metadata.eventName : ''
    this.description =
      typeof metadata.description !== 'undefined' ? metadata.description : ''
    this.location =
      typeof metadata.location !== 'undefined' ? metadata.location : ''
    this.duration =
      typeof metadata.duration !== 'undefined' ? metadata.duration : ''
    this.default =
      typeof metadata.default !== 'undefined' ? metadata.default : true
  }

  eventName() {
    return this.eventName
  }

  description() {
    return this.description
  }

  location() {
    return this.location
  }

  duration() {
    return this.duration
  }

  update(newMetadata) {
    const metadata = {
      eventName: this.eventName,
      description: this.description,
      location: this.location,
      duration: this.duration,
      default: this.default
    }

    Object.entries(newMetadata)
      .filter(([key, _]) => key in metadata)
      .forEach(([key, value]) => (metadata[key] = value))
    metadata.default = false
    return new DoodleMetadata(metadata)
  }
}

class Doodle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectionTool: SelectionTool.Available,
      metadata: new DoodleMetadata({}),
      data: new AvailableTimes([], [], 30)
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
          flexDirection: 'row'
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
        <div style={{ width: 10 }} />
        <Calendar
          style={{ flex: '1 1 auto' }}
          selectionTool={this.state.selectionTool}
          calendarData={this.state.data}
          calendarDataChange={(data) => this.handleNewCalendarData(data)}
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
