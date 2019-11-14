import React from 'react'
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

  return (
    <Modal show={show} centered onHide={onClose}>
      <Modal.Body>
        <InfiniteCalendar width='100%' onSelect={onCalendarSelect} selected={initialDate}/>
      </Modal.Body>
    </Modal>
  )
}

export default DatePickerModal
