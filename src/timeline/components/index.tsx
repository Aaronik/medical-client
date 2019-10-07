import React from 'react'
import * as timeline from 'timeline-plus'
import Container from 'react-bootstrap/Container'

import * as T from 'timeline/types.d'

type TProps = {
  data: T.TTimelineDatum[]
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
    const options = {}

    container.innerHTML = ''
    new timeline.Timeline(container, this.props.data, options)
  }

  render() {
    return (
      <Container>
        <div id='timeline-container' ref={this.timelineTargetRef}></div>
      </Container>
    )
  }
}
