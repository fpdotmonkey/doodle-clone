import React from 'react'
import PropTypes from 'prop-types'

import { SelectionTool } from './common'

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

function availableTimesBackgroundColor(
  selectionTool,
  minutesIntoTheWeek,
  availableTimes,
  candidateTimes
) {
  if (in2dTimeRange(minutesIntoTheWeek, candidateTimes)) {
    if (selectionTool === SelectionTool.Unavailable) {
      return 'IndianRed'
    } else if (selectionTool === SelectionTool.Maybe) {
      return 'LemonChiffon'
    }
    return 'PaleGreen'
  } else if (availableTimes.available().includes(minutesIntoTheWeek)) {
    return 'DarkGreen'
  } else if (availableTimes.maybe().includes(minutesIntoTheWeek)) {
    return 'NavajoWhite'
  }
  return 'transparent'
}

function voteResultBackgroundColor(voteResult, minutesIntoTheWeek) {
  let backgroundColor = ''
  const key = minutesIntoTheWeek.toString()
  if (key in voteResult.availableTimes) {
    if (voteResult.availableTimes[key] === voteResult.quantity) {
      return 'DarkGreen'
    } else if (voteResult.availableTimes[key] > 1) {
      return 'MediumSeaGreen'
    }
  }
  return 'transparent'
}

class TimeOfDay extends React.Component {
  render() {
    const minutesPerDay = 1440
    const daysPerWeek = 7
    const days = []
    for (let day = 0; day < daysPerWeek; ++day) {
      const minutesIntoTheWeek =
        this.props.minutesSinceMidnight + day * minutesPerDay
      let backgroundColor = ''
      if (!this.props.showVoteResult) {
        backgroundColor = availableTimesBackgroundColor(
          this.props.selectionTool,
          minutesIntoTheWeek,
          this.props.availableTimes,
          this.props.candidateTimes
        )
      } else {
        backgroundColor = voteResultBackgroundColor(
          this.props.voteResult,
          minutesIntoTheWeek
        )
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
  voteResult: PropTypes.object.isRequired,
  showVoteResult: PropTypes.bool.isRequired,
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
          voteResult={this.props.voteResult}
          showVoteResult={this.props.showVoteResult}
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
  voteResult: PropTypes.object.isRequired,
  showVoteResult: PropTypes.bool.isRequired,
  candidateTimes: PropTypes.array.isRequired,
  selectionTool: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
}

export class Calendar extends React.Component {
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
    if (this.props.showVoteResult) {
      return
    }

    if (this.props.selectionTool === SelectionTool.Available) {
      this.addAvailableTimes([minutesSinceMidnight])
    } else if (this.props.selectionTool === SelectionTool.Maybe) {
      this.addMaybeTimes([minutesSinceMidnight])
    } else {
      this.removeTimes([minutesSinceMidnight])
    }
  }

  handleDragStart(minutesSinceMidnight) {
    if (this.props.showVoteResult) {
      return
    }

    this.setState({
      candidateTimes: [minutesSinceMidnight, minutesSinceMidnight]
    })
  }

  handleDragOver(minutesSinceMidnight) {
    if (this.props.showVoteResult) {
      return
    }

    const candidateTimes = this.state.candidateTimes
    candidateTimes[1] = minutesSinceMidnight
    this.setState({ candidateTimes: candidateTimes })
  }

  handleDragDrop() {
    if (this.props.showVoteResult) {
      return
    }

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
        voteResult={this.props.voteResult}
        showVoteResult={this.props.showVoteResult}
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
  voteResult: PropTypes.object.isRequired,
  showVoteResult: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired
}
