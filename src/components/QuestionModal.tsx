import React, { useState } from 'react'
import { TQuestion, QuestionOption, QuestionType } from 'types/Question.d'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import FormInput from 'components/FormInput'
import Select from 'react-select'
import onSelectChange from 'util/onSelectChange'
import onKeyDown from 'util/onKeyDown'

type QuestionModalProps = {
  question?: TQuestion
  show: boolean
  close: () => void
  save: (question: TQuestion) => void
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
  const [ optionText, setOptionText ] = useState('')

  const questionTypeHasOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(type)

  const onAddOptionClick = () => {
    setOptions(options.concat([{ text: optionText }]))
    setOptionText('')
  }

  const onSaveClick = () => {
    let updatedQuestion = { type, text } as TQuestion
    if (question?.id) Object.assign(updatedQuestion, { id: question.id })
    if (options.length) Object.assign(updatedQuestion, { options })
    save(updatedQuestion)
    setType(initialType)
    setText(initialText)
    setOptions(initialOptions)
    setOptionText('')
  }

  const modalTitle = question
    ? 'Edit Question'
    : 'Add Question'

  const OptionRows = () => {
    const removeOption = (option: QuestionOption) => {
      const newOptions = options.filter(existingOption => option.id ? option.id !== existingOption.id : option.text !== existingOption.text)
      setOptions(newOptions)
    }

    return (
      <Col xs={6} className='d-flex flex-column'>
        {
          options.map(option => (
            <Button onClick={() => removeOption(option)} className='mb-1' key={option.id || option.text}>{option.text}</Button>
          ))
        }
      </Col>
    )
  }

  const defaultSelectType = QUESTION_TYPE_OPTIONS.find(op => op.value === type)

  return (
    <Modal show={show} centered onHide={close}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Select
          className='pb-3'
          onChange={onSelectChange(setType)}
          defaultValue={defaultSelectType}
          options={QUESTION_TYPE_OPTIONS}/>

        <FormInput
          autoFocus={true}
          label='Question Text'
          value={text}
          type="text"
          onChange={setText}
          onKeyDown={onKeyDown('Enter', onSaveClick)}/>

        { questionTypeHasOptions && [

          <FormInput
            key='options-text'
            autoFocus={false}
            label={'Option Text'}
            value={optionText}
            type="text"
            onChange={setOptionText}
            onKeyDown={onKeyDown('Enter', onAddOptionClick)}/>,

          <OptionRows key='option-rows'/>
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

const QUESTION_TYPE_OPTIONS: { value: QuestionType, label: string }[] = [
  { value: 'TEXT', label: 'Text' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'SINGLE_CHOICE', label: 'Radio Group (Choose Single Answer)' },
  { value: 'MULTIPLE_CHOICE', label: 'Check Boxes (Choose Multiple Answers)' },
  { value: 'EVENT', label: 'Event' },
]
