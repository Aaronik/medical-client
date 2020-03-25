import React, { useState } from 'react'
import { Question, QuestionOption } from 'types/Question.d'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormInput from 'components/FormInput'
import Select from 'react-select'
import onSelectChange, { TOption } from 'util/onSelectChange'

type QuestionModalProps = {
  question?: Question
  show: boolean
  close: () => void
  save: (question: Question) => void
}

const QuestionModal = (props: QuestionModalProps) => {
  const { question, show, close, save } = props

  const defaultType = 'TEXT'

  const initialType = question?.type || defaultType
  const initialText = question?.text || ''
  const initialOptions = question?.options || []

  const [ type, setType ] = useState(initialType)
  const [ text, setText ] = useState(initialText)
  const [ options, setOptions ] = useState<QuestionOption[]>(initialOptions)
  const [ optionValue, setOptionValue ] = useState('')
  const [ optionText, setOptionText ] = useState('')

  const questionTypeHasOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(type)

  const onAddOptionClick = () => {
    setOptions(options.concat([{value: optionValue, text: optionText}]))
    setOptionValue('')
    setOptionText('')
  }

  const onSaveClick = () => {
    let updatedQuestion = { type, text } as Question
    if (question?.id) Object.assign(updatedQuestion, { id: question.id })
    if (options.length) Object.assign(updatedQuestion, { options })
    save(updatedQuestion)
    setType(initialType)
    setText(initialText)
    setOptions(initialOptions)
    setOptionValue('')
    setOptionText('')
  }

  const modalTitle = question
    ? 'Edit Question'
    : 'Add Question'

  return (
    <Modal show={props.show} centered onHide={props.close}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Select
          className='pb-3'
          onChange={onSelectChange(setType)}
          defaultValue={QUESTION_TYPE_OPTIONS[0]}
          options={QUESTION_TYPE_OPTIONS}/>

        <FormInput
          autoFocus={true}
          label='Question Text'
          value={text}
          type="text"
          onChange={setText}/>

        { questionTypeHasOptions && [

          <FormInput
            key='options-value'
            autoFocus={true}
            label={'Option Value'}
            value={optionValue}
            type="text"
            onChange={setOptionValue}/>,

          <FormInput
            key='options-text'
            autoFocus={true}
            label={'Option Text'}
            value={optionText}
            type="text"
            onChange={setOptionText}/>,

          <code key='options'>Question Options: {JSON.stringify(options, null, 2)}</code>
        ]}

      </Modal.Body>

      <Modal.Footer>
        { questionTypeHasOptions &&
          <Button variant="success" onClick={onAddOptionClick}>add option</Button>
        }
        <Button variant="secondary" onClick={close}>close</Button>
        <Button variant="primary" onClick={onSaveClick}>save</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default QuestionModal

const QUESTION_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'Text' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'SINGLE_CHOICE', label: 'Radio Group (Choose Single Answer)' },
  { value: 'MULTIPLE_CHOICE', label: 'Check Boxes (Choose Multiple Answers)' },
]

