import React from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

type TProps = {
  label: string
  type: 'text' | 'password' | 'email'
  onChange: (value: string) => void
  value: string
  icon: icons.IconDefinition
}

// hate to codify the event: any pattern but typing it is very difficult
const deconstructEvent = (onChange: Function) => (event: any) => onChange(event.currentTarget.value)

// This component is here to abstract common input fields.
// ATTOW this was used in signin and signout.
// Ideally, if more pages are built, this same style will be used
// on inputs and this can be used in more places.
const FormInput: React.FunctionComponent<TProps> = ({ label, type, onChange, value, icon }) => (
  <Form.Group>
    <Form.Label className="text-muted">{label}</Form.Label>
    <InputGroup>
      <Form.Control type={type} onChange={deconstructEvent(onChange)} value={value}></Form.Control>
      <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icon} /></InputGroup.Text></InputGroup.Append>
    </InputGroup>
  </Form.Group>
)

export default FormInput