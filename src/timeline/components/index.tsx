import React from 'react'
import * as timeline from 'vis-timeline'
import Container from 'react-bootstrap/Container'

import * as T from 'timeline/types.d'

type TProps = {
  data: T.TTimelineDatum[]
  groups: T.TTimelineGroup[]
}

export default class Timeline extends React.Component<TProps, {}> {

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

    const options = {
      minHeight: '300px',
      orientation: 'top',
      groupEditable: true,
      align: 'left' as 'left',
      stack: true,
      margin: {
        axis: 40,
        item: 20,
      },
    }

    container.innerHTML = ''

    if (this.props.groups.length) return new timeline.Timeline(container, this.props.data, this.props.groups, options)
    else new timeline.Timeline(container, this.props.data, options)
  }

  render() {
    return (
      <Container>
        <div id='timeline-container' ref={this.timelineTargetRef}></div>
      </Container>
    )
  }
}
