import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import InfiniteCalendar from 'react-infinite-calendar'
import 'react-infinite-calendar/styles.css'

type TDatePickerModalProps = {
  show: boolean
  onSelect: (date: Date) => void
  onClose: () => void
  initialDate?: Date
}

const DatePickerModal: React.FC<TDatePickerModalProps> = ({ show, onSelect, onClose, initialDate }) => {
  const onCalendarSelect = (date: Date) => {
    onSelect(date)
    onClose()
  }

  // There's an issue with the calendar initially appearing blank and back 50 years. (GH #55)
  // This fixes that by finding the date that's selected and scrolling that to the center.
  // I'm not sure Cal__Day__selection is a public API so this might not be a totally
  // robust solution.
  useEffect(() => {
    const currentDaySelection = document.querySelector('.Cal__Day__selection')
    if (!currentDaySelection) return
    currentDaySelection.scrollIntoView({ block: 'center' })
  }, [show])

  return (
    <Modal show={show} centered onHide={onClose}>
      <Modal.Body>
        <InfiniteCalendar
          width='100%'
          onSelect={onCalendarSelect}
          selected={initialDate}
          autoFocus
          display='days'
          onScroll={() => {}}/>
      </Modal.Body>
    </Modal>
  )
}

export default DatePickerModal
