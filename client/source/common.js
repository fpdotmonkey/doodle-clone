export const SelectionTool = {
  Available: 0,
  Maybe: 1,
  Unavailable: 2
}

export class VoteResult {
  constructor(result) {
    this.maybeTimes = result.maybeTimes
    this.quantity = result.quantity
    this.availableTimes = result.availableTimes
  }
}

export class AvailableTimes {
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

export class DoodleMetadata {
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
