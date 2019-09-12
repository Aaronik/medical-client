import React, { Component } from 'react'
import * as timeline from 'timeline-plus'
import Button from 'react-bootstrap/Button'
import { isEqual, random } from 'lodash'

require('timeline-plus/dist/timeline.css')

type TProps = {

}

type TTimelineDataItem = {
  id: number,
  content: string,
  start: string,
  end?: string
}

type TState = {
  timelineData: TTimelineDataItem[]
}

export default class TimelineDemo extends React.Component {

  timelineTargetRef: React.Ref<HTMLDivElement>

  state = {
    timelineData: [
      {id: 1, content: 'Stubbed my toe', start: '2013-04-20'},
      {id: 2, content: 'First experienced allergy to the word "forever"', start: '2013-04-14'},
      {id: 3, content: 'First time experiencing enui', start: '2013-04-18'},
      {id: 4, content: 'Developed jogging habbit', start: '2013-04-16', end: '2013-04-19'},
      {id: 5, content: 'Jogged into bees nest', start: '2013-04-25'},
    ]

  }

  constructor(props: TProps) {
    super(props)
    this.timelineTargetRef = React.createRef()
  }

  shouldComponentUpdate(nextProps: TProps, nextState: TState) {
    if (!isEqual(nextState, this.state)) return true
    if (!isEqual(nextProps, this.props)) return true
    return false
  }

  componentDidMount() {
    this.renderTimeline()
  }

  componentDidUpdate() {
    this.renderTimeline()
  }

  private renderTimeline() {
    const container = (this.timelineTargetRef as React.RefObject<HTMLDivElement>).current as HTMLDivElement
    const options = {}

    container.innerHTML = ''
    new timeline.Timeline(container, this.state.timelineData, options)
  }

  private addRandomTimelineDatum() {
    const date = `2013-0${random(4, 5)}-${random(0, 30)}`

    const newDatum = {
      id: this.state.timelineData[this.state.timelineData.length - 1].id + 1,
      content: 'Here\'s a random new thing that happened on ' + date,
      start: date
    }

    this.setState({
      timelineData: this.state.timelineData.concat([newDatum])
    })
  }

  private onButtonPress = () => {
    this.addRandomTimelineDatum()
  }

  render() {
    return (
      <div>
        <div id='timeline-container' ref={this.timelineTargetRef}></div>
        <Button onClick={this.onButtonPress}>Add Random Event to Timeline</Button>
      </div>
    )
  }
}
