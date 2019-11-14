import React, { useEffect, useRef, useState } from 'react'
import * as timeline from 'vis-timeline'

import * as T from 'timeline/types.d'
import strings from 'common/strings'
import formatDate from 'util/date-to-timeline-date'
import 'timeline/styles/index.sass'

const tooltipTemplater = (item: timeline.TimelineItem, editedData?: timeline.TimelineItem) => {
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
    strings('startDate') + formatDate(item.start),
    (item.end && strings('end') + formatDate(item.end)),
    item.content
  ].filter(Boolean) as string[]
  // TS is not smart enough to know that filtering on boolean will remove falseys

  return intoRows(...rows)
}

type TOnAdd = (timelineItem: timeline.TimelineItem) => void
type TOnUpdate = (timelineItem: timeline.TimelineItem) => void

// Trample over any react created elements, adding the timeline.
// This is the transformation from react's beautiful declarative
// paradigm to timeline's imperative paradigm.
const renderTimeline = (container: HTMLDivElement, data: T.TTimelineItem[], groups: T.TTimelineGroup[], onAdd: TOnAdd, onUpdate: TOnUpdate) => {
  const options: timeline.TimelineOptions = {
    selectable: true,
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
    },
    editable: {
      add: true,
      updateTime: true,
      updateGroup: true,
      remove: true
    },
    onAdd: (item, cb) => onAdd(item),
    onUpdate: (item, cb) => onUpdate(item),
  }

  container.innerHTML = ''

  const modifiedData = data.map(datum => {
    return {
      editable: true,
      ...datum,
    }
  })

  if (groups.length) return new timeline.Timeline(container, modifiedData, groups, options)
  else return new timeline.Timeline(container, modifiedData, options)
}

const redrawTimeline = (ref: timeline.Timeline, items: T.TTimelineItem[], groups: T.TTimelineGroup[]) => {
  ref.setData({ groups, items })
}

type TProps = {
  data: T.TTimelineItem[]
  groups: T.TTimelineGroup[]
  onAdd: TOnAdd
  onUpdate: TOnUpdate
}

const Timeline: React.FC<TProps> = ({ data, groups, onAdd, onUpdate }) => {
  const timelineTargetRef = useRef<HTMLDivElement>(null)
  const [ timelineRef, setTimelineRef ] = useState()

  useEffect(() => {
    const ref = timelineTargetRef.current as HTMLDivElement
    setTimelineRef(renderTimeline(ref, data, groups, onAdd, onUpdate))
    // ESLint needs onAdd to be in the array below. However, doing so introduces a bug,
    // that the timeline then gets rendered every time the Timeline FC gets rendered.
    // That's a bunch of extra reners that don't need to happen. It basically is breaking
    // the useEffect dependency list. I'm confident this is a unique situation, using this
    // imperative vis-timeline, so I'm leaving the rule in place and leaving this comment
    // as well.
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (timelineRef) redrawTimeline(timelineRef, data, groups)
  }, [data, groups, timelineRef])

  return (
    <div id='timeline-container' ref={timelineTargetRef}></div>
  )
}

export default Timeline
