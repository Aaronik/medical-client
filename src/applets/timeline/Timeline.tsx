import React, { useEffect, useRef, useState } from 'react'
import * as timeline from 'vis-timeline'
import { min } from 'lodash'
import jsxToString from 'jsx-to-string'
import ErrorBoundary from 'common/components/ErrorBoundary'

import * as T from './Timeline.d'
import strings from './Timeline.strings'
import formatDate from 'common/util/dateToTimelineDate'
import './Timeline.sass'

const tooltipTemplater = (item: timeline.TimelineItem, editedData?: timeline.TimelineItem) => {
  return jsxToString(
    // @ts-ignore // https://github.com/grommet/jsx-to-string/issues/7
    <div class='timeline-tooltip'>
      <span>{strings('startDate')}</span>
      // @ts-ignore
      <strong class='float-right'>{formatDate(item.start)}</strong>
      <br/><hr/>
      { item.end && <div>
          <span>{strings('end')}</span>
          // @ts-ignore
          <strong class='float-right'>{item.end && formatDate(item.end)}</strong>
          <br/><hr/>
        </div>
      }
      <strong>{item.content}</strong>
    </div>
  )
}

const optionsWith = (partialOptions: Partial<timeline.TimelineOptions>) => {
  const options: timeline.TimelineOptions = {
    min: new Date(1900, 1, 1), // earliest date timeline will allow scrolling to
    max: new Date(),           // latest ''
    selectable: true,
    minHeight: '60vh',
    maxHeight: '60vh',
    orientation: 'top',
    groupEditable: {
      add: true,
      remove: true,
      order: true
    },
    align: 'left' as 'left',
    stack: true,
    groupOrder: 'content',
    margin: {
      axis: 10,
      item: {
        horizontal: 10,
        vertical: 10
      }
    },
    tooltip: {
      template: tooltipTemplater
    },
    editable: {
      add: true,
      updateTime: true,
      updateGroup: true,
      remove: true
    }
  }

  return { ...options, ...partialOptions }
}

const earliestStartDateOfItems = (items: T.TTimelineItem[]) => {
  return min(items.map(i => i.start))
}

const onMoveWithoutGroupEditability = (onMove: TOnMove, items: T.TTimelineItem[]) => (updatedItem: T.TTimelineItem) => {
  const originalItem = items.find(item => item.id === updatedItem.id)
  if (!originalItem) return onMove(updatedItem)
  updatedItem.group = originalItem.group
  onMove(updatedItem)
}

type TOnItemChange = (timelineItem: timeline.TimelineItem) => void

type TOnAdd = TOnItemChange
type TOnUpdate = TOnItemChange
type TOnMove = TOnItemChange

// Trample over any react created elements, adding the timeline.
// This is the transformation from react's beautiful declarative
// paradigm to timeline's imperative paradigm.
const renderTimeline = (container: HTMLDivElement, items: T.TTimelineItem[], groups: T.TTimelineGroup[], onAdd: TOnAdd, onUpdate: TOnUpdate, onMove: TOnMove) => {

  // Calculating the earliest date the timeline shows here allows us to only
  // show what dates the user is concerned with, so they don't get super
  // lost in an infinity of time on the timeline. It'll literally go into negative
  // years if you sroll enough, which isn't hard to do by just zooming out a bunch.
  const earliestDate = earliestStartDateOfItems(items) || new Date()

  const options = optionsWith({ onAdd, onUpdate, onMove, min: earliestDate })

  container.innerHTML = ''

  const dataSetGroups = new timeline.DataSet(groups)

  if (groups.length) return new timeline.Timeline(container, items, dataSetGroups, options)
  else return new timeline.Timeline(container, items, options)
}

const redrawTimeline = (ref: timeline.Timeline, items: T.TTimelineItem[], groups: T.TTimelineGroup[], options: timeline.TimelineOptions) => {
  const dataSetGroups = new timeline.DataSet(groups)

  ref.setData({ groups: dataSetGroups, items })
  ref.setOptions(options)
}

type TProps = {
  items: T.TTimelineItem[]
  groups: T.TTimelineGroup[]
  onAdd: TOnAdd
  onUpdate: TOnUpdate
  onMove: TOnMove
}

const TimelineSansErrorBoundary: React.FC<TProps> = ({ items, groups, onAdd, onUpdate, onMove }) => {
  const timelineTargetRef = useRef<HTMLDivElement>(null)
  const [ timelineRef, setTimelineRef ] = useState()

  // Simply using the setting, groupUpdate: false, does not
  // work with vis timeline. So we need to ensure the item's
  // group does not change when it's moved.
  // https://github.com/visjs/vis-timeline/issues/202
  onMove = onMoveWithoutGroupEditability(onMove, items)

  useEffect(() => {
    const ref = timelineTargetRef.current as HTMLDivElement
    setTimelineRef(renderTimeline(ref, items, groups, onAdd, onUpdate, onMove))
    // ESLint needs onAdd to be in the array below. However, doing so introduces a bug,
    // that the timeline then gets rendered every time the Timeline FC gets rendered.
    // That's a bunch of extra renders that don't need to happen. It basically is breaking
    // the useEffect dependency list. I'm confident this is a unique situation, using this
    // imperative vis-timeline, so I'm leaving the rule in place and leaving this comment
    // as well.
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const min = earliestStartDateOfItems(items) || new Date()
    const options = optionsWith({ onAdd, onUpdate, onMove, min })
    if (timelineRef) redrawTimeline(timelineRef, items, groups, options)
    // eslint-disable-next-line
  }, [items, groups])

  return (
    <div id='timeline-container' ref={timelineTargetRef}></div>
  )
}

const Timeline: React.FC<TProps> = (props: TProps) => (
  <ErrorBoundary>
    <TimelineSansErrorBoundary {...props}/>
  </ErrorBoundary>
)
export default Timeline
