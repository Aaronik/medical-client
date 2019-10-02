import React from 'react'
import * as timeline from 'timeline-plus'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'

import { TStoreState } from 'store'
import * as actions from 'timeline/actions'
import * as T from 'timeline/types.d'

require('timeline-plus/dist/timeline.css')

type TProps = {
  timelineData: T.TTimelineDatum[]
}

class TimelineContainer extends React.Component<TProps, {}> {

  timelineTargetRef: React.Ref<HTMLDivElement>

  constructor(props: TProps) {
    super(props)
    this.timelineTargetRef = React.createRef()
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
    new timeline.Timeline(container, this.props.timelineData, options)
  }

  private addRandomTimelineDatum() {
    actions.createNewRandomTimelineData()
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

export default connect((storeState: TStoreState) => {
  return { timelineData: storeState.timeline }
})(TimelineContainer)
