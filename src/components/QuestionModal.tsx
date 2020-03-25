import React, { useState } from 'react'
import { TQuestion, TQuestionOption } from 'types/Question.d'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormInput from 'components/FormInput'
import Select from 'react-select'
import onSelectChange, { TOption } from 'util/onSelectChange'

type QuestionModalProps = {
  question?: TQuestion
  show: boolean
  close: () => void
  save: (question: TQuestion) => void
}

const QuestionModal = (props: QuestionModalProps) => {
  const { question, show, close, save } = props

  const defaultQuestionType = 'TEXT'

  const [ questionType, setQuestionType ] = useState(question?.type || defaultQuestionType)
  const [ questionText, setQuestionText ] = useState(question?.text || '')
  const [ questionOptions, setQuestionOptions ] = useState<TQuestionOption[]>(question?.options || [])
  const [ optionValue, setOptionValue ] = useState('')
  const [ optionText, setOptionText ] = useState('')

  const questionTypeHasOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(questionType)

  const onAddOptionClick = () => {
    setQuestionOptions(questionOptions.concat([{value: optionValue, text: optionText}]))
    setOptionValue('')
    setOptionText('')
  }

  const onSaveClick = () => {
    save({
      type: questionType,
      text: questionText,
      options: questionOptions
    })
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
          onChange={onSelectChange(setQuestionType)}
          defaultValue={QUESTION_TYPE_OPTIONS[0]}
          options={QUESTION_TYPE_OPTIONS}/>

        <FormInput
          autoFocus={true}
          label='Question Text'
          value={questionText}
          type="text"
          onChange={setQuestionText}/>

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

          <code key='options'>Question Options: {JSON.stringify(questionOptions, null, 2)}</code>
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

