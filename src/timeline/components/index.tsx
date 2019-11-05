import React, { useEffect, useRef } from 'react'
import * as timeline from 'vis-timeline'
import Container from 'react-bootstrap/Container'

import * as T from 'timeline/types.d'
import 'timeline/styles/index.sass'

type TProps = {
  data: T.TTimelineDatum[]
  groups: T.TTimelineGroup[]
}

const tooltipTemplater = (item: timeline.TimelineItem, editedData?: timeline.TimelineItem) => {

  // How we view the dates within the tooltip
  const formatDate = (datetype: timeline.DateType) => {
    const date = new Date(datetype)
    return `${date.getFullYear()}-${date.getDate()}-${date.getMonth()}`
  }

  // Separate all args into a "row"
  const intoRows = (...rows: string[]) => {

    let str = "<div class='timeline-tooltip'>"

    rows.forEach((row, idx) => {
      if (idx === rows.length - 1)
        str += row
      else
        str += `${row}<br><hr>`
    })

    str += '</div>'

    return str
  }

  const rows = [
    "start/date: " + formatDate(item.start),
    (item.end && "end: " + formatDate(item.end)),
    item.content
  ].filter(Boolean) as string[]
  // TS is not smart enough to know that filtering on boolean will remove falseys

  return intoRows(...rows)
}

// Trample over any react created elements, adding the timeline.
// This is the transformation from react's beautiful declarative
// paradigm to timeline's imperative paradigm.
const renderTimeline = (container: HTMLDivElement, data: T.TTimelineDatum[], groups: T.TTimelineGroup[]) => {
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
    tooltip: {
      template: tooltipTemplater
    }
  }

  container.innerHTML = ''

  const dataWithTooltip = data.map(datum => {
    return {
      ...datum,
    }
  })

  if (groups.length) return new timeline.Timeline(container, dataWithTooltip, groups, options)
  else new timeline.Timeline(container, dataWithTooltip, options)
}

const Timeline: React.FC<TProps> = ({ data, groups }) => {
  const timelineTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    renderTimeline(timelineTargetRef.current as HTMLDivElement, data, groups)
  })

  return (
    <Container>
      <div id='timeline-container' ref={timelineTargetRef}></div>
    </Container>
  )
}

export default Timeline
