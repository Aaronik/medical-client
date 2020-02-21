import React, { useRef, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import './FormInput.sass'

type TProps = {
  label: string
  type: 'text' | 'password' | 'email'
  onChange: (value: string) => void
  value: string
  icon?: icons.IconDefinition // this'll be automatically put into a FA component
  onIconClick?: () => void
  autoFocus?: boolean
}

// hate to codify the event: any pattern but typing it is very difficult
const deconstructEvent = (onChange: Function) => (event: any) => onChange(event.currentTarget.value)

// This component is here to abstract common input fields.
const FormInput: React.FunctionComponent<TProps> = ({ label, type, onChange, value, icon, onIconClick, autoFocus }) => {

  // Have to use "any" as there's no FormControl export:
  // https://github.com/react-bootstrap/react-bootstrap/issues/3568
  const formControlEl = useRef<any>(null)

  // We have to manually autofocus because, for some reason, the build in autoFocus flag is not working:
  // https://github.com/react-bootstrap/react-bootstrap/issues/429
  useEffect(() => {
    if (autoFocus) formControlEl.current.focus()
  }, [autoFocus])

  return (
    <Form.Group className='custom-form-group'>
      <Form.Label className="text-muted">{label}</Form.Label>
      <InputGroup>
        <Form.Control ref={formControlEl} type={type} onChange={deconstructEvent(onChange)} value={value}></Form.Control>
        { icon &&
          <InputGroup.Append onClick={onIconClick} style={{ cursor: onIconClick ? "pointer" : "default" }}>
            <InputGroup.Text><FontAwesomeIcon icon={icon} /></InputGroup.Text>
          </InputGroup.Append>
        }
      </InputGroup>
    </Form.Group>
  )
}

export default FormInput
